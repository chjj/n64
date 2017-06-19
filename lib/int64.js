/*!
 * int64.js - javascript int64's for n64.js.
 * Copyright (c) 2017, Christopher Jeffrey (MIT License).
 * https://github.com/chjj/n64
 */

'use strict';

var assert = require('assert');
var mul32 = Math.imul;

/**
 * Int64
 * @constructor
 */

function Int64(num, signed, base) {
  if (!(this instanceof Int64))
    return new Int64(num, signed, base);

  this.hi = 0;
  this.lo = 0;
  this.signed = false;

  this.from(num, signed, base);
}

/*
 * Addition
 */

Int64.prototype._add = function _add(bhi, blo) {
  var ahi = this.hi;
  var alo = this.lo;
  var hi, lo, as, bs, s, c;

  // Credit to @indutny for this method.
  lo = (alo + blo) | 0;

  s = lo >> 31;
  as = alo >> 31;
  bs = blo >> 31;

  c = ((as & bs) | (~s & (as ^ bs))) & 1;

  hi = ((ahi + bhi) | 0) + c;

  this.hi = hi | 0;
  this.lo = lo;

  return this;
};

Int64.prototype.iadd = function iadd(b) {
  assert(b && typeof b === 'object');
  return this._add(b.hi, b.lo);
};

Int64.prototype.iaddn = function iaddn(num) {
  assert(num >= Int64.LONG_MIN && num <= Int64.ULONG_MAX);
  return this._add(num < 0 ? -1 : 0, num | 0);
};

Int64.prototype.add = function add(b) {
  return this.clone().iadd(b);
};

Int64.prototype.addn = function addn(num) {
  return this.clone().iaddn(num);
};

/*
 * Subtraction
 */

Int64.prototype._sub = function _sub(bhi, blo) {
  bhi = ~bhi;
  blo = ~blo;

  if (blo === -1) {
    blo = 0;
    bhi += 1;
    bhi |= 0;
  } else {
    blo += 1;
  }

  return this._add(bhi, blo);
};

Int64.prototype.isub = function isub(b) {
  assert(b && typeof b === 'object');
  return this._sub(b.hi, b.lo);
};

Int64.prototype.isubn = function isubn(num) {
  assert(num >= Int64.LONG_MIN && num <= Int64.ULONG_MAX);
  return this._sub(num < 0 ? -1 : 0, num | 0);
};

Int64.prototype.sub = function sub(b) {
  return this.clone().isub(b);
};

Int64.prototype.subn = function subn(num) {
  return this.clone().isubn(num);
};

/*
 * Multiplication
 */

Int64.prototype._mul = function _mul(bhi, blo) {
  var ahi = this.hi;
  var alo = this.lo;
  var hi, c, as, bs, ap, bp;

  // Credit to @indutny for this method.
  hi = (mul32(ahi, blo) + mul32(bhi, alo)) | 0;
  c = ((alo * blo) * (1 / 0x100000000)) | 0;

  as = alo >> 31;
  bs = blo >> 31;

  ap = ~as & (~(~alo & (alo - 1)) >> 31);
  bp = ~bs & (~(~blo & (blo - 1)) >> 31);

  // If both negative
  c = (c + (as & bs & (blo + alo))) | 0;
  // If `a < 0` & `b > 0`
  c = (c + (as & bp & (blo - 1))) | 0;
  // If `a > 0` & `b < 0`
  c = (c + (ap & bs & (alo - 1))) | 0;

  this.hi = (hi + c) | 0;
  this.lo = mul32(alo, blo) | 0;

  return this;
};

Int64.prototype.imul = function imul(b) {
  assert(b && typeof b === 'object');
  return this._mul(b.hi, b.lo);
};

Int64.prototype.imuln = function imuln(num) {
  assert(num >= Int64.LONG_MIN && num <= Int64.ULONG_MAX);
  return this._mul(num < 0 ? -1 : 0, num | 0);
};

