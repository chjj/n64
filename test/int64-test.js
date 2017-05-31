/**
 * Copyright 2013 Daniel Wirtz <dcode@dcode.io>
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS-IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var assert = require('assert');
var Int64 = require('../lib/int64.js');
var Native = require('../lib/native.js');

function run(Int64, name) {
  var ONE = Int64.fromInt(1, true);
  var UONE = Int64.fromInt(1, false);
  var MIN_I64 = Int64.fromBits(0x80000000, 0, true);
  var MAX_I64 = Int64.fromBits(0x7fffffff, 0xffffffff, true);
  var MAX_U64 = Int64.fromBits(0xffffffff, 0xffffffff, false);

  describe(name, function() {
    it('should instantiate and serialize', function() {
      var num1 = Int64.fromBits(0x7fffffff, 0xffffffff, true);
      var num2;

      assert.equal(num1.toDouble(), 9223372036854775807);
      assert.equal(num1.toString(), '9223372036854775807');

      num2 = Int64.fromString(num1.toString(), true);

      assert.equal(num2.toDouble(), 9223372036854775807);
      assert.equal(num2.toString(), '9223372036854775807');
      assert.equal(num2.signed, num1.signed);
    });

    it('should duck type', function() {
      var num = Int64.fromBits(0x7fffffff, 0xffffffff, true);
      assert.strictEqual(Int64.isInt64(num), true);
      assert.strictEqual(Int64.isInt64({}), false);
    });

    it('should serialize unsigned strings', function() {
      var num = Int64.fromBits(0xffffffff, 0xffffffff, false);
      assert.equal(num.toString(16), 'ffffffffffffffff');
      assert.equal(num.toString(10), '18446744073709551615');
      assert.equal(num.toString(8), '1777777777777777777777');
      assert.equal(num.toString(2),
        '1111111111111111111111111111111111111111111111111111111111111111');

      num = Int64.fromNumber(123456789012, false);
      assert.equal(num.toString(16), '1cbe991a14');
      assert.equal(num.toString(10), '123456789012');
      assert.equal(num.toString(8), '1627646215024');
      assert.equal(num.toString(2), '1110010111110100110010001101000010100');
    });

    it('should serialize signed strings', function() {
      var num = Int64.fromBits(0xffffffff, 0xffffffff, true);
      assert.equal(num.toString(16), '-1');
      assert.equal(num.toString(10), '-1');
      assert.equal(num.toString(8), '-1');
      assert.equal(num.toString(2), '-1');

      num = Int64.fromNumber(-123456789012, true);
      assert.equal(num.toString(16), '-1cbe991a14');
      assert.equal(num.toString(10), '-123456789012');
      assert.equal(num.toString(8), '-1627646215024');
      assert.equal(num.toString(2), '-1110010111110100110010001101000010100');
    });

    it('should deserialize unsigned strings', function() {
      var num = Int64.fromString('ffffffffffffffff', false, 16);
      assert.equal(num.toString(16), 'ffffffffffffffff');

      num = Int64.fromString('18446744073709551615', false, 10);
      assert.equal(num.toString(10), '18446744073709551615');

      num = Int64.fromString('1777777777777777777777', false, 8);
      assert.equal(num.toString(8), '1777777777777777777777');

      num = Int64.fromString(
        '1111111111111111111111111111111111111111111111111111111111111111',
        false, 2);
      assert.equal(num.toString(2),
        '1111111111111111111111111111111111111111111111111111111111111111');

      num = Int64.fromString('1cbe991a14', false, 16);
      assert.equal(num.toString(16), '1cbe991a14');

      num = Int64.fromString('123456789012', false, 10);
      assert.equal(num.toString(10), '123456789012');

      num = Int64.fromString('1627646215024', false, 8);
      assert.equal(num.toString(8), '1627646215024');

      num = Int64.fromString('1110010111110100110010001101000010100', false, 2);
      assert.equal(num.toString(2), '1110010111110100110010001101000010100');
    });

    it('should deserialize signed strings', function() {
      var num = Int64.fromString('-1', true, 16);
      assert.equal(num.toString(16), '-1');

      num = Int64.fromString('-1', true, 10);
      assert.equal(num.toString(10), '-1');

      num = Int64.fromString('-1', true, 8);
      assert.equal(num.toString(8), '-1');

      num = Int64.fromString('-1', true, 2);
      assert.equal(num.toString(2), '-1');

      num = Int64.fromString('-1cbe991a14', true, 16);
      assert.equal(num.toString(16), '-1cbe991a14');

      num = Int64.fromString('-123456789012', true, 10);
      assert.equal(num.toString(10), '-123456789012');

      num = Int64.fromString('-1627646215024', true, 8);
      assert.equal(num.toString(8), '-1627646215024');

      num = Int64.fromString('-1110010111110100110010001101000010100', true, 2);
      assert.equal(num.toString(2), '-1110010111110100110010001101000010100');
    });

    it('should serialize strings for min/max', function() {
      assert.equal(MIN_I64.toString(), '-9223372036854775808');
      assert.equal(MAX_I64.toString(), '9223372036854775807');
      assert.equal(MAX_U64.toString(), '18446744073709551615');
    });

    it('should cast a negative', function() {
      var num = Int64.fromInt(-1, false);
      assert.equal(num.lo, -1);
      assert.equal(num.hi, -1);
      assert.equal(num.signed, false);
      assert.equal(num.toDouble(), 18446744073709551615);
      assert.equal(num.toString(), '18446744073709551615');
    });

    it('should handle uint64 max', function() {
      var num = Int64.fromBits(0xffffffff, 0xffffffff, false);
      assert.equal(num.lo, -1);
      assert.equal(num.hi, -1);
      assert.equal(num.signed, false);
      assert.equal(num.toDouble(), 18446744073709551615);
      assert.equal(num.toString(), '18446744073709551615');
    });

    it('should handle uint64 max as string', function() {
      var num = Int64.fromString('ffffffffffffffff', false, 16);
      assert.equal(num.lo, -1);
      assert.equal(num.hi, -1);
      assert.equal(num.signed, false);
      assert.equal(num.toDouble(), 18446744073709551615);
      assert.equal(num.toString(), '18446744073709551615');
    });

    it('should count bits', function() {
      var num = Int64.fromString('000010000fffffff', false, 16);
      assert.equal(num.bitLength(), 45)
      assert.equal(num.byteLength(), 6)
      num = Int64.fromString('000010000fffffff', true, 16);
      assert.equal(num.bitLength(), 45)
      assert.equal(num.byteLength(), 6)
      num = Int64.fromString('800010000fffffff', false, 16);
      assert.equal(num.bitLength(), 64)
      assert.equal(num.byteLength(), 8)
      num = Int64.fromString('800010000fffffff', true, 16);
      assert.equal(num.bitLength(), 63)
      assert.equal(num.byteLength(), 8)
    });

    it('should cast between signed and unsigned', function() {
      var num = Int64.fromNumber(-1, true);
      assert.equal(num.toDouble(), -1);
      num = num.toUnsigned();
      assert.equal(num.toDouble(), 0xffffffffffffffff);
      assert.equal(num.toString(16), 'ffffffffffffffff');
      num = num.toSigned();
      assert.equal(num.toDouble(), -1);
    });

    it('should subtract from uint64 max', function() {
      var num = MAX_U64.sub(MAX_I64).sub(ONE);
      assert.equal(num.toDouble(), MAX_I64.toDouble());
      assert.equal(num.toString(), MAX_I64.toString());
    });

    it('should subtract from uint64 max to zero', function() {
      var num = MAX_U64.sub(MAX_U64);
      assert.equal(num.lo, 0);
      assert.equal(num.hi, 0);
      assert.equal(num.signed, false);
      assert.equal(num.toDouble(), 0);
      assert.equal(num.toString(), '0');
    });

    it('should overflow from subtraction', function() {
      var num = Int64.fromInt(0, false).add(Int64.fromInt(-1, true));
      assert.equal(num.lo, -1);
      assert.equal(num.hi, -1);
      assert.equal(num.signed, false);
      assert.equal(num.toDouble(), 18446744073709551615);
      assert.equal(num.toString(), '18446744073709551615');
    });

    it('should divide uint64 max by int64 max', function() {
      var num = MAX_U64.div(MAX_I64);
      assert.equal(num.toDouble(), 2);
      assert.equal(num.toString(), '2');
    });

    it('should divide uint64 max by itself', function() {
      var num = MAX_U64;
      assert.strictEqual(num.div(num).toString(), '1');
    });

    it('should cast and divide', function() {
      var a = MAX_U64;
      var b = Int64.fromInt(-2, true);
      var num;

      assert.strictEqual(b.toUnsigned().toString(),
        MAX_U64.subn(1).toString());

      num = a.div(b);
      assert.strictEqual(num.toString(), '1');
    });

    it('should divide int64 min by one', function() {
      var num = MIN_I64.div(ONE);
      assert.strictEqual(num.toString(), MIN_I64.toString());
    });

    it('should do unsigned left shift', function() {
      var num = UONE.shln(63);
      assert.ok(!num.eq(MIN_I64));
      assert.equal(num.toString(), '9223372036854775808');
      assert.equal(
        Int64.fromString('9223372036854775808', false).toString(),
        '9223372036854775808');
    });

    it('should maintain sign after division', function() {
      var a = Int64.fromBits(8, 0, false);
      var b = Int64.fromNumber(2656901066, false);
      var x;

      assert.strictEqual(a.signed, false);
      assert.strictEqual(b.signed, false);

      x = a.div(b);

      assert.strictEqual(x.toString(), '12');
      assert.strictEqual(x.signed, false);
    });

    it('should do comparisons', function() {
      assert.equal(ONE.eq(UONE), true);
      assert.equal(ONE.cmp(UONE), 0);
      assert.equal(ONE.cmp(MAX_I64), -1);
      assert.equal(MAX_I64.cmp(ONE), 1);
      assert.equal(ONE.lt(MAX_I64), true);
      assert.equal(ONE.lte(MAX_I64), true);
      assert.equal(MAX_I64.gt(ONE), true);
      assert.equal(MAX_I64.gte(ONE), true);
      assert.equal(MAX_I64.eq(ONE), false);
      assert.equal(ONE.eq(MAX_I64), false);
      assert.equal(MAX_U64.eq(ONE), false);
      assert.equal(ONE.eq(MAX_U64), false);
      assert.equal(ONE.isOdd(), true);
      assert.equal(ONE.isEven(), false);
      assert.equal(MAX_U64.isOdd(), true);
      assert.equal(MAX_U64.isEven(), false);
      assert.equal(MAX_U64.subn(1).isOdd(), false);
      assert.equal(MAX_U64.subn(1).isEven(), true);
      assert.equal(Int64.fromNumber(0, false).isZero(), true);
      assert.equal(Int64.fromNumber(0, true).isZero(), true);
      assert.equal(ONE.isZero(), false);
      assert.equal(MAX_U64.isZero(), false);
      assert.equal(MAX_U64.isNeg(), false);
      assert.equal(MAX_I64.isNeg(), false);
      assert.equal(MIN_I64.isNeg(), true);
      assert.equal(MIN_I64.cmpn(0), -1);
      assert.equal(MAX_I64.cmpn(0), 1);
      assert.equal(MIN_I64.eqn(0), false);
      assert.equal(MAX_I64.eqn(0), false);
      assert.equal(ONE.eqn(1), true);
      assert.equal(ONE.ltn(1), false);
      assert.equal(ONE.lten(1), true);
      assert.equal(ONE.subn(1).lten(1), true);
      assert.equal(ONE.subn(1).ltn(1), true);
      assert.equal(ONE.addn(1).lten(1), false);
      assert.equal(ONE.addn(1).ltn(1), false);
      assert.equal(ONE.addn(1).gten(1), true);
      assert.equal(ONE.addn(1).gtn(1), true);
      assert.equal(ONE.addn(1).lten(1), false);
      assert.equal(ONE.addn(1).ltn(1), false);
    });

    it('should do small addition (unsigned)', function() {
      var a = Int64.fromNumber(100, false);
      var b = Int64.fromNumber(200, false);
      a.iadd(b);
      assert.equal(a.toString(), '300');

      a = Int64.fromNumber(100, false);
      a.iaddn(200);
      assert.equal(a.toString(), '300');

      a = Int64.fromNumber(100, false);
      b = Int64.fromNumber(200, false);
      assert.equal(a.add(b).toString(), '300');
      assert.equal(a.toString(), '100');

      a = Int64.fromNumber(100, false);
      assert.equal(a.addn(200).toString(), '300');
      assert.equal(a.toString(), '100');
    });

    it('should do small addition (signed)', function() {
      var a = Int64.fromNumber(100, true);
      var b = Int64.fromNumber(-50, true);
      a.iadd(b);
      assert.equal(a.toString(), '50');

      a = Int64.fromNumber(100, true);
      a.iaddn(-50);
      assert.equal(a.toString(), '50');

      a = Int64.fromNumber(100, true);
      b = Int64.fromNumber(-50, true);
      assert.equal(a.add(b).toString(), '50');
      assert.equal(a.toString(), '100');

      a = Int64.fromNumber(100, true);
      assert.equal(a.addn(-50).toString(), '50');
      assert.equal(a.toString(), '100');
    });

    it('should do big addition (unsigned)', function() {
      var a = Int64.fromNumber(100 * 0x100000000, false);
      var b = Int64.fromNumber(200 * 0x100000000, false);
      a.iadd(b);
      assert.equal(a.toString(), '1288490188800');

      a = Int64.fromNumber(100 * 0x100000000, false);
      a.iaddn(200 * 0x1000000);
      assert.equal(a.toString(), '432852172800');

      a = Int64.fromNumber(100 * 0x100000000, false);
      b = Int64.fromNumber(200 * 0x100000000, false);
      assert.equal(a.add(b).toString(), '1288490188800');
      assert.equal(a.toString(), '429496729600');

      a = Int64.fromNumber(100 * 0x100000000, false);
      assert.equal(a.addn(200 * 0x1000000).toString(), '432852172800');
      assert.equal(a.toString(), '429496729600');
    });

    it('should do big addition (signed)', function() {
      var a = Int64.fromNumber(100 * 0x100000000, true);
      var b = Int64.fromNumber(-50 * 0x100000000, true);
      a.iadd(b);
      assert.equal(a.toString(), '214748364800');

      a = Int64.fromNumber(100 * 0x100000000, true);
      a.iaddn(-50 * 0x100000);
      assert.equal(a.toString(), '429444300800');

      a = Int64.fromNumber(100 * 0x100000000, true);
      b = Int64.fromNumber(-50 * 0x100000000, true);
      assert.equal(a.add(b).toString(), '214748364800');
      assert.equal(a.toString(), '429496729600');

      a = Int64.fromNumber(100 * 0x100000000, true);
      assert.equal(a.addn(-50 * 0x100000).toString(), '429444300800');
      assert.equal(a.toString(), '429496729600');
    });

    it('should do small subtraction (unsigned)', function() {
      var a = Int64.fromNumber(200, false);
      var b = Int64.fromNumber(100, false);
      a.isub(b);
      assert.equal(a.toString(), '100');

      a = Int64.fromNumber(200, false);
      a.isubn(100);
      assert.equal(a.toString(), '100');

      a = Int64.fromNumber(200, false);
      b = Int64.fromNumber(100, false);
      assert.equal(a.sub(b).toString(), '100');
      assert.equal(a.toString(), '200');

      a = Int64.fromNumber(200, false);
      assert.equal(a.subn(100).toString(), '100');
      assert.equal(a.toString(), '200');
    });

    it('should do small subtraction (signed)', function() {
      var a = Int64.fromNumber(100, true);
      var b = Int64.fromNumber(-50, true);
      a.isub(b);
      assert.equal(a.toString(), '150');

      a = Int64.fromNumber(100, true);
      a.isubn(-50);
      assert.equal(a.toString(), '150');

      a = Int64.fromNumber(100, true);
      b = Int64.fromNumber(-50, true);
      assert.equal(a.sub(b).toString(), '150');
      assert.equal(a.toString(), '100');

      a = Int64.fromNumber(100, true);
      assert.equal(a.subn(-50).toString(), '150');
      assert.equal(a.toString(), '100');
    });

    it('should do big subtraction (unsigned)', function() {
      var a = Int64.fromNumber(100 * 0x100000000, false);
      var b = Int64.fromNumber(200 * 0x100000000, false);
      a.isub(b);
      assert.equal(a.toString(), '18446743644212822016');

      a = Int64.fromNumber(100 * 0x100000000, false);
      a.isubn(200 * 0x100000);
      assert.equal(a.toString(), '429287014400');

      a = Int64.fromNumber(100 * 0x100000000, false);
      b = Int64.fromNumber(200 * 0x100000000, false);
      assert.equal(a.sub(b).toString(), '18446743644212822016');
      assert.equal(a.toString(), '429496729600');

      a = Int64.fromNumber(100 * 0x100000000, false);
      assert.equal(a.subn(200 * 0x100000).toString(), '429287014400');
      assert.equal(a.toString(), '429496729600');
    });

    it('should do big subtraction (signed)', function() {
      var a = Int64.fromNumber(100 * 0x100000000, true);
      var b = Int64.fromNumber(200 * 0x100000000, true);
      a.isub(b);
      assert.equal(a.toString(), '-429496729600');

      a = Int64.fromNumber(100 * 0x100000000, true);
      a.isubn(200 * 0x100000);
      assert.equal(a.toString(), '429287014400');

      a = Int64.fromNumber(100 * 0x100000000, true);
      b = Int64.fromNumber(200 * 0x100000000, true);
      assert.equal(a.sub(b).toString(), '-429496729600');
      assert.equal(a.toString(), '429496729600');

      a = Int64.fromNumber(100 * 0x100000000, false);
      assert.equal(a.subn(200 * 0x100000).toString(), '429287014400');
      assert.equal(a.toString(), '429496729600');
    });

    it('should do small multiplication (unsigned)', function() {
      var a = Int64.fromNumber(100, false);
      var b = Int64.fromNumber(200, false);
      a.imul(b);
      assert.equal(a.toString(), '20000');

      a = Int64.fromNumber(100, false);
      a.imuln(200);
      assert.equal(a.toString(), '20000');

      a = Int64.fromNumber(100, false);
      b = Int64.fromNumber(200, false);
      assert.equal(a.mul(b).toString(), '20000');
      assert.equal(a.toString(), '100');

      a = Int64.fromNumber(100, false);
      assert.equal(a.muln(200).toString(), '20000');
      assert.equal(a.toString(), '100');
    });

    it('should do small multiplication (signed)', function() {
      var a = Int64.fromNumber(100, true);
      var b = Int64.fromNumber(-50, true);
      a.imul(b);
      assert.equal(a.toString(), '-5000');

      a = Int64.fromNumber(100, true);
      a.imuln(-50);
      assert.equal(a.toString(), '-5000');

      a = Int64.fromNumber(100, true);
      b = Int64.fromNumber(-50, true);
      assert.equal(a.mul(b).toString(), '-5000');
      assert.equal(a.toString(), '100');

      a = Int64.fromNumber(100, true);
      assert.equal(a.muln(-50).toString(), '-5000');
      assert.equal(a.toString(), '100');
    });

    it('should do big multiplication (unsigned)', function() {
      var a = Int64.fromNumber(100 * 0x100000000, false);
      var b = Int64.fromNumber(10 * 0x10000000, false);
      a.imul(b);
      assert.equal(a.toString(), '9223372036854775808');

      a = Int64.fromNumber(100 * 0x100000000, false);
      a.imuln(200 * 0x1000000);
      assert.equal(a.toString(), '2305843009213693952');

      a = Int64.fromNumber(100 * 0x100000000, false);
      b = Int64.fromNumber(10 * 0x10000000, false);
      assert.equal(a.mul(b).toString(), '9223372036854775808');
      assert.equal(a.toString(), '429496729600');

      a = Int64.fromNumber(100 * 0x100000000, false);
      assert.equal(a.muln(200 * 0x1000000).toString(), '2305843009213693952');
      assert.equal(a.toString(), '429496729600');
    });

    it('should do big multiplication (signed)', function() {
      var a = Int64.fromNumber(100 * 0x100000000, true);
      var b = Int64.fromNumber(-10 * 0x10000000, true);
      a.imul(b);
      assert.equal(a.toString(), '-9223372036854775808');

      a = Int64.fromNumber(100 * 0x100000000, true);
      a.imuln(-50 * 0x100000);
      assert.equal(a.toString(), '-4071254063142928384');

      a = Int64.fromNumber(100 * 0x100000000, true);
      b = Int64.fromNumber(-10 * 0x10000000, true);
      assert.equal(a.mul(b).toString(), '-9223372036854775808');
      assert.equal(a.toString(), '429496729600');

      a = Int64.fromNumber(100 * 0x100000000, true);
      assert.equal(a.muln(-50 * 0x100000).toString(), '-4071254063142928384');
      assert.equal(a.toString(), '429496729600');
    });

    it('should do small division (unsigned)', function() {
      var a = Int64.fromNumber(200, false);
      var b = Int64.fromNumber(100, false);
      a.idiv(b);
      assert.equal(a.toString(), '2');

      a = Int64.fromNumber(200, false);
      a.idivn(100);
      assert.equal(a.toString(), '2');

      a = Int64.fromNumber(200, false);
      b = Int64.fromNumber(100, false);
      assert.equal(a.div(b).toString(), '2');
      assert.equal(a.toString(), '200');

      a = Int64.fromNumber(200, false);
      assert.equal(a.divn(100).toString(), '2');
      assert.equal(a.toString(), '200');
    });

    it('should do small division (signed)', function() {
      var a = Int64.fromNumber(100, true);
      var b = Int64.fromNumber(-50, true);
      a.idiv(b);
      assert.equal(a.toString(), '-2');

      a = Int64.fromNumber(100, true);
      a.idivn(-50);
      assert.equal(a.toString(), '-2');

      a = Int64.fromNumber(100, true);
      b = Int64.fromNumber(-50, true);
      assert.equal(a.div(b).toString(), '-2');
      assert.equal(a.toString(), '100');

      a = Int64.fromNumber(100, true);
      assert.equal(a.divn(-50).toString(), '-2');
      assert.equal(a.toString(), '100');
    });

    it('should do big division (unsigned)', function() {
      var a = Int64.fromNumber(100 * 0x100000000, false);
      var b = Int64.fromNumber(10 * 0x10000000, false);
      a.idiv(b);
      assert.equal(a.toString(), '160');

      a = Int64.fromNumber(100 * 0x100000000, false);
      a.idivn(200 * 0x1000000);
      assert.equal(a.toString(), '128');

      a = Int64.fromNumber(100 * 0x100000000, false);
      b = Int64.fromNumber(10 * 0x10000000, false);
      assert.equal(a.div(b).toString(), '160');
      assert.equal(a.toString(), '429496729600');

      a = Int64.fromNumber(100 * 0x100000000, false);
      assert.equal(a.divn(200 * 0x1000000).toString(), '128');
      assert.equal(a.toString(), '429496729600');
    });

    it('should do big division (signed)', function() {
      var a = Int64.fromNumber(100 * 0x100000000, true);
      var b = Int64.fromNumber(-10 * 0x10000000, true);
      a.idiv(b);
      assert.equal(a.toString(), '-160');

      a = Int64.fromNumber(100 * 0x100000000, true);
      a.idivn(-50 * 0x100000);
      assert.equal(a.toString(), '-8192');

      a = Int64.fromNumber(100 * 0x100000000, true);
      b = Int64.fromNumber(-10 * 0x10000000, true);
      assert.equal(a.div(b).toString(), '-160');
      assert.equal(a.toString(), '429496729600');

      a = Int64.fromNumber(100 * 0x100000000, true);
      assert.equal(a.divn(-50 * 0x100000).toString(), '-8192');
      assert.equal(a.toString(), '429496729600');
    });

    it('should do small modulo (unsigned)', function() {
      var a = Int64.fromNumber(23525432, false);
      var b = Int64.fromNumber(100, false);
      a.imod(b);
      assert.equal(a.toString(), '32');

      a = Int64.fromNumber(435325234, false);
      a.imodn(100);
      assert.equal(a.toString(), '34');

      a = Int64.fromNumber(131235, false);
      b = Int64.fromNumber(100, false);
      assert.equal(a.mod(b).toString(), '35');
      assert.equal(a.toString(), '131235');

      a = Int64.fromNumber(1130021, false);
      assert.equal(a.modn(100).toString(), '21');
      assert.equal(a.toString(), '1130021');
    });

    it('should do small modulo (signed)', function() {
      var a = Int64.fromNumber(354241, true);
      var b = Int64.fromNumber(-50, true);
      a.imod(b);
      assert.equal(a.toString(), '41');

      a = Int64.fromNumber(2124523, true);
      a.imodn(-50);
      assert.equal(a.toString(), '23');

      a = Int64.fromNumber(13210, true);
      b = Int64.fromNumber(-50, true);
      assert.equal(a.mod(b).toString(), '10');
      assert.equal(a.toString(), '13210');

      a = Int64.fromNumber(141001, true);
      assert.equal(a.modn(-50).toString(), '1');
      assert.equal(a.toString(), '141001');
    });

    it('should do big modulo (unsigned)', function() {
      var a = Int64.fromNumber(100 * 0x100000000, false);
      var b = Int64.fromNumber(9 * 0x10000000, false);
      a.imod(b);
      assert.equal(a.toString(), '1879048192');

      a = Int64.fromNumber(100 * 0x100000000, false);
      a.imodn(187 * 0x1000000);
      assert.equal(a.toString(), '2818572288');

      a = Int64.fromNumber(100 * 0x100000000, false);
      b = Int64.fromNumber(9 * 0x10000000, false);
      assert.equal(a.mod(b).toString(), '1879048192');
      assert.equal(a.toString(), '429496729600');

      a = Int64.fromNumber(100 * 0x100000000, false);
      assert.equal(a.modn(187 * 0x1000000).toString(), '2818572288');
      assert.equal(a.toString(), '429496729600');
    });

    it('should do big modulo (signed)', function() {
      var a = Int64.fromNumber(100 * 0x100000000, true);
      var b = Int64.fromNumber(-9 * 0x10000000, true);
      a.imod(b);
      assert.equal(a.toString(), '1879048192');

      a = Int64.fromNumber(100 * 0x100000000, true);
      a.imodn(-187 * 0x100000);
      assert.equal(a.toString(), '73400320');

      a = Int64.fromNumber(100 * 0x100000000, true);
      b = Int64.fromNumber(-9 * 0x10000000, true);
      assert.equal(a.mod(b).toString(), '1879048192');
      assert.equal(a.toString(), '429496729600');

      a = Int64.fromNumber(100 * 0x100000000, true);
      assert.equal(a.modn(-187 * 0x100000).toString(), '73400320');
      assert.equal(a.toString(), '429496729600');
    });

    it('should do small pow (unsigned)', function() {
      var a = Int64.fromNumber(123, false);
      var b = Int64.fromNumber(6, false);
      a.ipow(b);
      assert.equal(a.toString(), '3462825991689');

      a = Int64.fromNumber(123, false);
      a.ipown(6);
      assert.equal(a.toString(), '3462825991689');

      a = Int64.fromNumber(123, false);
      b = Int64.fromNumber(6, false);
      assert.equal(a.pow(b).toString(), '3462825991689');
      assert.equal(a.toString(), '123');

      a = Int64.fromNumber(123, false);
      assert.equal(a.pown(6).toString(), '3462825991689');
      assert.equal(a.toString(), '123');
    });

    it('should do small pow (signed)', function() {
      var a = Int64.fromNumber(-123, true);
      var b = Int64.fromNumber(6, true);
      a.ipow(b);
      assert.equal(a.toString(), '3462825991689');

      a = Int64.fromNumber(-123, true);
      a.ipown(6);
      assert.equal(a.toString(), '3462825991689');

      a = Int64.fromNumber(-123, true);
      b = Int64.fromNumber(6, true);
      assert.equal(a.pow(b).toString(), '3462825991689');
      assert.equal(a.toString(), '-123');

      a = Int64.fromNumber(-123, true);
      assert.equal(a.pown(6).toString(), '3462825991689');
      assert.equal(a.toString(), '-123');
    });

    it('should do big pow (unsigned)', function() {
      var a = Int64.fromNumber(2, false);
      var b = Int64.fromNumber(63, false);
      a.ipow(b);
      assert.equal(a.toString(), '9223372036854775808');

      a = Int64.fromNumber(2, false);
      a.ipown(63);
      assert.equal(a.toString(), '9223372036854775808');

      a = Int64.fromNumber(2, false);
      b = Int64.fromNumber(63, false);
      assert.equal(a.pow(b).toString(), '9223372036854775808');
      assert.equal(a.toString(), '2');

      a = Int64.fromNumber(2, false);
      assert.equal(a.pown(63).toString(), '9223372036854775808');
      assert.equal(a.toString(), '2');

      a = Int64.fromNumber(2, false);
      assert.equal(a.pown(64).subn(1).toString(), '18446744073709551615');

      a = Int64.fromNumber(2, false);
      assert.equal(a.pown(64).toString(), '0');
    });

    it('should do big pow (signed)', function() {
      var a = Int64.fromNumber(-2, true);
      var b = Int64.fromNumber(63, true);
      a.ipow(b);
      assert.equal(a.toString(), '-9223372036854775808');

      a = Int64.fromNumber(-2, true);
      a.ipown(63);
      assert.equal(a.toString(), '-9223372036854775808');

      a = Int64.fromNumber(-2, true);
      b = Int64.fromNumber(63, true);
      assert.equal(a.pow(b).toString(), '-9223372036854775808');
      assert.equal(a.toString(), '-2');

      a = Int64.fromNumber(-2, true);
      assert.equal(a.pown(63).toString(), '-9223372036854775808');
      assert.equal(a.toString(), '-2');

      a = Int64.fromNumber(-2, true);
      assert.equal(a.pown(64).subn(1).toString(), '-1');

      a = Int64.fromNumber(-2, true);
      assert.equal(a.pown(64).toString(), '0');
    });

    it('should do small AND (unsigned)', function() {
      var a = Int64.fromNumber(12412, false);
      var b = Int64.fromNumber(200, false);
      a.iand(b);
      assert.equal(a.toString(), '72');

      a = Int64.fromNumber(12412, false);
      a.iandn(200);
      assert.equal(a.toString(), '72');

      a = Int64.fromNumber(12412, false);
      b = Int64.fromNumber(200, false);
      assert.equal(a.and(b).toString(), '72');
      assert.equal(a.toString(), '12412');

      a = Int64.fromNumber(12412, false);
      assert.equal(a.andn(200).toString(), '72');
      assert.equal(a.toString(), '12412');
    });

    it('should do small AND (signed)', function() {
      var a = Int64.fromNumber(12412, true);
      var b = Int64.fromNumber(-50, true);
      a.iand(b);
      assert.equal(a.toString(), '12364');

      a = Int64.fromNumber(12412, true);
      a.iandn(-50);
      assert.equal(a.toString(), '12364');

      a = Int64.fromNumber(12412, true);
      b = Int64.fromNumber(-50, true);
      assert.equal(a.and(b).toString(), '12364');
      assert.equal(a.toString(), '12412');

      a = Int64.fromNumber(12412, true);
      assert.equal(a.andn(-50).toString(), '12364');
      assert.equal(a.toString(), '12412');
    });

    it('should do big AND (unsigned)', function() {
      var a = Int64.fromNumber(121453243524523414, false);
      var b = Int64.fromNumber(1242541452, false);
      a.iand(b);
      assert.equal(a.toString(), '1208558976');

      a = Int64.fromNumber(13545214126, false);
      a.iandn(7 * 0x1000000);
      assert.equal(a.toString(), '117440512');

      a = Int64.fromNumber(13545214126, false);
      b = Int64.fromNumber(7 * 0x10000000, false);
      assert.equal(a.and(b).toString(), '536870912');
      assert.equal(a.toString(), '13545214126');

      a = Int64.fromNumber(13545214126, false);
      assert.equal(a.andn(7 * 0x1000000).toString(), '117440512');
      assert.equal(a.toString(), '13545214126');
    });

    it('should do big AND (signed)', function() {
      var a = Int64.fromNumber(121453243524523414, true);
      var b = Int64.fromNumber(1242541452, true);
      a.iand(b);
      assert.equal(a.toString(), '1208558976');

      a = Int64.fromNumber(13545214126, true);
      a.iandn(7 * 0x1000000);
      assert.equal(a.toString(), '117440512');

      a = Int64.fromNumber(13545214126, true);
      b = Int64.fromNumber(7 * 0x10000000, true);
      assert.equal(a.and(b).toString(), '536870912');
      assert.equal(a.toString(), '13545214126');

      a = Int64.fromNumber(13545214126, true);
      assert.equal(a.andn(7 * 0x1000000).toString(), '117440512');
      assert.equal(a.toString(), '13545214126');
    });

    it('should do small OR (unsigned)', function() {
      var a = Int64.fromNumber(12412, false);
      var b = Int64.fromNumber(200, false);
      a.ior(b);
      assert.equal(a.toString(), '12540');

      a = Int64.fromNumber(12412, false);
      a.iorn(200);
      assert.equal(a.toString(), '12540');

      a = Int64.fromNumber(12412, false);
      b = Int64.fromNumber(200, false);
      assert.equal(a.or(b).toString(), '12540');
      assert.equal(a.toString(), '12412');

      a = Int64.fromNumber(12412, false);
      assert.equal(a.orn(200).toString(), '12540');
      assert.equal(a.toString(), '12412');
    });

    it('should do small OR (signed)', function() {
      var a = Int64.fromNumber(12412, true);
      var b = Int64.fromNumber(-50, true);
      a.ior(b);
      assert.equal(a.toString(), '-2');

      a = Int64.fromNumber(12412, true);
      a.iorn(-50);
      assert.equal(a.toString(), '-2');

      a = Int64.fromNumber(12412, true);
      b = Int64.fromNumber(-50, true);
      assert.equal(a.or(b).toString(), '-2');
      assert.equal(a.toString(), '12412');

      a = Int64.fromNumber(12412, true);
      assert.equal(a.orn(-50).toString(), '-2');
      assert.equal(a.toString(), '12412');
    });

    it('should do big OR (unsigned)', function() {
      var a = Int64.fromNumber(121453243524523414, false);
      var b = Int64.fromNumber(1242541452, false);
      a.ior(b);
      assert.equal(a.toString(), '121453243558505884');

      a = Int64.fromNumber(13545214126, false);
      a.iorn(7 * 0x1000000);
      assert.equal(a.toString(), '13545214126');

      a = Int64.fromNumber(13545214126, false);
      b = Int64.fromNumber(7 * 0x10000000, false);
      assert.equal(a.or(b).toString(), '14887391406');
      assert.equal(a.toString(), '13545214126');

      a = Int64.fromNumber(13545214126, false);
      assert.equal(a.orn(7 * 0x1000000).toString(), '13545214126');
      assert.equal(a.toString(), '13545214126');
    });

    it('should do big OR (signed)', function() {
      var a = Int64.fromNumber(121453243524523414, true);
      var b = Int64.fromNumber(1242541452, true);
      a.ior(b);
      assert.equal(a.toString(), '121453243558505884');

      a = Int64.fromNumber(13545214126, true);
      a.iorn(7 * 0x1000000);
      assert.equal(a.toString(), '13545214126');

      a = Int64.fromNumber(13545214126, true);
      b = Int64.fromNumber(7 * 0x10000000, true);
      assert.equal(a.or(b).toString(), '14887391406');
      assert.equal(a.toString(), '13545214126');

      a = Int64.fromNumber(13545214126, true);
      assert.equal(a.orn(7 * 0x1000000).toString(), '13545214126');
      assert.equal(a.toString(), '13545214126');
    });

    it('should do small XOR (unsigned)', function() {
      var a = Int64.fromNumber(12412, false);
      var b = Int64.fromNumber(200, false);
      a.ixor(b);
      assert.equal(a.toString(), '12468');

      a = Int64.fromNumber(12412, false);
      a.ixorn(200);
      assert.equal(a.toString(), '12468');

      a = Int64.fromNumber(12412, false);
      b = Int64.fromNumber(200, false);
      assert.equal(a.xor(b).toString(), '12468');
      assert.equal(a.toString(), '12412');

      a = Int64.fromNumber(12412, false);
      assert.equal(a.xorn(200).toString(), '12468');
      assert.equal(a.toString(), '12412');
    });

    it('should do small XOR (signed)', function() {
      var a = Int64.fromNumber(12412, true);
      var b = Int64.fromNumber(-50, true);
      a.ixor(b);
      assert.equal(a.toString(), '-12366');

      a = Int64.fromNumber(12412, true);
      a.ixorn(-50);
      assert.equal(a.toString(), '-12366');

      a = Int64.fromNumber(12412, true);
      b = Int64.fromNumber(-50, true);
      assert.equal(a.xor(b).toString(), '-12366');
      assert.equal(a.toString(), '12412');

      a = Int64.fromNumber(12412, true);
      assert.equal(a.xorn(-50).toString(), '-12366');
      assert.equal(a.toString(), '12412');
    });

    it('should do big XOR (unsigned)', function() {
      var a = Int64.fromNumber(121453243524523414, false);
      var b = Int64.fromNumber(1242541452, false);
      a.ixor(b);
      assert.equal(a.toString(), '121453242349946908');

      a = Int64.fromNumber(13545214126, false);
      a.ixorn(7 * 0x1000000);
      assert.equal(a.toString(), '13427773614');

      a = Int64.fromNumber(13545214126, false);
      b = Int64.fromNumber(7 * 0x10000000, false);
      assert.equal(a.xor(b).toString(), '14350520494');
      assert.equal(a.toString(), '13545214126');

      a = Int64.fromNumber(13545214126, false);
      assert.equal(a.xorn(7 * 0x1000000).toString(), '13427773614');
      assert.equal(a.toString(), '13545214126');
    });

    it('should do big XOR (signed)', function() {
      var a = Int64.fromNumber(121453243524523414, true);
      var b = Int64.fromNumber(1242541452, true);
      a.ixor(b);
      assert.equal(a.toString(), '121453242349946908');

      a = Int64.fromNumber(13545214126, true);
      a.ixorn(7 * 0x1000000);
      assert.equal(a.toString(), '13427773614');

      a = Int64.fromNumber(13545214126, true);
      b = Int64.fromNumber(7 * 0x10000000, true);
      assert.equal(a.xor(b).toString(), '14350520494');
      assert.equal(a.toString(), '13545214126');

      a = Int64.fromNumber(13545214126, true);
      assert.equal(a.xorn(7 * 0x1000000).toString(), '13427773614');
      assert.equal(a.toString(), '13545214126');
    });

    it('should do small left shift (unsigned)', function() {
      var a = Int64.fromNumber(12412, false);
      var b = Int64.fromNumber(2, false);
      a.ishl(b);
      assert.equal(a.toString(), '49648');

      a = Int64.fromNumber(12412, false);
      a.ishln(2);
      assert.equal(a.toString(), '49648');

      a = Int64.fromNumber(12412, false);
      b = Int64.fromNumber(2, false);
      assert.equal(a.shl(b).toString(), '49648');
      assert.equal(a.toString(), '12412');

      a = Int64.fromNumber(12412, false);
      assert.equal(a.shln(2).toString(), '49648');
      assert.equal(a.toString(), '12412');
    });

    it('should do small left shift (signed)', function() {
      var a = Int64.fromNumber(12412, true);
      var b = Int64.fromNumber(2, true);
      a.ishl(b);
      assert.equal(a.toString(), '49648');

      a = Int64.fromNumber(12412, true);
      a.ishln(2);
      assert.equal(a.toString(), '49648');

      a = Int64.fromNumber(12412, true);
      b = Int64.fromNumber(2, true);
      assert.equal(a.shl(b).toString(), '49648');
      assert.equal(a.toString(), '12412');

      a = Int64.fromNumber(12412, true);
      assert.equal(a.shln(2).toString(), '49648');
      assert.equal(a.toString(), '12412');
    });

    it('should do big left shift (unsigned)', function() {
      var a = Int64.fromNumber(123, false);
      var b = Int64.fromNumber(60, false);
      a.ishl(b);
      assert.equal(a.toString(), '12682136550675316736');

      a = Int64.fromNumber(123, false);
      a.ishln(60);
      assert.equal(a.toString(), '12682136550675316736');

      a = Int64.fromNumber(123, false);
      b = Int64.fromNumber(60, false);
      assert.equal(a.shl(b).toString(), '12682136550675316736');
      assert.equal(a.toString(), '123');

      a = Int64.fromNumber(123, false);
      assert.equal(a.shln(60).toString(), '12682136550675316736');
      assert.equal(a.toString(), '123');
    });

    it('should do big left shift (signed)', function() {
      var a = Int64.fromNumber(123, true);
      var b = Int64.fromNumber(60, true);
      a.ishl(b);
      assert.equal(a.toString(), '-5764607523034234880');

      a = Int64.fromNumber(123, true);
      a.ishln(60);
      assert.equal(a.toString(), '-5764607523034234880');

      a = Int64.fromNumber(123, true);
      b = Int64.fromNumber(60, true);
      assert.equal(a.shl(b).toString(), '-5764607523034234880');
      assert.equal(a.toString(), '123');

      a = Int64.fromNumber(123, true);
      assert.equal(a.shln(60).toString(), '-5764607523034234880');
      assert.equal(a.toString(), '123');
    });

    it('should do small right shift (unsigned)', function() {
      var a = Int64.fromNumber(12412, false);
      var b = Int64.fromNumber(2, false);
      a.ishr(b);
      assert.equal(a.toString(), '3103');

      a = Int64.fromNumber(12412, false);
      a.ishrn(2);
      assert.equal(a.toString(), '3103');

      a = Int64.fromNumber(12412, false);
      b = Int64.fromNumber(2, false);
      assert.equal(a.shr(b).toString(), '3103');
      assert.equal(a.toString(), '12412');

      a = Int64.fromNumber(12412, false);
      assert.equal(a.shrn(2).toString(), '3103');
      assert.equal(a.toString(), '12412');
    });

    it('should do small right shift (signed)', function() {
      var a = Int64.fromNumber(12412, true);
      var b = Int64.fromNumber(2, true);
      a.ishr(b);
      assert.equal(a.toString(), '3103');

      a = Int64.fromNumber(12412, true);
      a.ishrn(2);
      assert.equal(a.toString(), '3103');

      a = Int64.fromNumber(12412, true);
      b = Int64.fromNumber(2, true);
      assert.equal(a.shr(b).toString(), '3103');
      assert.equal(a.toString(), '12412');

      a = Int64.fromNumber(12412, true);
      assert.equal(a.shrn(2).toString(), '3103');
      assert.equal(a.toString(), '12412');
    });

    it('should do big right shift (unsigned)', function() {
      var a = Int64.fromString('ffffffffffffffff', false, 16);
      var b = Int64.fromNumber(45, false);
      a.ishr(b);
      assert.equal(a.toString(), '524287');

      a = Int64.fromString('ffffffffffffffff', false, 16);
      a.ishrn(45);
      assert.equal(a.toString(), '524287');

      a = Int64.fromString('ffffffffffffffff', false, 16);
      b = Int64.fromNumber(45, false);
      assert.equal(a.shr(b).toString(), '524287');
      assert.equal(a.toString(), '18446744073709551615');

      a = Int64.fromString('ffffffffffffffff', false, 16);
      assert.equal(a.shrn(45).toString(), '524287');
      assert.equal(a.toString(), '18446744073709551615');
    });

    // XXX
    it('should do big right shift (signed)', function() {
      var a = Int64.fromString('ffffffffffffffff', true, 16);
      var b = Int64.fromNumber(45, true);
      a.ishr(b);
      assert.equal(a.toString(), '-1');

      a = Int64.fromString('ffffffffffffffff', true, 16);
      a.ishrn(45);
      assert.equal(a.toString(), '-1');

      a = Int64.fromString('ffffffffffffffff', true, 16);
      b = Int64.fromNumber(45, true);
      assert.equal(a.shr(b).toString(), '-1');
      assert.equal(a.toString(), '-1');

      a = Int64.fromString('ffffffffffffffff', true, 16);
      assert.equal(a.shrn(45).toString(), '-1');
      assert.equal(a.toString(), '-1');
    });

    it('should do small unsigned right shift (unsigned)', function() {
      var a = Int64.fromNumber(12412, false);
      var b = Int64.fromNumber(2, false);
      a.iushr(b);
      assert.equal(a.toString(), '3103');

      a = Int64.fromNumber(12412, false);
      a.iushrn(2);
      assert.equal(a.toString(), '3103');

      a = Int64.fromNumber(12412, false);
      b = Int64.fromNumber(2, false);
      assert.equal(a.ushr(b).toString(), '3103');
      assert.equal(a.toString(), '12412');

      a = Int64.fromNumber(12412, false);
      assert.equal(a.ushrn(2).toString(), '3103');
      assert.equal(a.toString(), '12412');
    });

    it('should do small unsigned right shift (signed)', function() {
      var a = Int64.fromNumber(12412, true);
      var b = Int64.fromNumber(2, true);
      a.iushr(b);
      assert.equal(a.toString(), '3103');

      a = Int64.fromNumber(12412, true);
      a.iushrn(2);
      assert.equal(a.toString(), '3103');

      a = Int64.fromNumber(12412, true);
      b = Int64.fromNumber(2, true);
      assert.equal(a.ushr(b).toString(), '3103');
      assert.equal(a.toString(), '12412');

      a = Int64.fromNumber(12412, true);
      assert.equal(a.ushrn(2).toString(), '3103');
      assert.equal(a.toString(), '12412');
    });

    it('should do big unsigned right shift (unsigned)', function() {
      var a = Int64.fromString('ffffffffffffffff', false, 16);
      var b = Int64.fromNumber(45, false);
      a.iushr(b);
      assert.equal(a.toString(), '524287');

      a = Int64.fromString('ffffffffffffffff', false, 16);
      a.iushrn(45);
      assert.equal(a.toString(), '524287');

      a = Int64.fromString('ffffffffffffffff', false, 16);
      b = Int64.fromNumber(45, false);
      assert.equal(a.ushr(b).toString(), '524287');
      assert.equal(a.toString(), '18446744073709551615');

      a = Int64.fromString('ffffffffffffffff', false, 16);
      assert.equal(a.ushrn(45).toString(), '524287');
      assert.equal(a.toString(), '18446744073709551615');
    });

    it('should do big unsigned right shift (signed)', function() {
      var a = Int64.fromString('ffffffffffffffff', true, 16);
      var b = Int64.fromNumber(45, true);
      a.iushr(b);
      assert.equal(a.toString(), '524287');

      a = Int64.fromString('ffffffffffffffff', true, 16);
      a.iushrn(45);
      assert.equal(a.toString(), '524287');

      a = Int64.fromString('ffffffffffffffff', true, 16);
      b = Int64.fromNumber(45, true);
      assert.equal(a.ushr(b).toString(), '524287');
      assert.equal(a.toString(), '-1');

      a = Int64.fromString('ffffffffffffffff', true, 16);
      assert.equal(a.ushrn(45).toString(), '524287');
      assert.equal(a.toString(), '-1');
    });

    it('should do small NOT (unsigned)', function() {
      var a = Int64.fromNumber(12412, false);
      a.inot();
      assert.equal(a.toString(), '18446744073709539203');

      a = Int64.fromNumber(12412, false);
      assert.equal(a.not().toString(), '18446744073709539203');
      assert.equal(a.toString(), '12412');
    });

    it('should do small NOT (signed)', function() {
      var a = Int64.fromNumber(12412, true);
      a.inot();
      assert.equal(a.toString(), '-12413');

      a = Int64.fromNumber(12412, true);
      assert.equal(a.not().toString(), '-12413');
      assert.equal(a.toString(), '12412');
    });

    it('should do big NOT (unsigned)', function() {
      var a = Int64.fromString('ffffffffffffffff', false, 16);
      a.inot();
      assert.equal(a.toString(), '0');

      a = Int64.fromString('ffffffffffffffff', false, 16);
      assert.equal(a.not().toString(), '0');
      assert.equal(a.toString(), '18446744073709551615');
    });

    it('should do big NOT (signed)', function() {
      var a = Int64.fromString('ffffffffffffffff', true, 16);
      a.inot();
      assert.equal(a.toString(), '0');

      a = Int64.fromString('ffffffffffffffff', true, 16);
      assert.equal(a.not().toString(), '0');
      assert.equal(a.toString(), '-1');
    });

    it('should do small NEGATE (unsigned)', function() {
      var a = Int64.fromNumber(12412, false);
      a.ineg();
      assert.equal(a.toString(), '18446744073709539204');

      a = Int64.fromNumber(12412, false);
      assert.equal(a.neg().toString(), '18446744073709539204');
      assert.equal(a.toString(), '12412');
    });

    it('should do small NEGATE (signed)', function() {
      var a = Int64.fromNumber(12412, true);
      a.ineg();
      assert.equal(a.toString(), '-12412');

      a = Int64.fromNumber(12412, true);
      assert.equal(a.neg().toString(), '-12412');
      assert.equal(a.toString(), '12412');
    });

    it('should do big NEGATE (unsigned)', function() {
      var a = Int64.fromString('ffffffffffffffff', false, 16);
      a.ineg();
      assert.equal(a.toString(), '1');

      a = Int64.fromString('ffffffffffffffff', false, 16);
      assert.equal(a.neg().toString(), '1');
      assert.equal(a.toString(), '18446744073709551615');
    });

    it('should do big NEGATE (signed)', function() {
      var a = Int64.fromString('ffffffffffffffff', true, 16);
      a.ineg();
      assert.equal(a.toString(), '1');

      a = Int64.fromString('ffffffffffffffff', true, 16);
      assert.equal(a.neg().toString(), '1');
      assert.equal(a.toString(), '-1');
    });
  });
}

run(Int64, 'Int64 (JS)');
run(Native, 'Int64 (Native)');
