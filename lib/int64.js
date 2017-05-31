/*!
 * int64.js - javascript int64's for n64.js.
 * Copyright (c) 2017, Christopher Jeffrey (MIT License).
 * https://github.com/chjj/n64
 */

'use strict';

var assert = require('assert');

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
 * Internal
 */

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

  throw new Error('Not a number.');
};

Int64.from = function from(num, signed, base) {
  return new Int64().from(num, signed, base);
};

Int64.prototype.clone = function clone() {
  var n = new Int64();
  n.hi = this.hi;
  n.lo = this.lo;
  n.signed = this.signed;
  return n;
};

Int64.prototype.join = function join(hi, lo) {
  this.hi = hi | 0;
  this.lo = lo | 0;
  return this;
};

Int64.prototype.set = function set(num) {
  return this.fromNumber(num, this.signed);
};

Int64.prototype.inject = function inject(b) {
  this.hi = b.hi;
  this.lo = b.lo;
  this.signed = b.signed;
  return this;
};

Int64.prototype.small = function small(lo) {
  var n = new Int64();
  n.signed = this.signed;
  return n.join(lo < 0 ? -1 : 0, lo);
};

/*
 * Addition
 */

Int64.prototype.iadd = function iadd(b) {
  var a = this;
  var a48 = a.hi >>> 16;
  var a32 = a.hi & 0xffff;
  var a16 = a.lo >>> 16;
  var a00 = a.lo & 0xffff;
  var b48 = b.hi >>> 16;
  var b32 = b.hi & 0xffff;
  var b16 = b.lo >>> 16;
  var b00 = b.lo & 0xffff;
  var c48 = 0;
  var c32 = 0;
  var c16 = 0;
  var c00 = 0;
  var hi, lo;

  c00 += a00 + b00;
  c16 += c00 >>> 16;
  c00 &= 0xffff;
  c16 += a16 + b16;
  c32 += c16 >>> 16;
  c16 &= 0xffff;
  c32 += a32 + b32;
  c48 += c32 >>> 16;
  c32 &= 0xffff;
  c48 += a48 + b48;
  c48 &= 0xffff;

  hi = (c48 << 16) | c32;
  lo = (c16 << 16) | c00;

  return a.join(hi, lo);
};