Int64.prototype.mul = function mul(b) {
  return this.clone().imul(b);
};

Int64.prototype.muln = function muln(num) {
  return this.clone().imuln(num);
};

/*
 * Division
 */

Int64.prototype.idiv = function idiv(b) {
  var a = this;
  var neg = false;
  var n, d, q, r, bit;

  assert(b && typeof b === 'object');

  if (b.isZero())
    throw new Error('Cannot divide by zero.');

  if (a.isZero())
    return a;

  if (a.eq(b))
    return a.set(1);

  if (a.isSafe() && b.isSafe()) {
    n = a.toDouble();
    d = b.toDouble();
    q = floor(n / d);
    return a.set(q);
  }

  if (a.signed) {
    if (a.hi < 0) {
      if (b.hi < 0) {
        a = a.ineg();
        b = b.neg();
      } else {
        a = a.ineg();
        neg = true;
      }
    } else if (b.hi < 0) {
      b = b.neg();
      neg = true;
    }
  } else {
    if (a.lt(b))
      return a.set(0);

    if (a.ushrn(1).lt(b))
      return a.set(1);
  }

  n = a.toUnsigned();
  d = b.toUnsigned();
  q = this.set(0);
  r = new this.constructor();
  bit = n.bitLength();

  r.signed = false;

  while (bit--) {
    r.ishln(1);
    r.lo |= n.testn(bit);
    if (r.gte(d)) {
      r.isub(d);
      q.setn(bit, 1);
    }
  }

  if (neg)
    q.ineg();

  return q;
};

Int64.prototype.idivn = function idivn(num) {
  assert(num >= Int64.LONG_MIN && num <= Int64.ULONG_MAX);
  return this.idiv(this.small(num));
};

Int64.prototype.div = function div(b) {
  return this.clone().idiv(b);
};

Int64.prototype.divn = function divn(num) {
  return this.clone().idivn(num);
};

/*
 * Modulo
 */

Int64.prototype.imod = function imod(b) {
  var a = this;
  var n, d, r;

  assert(b && typeof b === 'object');

  if (b.isZero())
    throw new Error('Cannot divide by zero.');

  if (a.isZero())
    return a;

  if (a.eq(b))
    return a.set(0);

  if (a.isSafe() && b.isSafe()) {
    n = a.toDouble();
    d = b.toDouble();
    r = n % d;
    return a.set(r);
  }

  return a.isub(a.div(b).imul(b));
};

Int64.prototype.imodn = function imodn(num) {
  assert(num >= Int64.LONG_MIN && num <= Int64.ULONG_MAX);
  return this.imod(this.small(num));
};

Int64.prototype.mod = function mod(b) {
  return this.clone().imod(b);
};

Int64.prototype.modn = function modn(num) {
  return this.clone().imodn(num);
};

/*
 * Exponentiation
 */

Int64.prototype.ipow = function ipow(b) {
  assert(b && typeof b === 'object');
  assert(b.hi === 0);
  return this.ipown(b.lo);
};

Int64.prototype.ipown = function ipown(num) {
  var x, y, n;

  assert(num >= Int64.LONG_MIN && num <= Int64.ULONG_MAX);

  if (this.isZero())
    return this;

  x = this.clone();
  y = num >>> 0;
  n = this;

  n.set(1);

  while (y > 0) {
    if (y & 1)
      n.imul(x);
    y >>>= 1;
    x.imul(x);
  }

  return n;
};

Int64.prototype.pow = function pow(b) {
  return this.clone().ipow(b);
};

Int64.prototype.pown = function pown(num) {
  return this.clone().ipown(num);
};

Int64.prototype.sqr = function sqr() {
  return this.mul(this);
};

Int64.prototype.isqr = function isqr() {
  return this.imul(this);
};

/*
 * AND
 */

