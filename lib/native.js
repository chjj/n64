/*!
 * native.js - native int64's for n64.js.
 * Copyright (c) 2017, Christopher Jeffrey (MIT License).
 * https://github.com/chjj/n64
 */

'use strict';

var assert = require('assert');
var Native = require('bindings')('n64').Int64;

/**
 * Int64
 * @constructor
 */

function Int64(num, signed, base) {
  if (!(this instanceof Int64))
    return new Int64(num, signed, base);

  this.n = new Native();
  this.from(num, signed, base);
}

/*
 * Internal
 */

Int64.prototype.__defineGetter__('hi', function() {
  return this.n.getHi();
});

Int64.prototype.__defineSetter__('hi', function(value) {
  return this.n.setHi(value);
});

Int64.prototype.__defineGetter__('lo', function() {
  return this.n.getLo();
});

Int64.prototype.__defineSetter__('lo', function(value) {
  return this.n.setLo(value);
});

Int64.prototype.__defineGetter__('signed', function() {
  return this.n.getSigned();
});

Int64.prototype.__defineSetter__('signed', function(value) {
  return this.n.setSigned(value);
});

/*
 * Addition
 */

Int64.prototype.iadd = function iadd(b) {
  this.n.iadd(b.n);
  return this;
};

Int64.prototype.iaddn = function iaddn(num) {
  assert(num >= Int64.LONG_MIN && num <= Int64.ULONG_MAX);
  this.n.iaddn(num);
  return this;
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
  this.n.isub(b.n);
  return this;
};

Int64.prototype.isubn = function isubn(num) {
  assert(num >= Int64.LONG_MIN && num <= Int64.ULONG_MAX);
  this.n.isubn(num);
  return this;
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
  this.n.imul(b.n);
  return this;
};

Int64.prototype.imuln = function imuln(num) {
  assert(num >= Int64.LONG_MIN && num <= Int64.ULONG_MAX);
  this.n.imuln(num);
  return this;
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
  this.n.idiv(b.n);
  return this;
};

Int64.prototype.idivn = function idivn(num) {
  assert(num >= Int64.LONG_MIN && num <= Int64.ULONG_MAX);
  this.n.idivn(num);
  return this;
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
  this.n.imod(b.n);
  return this;
};

Int64.prototype.imodn = function imodn(num) {
  assert(num >= Int64.LONG_MIN && num <= Int64.ULONG_MAX);
  this.n.imodn(num);
  return this;
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
  assert(b.n.getHi() === 0);
  return this.ipown(b.lo);
};

Int64.prototype.ipown = function ipown(num) {
  assert(num >= Int64.LONG_MIN && num <= Int64.ULONG_MAX);
  this.n.ipown(num);
  return this;
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
  this.n.iand(b.n);
  return this;
};

Int64.prototype.iandn = function iandn(num) {
  assert(num >= Int64.LONG_MIN && num <= Int64.ULONG_MAX);
  this.n.iandn(num);
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
  this.n.ior(b.n);
  return this;
};

Int64.prototype.iorn = function iorn(num) {
  assert(num >= Int64.LONG_MIN && num <= Int64.ULONG_MAX);
  this.n.iorn(num);
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
  this.n.ixor(b.n);
  return this;
};

Int64.prototype.ixorn = function ixorn(num) {
  assert(num >= Int64.LONG_MIN && num <= Int64.ULONG_MAX);
  this.n.ixorn(num);
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
  this.n.inot();
  return this;
};

Int64.prototype.not = function not() {
  return this.clone().inot();
};

/*
 * Left Shift
 */

Int64.prototype.ishl = function ishl(b) {
  assert(b.n.getHi() === 0);
  return this.ishln(b.lo);
};

Int64.prototype.ishln = function ishln(bits) {
  assert(bits >= 0);
  this.n.ishln(bits);
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
  assert(b.n.getHi() === 0);
  return this.ishrn(b.lo);
};

Int64.prototype.ishrn = function ishrn(bits) {
  assert(bits >= 0);
  this.n.ishrn(bits);
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
  assert(b.n.getHi() === 0);
  return this.iushrn(b.lo);
};

Int64.prototype.iushrn = function iushrn(bits) {
  assert(bits >= 0);
  this.n.iushrn(bits);
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
  this.n.setn(bit, val);
  return this;
};

Int64.prototype.testn = function testn(bit) {
  assert(bit >= 0);
  return this.n.testn(bit);
};

Int64.prototype.imaskn = function imaskn(bit) {
  assert(bit >= 0);
  this.n.imaskn(bit);
  return this;
};

Int64.prototype.maskn = function maskn(bit) {
  return this.clone().imaskn(bit);
};

Int64.prototype.andln = function andln(num) {
  assert(num >= Int64.LONG_MIN && num <= Int64.ULONG_MAX);
  return this.n.getLo() & num;
};

/*
 * Negation
 */

