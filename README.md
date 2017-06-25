# n64

Int64 object for javascript.

---

There are a few different int64 libraries which currently exist for javascript.
Some native, some non-native. Most are lacking test coverage. `n64` gives you a
native and non-native version which both have full test coverage.

## Install

``` js
$ npm install n64
```

## Usage

``` js
var Int64 = require('n64');

console.log(Int64(0x123456789).muln(0x12345678).toString(10));
```

Outputs:

```
1492501008711192120
```

## API

`n64` tries to mimic the [bn.js] API as much as possible. Each method follows a
pattern of `(i?)(operation)(n?)`. For example, `a.add(b)` will clone the
current int64, do the addition, and return a new int64. `a.iadd(b)` will do the
addition _in place_. `a.addn(b)` will do the "cloned" addition with `b` being a
32 bit JS number. `a.iaddn(b)` will do the same thing _in-place_.

### Constructor

- `new Int64(signed?)` - Instantiate.
- `new Int64(num, signed?)` - Instantiate from JS number.
- `new Int64(hi, lo, signed?)` - Instantiate from hi/lo bits.
- `new Int64(str, signed?, base?)` - Instantiate from string.
- `new Int64(obj, signed?)` - Instantiate from object (hi & lo).
- `new Int64(bn, signed?)` - Instantiate from bn.js bignumber.

### Properties

- `hi` - Internal hi bits (int32).
- `lo` - Internal lo bits (int32).
- `signed` - Whether the int64 is signed (bool).

### Static Methods

- `Int64.min(a, b)` - Pick min value.
- `Int64.max(a, b)` - Pick max value.
- `Int64.fromNumber(num, signed?)` - Instantiate from JS number.
- `Int64.fromBits(hi, lo, signed?)` - Instantiate from hi/lo bits.
- `Int64.fromInt(lo, signed?)` - Instantiate from lo bits.
- `Int64.fromString(str, signed?, base?)` - Instantiate from string.
- `Int64.fromObject(obj, signed?)` - Instantiate from object (hi & lo).
- `Int64.fromBN(bn, signed?)` - Instantiate from bn.js bignumber.
- `Int64.from(signed?)` - Instantiate.
- `Int64.from(num, signed?)` - Instantiate from JS number.
- `Int64.from(hi, lo, signed?)` - Instantiate from hi/lo bits.
- `Int64.from(str, signed?, base?)` - Instantiate from string.
- `Int64.from(obj, signed?)` - Instantiate from object (hi & lo).
- `Int64.from(bn, signed?)` - Instantiate from bn.js bignumber.
- `Int64.isInt64(obj)` - Test instanceof.

### Methods

#### Arithmetic

- `Int64#iadd(i64)` - In-place addition with another int64.
- `Int64#iaddn(num)` - In-place addition with a JS number.
- `Int64#add(i64)` - Cloned addition with another int64.
- `Int64#addn(num)` - Cloned addition with a JS number.
- `Int64#isub(i64)` - In-place subtraction with another int64.
- `Int64#isubn(num)` - In-place subtraction with a JS number.
- `Int64#sub(i64)` - Cloned subtraction with another int64.
- `Int64#subn(num)` - Cloned subtraction with a JS number.
- `Int64#imul(i64)` - In-place multiplication with another int64.
- `Int64#imuln(num)` - In-place multiplication with a JS number.
- `Int64#mul(i64)` - Cloned multiplication with another int64.
- `Int64#muln(num)` - Cloned multiplication with a JS number.
- `Int64#idiv(i64)` - In-place division with another int64.
- `Int64#idivn(num)` - In-place division with a JS number.
- `Int64#div(i64)` - Cloned division with another int64.
- `Int64#divn(num)` - Cloned division with a JS number.
- `Int64#imod(i64)` - In-place modulo with another int64.
- `Int64#imodn(num)` - In-place modulo with a JS number.
- `Int64#mod(i64)` - Cloned modulo with another int64.
- `Int64#modn(num)` - Cloned modulo with a JS number.
- `Int64#ipow(i64)` - In-place exponentiation with another int64.
- `Int64#ipown(num)` - In-place exponentiation with a JS number.
- `Int64#pow(i64)` - Cloned exponentiation with another int64.
- `Int64#pown(num)` - Cloned exponentiation with a JS number.
- `Int64#isqr()` - Square number in-place.
- `Int64#sqr()` - Clone and square number.

#### Bitwise