Int64.prototype.iand = function iand(b) {
  assert(b && typeof b === 'object');
  this.hi &= b.hi;
  this.lo &= b.lo;
  return this;
};

Int64.prototype.iandn = function iandn(num) {
  assert(num >= Int64.LONG_MIN && num <= Int64.ULONG_MAX);
  this.hi &= num < 0 ? -1 : 0;
  this.lo &= num | 0;
  return this;
};

Int64.prototype.and = function and(b) {
  return this.clone().iand(b);
};

Int64.prototype.andn = function andn(num) {
  return this.clone().iandn(num);
};

/*
 * OR
 */

Int64.prototype.ior = function or(b) {
  assert(b && typeof b === 'object');
  this.hi |= b.hi;
  this.lo |= b.lo;
  return this;
};

Int64.prototype.iorn = function iorn(num) {
  assert(num >= Int64.LONG_MIN && num <= Int64.ULONG_MAX);
  this.hi |= num < 0 ? -1 : 0;
  this.lo |= num | 0;
  return this;
};

Int64.prototype.or = function or(b) {
  return this.clone().ior(b);
};

Int64.prototype.orn = function orn(num) {
  return this.clone().iorn(num);
};

/*
 * XOR
 */

Int64.prototype.ixor = function xor(b) {
  assert(b && typeof b === 'object');
  this.hi ^= b.hi;
  this.lo ^= b.lo;
  return this;
};

Int64.prototype.ixorn = function ixorn(num) {
  assert(num >= Int64.LONG_MIN && num <= Int64.ULONG_MAX);
  this.hi ^= num < 0 ? -1 : 0;
  this.lo ^= num | 0;
  return this;
};

Int64.prototype.xor = function xor(b) {
  return this.clone().ixor(b);
};

Int64.prototype.xorn = function xorn(num) {
  return this.clone().ixorn(num);
};

/*
 * NOT
 */

Int64.prototype.inot = function inot() {
  this.hi = ~this.hi;
  this.lo = ~this.lo;
  return this;
};

Int64.prototype.not = function not() {
  return this.clone().inot();
};

/*
 * Left Shift
 */

Int64.prototype.ishl = function ishl(b) {
  assert(b && typeof b === 'object');
  assert(b.hi === 0);
  return this.ishln(b.lo);
};

Int64.prototype.ishln = function ishln(bits) {
  var hi = this.hi;
  var lo = this.lo;

  assert(bits >= 0);

  bits &= 63;

  if (bits === 0)
    return this;

  if (bits < 32) {
    hi <<= bits;
    hi |= lo >>> (32 - bits);
    lo <<= bits;
  } else {
    hi = lo << (bits - 32);
    lo = 0;
  }

  this.hi = hi;
  this.lo = lo;

  return this;
};

Int64.prototype.shl = function shl(b) {
  return this.clone().ishl(b);
};

Int64.prototype.shln = function shln(bits) {
  return this.clone().ishln(bits);
};

/*
 * Right Shift
 */

Int64.prototype.ishr = function ishr(b) {
  assert(b && typeof b === 'object');
  assert(b.hi === 0);
  return this.ishrn(b.lo);
};

Int64.prototype.ishrn = function ushrn(bits) {
  var hi = this.hi;
  var lo = this.lo;

  if (!this.signed)
    return this.iushrn(bits);

  assert(bits >= 0);

  bits &= 63;

  if (bits === 0)
    return this;

  if (bits < 32) {
    lo >>>= bits;
    lo |= hi << (32 - bits);
    hi >>= bits;
  } else {
    lo = hi >> (bits - 32);
    hi = hi < 0 ? -1 : 0;
  }

  this.hi = hi;
  this.lo = lo;

  return this;
};

Int64.prototype.shr = function shr(b) {
  return this.clone().ishr(b);
};

Int64.prototype.shrn = function shrn(bits) {
  return this.clone().ishrn(bits);
};