Int64.prototype.ineg = function ineg() {
  this.n.ineg();
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

Int64.prototype.cmp = function cmp(b) {
  return this.n.cmp(b.n);
};

Int64.prototype.cmpn = function cmpn(num) {
  assert(num >= Int64.LONG_MIN && num <= Int64.ULONG_MAX);
  return this.n.cmpn(num);
};

Int64.prototype.eq = function eq(b) {
  return this.n.eq(b.n);
};

Int64.prototype.eqn = function eqn(num) {
  assert(num >= Int64.LONG_MIN && num <= Int64.ULONG_MAX);
  return this.n.eqn(num);
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
  return this.n.isZero();
};

Int64.prototype.isNeg = function isNeg() {
  return this.n.isNeg();
};

Int64.prototype.isOdd = function isOdd() {
  return this.n.isOdd();
};

Int64.prototype.isEven = function isEven() {
  return this.n.isEven();
};

/*
 * Helpers
 */

Int64.prototype.clone = function clone() {
  var obj = new Int64();
  obj.n.inject(this.n);
  return obj;
};

Int64.prototype.inject = function inject(b) {
  this.n.inject(b.n);
  return this;
};

Int64.prototype.set = function set(num) {
  this.n.set(num);
  return this;
};

Int64.prototype.join = function join(hi, lo) {
  this.n.join(hi, lo);
  return this;
};

Int64.prototype.toSigned = function toSigned() {
  var b = this.clone();
  b.n.setSigned(true);
  return b;
};

Int64.prototype.toUnsigned = function toUnsigned() {
  var b = this.clone();
  b.n.setSigned(false);
  return b;
};

Int64.prototype.bitLength = function bitLength() {
  return this.n.bitLength();
};

Int64.prototype.byteLength = function byteLength() {
  return Math.ceil(this.bitLength() / 8);
};

Int64.prototype.isSafe = function isSafe() {
  return this.n.isSafe();
};

Int64.prototype.toNumber = function toNumber() {
  return this.n.toNumber();
};

Int64.prototype.toDouble = function toDouble() {
  return this.n.toDouble();
};

Int64.prototype.toInt = function toInt() {
  return this.n.toInt();
};

Int64.prototype.toString = function toString(base) {
  return this.n.toString(base);
};

Int64.prototype.toJSON = function toJSON() {
  return this.toString(16);
};

Int64.prototype.fromNumber = function fromNumber(num, signed) {
  assert(num >= Int64.DOUBLE_MIN && num <= Int64.DOUBLE_MAX);
  this.n.fromNumber(num, signed);
  return this;
};

Int64.prototype.fromInt = function fromInt(num, signed) {
  assert(num >= Int64.LONG_MIN && num <= Int64.ULONG_MAX);
  this.n.fromInt(num, signed);
  return this;
};

Int64.prototype.fromBits = function fromBits(hi, lo, signed) {
  assert(hi >= Int64.LONG_MIN && hi <= Int64.ULONG_MAX);
  assert(lo >= Int64.LONG_MIN && lo <= Int64.ULONG_MAX);
  this.n.fromBits(hi, lo, signed);
  return this;
};

Int64.prototype.fromString = function fromString(str, signed, base) {
  if (typeof signed === 'number') {
    base = signed;
    signed = null;
  }
  this.n.fromString(str, signed, base);
  return this;
};

Int64.prototype.fromObject = function fromObject(num, signed) {
  assert(num && typeof num === 'object');

  if (signed == null)
    signed = num.signed;

  return this.fromBits(num.hi, num.lo, signed);
};

Int64.prototype.fromBN = function fromBN(num, signed) {
  var a = this;
  var b = num.clone();
  var neg = b.isNeg();
  var i = 0;
  var ch;

  if (signed == null)
    signed = false;

  assert(num && Array.isArray(num.words));
  assert(typeof signed === 'boolean');

  a.signed = signed;

  if (a.signed && b.testn(63))
    throw new Error('BN overflow.');

  while (!b.isZero()) {
    if (i === 8)
      throw new Error('BN overflow.');

    ch = b.andln(0xff);

    if (i < 4)
      a.n.setLo(a.n.getLo() | (ch << (i * 8)));
    else
      a.n.setHi(a.n.getHi() | (ch << ((i - 4) * 8)));

    b.iushrn(8);
    i++;
  }

  if (neg)
    a.ineg();

  return a;
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

  if (typeof num === 'object') {
    if (Array.isArray(num.words))
      return this.fromBN(num, signed);
    return this.fromObject(num, signed);
  }

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

Int64.fromObject = function fromObject(obj, signed) {
  return new Int64().fromString(obj, signed);
};

Int64.fromBN = function fromBN(num, signed) {
  return new Int64().fromBN(num, signed);
};

Int64.from = function from(num, signed, base) {
  return new Int64().from(num, signed, base);
};

Int64.isInt64 = function isInt64(obj) {
  if (obj instanceof Int64)
    return true;

  return !!obj && (obj.n instanceof Native);
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
 * Expose
 */

module.exports = Int64;