Int64.prototype.iaddn = function iaddn(num) {
  return this.iadd(this.small(num));
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

Int64.prototype.isub = function isub(b) {
  return this.iadd(b.neg());
};

Int64.prototype.isubn = function isubn(num) {
  return this.isub(this.small(num));
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

Int64.prototype.imul = function imul(b) {
  var a = this;
  var a48, a32, a16, a00;
  var b48, b32, b16, b00;
  var c48, c32, c16, c00;
  var hi, lo;

  if (a.isZero() || b.isZero())
    return a.set(0);

  if (a.signed) {
    if (!b.signed)
      b = b.toSigned();

    if (isMin64(a)) {
      if (!b.isOdd())
        return a.set(0);
      return a;
    }

    if (isMin64(b)) {
      if (!a.isOdd())
        return a.set(0);
      return a.inject(b);
    }

    if (a.isNeg()) {
      if (b.isNeg())
        return a.ineg().imul(b.neg());
      return a.ineg().imul(b).ineg();
    }

    if (b.isNeg())
      return a.imul(b.neg()).ineg();
  } else {
    if (b.signed)
      b = b.toUnsigned();
  }

  if (isSafeMul(a) && isSafeMul(b))
    return a.set(a.toNumber() * b.toNumber());

  a48 = a.hi >>> 16;
  a32 = a.hi & 0xffff;
  a16 = a.lo >>> 16;
  a00 = a.lo & 0xffff;

  b48 = b.hi >>> 16;
  b32 = b.hi & 0xffff;
  b16 = b.lo >>> 16;
  b00 = b.lo & 0xffff;

  c48 = 0;
  c32 = 0;
  c16 = 0;
  c00 = 0;

  c00 += a00 * b00;
  c16 += c00 >>> 16;
  c00 &= 0xffff;
  c16 += a16 * b00;
  c32 += c16 >>> 16;
  c16 &= 0xffff;
  c16 += a00 * b16;
  c32 += c16 >>> 16;
  c16 &= 0xffff;
  c32 += a32 * b00;
  c48 += c32 >>> 16;
  c32 &= 0xffff;
  c32 += a16 * b16;
  c48 += c32 >>> 16;
  c32 &= 0xffff;
  c32 += a00 * b32;
  c48 += c32 >>> 16;
  c32 &= 0xffff;
  c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
  c48 &= 0xffff;

  hi = (c48 << 16) | c32;
  lo = (c16 << 16) | c00;

  return a.join(hi, lo);
};

Int64.prototype.imuln = function imuln(num) {
  return this.imul(this.small(num));
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
  var approx, rem, res, half;
  var log2, delta, ares, arem;

  if (b.isZero())
    throw new Error('Cannot divide by zero.');

  if (a.isZero())
    return a;

  if (a.signed) {
    if (!b.signed)
      b = b.toSigned();

    if (isMin64(a)) {
      if (b.eqn(1) || b.eqn(-1))
        return a;

      if (isMin64(b))
        return a.set(1);

      half = a.shrn(1);
      approx = half.idiv(b).ishln(1);

      if (approx.isZero()) {
        if (b.isNeg())
          return a.set(1);
        return a.set(-1);
      }

      rem = a.sub(b.mul(approx));
      res = approx.iadd(rem.div(b));

      return res;
    }

    if (isMin64(b))
      return a.set(0);

    if (a.isNeg()) {
      if (b.isNeg())
        return a.ineg().idiv(b.neg());
      return a.ineg().idiv(b).ineg();
    }

    if (b.isNeg())
      return a.idiv(b.neg()).ineg();
  } else {
    if (b.signed)
      b = b.toUnsigned();

    if (b.gt(a))
      return a.set(0);

    if (b.gt(a.ushrn(1)))
      return a.set(1);
  }

  rem = a.clone();
  res = a.set(0);

  while (rem.gte(b)) {
    approx = rem.toDouble() / b.toDouble();
    approx = Math.floor(approx);

    if (approx < 1)
      approx = 1;

    log2 = Math.ceil(Math.log(approx) / Math.LN2);
    delta = 1;

    if (log2 > 48)
      delta = Math.pow(2, log2 - 48);

    ares = Int64.fromNumber(approx, true);
    arem = ares.mul(b);

    while (arem.isNeg() || arem.gt(rem)) {
      approx -= delta;
      ares = Int64.fromNumber(approx, a.signed);
      arem = ares.mul(b);
    }

    if (ares.isZero())
      ares.set(1);

    res.iadd(ares);
    rem.isub(arem);
  }

  return a;
};

Int64.prototype.idivn = function idivn(num) {
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
  return this.isub(this.div(b).imul(b));
};

Int64.prototype.imodn = function imodn(num) {
  return this.imod(this.small(num));
};

Int64.prototype.mod = function mod(b) {
  return this.clone().imod(b);
};

Int64.prototype.modn = function modn(num) {
  return this.clone().imodn(num);
};

/*
 * AND
 */

Int64.prototype.iand = function iand(b) {
  return this.join(this.hi & b.hi, this.lo & b.lo);
};

Int64.prototype.iandn = function iandn(num) {
  return this.iand(this.small(num));
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
  return this.join(this.hi | b.hi, this.lo | b.lo);
};

Int64.prototype.iorn = function iorn(num) {
  return this.ior(this.small(num));
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
  return this.join(this.hi ^ b.hi, this.lo ^ b.lo);
};

Int64.prototype.ixorn = function ixorn(num) {
  return this.ixor(this.small(num));
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
  return this.join(~this.hi, ~this.lo);
};

Int64.prototype.not = function not() {
  return this.clone().inot();
};

/*
 * Left Shift
 */

Int64.prototype.ishl = function ishl(b) {
  assert(!b.isNeg() && b.hi === 0);
  return this.ishln(b.lo);
};

Int64.prototype.ishln = function ishln(num) {
  var a = this;
  var hi = a.hi;
  var lo = a.lo;

  num &= 63;

  if (num === 0)
    return a;

  if (num < 32) {
    hi <<= num;
    hi |= lo >>> (32 - num);
    lo <<= num;
    return a.join(hi, lo);
  }

  hi = lo << (num - 32);
  lo = 0;

  return a.join(hi, lo);
};

Int64.prototype.shl = function shl(b) {
  return this.clone().ishl(b);
};

Int64.prototype.shln = function shln(num) {
  return this.clone().ishln(num);
};

/*
 * Right Shift
 */

Int64.prototype.ishr = function ishr(b) {
  assert(!b.isNeg() && b.hi === 0);
  return this.ishrn(b.lo);
};

Int64.prototype.ishrn = function ushrn(num) {
  var a = this;
  var hi = a.hi;
  var lo = a.lo;

  if (!this.signed)
    return this.iushrn(num);

  num &= 63;

  if (num === 0)
    return a;

  if (num < 32) {
    lo >>>= num;
    lo |= hi << (32 - num);
    hi >>= num;
    return a.join(hi, lo);
  }

  lo = hi >> (num - 32);
  hi = hi >= 0 ? 0 : -1;

  return a.join(hi, lo);
};

Int64.prototype.shr = function shr(b) {
  return this.clone().ishr(b);
};

Int64.prototype.shrn = function shrn(num) {
  return this.clone().ishrn(num);
};

/*
 * Unsigned Right Shift
 */

Int64.prototype.iushr = function iushr(b) {
  assert(!b.isNeg() && b.hi === 0);
  return this.iushrn(b.lo);
};

Int64.prototype.iushrn = function ushrn(num) {
  var a = this;
  var hi = a.hi;
  var lo = a.lo;

  num &= 63;

  if (num === 0)
    return a;

  if (num < 32) {
    lo >>>= num;
    lo |= hi << (32 - num);
    hi >>>= num;
    return a.join(hi, lo);
  }

  if (num === 32)
    return a.join(0, hi);

  lo = hi >>> (num - 32);
  hi = 0;

  return a.join(hi, lo);
};

Int64.prototype.ushr = function ushr(b) {
  return this.clone().iushr(b);
};

Int64.prototype.ushrn = function ushrn(num) {
  return this.clone().iushrn(num);
};

/*
 * Negation
 */

Int64.prototype.ineg = function ineg() {
  if (this.signed && isMin64(this))
    return this;
  return this.inot().iaddn(1);
};

Int64.prototype.neg = function neg() {
  return this.clone().ineg();
};

/*
 * Exponentiation
 */

Int64.prototype.ipow = function ipow(b) {
  assert(!b.isNeg() && b.hi === 0);
  return this.ipown(b.lo);
};

Int64.prototype.ipown = function ipown(num) {
  var exp = this.clone();

  num >>>= 0;

  if (num === 0)
    return this.set(1);

  while (--num)
    this.imul(exp);

  return this;
};

Int64.prototype.pow = function pow(b) {
  return this.clone().ipow(b);
};

Int64.prototype.pown = function pown(num) {
  return this.clone().ipown(num);
};

/*
 * Comparison
 */

Int64.prototype.cmp = function cmp(b) {
  var a = this;
  var x, y;

  if (a.eq(b))
    return 0;

  if (a.signed) {
    x = a.isNeg();
    y = b.isNeg();

    if (x && !y)
      return -1;

    if (!x && y)
      return 1;

    return a.sub(b).isNeg() ? -1 : 1;
  }

  if ((b.hi >>> 0) > (a.hi >>> 0))
    return -1;

  if (b.hi === a.hi && (b.lo >>> 0) > (a.lo >>> 0))
    return -1;

  return 1;
};

Int64.prototype.cmpn = function cmpn(num) {
  return this.cmp(this.small(num));
};

Int64.prototype.eq = function eq(b) {
  var a = this;

  if (a.signed !== b.signed) {
    if ((a.hi >>> 31) === 1 && (b.hi >>> 31) === 1)
      return false;
  }

  return a.hi === b.hi && a.lo === b.lo;
};

Int64.prototype.eqn = function eqn(num) {
  var hi = num < 0 ? -1 : 0;
  var lo = num | 0;
  return this.hi === hi && this.lo === lo;
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

/*
 * Helpers
 */

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

Int64.prototype.isZero = function isZero() {
  return this.hi === 0 && this.lo === 0;
};

Int64.prototype.isNeg = function isNeg() {
  return this.signed && this.hi < 0;
};

Int64.prototype.bitLength = function bitLength() {
  var a = this;

  if (this.isNeg()) {
    if (isMin64(this))
      return 64;
    a = this.neg();
  }

  if (a.hi === 0)
    return countBits(a.lo);

  return countBits(a.hi) + 32;
};

Int64.prototype.byteLength = function byteLength() {
  return Math.ceil(this.bitLength() / 8);
};

Int64.prototype.isOdd = function isOdd() {
  return (this.lo & 1) === 1;
};

Int64.prototype.isEven = function isEven() {
  return (this.lo & 1) === 0;
};

Int64.prototype.fromNumber = function fromNumber(num, signed) {
  var neg = false;
  var hi, lo;

  assert(typeof num === 'number' && isFinite(num));

  if (num < 0) {
    neg = true;
    num = -num;
  }

  lo = num % 0x100000000;
  hi = (num - lo) / 0x100000000;

  this.fromBits(hi, lo, signed);

  if (neg)
    this.ineg();

  return this;
};

Int64.fromNumber = function fromNumber(num, signed) {
  return new Int64().fromNumber(num, signed);
};

Int64.prototype.fromInt = function fromInt(num, signed) {
  var hi, lo;

  assert(typeof num === 'number' && isFinite(num));

  hi = num < 0 ? -1 : 0;
  lo = num | 0;

  return this.fromBits(hi, lo, signed);
};

Int64.fromInt = function fromInt(num, signed) {
  return new Int64().fromInt(num, signed);
};

Int64.prototype.fromBits = function fromBits(hi, lo, signed) {
  assert(typeof hi === 'number' && isFinite(hi));
  assert(typeof lo === 'number' && isFinite(lo));

  if (signed != null) {
    assert(typeof signed === 'boolean');
    this.signed = signed;
  }

  return this.join(hi, lo);
};

Int64.fromBits = function fromBits(hi, lo, signed) {
  return new Int64().fromBits(hi, lo, signed);
};

Int64.prototype.toNumber = function toNumber() {
  var hi = this.hi;
  var lo = this.lo;

  if (lo < 0)
    lo += 0x100000000;

  if (this.signed) {
    assert((Math.abs(hi) & 0xffe00000) === 0, 'Number exceeds 2^53-1');
    return hi * 0x100000000 + lo;
  }

  if (hi < 0)
    hi += 0x100000000;

  assert((hi & 0xffe00000) === 0, 'Number exceeds 2^53-1');

  return hi * 0x100000000 + lo;
};

Int64.prototype.toDouble = function toDouble() {
  var hi = this.hi;
  var lo = this.lo;

  if (lo < 0)
    lo += 0x100000000;

  if (this.signed)
    return hi * 0x100000000 + lo;

  if (hi < 0)
    hi += 0x100000000;

  return hi * 0x100000000 + lo;
};

Int64.prototype.toInt = function toInt() {
  return !this.signed ? this.lo >>> 0 : this.lo;
};

Int64.prototype.fromString = function fromString(str, signed, base) {
  var res = new Int64();
  var neg = false;
  var i, radix, size, val, pow;

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

  switch (base) {
    case 2:
    case 8:
    case 10:
    case 16:
      break;
    default:
      throw new Error('Invalid base.');
  }

  if (str[0] === '-') {
    assert(str.length > 1, 'Non-numeric string passed.');
    str = str.substring(1);
    neg = true;
  } else {
    assert(str.length > 0, 'Non-numeric string passed.');
  }

  assert(str.length <= 64);

  radix = Math.pow(base, 8);
  radix = Int64.fromNumber(radix, true);

  for (i = 0; i < str.length; i += 8) {
    size = Math.min(8, str.length - i);
    val = str.substring(i, i + size);
    val = parseInt(val, base);

    if (size < 8) {
      pow = Math.pow(base, size);
      pow = Int64.fromNumber(pow, true);
      res.imul(pow);
      res.iaddn(val);
    } else {
      res.imul(radix);
      res.iaddn(val);
    }
  }

  this.hi = res.hi;
  this.lo = res.lo;
  this.signed = signed;

  if (neg)
    this.ineg();

  return this;
};

Int64.fromString = function fromString(str, signed, base) {
  return new Int64().fromString(str, signed, base);
};

Int64.prototype.toString = function toString(base) {
  var str = '';
  var radix, div, rem;
  var rdiv, val, digits;

  if (base == null)
    base = 10;

  assert(typeof base === 'number');

  switch (base) {
    case 2:
    case 8:
    case 10:
    case 16:
      break;
    default:
      throw new Error('Invalid base.');
  }

  if (this.isZero())
    return '0';

  if (this.isNeg()) {
    if (isMin64(this)) {
      radix = Int64.fromNumber(base, true);
      div = this.div(radix);
      rem = div.mul(radix).isub(this);
      str += div.toString(base);
      str += rem.toInt().toString(base);
      return str;
    }
    return '-' + this.neg().toString(base);
  }

  radix = Math.pow(base, 6);
  radix = Int64.fromNumber(radix, this.signed);
  rem = this;

  for (;;) {
    rdiv = rem.div(radix);
    val = rem.sub(rdiv.mul(radix)).lo >>> 0;
    digits = val.toString(base);
    rem = rdiv;

    if (rem.isZero()) {
      str = digits + str;
      break;
    }

    while (digits.length < 6)
      digits = '0' + digits;

    str = digits + str;
  }

  return str;
};

Int64.prototype.inspect = function inspect() {
  return '<Int64 ' + this.toString(16) + '>';
};

Int64.isInt64 = function isInt64(obj) {
  return !!obj && !obj.n
    && typeof obj.toSigned === 'function'
    && typeof obj.muln === 'function';
};

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

function isMin64(a) {
  return a.hi === (0x80000000 | 0) && a.lo === 0;
}

function isSafeMul(a) {
  if (a.isNeg())
    a = a.neg();

  if (a.hi !== 0)
    return false;

  if ((a.lo >>> 0) >= (1 << 24))
    return false;

  return true;
}

/*
 * Expose
 */

module.exports = Int64;