/*
 * Unsigned Right Shift
 */

Int64.prototype.iushr = function iushr(b) {
  assert(b && typeof b === 'object');
  assert(b.hi === 0);
  return this.iushrn(b.lo);
};

Int64.prototype.iushrn = function ushrn(bits) {
  var hi = this.hi;
  var lo = this.lo;

  assert(bits >= 0);

  bits &= 63;

  if (bits === 0)
    return this;

  if (bits < 32) {
    lo >>>= bits;
    lo |= hi << (32 - bits);
    hi >>>= bits;
  } else {
    lo = hi >>> (bits - 32);
    hi = 0;
  }

  this.hi = hi | 0;
  this.lo = lo | 0;

  return this;
};

Int64.prototype.ushr = function ushr(b) {
  return this.clone().iushr(b);
};

Int64.prototype.ushrn = function ushrn(bits) {
  return this.clone().iushrn(bits);
};

/*
 * Bit Manipulation
 */

Int64.prototype.setn = function setn(bit, val) {
  assert(bit >= 0);

  bit &= 63;

  if (bit < 32) {
    if (val)
      this.lo |= (1 << bit);
    else
      this.lo &= ~(1 << bit);
  } else {
    if (val)
      this.hi |= (1 << (bit - 32));
    else
      this.hi &= ~(1 << (bit - 32));
  }

  return this;
};

Int64.prototype.testn = function testn(bit) {
  assert(bit >= 0);

  bit &= 63;

  if (bit < 32)
    return (this.lo >>> bit) & 1;

  return (this.hi >>> (bit - 32)) & 1;
};

Int64.prototype.imaskn = function imaskn(bit) {
  assert(bit >= 0);

  bit &= 63;

  if (bit < 32) {
    this.lo &= (1 << bit) - 1;
  } else {
    this.hi &= (1 << (bit - 32)) - 1;
    this.lo &= 0xffffffff;
  }

  return this;
};

Int64.prototype.maskn = function maskn(bit) {
  return this.clone().imaskn(bit);
};

Int64.prototype.andln = function andln(num) {
  assert(num >= Int64.LONG_MIN && num <= Int64.ULONG_MAX);
  return this.lo & num;
};

/*
 * Negation
 */

Int64.prototype.ineg = function ineg() {
  var hi = ~this.hi;
  var lo = ~this.lo;

  if (lo === -1) {
    lo = 0;
    hi += 1;
    hi |= 0;
  } else {
    lo += 1;
  }

  this.hi = hi;
  this.lo = lo;

  return this;
};

Int64.prototype.neg = function neg() {
  return this.clone().ineg();
};

Int64.prototype.iabs = function iabs() {
  if (this.isNeg())
    this.ineg();
  return this;
};

Int64.prototype.abs = function abs() {
  return this.clone().iabs();
};

/*
 * Comparison
 */

Int64.prototype._cmp = function _cmp(bhi, blo) {
  var a = this;
  var ahi = a.hi;
  var alo = a.lo;
  var x, y;

  if (ahi === bhi && alo === blo)
    return 0;

  if (a.signed) {
    x = ahi < 0;
    y = bhi < 0;

    if (x && !y)
      return -1;

    if (!x && y)
      return 1;
  }

  if (!x) {
    ahi >>>= 0;
    bhi >>>= 0;
  }

  if (ahi < bhi)
    return -1;

  if (ahi > bhi)
    return 1;

  if ((alo >>> 0) < (blo >>> 0))
    return -1;

  return 1;
};

Int64.prototype.cmp = function cmp(b) {
  assert(b && typeof b === 'object');
  return this._cmp(b.hi, b.lo);
};

Int64.prototype.cmpn = function cmpn(num) {
  assert(num >= Int64.LONG_MIN && num <= Int64.ULONG_MAX);
  return this._cmp(num < 0 ? -1 : 0, num | 0);
};