- `Int64#iand(i64)` - In-place `AND` with another int64.
- `Int64#iandn(num)` - In-place `AND` with a JS number.
- `Int64#and(i64)` - Cloned `AND` with another int64.
- `Int64#andn(num)` - Cloned `AND` with a JS number.
- `Int64#ior(i64)` - In-place `OR` with another int64.
- `Int64#iorn(num)` - In-place `OR` with a JS number.
- `Int64#or(i64)` - Cloned `OR` with another int64.
- `Int64#orn(num)` - Cloned `OR` with a JS number.
- `Int64#ixor(i64)` - In-place `XOR` with another int64.
- `Int64#ixorn(num)` - In-place `XOR` with a JS number.
- `Int64#xor(i64)` - Cloned `XOR` with another int64.
- `Int64#xorn(num)` - Cloned `XOR` with a JS number.
- `Int64#inot()` - In-place `NOT`.
- `Int64#not()` - Cloned `NOT`.
- `Int64#ishl(i64)` - In-place left-shift with another int64.
- `Int64#ishln(num)` - In-place left-shift with a JS number.
- `Int64#shl(i64)` - Cloned left-shift with another int64.
- `Int64#shln(num)` - Cloned left-shift with a JS number.
- `Int64#ishr(i64)` - In-place right-shift with another int64.
- `Int64#ishrn(num)` - In-place right-shift with a JS number.
- `Int64#shr(i64)` - Cloned right-shift with another int64.
- `Int64#shrn(num)` - Cloned right-shift with a JS number.
- `Int64#iushr(i64)` - In-place unsigned right-shift with another int64.
- `Int64#iushrn(num)` - In-place unsigned right-shift with a JS number.
- `Int64#ushr(i64)` - Cloned unsigned right-shift with another int64.
- `Int64#ushrn(num)` - Cloned unsigned right-shift with a JS number.
- `Int64#setn(bit)` - Set specified bit to `1` (in-place).
- `Int64#testn(bit)` - Test whether a bit is set.
- `Int64#imaskn(bit)` - Clear bits higher or equal to `bit` (in-place).
- `Int64#maskn(bit)` - Clear bits higher or equal to `bit`.
- `Int64#andln(num)` - Perform `AND` on lo 32 bits (returns JS number).

#### Negation

- `Int64#ineg()` - In-place negation.
- `Int64#neg()` - Cloned negation.
- `Int64#iabs()` - In-place absolute.
- `Int64#abs()` - Cloned absolute.

#### Comparison

- `Int64#cmp(i64)` - Compare to another int64.
- `Int64#cmpn(num)` - Compare to a JS number.
- `Int64#eq(i64)` - Test equality against another int64.
- `Int64#eqn(num)` - Test equality against a JS number.
- `Int64#gt(i64)` - Greater than (int64).
- `Int64#gtn(num)` - Greater than (JS number).
- `Int64#gte(i64)` - Greater than or equal to (int64).
- `Int64#gten(num)` - Greater than or equal to (JS number).
- `Int64#lt(i64)` - Less than (int64).
- `Int64#ltn(num)` - Less than (JS number).
- `Int64#lte(i64)` - Less than or equal to (int64).
- `Int64#lten(num)` - Less than or equal to (JS number).
- `Int64#isZero()` - Test whether int64 is zero.
- `Int64#isNeg()` - Test whether int64 is negative.
- `Int64#isOdd()` - Test whether int64 is odd.
- `Int64#isEven()` - Test whether int64 is even.

#### Helpers

- `Int64#clone()` - Clone and return a new int64.
- `Int64#inject(i64)` - Inject properties from int64.
- `Int64#set(num)` - Set the int64 to a JS number value.
- `Int64#join(hi, lo)` - Join hi and lo bits.
- `Int64#toUnsigned()` - Cast to unsigned.
- `Int64#toSigned()` - Cast to signed.
- `Int64#bitLength()` - Count number of bits.
- `Int64#byteLength()` - Count number of bytes.
- `Int64#isSafe()` - Test whether the number is less than or equal to 53 bits.
- `Int64#toNumber()` - Convert int64 to a JS number (throws on >53 bits).
- `Int64#toDouble()` - Convert int64 to a JS number.
- `Int64#toInt()` - Convert lo bits to a JS number.
- `Int64#toString(base?)` - Convert to string of `base`.
- `Int64#toJSON()` - Convert to hex string.
- `Int64#inspect()` - Inspect number.

## Testing

``` js
$ npm test
```

This should run all test vectors for both the native and non-native backend.

## Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your code
to be distributed under the MIT license. You are also implicitly verifying that
all code is your original work. `</legalese>`

## License

- Copyright (c) 2017, Christopher Jeffrey. (MIT License)

See LICENSE for more info.

[bn.js]: https://github.com/indutny/bn.js
