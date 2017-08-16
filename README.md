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
const {U64} = require('n64');

console.log(U64(0x123456789).muln(0x12345678).toString(10));
```

Outputs:

```
1492501008711192120
```

## API

`n64` tries to mimic the [bn.js] API as much as possible. Like bn.js, each
method follows a pattern of `(i?)(operation)(n?)`.

### Prefixes

- `i` - Perform the operation in-place.

### Postfixes

- `n` - Function must be passed a 32 bit javascript number.

For example, `a.add(b)` will clone the current object, do the addition, and
return a new object. `a.iadd(b)` will do the addition _in place_. `a.addn(b)`
will do the "cloned" addition with `b` being a 32 bit JS number, and
`a.iaddn(b)` will do the same thing _in-place_.

### Constructor

There are two constructors: `U64` and `I64`, both containing the same methods.
The `N64` object documented below applies to both `n64.U64` and `n64.I64`.

- `new N64()` - Instantiate.
- `new N64(num)` - Instantiate from JS number.
- `new N64(hi, lo)` - Instantiate from hi/lo bits.
- `new N64(str, base?)` - Instantiate from string.
- `new N64(obj)` - Instantiate from object (hi & lo).
- `new N64(bn)` - Instantiate from bn.js bignumber.

### Properties

- `hi` - Internal hi bits (int32).
- `lo` - Internal lo bits (int32).
- `signed` - Whether the int64 is signed (bool).

### Static Methods

- `N64.random()` - Instantiate random int64.
- `N64.pow(num, exp)` - Instantiate from number and power.
- `N64.shift(num, bits)` - Instantiate from left shift.
- `N64.fromNumber(num)` - Instantiate from JS number.
- `N64.fromBits(hi, lo)` - Instantiate from hi/lo bits.
- `N64.fromInt(lo)` - Instantiate from lo bits.
- `N64.fromString(str)` - Instantiate from string.
- `N64.fromObject(obj)` - Instantiate from object (hi & lo).
- `N64.fromBN(bn)` - Instantiate from bn.js bignumber.
- `N64.from()` - Instantiate.
- `N64.from(num)` - Instantiate from JS number.
- `N64.from(hi, lo)` - Instantiate from hi/lo bits.
- `N64.from(str, base?)` - Instantiate from string.
- `N64.from(obj)` - Instantiate from object (hi & lo).
- `N64.from(bn)` - Instantiate from bn.js bignumber.
- `N64.isN64(obj)` - Test instanceof N64.
- `N64.isU64(obj)` - Test instanceof U64.
- `N64.isI64(obj)` - Test instanceof I64.

### Methods

#### Arithmetic

- `N64#iadd(obj)` - In-place addition with another int64.
- `N64#iaddn(num)` - In-place addition with a JS number.
- `N64#add(obj)` - Cloned addition with another int64.
- `N64#addn(num)` - Cloned addition with a JS number.
- `N64#isub(obj)` - In-place subtraction with another int64.
- `N64#isubn(num)` - In-place subtraction with a JS number.
- `N64#sub(obj)` - Cloned subtraction with another int64.
- `N64#subn(num)` - Cloned subtraction with a JS number.
- `N64#imul(obj)` - In-place multiplication with another int64.
- `N64#imuln(num)` - In-place multiplication with a JS number.
- `N64#mul(obj)` - Cloned multiplication with another int64.
- `N64#muln(num)` - Cloned multiplication with a JS number.
- `N64#idiv(obj)` - In-place division with another int64.
- `N64#idivn(num)` - In-place division with a JS number.
- `N64#div(obj)` - Cloned division with another int64.
- `N64#divn(num)` - Cloned division with a JS number.
- `N64#imod(obj)` - In-place modulo with another int64.
- `N64#imodn(num)` - In-place modulo with a JS number.
- `N64#mod(obj)` - Cloned modulo with another int64.
- `N64#modn(num)` - Cloned modulo with a JS number.
- `N64#ipow(obj)` - In-place exponentiation with another int64.
- `N64#ipown(num)` - In-place exponentiation with a JS number.
- `N64#pow(obj)` - Cloned exponentiation with another int64.
- `N64#pown(num)` - Cloned exponentiation with a JS number.
- `N64#isqr()` - Square number in-place.
- `N64#sqr()` - Clone and square number.