Int64.prototype.eq = function eq(b) {
  assert(b && typeof b === 'object');
  return this.hi === b.hi && this.lo === b.lo;
};

Int64.prototype.eqn = function eqn(num) {
  assert(num >= Int64.LONG_MIN && num <= Int64.ULONG_MAX);
  return this.hi === (num < 0 ? -1 : 0) && this.lo === (num | 0);
};

Int64.prototype.gt = function gt(b) {
  return this.cmp(b) > 0;
};

Int64.prototype.gtn = function gtn(num) {
  return this.cmpn(num) > 0;
};

Int64.prototype.gte = function gte(b) {
  return this.cmp(b) >= 0;
};

Int64.prototype.gten = function gten(num) {
  return this.cmpn(num) >= 0;
};

Int64.prototype.lt = function lt(b) {
  return this.cmp(b) < 0;
};

Int64.prototype.ltn = function ltn(num) {
  return this.cmpn(num) < 0;
};

Int64.prototype.lte = function lte(b) {
  return this.cmp(b) <= 0;
};

Int64.prototype.lten = function lten(num) {
  return this.cmpn(num) <= 0;
};

Int64.prototype.isZero = function isZero() {
  return this.hi === 0 && this.lo === 0;
};

Int64.prototype.isNeg = function isNeg() {
  return this.signed && this.hi < 0;
};

Int64.prototype.isOdd = function isOdd() {
  return (this.lo & 1) === 1;
};

Int64.prototype.isEven = function isEven() {
  return (this.lo & 1) === 0;
};

/*
 * Helpers
 */

Int64.prototype.clone = function clone() {
  var n = new this.constructor();
  n.hi = this.hi;
  n.lo = this.lo;
  n.signed = this.signed;
  return n;
};

Int64.prototype.inject = function inject(b) {
  assert(b && typeof b === 'object');
  this.hi = b.hi;
  this.lo = b.lo;
  this.signed = b.signed;
  return this;
};

Int64.prototype.set = function set(num) {
  var neg = false;

  if (num < 0) {
    num = -num;
    neg = true;
  }

  this.hi = (num * (1 / 0x100000000)) | 0;
  this.lo = num | 0;

  if (neg)
    this.ineg();

  return this;
};

Int64.prototype.join = function join(hi, lo) {
  this.hi = hi | 0;
  this.lo = lo | 0;
  return this;
};

Int64.prototype.small = function small(num) {
  var n = new this.constructor();
  n.hi = num < 0 ? -1 : 0;
  n.lo = num | 0;
  n.signed = this.signed;
  return n;
};

Int64.prototype.toSigned = function toSigned() {
  var b = this.clone();
  b.signed = true;
  return b;
};

Int64.prototype.toUnsigned = function toUnsigned() {
  var b = this.clone();
  b.signed = false;
  return b;
};

Int64.prototype.bitLength = function bitLength() {
  var a = this;

  if (this.isNeg())
    a = this.neg();

  if (a.hi === 0)
    return countBits(a.lo);

  return countBits(a.hi) + 32;
};

Int64.prototype.byteLength = function byteLength() {
  return Math.ceil(this.bitLength() / 8);
};

Int64.prototype.isSafe = function isSafe() {
  var hi = this.hi;

  if (this.isNeg()) {
    hi = ~hi;
    if (this.lo === 0)
      hi += 1;
  }

  return (hi & 0xffe00000) === 0;
};

Int64.prototype.toNumber = function toNumber() {
  assert(this.isSafe(), 'Number exceeds 53 bits.');
  return this.toDouble();
};

Int64.prototype.toDouble = function toDouble() {
  var hi = this.hi;

  if (!this.signed)
    hi >>>= 0;

  return hi * 0x100000000 + (this.lo >>> 0);
};

Int64.prototype.toInt = function toInt() {
  return this.signed ? this.lo : this.lo >>> 0;
};

