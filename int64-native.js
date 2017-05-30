'use strict';

var assert = require('assert');
var Native = require('bcoin-native').Int64;

/**
 * Int64
 * @constructor
 */

function Int64() {
  if (!(this instanceof Int64))
    return new Int64();

  this.n = new Native();
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

Int64.prototype.clone = function clone() {
  var obj = new Int64();
  obj.n.inject(this.n);
  return obj;
};

Int64.prototype.join = function join(hi, lo) {
  this.n.join(hi, lo);
  return this;
};

Int64.prototype.set = function set(num) {
  this.n.set(num);
  return this;
};

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

Int64.prototype.ior = function or(b) {
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

Int64.prototype.ixor = function xor(b) {
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
  assert(!b.isNeg() && b.hi === 0);
  return this.ishln(b.lo);
};

Int64.prototype.ishln = function ishln(num) {
  this.n.ishln(num);
  return this;
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

Int64.prototype.ishrn = function ishrn(num) {
  this.n.ishrn(num);
  return this;
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

Int64.prototype.iushrn = function iushrn(num) {
  this.n.iushrn(num);
  return this;
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
  this.n.ineg();
  return this;
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
  this.n.ipown(num);
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

/*
 * Helpers
 */

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

Int64.prototype.isZero = function isZero() {
  return this.n.isZero();
};

Int64.prototype.isNeg = function isNeg() {
  return this.n.isNeg();
};

Int64.prototype.bitLength = function bitLength() {
  return this.n.bitLength();
};

Int64.prototype.byteLength = function byteLength() {
  return Math.ceil(this.bitLength() / 8);
};

Int64.prototype.isOdd = function isOdd() {
  return this.n.isOdd();
};

Int64.prototype.isEven = function isEven() {
  return this.n.isEven();
};

Int64.prototype.fromNumber = function fromNumber(num, signed) {
  this.n.fromNumber(num, signed);
  return this;
};

Int64.fromNumber = function fromNumber(num, signed) {
  return new Int64().fromNumber(num, signed);
};

Int64.prototype.fromInt = function fromInt(num, signed) {
  this.n.fromInt(num, signed);
  return this;
};

Int64.fromInt = function fromInt(num, signed) {
  return new Int64().fromInt(num, signed);
};

Int64.prototype.fromBits = function fromBits(hi, lo, signed) {
  this.n.fromBits(hi, lo, signed);
  return this;
};

Int64.fromBits = function fromBits(hi, lo, signed) {
  return new Int64().fromBits(hi, lo, signed);
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

Int64.prototype.fromString = function fromString(str, signed, base) {
  this.n.fromString(str, signed, base);
  return this;
};

Int64.fromString = function fromString(str, signed, base) {
  return new Int64().fromString(str, signed, base);
};

Int64.prototype.toString = function toString(base) {
  return this.n.toString(base);
};

Int64.isInt64 = function isInt64(obj) {
  return !!obj && (obj.n instanceof Native);
};

/*
 * Expose
 */

module.exports = Int64;
