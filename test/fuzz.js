'use strict';

const assert = require('assert');
const Native = require('../lib/native');
const Int64 = require('../lib/int64');

const single = [
  'sqr',
  'not',
  'neg',
  'abs'
];

const singleRes = [
  'isZero',
  'isNeg',
  'isOdd',
  'isEven',
  'bitLength',
  'byteLength',
  'isSafe',
  'toDouble',
  'toString'
];

const double = [
  'add',
  'sub',
  'mul',
  'div',
  'mod',
  'and',
  'or',
  'xor'
];

const doubleRes = [
  'cmp',
  'eq',
  'lt',
  'lte',
  'gt',
  'gte'
];

const bitwise = [
  'shln',
  'shrn',
  'ushrn',
  'setn',
  'maskn',
  'pown'
];

function randomInt() {
  const hi = (Math.random() * 0x100000000) | 0;
  const lo = (Math.random() * 0x100000000) | 0;
  return { hi, lo };
}

function randomBits() {
  return Math.random() * 64 | 0;
}

function randomBit() {
  return Math.random() * 2 | 0;
}

function equals(a, b) {
  return a.hi === b.hi && a.lo === b.lo;
}

const iterations = 1000000;

// Single param ops
for (const signed of [false, true]) {
  for (let i = 0; i < iterations; i++) {
    const n1 = randomInt();
    const a1 = Int64.fromObject(n1, signed);
    const b1 = Native.fromObject(n1, signed);
    assert(equals(a1, b1));
    for (const op of single) {
      const a = a1[op]();
      const b = b1[op]();

      if (!equals(a, b)) {
        console.error('Single param operation failed!');
        console.error({
          number: a1.toString(),
          signed: signed,
          operation: op,
          result: a.toString(),
          expect: b.toString()
        });
      }
    }
  }
}

// Single param ops with primitive result
for (const signed of [false, true]) {
  for (let i = 0; i < iterations; i++) {
    const n1 = randomInt();
    const a1 = Int64.fromObject(n1, signed);
    const b1 = Native.fromObject(n1, signed);
    assert(equals(a1, b1));
    for (const op of singleRes) {
      const a = a1[op]();
      const b = b1[op]();

      if (a !== b) {
        console.error('Single param operation failed!');
        console.error({
          number: a1.toString(),
          signed: signed,
          operation: op,
          result: a,
          expect: b
        });
      }
    }
  }
}

// Double param ops
for (const signed of [false, true]) {
  for (let i = 0; i < iterations; i++) {
    const n1 = randomInt();
    const a1 = Int64.fromObject(n1, signed);
    const b1 = Native.fromObject(n1, signed);
    const n2 = randomInt();
    const a2 = Int64.fromObject(n2, signed);
    const b2 = Native.fromObject(n2, signed);
    assert(equals(a1, b1));
    assert(equals(a2, b2));
    for (const op of double) {
      const a = a1[op](a2);
      const b = b1[op](b2);

      if (!equals(a, b)) {
        console.error('Double param operation failed!');
        console.error({
          number: a1.toString(),
          operand: a2.toString(),
          signed: signed,
          operation: op,
          result: a.toString(),
          expect: b.toString()
        });
      }
    }
  }
}

// Double param ops with primitive result
for (const signed of [false, true]) {
  for (let i = 0; i < iterations; i++) {
    const n1 = randomInt();
    const a1 = Int64.fromObject(n1, signed);
    const b1 = Native.fromObject(n1, signed);
    const n2 = randomInt();
    const a2 = Int64.fromObject(n2, signed);
    const b2 = Native.fromObject(n2, signed);
    assert(equals(a1, b1));
    assert(equals(a2, b2));
    for (const op of doubleRes) {
      const a = a1[op](a2);
      const b = b1[op](b2);

      if (a !== b) {
        console.error('Double param operation failed!');
        console.error({
          number: a1.toString(),
          operand: a2.toString(),
          signed: signed,
          operation: op,
          result: a,
          expect: b
        });
      }
    }
  }
}

// Bitwise ops
for (const signed of [false, true]) {
  for (let i = 0; i < iterations; i++) {
    const n1 = randomInt();
    const a1 = Int64.fromObject(n1, signed);
    const b1 = Native.fromObject(n1, signed);
    const bits = randomBits();
    const bit = randomBit();
    assert(equals(a1, b1));
    for (const op of bitwise) {
      const a = a1[op](bits, bit);
      const b = b1[op](bits, bit);

      if (!equals(a, b)) {
        console.error('Bitwise operation failed!');
        console.error({
          number: a1.toString(),
          operand: bits,
          signed: signed,
          operation: op,
          result: a.toString(),
          expect: b.toString()
        });
      }
    }
  }
}