Int64.prototype.toString = function toString(base) {
  var n = this;
  var str = '';
  var neg = false;
  var ch, hi, lo;

  if (base == null)
    base = 10;

  assert(typeof base === 'number');
  assert(base >= 2 && base <= 16);

  if (n.isZero())
    return '0';

  if (n.isNeg()) {
    n = n.neg();
    neg = true;
  }

  hi = n.hi >>> 0;
  lo = n.lo >>> 0;

  do {
    ch = hi % base;
    hi -= ch;
    hi /= base;
    lo += ch * 0x100000000;

    ch = lo % base;
    lo -= ch;
    lo /= base;

    if (ch < 10)
      ch += 0x30;
    else
      ch += 0x61 - 10;

    ch = String.fromCharCode(ch);
    str = ch + str;
  } while (lo > 0 || hi > 0);

  if (neg)
    str = '-' + str;

  return str;
};

Int64.prototype.toJSON = function toJSON() {
  return this.toString(16);
};

Int64.prototype.fromNumber = function fromNumber(num, signed) {
  assert(typeof num === 'number' && isFinite(num));
  assert(num >= Int64.DOUBLE_MIN && num <= Int64.DOUBLE_MAX);

  if (signed != null) {
    assert(typeof signed === 'boolean');
    this.signed = signed;
  }

  return this.set(num);
};

Int64.prototype.fromInt = function fromInt(num, signed) {
  assert(typeof num === 'number' && isFinite(num));
  assert(num >= Int64.LONG_MIN && num <= Int64.ULONG_MAX);

  if (signed != null) {
    assert(typeof signed === 'boolean');
    this.signed = signed;
  }

  return this.join(num < 0 ? -1 : 0, num);
};

Int64.prototype.fromBits = function fromBits(hi, lo, signed) {
  assert(typeof hi === 'number' && isFinite(hi));
  assert(typeof lo === 'number' && isFinite(lo));
  assert(hi >= Int64.LONG_MIN && hi <= Int64.ULONG_MAX);
  assert(lo >= Int64.LONG_MIN && lo <= Int64.ULONG_MAX);

  if (signed != null) {
    assert(typeof signed === 'boolean');
    this.signed = signed;
  }

  return this.join(hi, lo);
};

Int64.prototype.fromString = function fromString(str, signed, base) {
  var neg = false;
  var hi = 0;
  var lo = 0;
  var i = 0;
  var ch;

  if (typeof signed === 'number') {
    base = signed;
    signed = null;
  }

  if (base == null)
    base = 10;

  if (signed == null)
    signed = false;

  assert(typeof str === 'string');
  assert(typeof base === 'number');
  assert(typeof signed === 'boolean');
  assert(str.length > 0);
  assert(base >= 2 && base <= 16);

  if (str[0] === '-') {
    i += 1;
    neg = true;
  }

  assert(str.length > i);
  assert(str.length <= 64 + i);

  for (; i < str.length; i++) {
    ch = str.charCodeAt(i);

    if (ch >= 0x30 && ch <= 0x39)
      ch -= 0x30;
    else if (ch >= 0x41 && ch <= 0x5a)
      ch -= 0x41 - 10;
    else if (ch >= 0x61 && ch <= 0x7a)
      ch -= 0x61 - 10;
    else
      ch = base;

    if (ch >= base)
      throw new Error('Invalid string.');

    lo *= base;
    lo += ch;

    hi *= base;

    if (lo > Int64.ULONG_MAX) {
      ch = lo % 0x100000000;
      hi += (lo - ch) / 0x100000000;
      lo = ch;
    }

    if (hi > Int64.ULONG_MAX)
      throw new Error('Invalid string (overflow).');
  }

  this.hi = hi | 0;
  this.lo = lo | 0;
  this.signed = signed;

  if (neg)
    this.ineg();

  return this;
};

