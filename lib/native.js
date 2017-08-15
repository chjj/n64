/*!
 * native.js - native int64 object for node.js.
 * Copyright (c) 2017, Christopher Jeffrey (MIT License).
 * https://github.com/chjj/n64
 */

'use strict';

const Native = require('bindings')('n64').N64;

/*
 * N64
 */

function N64() {
  this.n = new Native(this.signed);
}

N64.prototype.signed = false;

/*
 * Internal
 */

N64.prototype.__defineGetter__('hi', function() {
  return this.n.getHi();
});

N64.prototype.__defineSetter__('hi', function(value) {
  return this.n.setHi(value);
});

N64.prototype.__defineGetter__('lo', function() {
  return this.n.getLo();
});

N64.prototype.__defineSetter__('lo', function(value) {
  return this.n.setLo(value);
});

/*
 * Addition
 */

N64.prototype.iadd = function iadd(b) {
  this.n.iadd(b.n);
  return this;
};

N64.prototype.iaddn = function iaddn(num) {
  this.n.iaddn(num);
  return this;
};

N64.prototype.add = function add(b) {
  return this.clone().iadd(b);
};

N64.prototype.addn = function addn(num) {
  return this.clone().iaddn(num);
};

/*
 * Subtraction
 */

N64.prototype.isub = function isub(b) {
  this.n.isub(b.n);
  return this;
};

N64.prototype.isubn = function isubn(num) {
  this.n.isubn(num);
  return this;
};

N64.prototype.sub = function sub(b) {
  return this.clone().isub(b);
};

N64.prototype.subn = function subn(num) {
  return this.clone().isubn(num);
};

/*
 * Multiplication
 */

N64.prototype.imul = function imul(b) {
  this.n.imul(b.n);
  return this;
};

N64.prototype.imuln = function imuln(num) {
  this.n.imuln(num);
  return this;
};

N64.prototype.mul = function mul(b) {
  return this.clone().imul(b);
};

N64.prototype.muln = function muln(num) {
  return this.clone().imuln(num);
};

/*
 * Division
 */

N64.prototype.idiv = function idiv(b) {
  this.n.idiv(b.n);
  return this;
};

N64.prototype.idivn = function idivn(num) {
  this.n.idivn(num);
  return this;
};

N64.prototype.div = function div(b) {
  return this.clone().idiv(b);
};

N64.prototype.divn = function divn(num) {
  return this.clone().idivn(num);
};

/*
 * Modulo
 */

N64.prototype.imod = function imod(b) {
  this.n.imod(b.n);
  return this;
};

N64.prototype.imodn = function imodn(num) {
  this.n.imodn(num);
  return this;
};

N64.prototype.mod = function mod(b) {
  return this.clone().imod(b);
};

N64.prototype.modn = function modn(num) {
  return this.clone().imodn(num);
};

/*
 * Exponentiation
 */

N64.prototype.ipow = function ipow(b) {
  enforce(N64.isN64(b), 'exponent', 'int64');
  return this.ipown(b.n.getLo());
};

N64.prototype.ipown = function ipown(num) {
  this.n.ipown(num);
  return this;
};

N64.prototype.pow = function pow(b) {
  return this.clone().ipow(b);
};

N64.prototype.pown = function pown(num) {
  return this.clone().ipown(num);
};

N64.prototype.sqr = function sqr() {
  return this.mul(this);
};

N64.prototype.isqr = function isqr() {
  return this.imul(this);
};

/*
 * AND
 */

N64.prototype.iand = function iand(b) {
  this.n.iand(b.n);
  return this;
};

N64.prototype.iandn = function iandn(num) {
  this.n.iandn(num);
  return this;
};

N64.prototype.and = function and(b) {
  return this.clone().iand(b);
};

N64.prototype.andn = function andn(num) {
  return this.clone().iandn(num);
};

/*
 * OR
 */

N64.prototype.ior = function ior(b) {
  this.n.ior(b.n);
  return this;
};

N64.prototype.iorn = function iorn(num) {
  this.n.iorn(num);
  return this;
};

N64.prototype.or = function or(b) {
  return this.clone().ior(b);
};

N64.prototype.orn = function orn(num) {
  return this.clone().iorn(num);
};

/*
 * XOR
 */

N64.prototype.ixor = function ixor(b) {
  this.n.ixor(b.n);
  return this;
};

N64.prototype.ixorn = function ixorn(num) {
  this.n.ixorn(num);
  return this;
};

N64.prototype.xor = function xor(b) {
  return this.clone().ixor(b);
};

N64.prototype.xorn = function xorn(num) {
  return this.clone().ixorn(num);
};

/*
 * NOT
 */

N64.prototype.inot = function inot() {
  this.n.inot();
  return this;
};

N64.prototype.not = function not() {
  return this.clone().inot();
};

/*
 * Left Shift
 */

N64.prototype.ishl = function ishl(b) {
  enforce(N64.isN64(b), 'bits', 'int64');
  return this.ishln(b.n.getLo());
};

N64.prototype.ishln = function ishln(bits) {
  this.n.ishln(bits);
  return this;
};

N64.prototype.shl = function shl(b) {
  return this.clone().ishl(b);
};

N64.prototype.shln = function shln(bits) {
  return this.clone().ishln(bits);
};

/*
 * Right Shift
 */

N64.prototype.ishr = function ishr(b) {
  enforce(N64.isN64(b), 'bits', 'int64');
  return this.ishrn(b.n.getLo());
};

N64.prototype.ishrn = function ishrn(bits) {
  this.n.ishrn(bits);
  return this;
};

N64.prototype.shr = function shr(b) {
  return this.clone().ishr(b);
};

N64.prototype.shrn = function shrn(bits) {
  return this.clone().ishrn(bits);
};