#### Bitwise

- `N64#iand(obj)` - In-place `AND` with another int64.
- `N64#iandn(num)` - In-place `AND` with a JS number.
- `N64#and(obj)` - Cloned `AND` with another int64.
- `N64#andn(num)` - Cloned `AND` with a JS number.
- `N64#ior(obj)` - In-place `OR` with another int64.
- `N64#iorn(num)` - In-place `OR` with a JS number.
- `N64#or(obj)` - Cloned `OR` with another int64.
- `N64#orn(num)` - Cloned `OR` with a JS number.
- `N64#ixor(obj)` - In-place `XOR` with another int64.
- `N64#ixorn(num)` - In-place `XOR` with a JS number.
- `N64#xor(obj)` - Cloned `XOR` with another int64.
- `N64#xorn(num)` - Cloned `XOR` with a JS number.
- `N64#inot()` - In-place `NOT`.
- `N64#not()` - Cloned `NOT`.
- `N64#ishl(obj)` - In-place left-shift with another int64.
- `N64#ishln(num)` - In-place left-shift with a JS number.
- `N64#shl(obj)` - Cloned left-shift with another int64.
- `N64#shln(num)` - Cloned left-shift with a JS number.
- `N64#ishr(obj)` - In-place right-shift with another int64.
- `N64#ishrn(num)` - In-place right-shift with a JS number.
- `N64#shr(obj)` - Cloned right-shift with another int64.
- `N64#shrn(num)` - Cloned right-shift with a JS number.
- `N64#iushr(obj)` - In-place unsigned right-shift with another int64.
- `N64#iushrn(num)` - In-place unsigned right-shift with a JS number.
- `N64#ushr(obj)` - Cloned unsigned right-shift with another int64.
- `N64#ushrn(num)` - Cloned unsigned right-shift with a JS number.
- `N64#setn(bit)` - Set specified bit to `1` (in-place).
- `N64#testn(bit)` - Test whether a bit is set.
- `N64#imaskn(bit)` - Clear bits higher or equal to `bit` (in-place).
- `N64#maskn(bit)` - Clear bits higher or equal to `bit`.
- `N64#andln(num)` - Perform `AND` on lo 32 bits (returns JS number).

#### Negation

- `N64#ineg()` - In-place negation.
- `N64#neg()` - Cloned negation.
- `N64#iabs()` - In-place absolute.
- `N64#abs()` - Cloned absolute.

#### Comparison

- `N64#cmp(obj)` - Compare to another int64.
- `N64#cmpn(num)` - Compare to a JS number.
- `N64#eq(obj)` - Test equality against another int64.
- `N64#eqn(num)` - Test equality against a JS number.
- `N64#gt(obj)` - Greater than (int64).
- `N64#gtn(num)` - Greater than (JS number).
- `N64#gte(obj)` - Greater than or equal to (int64).
- `N64#gten(num)` - Greater than or equal to (JS number).
- `N64#lt(obj)` - Less than (int64).
- `N64#ltn(num)` - Less than (JS number).
- `N64#lte(obj)` - Less than or equal to (int64).
- `N64#lten(num)` - Less than or equal to (JS number).
- `N64#isZero()` - Test whether int64 is zero.
- `N64#isNeg()` - Test whether int64 is negative.
- `N64#isOdd()` - Test whether int64 is odd.
- `N64#isEven()` - Test whether int64 is even.

#### Helpers