Int64.prototype.fromObject = function fromObject(num, signed) {
  assert(num && typeof num === 'object');

  if (signed == null)
    signed = num.signed;

  return this.fromBits(num.hi, num.lo, signed);
};

Int64.prototype.from = function from(num, signed, base) {
  if (num == null)
    return this;

  if (typeof num === 'number') {
    if (typeof signed === 'number')
      return this.fromBits(num, signed, base);
    return this.fromNumber(num, signed);
  }

  if (typeof num === 'string')
    return this.fromString(num, signed, base);

  if (typeof num === 'boolean') {
    this.signed = num;
    return this;
  }

  if (typeof num === 'object')
    return this.fromObject(num, signed);

  throw new Error('Not a number.');
};

Int64.prototype.inspect = function inspect() {
  var prefix = 'Int64';

  if (!this.signed)
    prefix = 'Uint64';

  return '<' + prefix + ' ' + this.toString(16) + '>';
};

/*
 * Static Methods
 */

Int64.min = function min(a, b) {
  return a.cmp(b) < 0 ? a : b;
};

Int64.max = function max(a, b) {
  return a.cmp(b) > 0 ? a : b;
};

Int64.fromNumber = function fromNumber(num, signed) {
  return new Int64().fromNumber(num, signed);
};

Int64.fromInt = function fromInt(num, signed) {
  return new Int64().fromInt(num, signed);
};

Int64.fromBits = function fromBits(hi, lo, signed) {
  return new Int64().fromBits(hi, lo, signed);
};

Int64.fromString = function fromString(str, signed, base) {
  return new Int64().fromString(str, signed, base);
};

Int64.from = function from(num, signed, base) {
  return new Int64().from(num, signed, base);
};

Int64.isInt64 = function isInt64(obj) {
  if (obj instanceof Int64)
    return true;

  return !!obj && !obj.n
    && typeof obj.toSigned === 'function'
    && typeof obj.muln === 'function';
};

/*
 * Constants
 */

Int64.ULONG_MIN = 0x00000000;
Int64.ULONG_MAX = 0xffffffff;

Int64.LONG_MIN = -0x80000000;
Int64.LONG_MAX = 0x7fffffff;

Int64.DOUBLE_MIN = -0x001fffffffffffff;
Int64.DOUBLE_MAX = 0x001fffffffffffff;

Int64.UINT32_MIN = Int64(0x00000000, 0x00000000);
Int64.UINT32_MAX = Int64(0x00000000, 0xffffffff);

Int64.INT32_MIN = Int64(0xffffffff, 0x80000000, true);
Int64.INT32_MAX = Int64(0x00000000, 0x7fffffff, true);

Int64.UINT64_MIN = Int64(0x00000000, 0x00000000);
Int64.UINT64_MAX = Int64(0xffffffff, 0xffffffff);

Int64.INT64_MIN = Int64(0x80000000, 0x00000000, true);
Int64.INT64_MAX = Int64(0x7fffffff, 0xffffffff, true);

/*
 * Helpers
 */

function countBits(word) {
  var bit;

  if (Math.clz32)
    return 32 - Math.clz32(word);

  for (bit = 31; bit > 0; bit--) {
    if ((word & (1 << bit)) !== 0)
      break;
  }

  return bit + 1;
}

function floor(n) {
  if (n < 0)
    return -Math.floor(-n);
  return Math.floor(n);
}

function _mul32(a, b) {
  var alo = a & 0xffff;
  var blo = b & 0xffff;
  var ahi = a >>> 16;
  var bhi = b >>> 16;
  var r, lo, hi;

  lo = alo * blo;
  hi = (ahi * blo + bhi * alo) & 0xffff;

  hi += lo >>> 16;
  lo &= 0xffff;
  r = (hi << 16) | lo;

  if (r < 0)
    r += 0x100000000;

  return r;
}

if (!mul32)
  mul32 = _mul32;

/*
 * Expose
 */

module.exports = Int64;
