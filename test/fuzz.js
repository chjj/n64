'use strict';

const assert = require('assert');
const Native = require('../lib/native');
const Int64 = require('../lib/int64');

const singleOps = [
  'sqr',
  'not',
  'neg',
  'abs'
];

const singleOpsRes = [
  'isZero',
  'isNeg',
  'isOdd',
  'isEven',
  'bitLength',
  'byteLength',
  'isSafe',
  'toDouble',
  'toInt',
  'toString',
  'toJSON'
];

const doubleOps = [
  'add',
  'sub',
  'mul',
  'div',
  'mod',
  'and',
  'or',
  'xor'
];

const doubleOpsRes = [
  'cmp',
  'eq',
  'lt',
  'lte',
  'gt',
  'gte'
];

const numberOps = [
  'addn',
  'subn',
  'muln',
  'divn',
  'modn',
  'andn',
  'orn',
  'xorn',
  'shln',
  'shrn',
  'ushrn',
  'pown',
  'setn',
  'maskn'
];

const numberOpsRes = [
  'cmpn',
  'eqn',
  'ltn',
  'lten',
  'gtn',
  'gten',
  'testn'
];

function random32() {
  // Throw a zero in every so often.
  if (((Math.random() * 10000) | 0) === 0)
    return 0;

  return (Math.random() * 0x100000000) | 0;
}

function random64(low) {
  if (low) {
    const hi = 0;
    const lo = random32();
    return { hi, lo };
  }
  const hi = random32();
  const lo = random32();
  return { hi, lo };
}

function random2() {
  return (Math.random() * 2) | 0;
}

function equals(a, b) {
  return a.hi === b.hi && a.lo === b.lo;
}

const iterations = Number(process.argv[2]) || 1000000;

console.log('Fuzzing with %d iterations.', iterations);

for (const low of [false, true]) {
  console.log('Fuzzing with %s values.', low ? 'low' : 'high');

  // Single param ops
  for (const signed of [false, true]) {
    console.log('Fuzzing single param ops (%s).',
      signed ? 'signed' : 'unsigned');

    for (let i = 0; i < iterations; i++) {
      const n1 = random64(low);
      const a1 = Int64.fromObject(n1, signed);
      const b1 = Native.fromObject(n1, signed);

      assert(equals(a1, b1));

      for (const op of singleOps) {
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
    console.log('Fuzzing single param ops w/ primitive result (%s).',
      signed ? 'signed' : 'unsigned');

    for (let i = 0; i < iterations; i++) {
      const n1 = random64(low);
      const a1 = Int64.fromObject(n1, signed);
      const b1 = Native.fromObject(n1, signed);

      assert(equals(a1, b1));

      for (const op of singleOpsRes) {
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
    console.log('Fuzzing double param ops (%s).',
      signed ? 'signed' : 'unsigned');

    for (let i = 0; i < iterations; i++) {
      const n1 = random64(low);
      const a1 = Int64.fromObject(n1, signed);
      const b1 = Native.fromObject(n1, signed);

      const n2 = random64(low);
      const a2 = Int64.fromObject(n2, signed);
      const b2 = Native.fromObject(n2, signed);

      assert(equals(a1, b1));
      assert(equals(a2, b2));

      for (const op of doubleOps) {
        if ((op === 'div' || op === 'mod') && a2.isZero())
          continue;

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
    console.log('Fuzzing double param ops w/ primitive result (%s).',
      signed ? 'signed' : 'unsigned');

    for (let i = 0; i < iterations; i++) {
      const n1 = random64(low);
      const a1 = Int64.fromObject(n1, signed);
      const b1 = Native.fromObject(n1, signed);

      const n2 = random64(low);
      const a2 = Int64.fromObject(n2, signed);
      const b2 = Native.fromObject(n2, signed);

      assert(equals(a1, b1));
      assert(equals(a2, b2));

      for (const op of doubleOpsRes) {
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

  // Number ops
  for (const signed of [false, true]) {
    console.log('Fuzzing number ops (%s).',
      signed ? 'signed' : 'unsigned');

    for (let i = 0; i < iterations; i++) {
      const n1 = random64(low);
      const a1 = Int64.fromObject(n1, signed);
      const b1 = Native.fromObject(n1, signed);
      const num = random32() >>> 0;

      // For `.setn()`.
      const bit = random2();

      assert(equals(a1, b1));

      for (const op of numberOps) {
        if ((op === 'divn' || op === 'modn') && num === 0)
          continue;

        const a = a1[op](num, bit);
        const b = b1[op](num, bit);

        if (!equals(a, b)) {
          console.error('Number operation failed!');
          console.error({
            number: a1.toString(),
            operand: num,
            signed: signed,
            operation: op,
            result: a.toString(),
            expect: b.toString()
          });
        }
      }
    }
  }

  // Number ops with primitive result
  for (const signed of [false, true]) {
    console.log('Fuzzing number ops w/ primitive result (%s).',
      signed ? 'signed' : 'unsigned');

    for (let i = 0; i < iterations; i++) {
      const n1 = random64(low);
      const a1 = Int64.fromObject(n1, signed);
      const b1 = Native.fromObject(n1, signed);
      const num = random32() >>> 0;

      assert(equals(a1, b1));

      for (const op of numberOpsRes) {
        const a = a1[op](num);
        const b = b1[op](num);

        if (a !== b) {
          console.error('Number operation failed!');
          console.error({
            number: a1.toString(),
            operand: num,
            signed: signed,
            operation: op,
            result: a.toString(),
            expect: b.toString()
          });
        }
      }
    }
  }
}

console.log('Fuzzing complete.');