- `N64#clone()` - Clone and return a new int64.
- `N64#inject(obj)` - Inject properties from int64.
- `N64#set(num)` - Set the int64 to a JS number value.
- `N64#join(hi, lo)` - Join hi and lo bits.
- `N64#toUnsigned()` - Cast to unsigned. Returns a U64.
- `N64#toSigned()` - Cast to signed. Returns an I64.
- `N64#bitLength()` - Count number of bits.
- `N64#byteLength()` - Count number of bytes.
- `N64#isSafe()` - Test whether the number is less than or equal to 53 bits.
- `N64#toNumber()` - Convert int64 to a JS number (throws on >53 bits).
- `N64#toDouble()` - Convert int64 to a JS number.
- `N64#toInt()` - Convert lo bits to a JS number.
- `N64#toString(base?)` - Convert to string of `base`.
- `N64#toJSON()` - Convert to hex string.
- `N64#inspect()` - Inspect number.

### Module Functions

- `n64.min(a, b)` - Pick min value.
- `n64.max(a, b)` - Pick max value.
- `n64.isU64(obj)` - Test instanceof U64.
- `n64.isI64(obj)` - Test instanceof I64.
- `n64.isN64(obj)` - Test instanceof N64.

### Module Constants

- `n64.ULONG_MIN` - Unsigned int32 minimum (number).
- `n64.ULONG_MAX` - Unsigned int32 maximum (number).
- `n64.LONG_MIN` - Int32 minimum (number).
- `n64.LONG_MAX` - Int32 maximum (number).
- `n64.DOUBLE_MIN` - Double float 53 bit minimum (number).
- `n64.DOUBLE_MAX` - Double float 53 bit maxmimum (number).
- `n64.UINT32_MIN` - Unsigned int32 minimum (U64).
- `n64.UINT32_MAX` - Unsigned int32 maximum (U64).
- `n64.INT32_MIN` - Int32 minimum (I64).
- `n64.INT32_MAX` - Int32 maximum (I64).
- `n64.UINT64_MIN` - Unsigned int64 minimum (U64).
- `n64.UINT64_MAX` - Unsigned int64 maximum (U64).
- `n64.INT64_MIN` - Int64 minimum (I64).
- `n64.INT64_MAX` - Int64 maximum (I64).

## Casting

With mixed types, the left operand will cast the right operand to its sign.

With the `n`-postfix methods, numbers passed into them will be cast to 32 bit
integers. If the left had operand is signed, the number is cast to an
`int32_t`. If unsigned, the number is cast to an `uint32_t`.

### Examples

In JS:

``` js
const a = new I64(1);
const b = new U64('ffffffffffffffff', 16);
const r = a.add(b);
console.log(r.toString());
```

In C:

``` c
int64_t a = 1;
uint64_t b = 0xffffffffffffffff;
int64_t r = a + (int64_t)b;
printf("%d\n", r);
```

Outputs `0`, as `(int64_t)ULLONG_MAX == -1LL`.

---

In JS:

``` js
const a = new I64(0);
const r = a.addn(0xffffffff);
console.log(r.toString());
```

In C:

``` c
int64_t a = 0;
int64_t r = a + (int32_t)0xffffffff;
printf("%d\n", r);
```

Outputs `-1`.

---

In JS:

``` js
const a = new U64(0);
const r = a.addn(-1);
console.log(r.toString());
```

In C:

``` c
uint64_t a = 0;
uint64_t r = a + (uint32_t)-1;
printf("%u\n", r);
```

Outputs `4294967295`.

## Testing

``` js
$ npm test
```

This should run all test vectors for both the native and non-native backend.

## Fuzzing

A fuzzer is present for testing of operations vs. actual machine operations.

``` js
$ node test/fuzz.js
```

## Benchmarks

Benchmarks are run against bn.js.

``` js
$ node bench
```

## Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your code
to be distributed under the MIT license. You are also implicitly verifying that
all code is your original work. `</legalese>`

## License

- Copyright (c) 2017, Christopher Jeffrey. (MIT License)

See LICENSE for more info.

[bn.js]: https://github.com/indutny/bn.js