/*
 * Unsigned Right Shift
 */

N64.prototype.iushr = function iushr(b) {
  enforce(N64.isN64(b), 'bits', 'int64');
  return this.iushrn(b.n.getLo());
};

N64.prototype.iushrn = function iushrn(bits) {
  this.n.iushrn(bits);
  return this;
};

N64.prototype.ushr = function ushr(b) {
  return this.clone().iushr(b);
};

N64.prototype.ushrn = function ushrn(bits) {
  return this.clone().iushrn(bits);
};

/*
 * Bit Manipulation
 */

N64.prototype.setn = function setn(bit, val) {
  this.n.setn(bit, val);
  return this;
};

N64.prototype.testn = function testn(bit) {
  return this.n.testn(bit);
};

N64.prototype.imaskn = function imaskn(bit) {
  this.n.imaskn(bit);
  return this;
};

N64.prototype.maskn = function maskn(bit) {
  return this.clone().imaskn(bit);
};

N64.prototype.andln = function andln(num) {
  enforce(typeof num === 'number' && isFinite(num), 'operand', 'number');
  return this.n.getLo() & num;
};

/*
 * Negation
 */

N64.prototype.ineg = function ineg() {
  this.n.ineg();
  return this;
};

N64.prototype.neg = function neg() {
  return this.clone().ineg();
};

N64.prototype.iabs = function iabs() {
  if (this.isNeg())
    this.ineg();
  return this;
};

N64.prototype.abs = function abs() {
  return this.clone().iabs();
};

/*
 * Comparison
 */

N64.prototype.cmp = function cmp(b) {
  return this.n.cmp(b.n);
};

N64.prototype.cmpn = function cmpn(num) {
  return this.n.cmpn(num);
};

N64.prototype.eq = function eq(b) {
  return this.n.eq(b.n);
};

N64.prototype.eqn = function eqn(num) {
  return this.n.eqn(num);
};

N64.prototype.gt = function gt(b) {
  return this.cmp(b) > 0;
};

N64.prototype.gtn = function gtn(num) {
  return this.cmpn(num) > 0;
};

N64.prototype.gte = function gte(b) {
  return this.cmp(b) >= 0;
};

N64.prototype.gten = function gten(num) {
  return this.cmpn(num) >= 0;
};

N64.prototype.lt = function lt(b) {
  return this.cmp(b) < 0;
};

N64.prototype.ltn = function ltn(num) {
  return this.cmpn(num) < 0;
};

N64.prototype.lte = function lte(b) {
  return this.cmp(b) <= 0;
};

N64.prototype.lten = function lten(num) {
  return this.cmpn(num) <= 0;
};

N64.prototype.isZero = function isZero() {
  return this.n.isZero();
};

N64.prototype.isNeg = function isNeg() {
  return this.n.isNeg();
};

N64.prototype.isOdd = function isOdd() {
  return this.n.isOdd();
};

N64.prototype.isEven = function isEven() {
  return this.n.isEven();
};

/*
 * Helpers
 */

N64.prototype.clone = function clone() {
  const obj = new this.constructor();
  obj.n.inject(this.n);
  return obj;
};

N64.prototype.inject = function inject(b) {
  this.n.inject(b.n);
  return this;
};

N64.prototype.set = function set(num) {
  this.n.set(num);
  return this;
};

N64.prototype.join = function join(hi, lo) {
  this.n.join(hi, lo);
  return this;
};

N64.prototype.toSigned = function toSigned() {
  const b = new I64();
  b.n.inject(this.n);
  return b;
};

N64.prototype.toUnsigned = function toUnsigned() {
  const b = new U64();
  b.n.inject(this.n);
  return b;
};

N64.prototype.bitLength = function bitLength() {
  return this.n.bitLength();
};

N64.prototype.byteLength = function byteLength() {
  return Math.ceil(this.bitLength() / 8);
};

N64.prototype.isSafe = function isSafe() {
  return this.n.isSafe();
};

N64.prototype.toNumber = function toNumber() {
  return this.n.toNumber();
};

N64.prototype.toDouble = function toDouble() {
  return this.n.toDouble();
};

N64.prototype.toInt = function toInt() {
  return this.n.toInt();
};

N64.prototype.toString = function toString(base) {
  return this.n.toString(base);
};

N64.prototype.toJSON = function toJSON() {
  return this.toString(16);
};

N64.prototype.fromNumber = function fromNumber(num) {
  this.n.fromNumber(num);
  return this;
};

N64.prototype.fromInt = function fromInt(num) {
  this.n.fromInt(num);
  return this;
};

N64.prototype.fromBits = function fromBits(hi, lo) {
  this.n.fromBits(hi, lo);
  return this;
};

N64.prototype.fromString = function fromString(str, base) {
  this.n.fromString(str, base);
  return this;
};

N64.prototype.fromObject = function fromObject(num) {
  enforce(num && typeof num === 'object', 'number', 'object');
  return this.fromBits(num.hi, num.lo);
};

N64.prototype.fromBN = function fromBN(num) {
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

N64.prototype.from = function from(num, base) {
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

N64.prototype.inspect = function inspect() {
  let prefix = 'I64';

  if (!this.signed)
    prefix = 'U64';

  return '<' + prefix + ' ' + this.toString(16) + '>';
};

/*
 * Static Methods
 */

N64.isN64 = function isN64(obj) {
  return obj instanceof N64;
};

/*
 * I64
 */

function I64(num, base) {
  if (!(this instanceof I64))
    return new I64(num, base);

  N64.call(this);

  this.from(num, base);
}

I64.prototype = new N64();
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

  N64.call(this);

  this.from(num, base);
}

U64.prototype = new N64();
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
  return obj instanceof N64;
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

exports.N64 = N64;
exports.I64 = I64;
exports.U64 = U64;
