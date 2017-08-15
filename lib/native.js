/*!
 * native.js - native int64 object for node.js.
 * Copyright (c) 2017, Christopher Jeffrey (MIT License).
 * https://github.com/chjj/n64
 */

'use strict';

const Native = require('bindings')('n64').Int64;

/*
 * Int64
 */

function Int64() {
  this.n = new Native(this.signed);
}

Int64.prototype.signed = false;

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

/*
 * Addition
 */

Int64.prototype.iadd = function iadd(b) {
  this.n.iadd(b.n);
  return this;
};

Int64.prototype.iaddn = function iaddn(num) {
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
  enforce(Int64.isInt64(b), 'exponent', 'int64');
  return this.ipown(b.n.getLo());
};

Int64.prototype.ipown = function ipown(num) {
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

Int64.prototype.ior = function ior(b) {
  this.n.ior(b.n);
  return this;
};

Int64.prototype.iorn = function iorn(num) {
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

Int64.prototype.ixor = function ixor(b) {
  this.n.ixor(b.n);
  return this;
};

Int64.prototype.ixorn = function ixorn(num) {
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
  enforce(Int64.isInt64(b), 'bits', 'int64');
  return this.ishln(b.n.getLo());
};

Int64.prototype.ishln = function ishln(bits) {
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
  enforce(Int64.isInt64(b), 'bits', 'int64');
  return this.ishrn(b.n.getLo());
};

Int64.prototype.ishrn = function ishrn(bits) {
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
  enforce(Int64.isInt64(b), 'bits', 'int64');
  return this.iushrn(b.n.getLo());
};

Int64.prototype.iushrn = function iushrn(bits) {
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
  this.n.setn(bit, val);
  return this;
};

Int64.prototype.testn = function testn(bit) {
  return this.n.testn(bit);
};

Int64.prototype.imaskn = function imaskn(bit) {
  this.n.imaskn(bit);
  return this;
};

Int64.prototype.maskn = function maskn(bit) {
  return this.clone().imaskn(bit);
};

Int64.prototype.andln = function andln(num) {
  enforce(typeof num === 'number' && isFinite(num), 'operand', 'number');
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
  return this.n.cmpn(num);
};

Int64.prototype.eq = function eq(b) {
  return this.n.eq(b.n);
};

Int64.prototype.eqn = function eqn(num) {
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
  const obj = new this.constructor();
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
  const b = new I64();
  b.n.inject(this.n);
  return b;
};

Int64.prototype.toUnsigned = function toUnsigned() {
  const b = new U64();
  b.n.inject(this.n);
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

Int64.prototype.fromNumber = function fromNumber(num) {
  this.n.fromNumber(num);
  return this;
};

Int64.prototype.fromInt = function fromInt(num) {
  this.n.fromInt(num);
  return this;
};

Int64.prototype.fromBits = function fromBits(hi, lo) {
  this.n.fromBits(hi, lo);
  return this;
};

Int64.prototype.fromString = function fromString(str, base) {
  this.n.fromString(str, base);
  return this;
};

Int64.prototype.fromObject = function fromObject(num) {
  enforce(num && typeof num === 'object', 'number', 'object');
  return this.fromBits(num.hi, num.lo);
};

Int64.prototype.fromBN = function fromBN(num) {
  enforce(num && Array.isArray(num.words), 'number', 'big number');

  const a = this;
  const b = num.clone();
  const neg = b.isNeg();

  if (a.signed && b.testn(63))
    throw new Error('Big number overflow.');

  let i = 0;

  while (!b.isZero()) {
    if (i === 8)
      throw new Error('Big number overflow.');

    const ch = b.andln(0xff);

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

Int64.prototype.from = function from(num, base) {
  if (num == null)
    return this;

  if (typeof num === 'number') {
    if (typeof base === 'number')
      return this.fromBits(num, base);
    return this.fromNumber(num);
  }

  if (typeof num === 'string')
    return this.fromString(num, base);

  if (typeof num === 'object') {
    if (Array.isArray(num.words))
      return this.fromBN(num);
    return this.fromObject(num);
  }

  throw new TypeError('Non-numeric object passed.');
};

Int64.prototype.inspect = function inspect() {
  let prefix = 'I64';

  if (!this.signed)
    prefix = 'U64';

  return '<' + prefix + ' ' + this.toString(16) + '>';
};

/*
 * Static Methods
 */

Int64.isInt64 = function isInt64(obj) {
  return obj instanceof Int64;
};

/*
 * I64
 */

function I64(num, base) {
  if (!(this instanceof I64))
    return new I64(num, base);

  Int64.call(this);

  this.from(num, base);
}

I64.prototype = new Int64();
I64.prototype.constructor = I64;
I64.prototype.signed = true;

I64.fromNumber = function fromNumber(num) {
  return new I64().fromNumber(num);
};

I64.fromInt = function fromInt(num) {
  return new I64().fromInt(num);
};

I64.fromBits = function fromBits(hi, lo) {
  return new I64().fromBits(hi, lo);
};

I64.fromString = function fromString(str, base) {
  return new I64().fromString(str, base);
};

I64.fromObject = function fromObject(obj) {
  return new I64().fromObject(obj);
};

I64.fromBN = function fromBN(num) {
  return new I64().fromBN(num);
};

I64.from = function from(num, base) {
  return new I64().from(num, base);
};

I64.isI64 = function isI64(obj) {
  return obj instanceof I64;
};

/*
 * U64
 */

function U64(num, base) {
  if (!(this instanceof U64))
    return new U64(num, base);

  Int64.call(this);

  this.from(num, base);
}

U64.prototype = new Int64();
U64.prototype.constructor = U64;
U64.prototype.signed = false;

U64.fromNumber = function fromNumber(num) {
  return new U64().fromNumber(num);
};

U64.fromInt = function fromInt(num) {
  return new U64().fromInt(num);
};

U64.fromBits = function fromBits(hi, lo) {
  return new U64().fromBits(hi, lo);
};

U64.fromString = function fromString(str, base) {
  return new U64().fromString(str, base);
};

U64.fromObject = function fromObject(obj) {
  return new U64().fromObject(obj);
};

U64.fromBN = function fromBN(num) {
  return new U64().fromBN(num);
};

U64.from = function from(num, base) {
  return new U64().from(num, base);
};

U64.isU64 = function isU64(obj) {
  return obj instanceof U64;
};

/*
 * Functions
 */

exports.min = function min(a, b) {
  return a.cmp(b) < 0 ? a : b;
};

exports.max = function max(a, b) {
  return a.cmp(b) > 0 ? a : b;
};

exports.isN64 = function isN64(obj) {
  return obj instanceof Int64;
};

/*
 * Constants
 */

exports.ULONG_MIN = 0x00000000;
exports.ULONG_MAX = 0xffffffff;

exports.LONG_MIN = -0x80000000;
exports.LONG_MAX = 0x7fffffff;

exports.DOUBLE_MIN = -0x001fffffffffffff;
exports.DOUBLE_MAX = 0x001fffffffffffff;

exports.UINT32_MIN = U64(0x00000000, 0x00000000);
exports.UINT32_MAX = U64(0x00000000, 0xffffffff);

exports.INT32_MIN = I64(0xffffffff, 0x80000000, true);
exports.INT32_MAX = I64(0x00000000, 0x7fffffff, true);

exports.UINT64_MIN = U64(0x00000000, 0x00000000);
exports.UINT64_MAX = U64(0xffffffff, 0xffffffff);

exports.INT64_MIN = I64(0x80000000, 0x00000000, true);
exports.INT64_MAX = I64(0x7fffffff, 0xffffffff, true);

/*
 * Helpers
 */

function enforce(value, name, type) {
  if (!value)
    throw new TypeError('`' + name + '` must be a(n) ' + type + '.');
}

/*
 * Expose
 */

exports.Int64 = Int64;
exports.I64 = I64;
exports.U64 = U64;
