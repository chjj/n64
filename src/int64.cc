/**
 * int64.cc - native int64 object for node.js.
 * Copyright (c) 2017, Christopher Jeffrey (MIT License)
 */

#include <cmath>
#include <inttypes.h>
#include <stdlib.h>

#include "int64.h"

#define ARG_ERROR(name, len) ("Int64#" #name " requires " #len " argument(s).")
#define TYPE_ERROR(name, type) ("`" #name "` must be a(n) " #type ".")

static Nan::Persistent<v8::FunctionTemplate> int64_constructor;

NAN_INLINE static bool IsNull(v8::Local<v8::Value> options);

static int64_t MAX_SAFE_INTEGER = 0x1fffffffffffff;

Int64::Int64() {
  n = 0;
  sign = false;
}

Int64::~Int64() {}

void
Int64::Init(v8::Local<v8::Object> &target) {
  Nan::HandleScope scope;

  v8::Local<v8::FunctionTemplate> tpl =
    Nan::New<v8::FunctionTemplate>(Int64::New);

  int64_constructor.Reset(tpl);

  tpl->SetClassName(Nan::New("Int64").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  Nan::SetPrototypeMethod(tpl, "getHi", Int64::GetHi);
  Nan::SetPrototypeMethod(tpl, "setHi", Int64::SetHi);
  Nan::SetPrototypeMethod(tpl, "getLo", Int64::GetLo);
  Nan::SetPrototypeMethod(tpl, "setLo", Int64::SetLo);
  Nan::SetPrototypeMethod(tpl, "getSigned", Int64::GetSigned);
  Nan::SetPrototypeMethod(tpl, "setSigned", Int64::SetSigned);
  Nan::SetPrototypeMethod(tpl, "iadd", Int64::Iadd);
  Nan::SetPrototypeMethod(tpl, "iaddn", Int64::Iaddn);
  Nan::SetPrototypeMethod(tpl, "isub", Int64::Isub);
  Nan::SetPrototypeMethod(tpl, "isubn", Int64::Isubn);
  Nan::SetPrototypeMethod(tpl, "imul", Int64::Imul);
  Nan::SetPrototypeMethod(tpl, "imuln", Int64::Imuln);
  Nan::SetPrototypeMethod(tpl, "idiv", Int64::Idiv);
  Nan::SetPrototypeMethod(tpl, "idivn", Int64::Idivn);
  Nan::SetPrototypeMethod(tpl, "imod", Int64::Imod);
  Nan::SetPrototypeMethod(tpl, "imodn", Int64::Imodn);
  Nan::SetPrototypeMethod(tpl, "ipown", Int64::Ipown);
  Nan::SetPrototypeMethod(tpl, "iand", Int64::Iand);
  Nan::SetPrototypeMethod(tpl, "iandn", Int64::Iandn);
  Nan::SetPrototypeMethod(tpl, "ior", Int64::Ior);
  Nan::SetPrototypeMethod(tpl, "iorn", Int64::Iorn);
  Nan::SetPrototypeMethod(tpl, "ixor", Int64::Ixor);
  Nan::SetPrototypeMethod(tpl, "inot", Int64::Inot);
  Nan::SetPrototypeMethod(tpl, "ixorn", Int64::Ixorn);
  Nan::SetPrototypeMethod(tpl, "ishln", Int64::Ishln);
  Nan::SetPrototypeMethod(tpl, "ishrn", Int64::Ishrn);
  Nan::SetPrototypeMethod(tpl, "iushrn", Int64::Iushrn);
  Nan::SetPrototypeMethod(tpl, "setn", Int64::Setn);
  Nan::SetPrototypeMethod(tpl, "testn", Int64::Testn);
  Nan::SetPrototypeMethod(tpl, "imaskn", Int64::Imaskn);
  Nan::SetPrototypeMethod(tpl, "ineg", Int64::Ineg);
  Nan::SetPrototypeMethod(tpl, "cmp", Int64::Cmp);
  Nan::SetPrototypeMethod(tpl, "cmpn", Int64::Cmpn);
  Nan::SetPrototypeMethod(tpl, "eq", Int64::Eq);
  Nan::SetPrototypeMethod(tpl, "eqn", Int64::Eqn);
  Nan::SetPrototypeMethod(tpl, "isZero", Int64::IsZero);
  Nan::SetPrototypeMethod(tpl, "isNeg", Int64::IsNeg);
  Nan::SetPrototypeMethod(tpl, "isOdd", Int64::IsOdd);
  Nan::SetPrototypeMethod(tpl, "isEven", Int64::IsEven);
  Nan::SetPrototypeMethod(tpl, "clone", Int64::Clone);
  Nan::SetPrototypeMethod(tpl, "inject", Int64::Inject);
  Nan::SetPrototypeMethod(tpl, "set", Int64::Set);
  Nan::SetPrototypeMethod(tpl, "join", Int64::Join);
  Nan::SetPrototypeMethod(tpl, "bitLength", Int64::BitLength);
  Nan::SetPrototypeMethod(tpl, "isSafe", Int64::IsSafe);
  Nan::SetPrototypeMethod(tpl, "toNumber", Int64::ToNumber);
  Nan::SetPrototypeMethod(tpl, "toDouble", Int64::ToDouble);
  Nan::SetPrototypeMethod(tpl, "toInt", Int64::ToInt);
  Nan::SetPrototypeMethod(tpl, "toString", Int64::ToString);
  Nan::SetPrototypeMethod(tpl, "fromNumber", Int64::FromNumber);
  Nan::SetPrototypeMethod(tpl, "fromInt", Int64::FromInt);
  Nan::SetPrototypeMethod(tpl, "fromBits", Int64::FromBits);
  Nan::SetPrototypeMethod(tpl, "fromString", Int64::FromString);

  v8::Local<v8::FunctionTemplate> ctor =
    Nan::New<v8::FunctionTemplate>(int64_constructor);

  target->Set(Nan::New("Int64").ToLocalChecked(), ctor->GetFunction());
}

v8::Local<v8::Value> Int64::Clone() {
  Nan::EscapableHandleScope scope;
  Nan::MaybeLocal<v8::Object> maybeInstance;
  v8::Local<v8::Object> instance;

  v8::Local<v8::FunctionTemplate> ctor =
    Nan::New<v8::FunctionTemplate>(int64_constructor);

  maybeInstance = Nan::NewInstance(ctor->GetFunction(), 0, NULL);

  if (maybeInstance.IsEmpty()) {
    Nan::ThrowError("Could not create Int64 instance.");
    return instance;
  }

  instance = maybeInstance.ToLocalChecked();

  Int64 *a = ObjectWrap::Unwrap<Int64>(instance);
  a->n = n;
  a->sign = sign;

  return scope.Escape(instance);
}

bool Int64::HasInstance(v8::Local<v8::Value> val) {
  Nan::HandleScope scope;
  return Nan::New(int64_constructor)->HasInstance(val);
}

NAN_METHOD(Int64::New) {
  if (!info.IsConstructCall()) {
    v8::Local<v8::FunctionTemplate> ctor =
      Nan::New<v8::FunctionTemplate>(int64_constructor);
    Nan::MaybeLocal<v8::Object> maybeInstance;
    v8::Local<v8::Object> instance;

    maybeInstance = Nan::NewInstance(ctor->GetFunction(), 0, NULL);

    if (maybeInstance.IsEmpty())
      return Nan::ThrowError("Could not create Int64 instance.");

    instance = maybeInstance.ToLocalChecked();

    info.GetReturnValue().Set(instance);
    return;
  }

  Int64 *obj = new Int64();
  obj->Wrap(info.This());
  info.GetReturnValue().Set(info.This());
}

NAN_METHOD(Int64::GetHi) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  int32_t hi = (int32_t)(a->n >> 32);

  info.GetReturnValue().Set(Nan::New<v8::Int32>(hi));
}

NAN_METHOD(Int64::SetHi) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(setHi, 1));

  if (!info[0]->IsNumber())
    return Nan::ThrowTypeError(TYPE_ERROR(hi, number));

  uint32_t hi = info[0]->Uint32Value();

  a->n = ((uint64_t)hi << 32) | (a->n & 0xffffffff);

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(Int64::GetLo) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  int32_t lo = (int32_t)(a->n & 0xffffffff);

  info.GetReturnValue().Set(Nan::New<v8::Int32>(lo));
}

NAN_METHOD(Int64::SetLo) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(setLo, 1));

  if (!info[0]->IsNumber())
    return Nan::ThrowTypeError(TYPE_ERROR(lo, number));

  uint32_t lo = info[0]->Uint32Value();

  a->n &= ~0xffffffff;
  a->n |= lo;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(Int64::GetSigned) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());
  info.GetReturnValue().Set(Nan::New<v8::Boolean>(a->sign));
}

NAN_METHOD(Int64::SetSigned) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(setSigned, 1));

  if (!info[0]->IsBoolean())
    return Nan::ThrowTypeError(TYPE_ERROR(signed, boolean));

  a->sign = info[0]->BooleanValue();

  info.GetReturnValue().Set(Nan::New<v8::Boolean>(a->sign));
}

NAN_METHOD(Int64::Iadd) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(iadd, 1));

  if (!Int64::HasInstance(info[0]))
    return Nan::ThrowTypeError(TYPE_ERROR(operand, int64));

  Int64 *b = ObjectWrap::Unwrap<Int64>(info[0].As<v8::Object>());

  if (a->sign)
    a->n = (int64_t)a->n + (int64_t)b->n;
  else
    a->n += b->n;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(Int64::Iaddn) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(iaddn, 1));

  if (!info[0]->IsNumber())
    return Nan::ThrowTypeError(TYPE_ERROR(operand, number));

  uint32_t num = info[0]->Uint32Value();

  if (a->sign)
    a->n = (int64_t)a->n + (int64_t)((int32_t)num);
  else
    a->n += num;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(Int64::Isub) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(isub, 1));

  if (!Int64::HasInstance(info[0]))
    return Nan::ThrowTypeError(TYPE_ERROR(operand, int64));

  Int64 *b = ObjectWrap::Unwrap<Int64>(info[0].As<v8::Object>());

  if (a->sign)
    a->n = (int64_t)a->n - (int64_t)b->n;
  else
    a->n -= b->n;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(Int64::Isubn) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(isubn, 1));

  if (!info[0]->IsNumber())
    return Nan::ThrowTypeError(TYPE_ERROR(operand, number));

  uint32_t num = info[0]->Uint32Value();

  if (a->sign)
    a->n = (int64_t)a->n - (int64_t)((int32_t)num);
  else
    a->n -= num;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(Int64::Imul) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(imul, 1));

  if (!Int64::HasInstance(info[0]))
    return Nan::ThrowTypeError(TYPE_ERROR(multiplicand, int64));

  Int64 *b = ObjectWrap::Unwrap<Int64>(info[0].As<v8::Object>());

  if (a->sign)
    a->n = (int64_t)a->n * (int64_t)b->n;
  else
    a->n *= b->n;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(Int64::Imuln) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(imuln, 1));

  if (!info[0]->IsNumber())
    return Nan::ThrowTypeError(TYPE_ERROR(multiplicand, number));

  uint32_t num = info[0]->Uint32Value();

  if (a->sign)
    a->n = (int64_t)a->n * (int64_t)((int32_t)num);
  else
    a->n *= num;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(Int64::Idiv) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(idiv, 1));

  if (!Int64::HasInstance(info[0]))
    return Nan::ThrowTypeError(TYPE_ERROR(divisor, int64));

  Int64 *b = ObjectWrap::Unwrap<Int64>(info[0].As<v8::Object>());

  if (b->n == 0)
    return Nan::ThrowError("Cannot divide by zero.");

  if (a->sign) {
    if ((int64_t)a->n == LLONG_MIN && (int64_t)b->n == -1)
      ;
    else
      a->n = (int64_t)a->n / (int64_t)b->n;
  } else {
    a->n /= b->n;
  }

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(Int64::Idivn) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(idivn, 1));

  if (!info[0]->IsNumber())
    return Nan::ThrowTypeError(TYPE_ERROR(divisor, number));

  uint32_t num = info[0]->Uint32Value();

  if (num == 0)
    return Nan::ThrowError("Cannot divide by zero.");

  if (a->sign) {
    if ((int64_t)a->n == LLONG_MIN && (int32_t)num == -1)
      ;
    else
      a->n = (int64_t)a->n / (int64_t)((int32_t)num);
  } else {
    a->n /= num;
  }

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(Int64::Imod) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(imod, 1));

  if (!Int64::HasInstance(info[0]))
    return Nan::ThrowTypeError(TYPE_ERROR(divisor, int64));

  Int64 *b = ObjectWrap::Unwrap<Int64>(info[0].As<v8::Object>());

  if (b->n == 0)
    return Nan::ThrowError("Cannot divide by zero.");

  if (a->sign)
    if ((int64_t)a->n == LLONG_MIN && (int64_t)b->n == -1)
      a->n = 0;
    else
      a->n = (int64_t)a->n % (int64_t)b->n;
  else
    a->n %= b->n;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(Int64::Imodn) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(imodn, 1));

  if (!info[0]->IsNumber())
    return Nan::ThrowTypeError(TYPE_ERROR(divisor, number));

  uint32_t num = info[0]->Uint32Value();

  if (num == 0)
    return Nan::ThrowError("Cannot divide by zero.");

  if (a->sign)
    if ((int64_t)a->n == LLONG_MIN && (int32_t)num == -1)
      a->n = 0;
    else
      a->n = (int64_t)a->n % (int64_t)((int32_t)num);
  else
    a->n %= num;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(Int64::Ipown) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(ipown, 1));

  if (!info[0]->IsNumber())
    return Nan::ThrowTypeError(TYPE_ERROR(exponent, number));

  uint64_t x = a->n;
  uint32_t y = info[0]->Uint32Value();

  if (a->n != 0) {
    a->n = 1;

    while (y > 0) {
      if (y & 1)
        a->n *= x;
      y >>= 1;
      x *= x;
    }
  }

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(Int64::Iand) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(iand, 1));

  if (!Int64::HasInstance(info[0]))
    return Nan::ThrowTypeError(TYPE_ERROR(operand, int64));

  Int64 *b = ObjectWrap::Unwrap<Int64>(info[0].As<v8::Object>());

  if (a->sign)
    a->n = (int64_t)a->n & (int64_t)b->n;
  else
    a->n &= b->n;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(Int64::Iandn) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(iandn, 1));

  if (!info[0]->IsNumber())
    return Nan::ThrowTypeError(TYPE_ERROR(operand, number));

  uint32_t num = info[0]->Uint32Value();

  if (a->sign)
    a->n = (int64_t)a->n & (int64_t)((int32_t)num);
  else
    a->n &= num;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(Int64::Ior) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(ior, 1));

  if (!Int64::HasInstance(info[0]))
    return Nan::ThrowTypeError(TYPE_ERROR(operand, int64));

  Int64 *b = ObjectWrap::Unwrap<Int64>(info[0].As<v8::Object>());

  if (a->sign)
    a->n = (int64_t)a->n | (int64_t)b->n;
  else
    a->n |= b->n;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(Int64::Iorn) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(iorn, 1));

  if (!info[0]->IsNumber())
    return Nan::ThrowTypeError(TYPE_ERROR(operand, number));

  uint32_t num = info[0]->Uint32Value();

  if (a->sign)
    a->n = (int64_t)a->n | (int64_t)((int32_t)num);
  else
    a->n |= num;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(Int64::Ixor) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(ixor, 1));

  if (!Int64::HasInstance(info[0]))
    return Nan::ThrowTypeError(TYPE_ERROR(operand, int64));

  Int64 *b = ObjectWrap::Unwrap<Int64>(info[0].As<v8::Object>());

  if (a->sign)
    a->n = (int64_t)a->n ^ (int64_t)b->n;
  else
    a->n ^= b->n;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(Int64::Ixorn) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(ixorn, 1));

  if (!info[0]->IsNumber())
    return Nan::ThrowTypeError(TYPE_ERROR(operand, number));

  uint32_t num = info[0]->Uint32Value();

  if (a->sign)
    a->n = (int64_t)a->n ^ (int64_t)((int32_t)num);
  else
    a->n ^= num;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(Int64::Inot) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  a->n = ~a->n;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(Int64::Ishln) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(ishln, 1));

  if (!info[0]->IsNumber())
    return Nan::ThrowTypeError(TYPE_ERROR(bits, number));

  uint32_t bits = info[0]->Uint32Value() & 63;

  if (a->sign)
    a->n = (int64_t)a->n << bits;
  else
    a->n <<= bits;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(Int64::Ishrn) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(ishrn, 1));

  if (!info[0]->IsNumber())
    return Nan::ThrowTypeError(TYPE_ERROR(bits, number));

  uint32_t bits = info[0]->Uint32Value() & 63;

  if (a->sign)
    a->n = (int64_t)a->n >> bits;
  else
    a->n >>= bits;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(Int64::Iushrn) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(ushrn, 1));

  if (!info[0]->IsNumber())
    return Nan::ThrowTypeError(TYPE_ERROR(bits, number));

  uint32_t bits = info[0]->Uint32Value() & 63;

  a->n >>= bits;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(Int64::Setn) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 2)
    return Nan::ThrowError(ARG_ERROR(setn, 2));

  if (!info[0]->IsNumber())
    return Nan::ThrowTypeError(TYPE_ERROR(bit, number));

  if (!info[1]->IsNumber() && !info[1]->IsBoolean())
    return Nan::ThrowTypeError(TYPE_ERROR(val, number));

  uint32_t bit = info[0]->Uint32Value() & 63;
  bool val = info[1]->BooleanValue();

  if (val)
    a->n |= (1ull << bit);
  else
    a->n &= ~(1ull << bit);

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(Int64::Testn) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(testn, 1));

  if (!info[0]->IsNumber())
    return Nan::ThrowTypeError(TYPE_ERROR(bit, number));

  uint32_t bit = info[0]->Uint32Value() & 63;
  int32_t r = 0;

  if ((a->n & (1ull << bit)) != 0)
    r = 1;

  info.GetReturnValue().Set(Nan::New<v8::Int32>(r));
}

NAN_METHOD(Int64::Imaskn) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(imaskn, 1));

  if (!info[0]->IsNumber())
    return Nan::ThrowTypeError(TYPE_ERROR(bit, number));

  uint32_t bit = info[0]->Uint32Value() & 63;

  a->n &= (1ull << bit) - 1;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(Int64::Ineg) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  a->n = ~a->n + 1;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(Int64::Cmp) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(cmp, 1));

  if (!Int64::HasInstance(info[0]))
    return Nan::ThrowTypeError(TYPE_ERROR(value, int64));

  Int64 *b = ObjectWrap::Unwrap<Int64>(info[0].As<v8::Object>());
  int32_t r = 0;

  if (a->sign) {
    if ((int64_t)a->n < (int64_t)b->n)
      r = -1;
    else if ((int64_t)a->n > (int64_t)b->n)
      r = 1;
  } else {
    if (a->n < b->n)
      r = -1;
    else if (a->n > b->n)
      r = 1;
  }

  info.GetReturnValue().Set(Nan::New<v8::Int32>(r));
}

NAN_METHOD(Int64::Cmpn) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(cmpn, 1));

  if (!info[0]->IsNumber())
    return Nan::ThrowTypeError(TYPE_ERROR(value, number));

  uint32_t num = info[0]->Uint32Value();
  int32_t r = 0;

  if (a->sign) {
    if ((int64_t)a->n < (int64_t)((int32_t)num))
      r = -1;
    else if ((int64_t)a->n > (int64_t)((int32_t)num))
      r = 1;
  } else {
    if (a->n < (uint64_t)num)
      r = -1;
    else if (a->n > (uint64_t)num)
      r = 1;
  }

  info.GetReturnValue().Set(Nan::New<v8::Int32>(r));
}

NAN_METHOD(Int64::Eq) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(eq, 1));

  if (!Int64::HasInstance(info[0]))
    return Nan::ThrowTypeError(TYPE_ERROR(value, int64));

  Int64 *b = ObjectWrap::Unwrap<Int64>(info[0].As<v8::Object>());
  bool r = false;

  if (a->n == b->n)
    r = true;

  info.GetReturnValue().Set(Nan::New<v8::Boolean>(r));
}

NAN_METHOD(Int64::Eqn) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(eqn, 1));

  if (!info[0]->IsNumber())
    return Nan::ThrowTypeError(TYPE_ERROR(value, number));

  uint32_t num = info[0]->Uint32Value();
  bool r = false;

  if (a->sign) {
    if ((int64_t)a->n == (int64_t)((int32_t)num))
      r = true;
  } else {
    if (a->n == (uint64_t)num)
      r = true;
  }

  info.GetReturnValue().Set(Nan::New<v8::Boolean>(r));
}

NAN_METHOD(Int64::IsZero) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());
  bool r = false;

  if (a->n == 0)
    r = true;

  info.GetReturnValue().Set(Nan::New<v8::Boolean>(r));
}

NAN_METHOD(Int64::IsNeg) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());
  bool r = false;

  if (a->sign && (int64_t)a->n < 0)
    r = true;

  info.GetReturnValue().Set(Nan::New<v8::Boolean>(r));
}

NAN_METHOD(Int64::IsOdd) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());
  bool r = false;

  if ((a->n & 1) == 1)
    r = true;

  info.GetReturnValue().Set(Nan::New<v8::Boolean>(r));
}

NAN_METHOD(Int64::IsEven) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());
  bool r = false;

  if ((a->n & 1) == 0)
    r = true;

  info.GetReturnValue().Set(Nan::New<v8::Boolean>(r));
}

NAN_METHOD(Int64::Clone) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());
  v8::Local<v8::FunctionTemplate> ctor =
    Nan::New<v8::FunctionTemplate>(int64_constructor);
  Nan::MaybeLocal<v8::Object> maybeInstance;
  v8::Local<v8::Object> instance;

  maybeInstance = Nan::NewInstance(ctor->GetFunction(), 0, NULL);

  if (maybeInstance.IsEmpty())
    return Nan::ThrowError("Could not create Int64 instance.");

  instance = maybeInstance.ToLocalChecked();
  Int64 *b = ObjectWrap::Unwrap<Int64>(instance);

  b->n = a->n;
  b->sign = a->sign;

  info.GetReturnValue().Set(instance);
}

NAN_METHOD(Int64::Inject) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(inject, 1));

  if (!Int64::HasInstance(info[0]))
    return Nan::ThrowTypeError(TYPE_ERROR(value, int64));

  Int64 *b = ObjectWrap::Unwrap<Int64>(info[0].As<v8::Object>());

  a->n = b->n;
  a->sign = b->sign;
}

NAN_METHOD(Int64::Set) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(set, 1));

  if (!info[0]->IsNumber())
    return Nan::ThrowTypeError(TYPE_ERROR(number, integer));

  int64_t n = info[0]->IntegerValue();

  if (info[0]->NumberValue() != (double)n)
    return Nan::ThrowTypeError(TYPE_ERROR(number, integer));

  if (n < -MAX_SAFE_INTEGER || n > MAX_SAFE_INTEGER)
    return Nan::ThrowError("Number exceeds 53 bits.");

  a->n = (uint64_t)n;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(Int64::Join) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 2)
    return Nan::ThrowError(ARG_ERROR(join, 2));

  if (!info[0]->IsNumber())
    return Nan::ThrowTypeError(TYPE_ERROR(hi, number));

  if (!info[1]->IsNumber())
    return Nan::ThrowTypeError(TYPE_ERROR(lo, number));

  uint32_t hi = info[0]->Uint32Value();
  uint32_t lo = info[1]->Uint32Value();

  a->n = ((uint64_t)hi << 32) | lo;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(Int64::BitLength) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());
  int32_t bit;
  uint64_t n = a->n;

  if (a->sign && (int64_t)a->n < 0)
    n = ~n + 1;

  for (bit = 63; bit >= 0; bit--) {
    if ((n & (1ull << bit)) != 0)
      break;
  }

  info.GetReturnValue().Set(Nan::New<v8::Int32>(bit + 1));
}

NAN_METHOD(Int64::IsSafe) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());
  bool r = true;

  if (a->sign) {
    if ((int64_t)a->n > MAX_SAFE_INTEGER
        || (int64_t)a->n < -MAX_SAFE_INTEGER) {
      r = false;
    }
  } else {
    if (a->n > (uint64_t)MAX_SAFE_INTEGER)
      r = false;
  }

  info.GetReturnValue().Set(Nan::New<v8::Boolean>(r));
}

NAN_METHOD(Int64::ToNumber) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());
  double r = 0;

  if (a->sign) {
    if ((int64_t)a->n > MAX_SAFE_INTEGER
        || (int64_t)a->n < -MAX_SAFE_INTEGER) {
      return Nan::ThrowError("Number exceeds 53 bits.");
    }
    r = (double)((int64_t)a->n);
  } else {
    if (a->n > (uint64_t)MAX_SAFE_INTEGER)
      return Nan::ThrowError("Number exceeds 53 bits.");
    r = (double)a->n;
  }

  info.GetReturnValue().Set(Nan::New<v8::Number>(r));
}

NAN_METHOD(Int64::ToDouble) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());
  double r = 0;

  if (a->sign)
    r = (double)((int64_t)a->n);
  else
    r = (double)a->n;

  info.GetReturnValue().Set(Nan::New<v8::Number>(r));
}

NAN_METHOD(Int64::ToInt) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());
  double r = 0;

  if (a->sign)
    r = (double)((int32_t)a->n);
  else
    r = (double)((uint32_t)a->n);

  info.GetReturnValue().Set(Nan::New<v8::Number>(r));
}

NAN_METHOD(Int64::ToString) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  int32_t base = 10;

  if (info.Length() > 0 && !IsNull(info[0])) {
    if (!info[0]->IsNumber())
      return Nan::ThrowTypeError(TYPE_ERROR(base, integer));

    base = info[0]->Int32Value();

    if (info[0]->NumberValue() != (double)base)
      return Nan::ThrowTypeError(TYPE_ERROR(base, integer));
  }

  uint64_t n = a->n;
  bool neg = false;

  if (a->sign && (int64_t)a->n < 0) {
    neg = true;
    n = ~n + 1;
  }

  size_t size = 64;
  char str_[66];
  char *str = (char *)str_ + 1;

  if (base == 2) {
    int32_t bit;
    int32_t i = 0;
    int32_t j = -1;

    for (bit = 63; bit >= 0; bit--) {
      if ((n & (1ull << bit)) != 0) {
        if (j == -1)
          j = i;
        str[i++] = '1';
      } else {
        str[i++] = '0';
      }
    }

    str[i] = '\0';

    if (j != -1) {
      str += j;
      size -= j;
    } else {
      str = (str + i) - 1;
      size = 1;
    }
  } else {
    char *fmt = NULL;

    switch (base) {
      case 8:
        size = 22;
        fmt = "%" PRIo64;
        break;
      case 10:
        size = 20;
        fmt = "%" PRIu64;
        break;
      case 16:
        size = 16;
        fmt = "%" PRIx64;
        break;
      default:
        return Nan::ThrowError("Base ranges between 2 and 16.");
    }

    int32_t r = snprintf((char *)str, size + 1, (const char *)fmt, n);

    if (r < 0)
      return Nan::ThrowError("Could not serialize string.");

    size = r;
  }

  if (neg) {
    *(--str) = '-';
    size++;
  }

  info.GetReturnValue().Set(
    Nan::New<v8::String>((char *)str, size).ToLocalChecked());
}

NAN_METHOD(Int64::FromNumber) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(fromNumber, 1));

  if (!info[0]->IsNumber())
    return Nan::ThrowTypeError(TYPE_ERROR(number, integer));

  if (info.Length() > 1 && !IsNull(info[1])) {
    if (!info[1]->IsBoolean())
      return Nan::ThrowTypeError(TYPE_ERROR(signed, boolean));
    a->sign = info[1]->BooleanValue();
  } else {
    a->sign = false;
  }

  int64_t n = info[0]->IntegerValue();

  if (info[0]->NumberValue() != (double)n)
    return Nan::ThrowTypeError(TYPE_ERROR(number, integer));

  if (n < -MAX_SAFE_INTEGER || n > MAX_SAFE_INTEGER)
    return Nan::ThrowError("Number exceeds 53 bits.");

  a->n = (uint64_t)n;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(Int64::FromInt) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(fromInt, 1));

  if (!info[0]->IsNumber())
    return Nan::ThrowTypeError(TYPE_ERROR(integer, number));

  if (info.Length() > 1 && !IsNull(info[1])) {
    if (!info[1]->IsBoolean())
      return Nan::ThrowTypeError(TYPE_ERROR(signed, boolean));
    a->sign = info[1]->BooleanValue();
  } else {
    a->sign = false;
  }

  uint32_t num = info[0]->Uint32Value();

  if (a->sign)
    a->n = (uint64_t)((int64_t)((int32_t)num));
  else
    a->n = (uint64_t)num;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(Int64::FromBits) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 2)
    return Nan::ThrowError(ARG_ERROR(fromBits, 2));

  if (!info[0]->IsNumber())
    return Nan::ThrowTypeError(TYPE_ERROR(hi, number));

  if (!info[1]->IsNumber())
    return Nan::ThrowTypeError(TYPE_ERROR(lo, number));

  if (info.Length() > 2 && !IsNull(info[2])) {
    if (!info[2]->IsBoolean())
      return Nan::ThrowTypeError(TYPE_ERROR(signed, boolean));
    a->sign = info[2]->BooleanValue();
  } else {
    a->sign = false;
  }

  uint32_t hi = info[0]->Uint32Value();
  uint32_t lo = info[1]->Uint32Value();

  a->n = ((uint64_t)hi << 32) | lo;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(Int64::FromString) {
  Int64 *a = ObjectWrap::Unwrap<Int64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(fromString, 1));

  if (!info[0]->IsString())
    return Nan::ThrowTypeError(TYPE_ERROR(string, string));

  Nan::Utf8String str_(info[0]);

  char *start = *str_;
  size_t len = str_.length();

  bool neg = false;

  if (*start == '-') {
    neg = true;
    start++;
    len--;
  }

  if (len == 0 || len > 64)
    return Nan::ThrowError("Invalid string (bad length).");

  bool sign = false;

  if (info.Length() > 1 && !IsNull(info[1])) {
    if (!info[1]->IsBoolean())
      return Nan::ThrowTypeError(TYPE_ERROR(signed, boolean));
    sign = info[1]->BooleanValue();
  }

  int32_t base = 10;

  if (info.Length() > 2 && !IsNull(info[2])) {
    if (!info[2]->IsNumber())
      return Nan::ThrowTypeError(TYPE_ERROR(base, integer));

    base = info[2]->Int32Value();

    if (info[2]->NumberValue() != (double)base)
      return Nan::ThrowTypeError(TYPE_ERROR(base, integer));
  }

  switch (base) {
    case 2:
    case 8:
    case 10:
    case 16:
      break;
    default:
      return Nan::ThrowError("Base ranges between 2 and 16.");
  }

  errno = 0;

  char *end = NULL;
  uint64_t n = strtoull((const char *)start, &end, base);

  if (errno == ERANGE && n == ULLONG_MAX)
    return Nan::ThrowError("Invalid string (overflow).");

  if (errno != 0 && n == 0)
    return Nan::ThrowError("Invalid string (parse error).");

  if (end == start)
    return Nan::ThrowError("Invalid string (no digits).");

  a->n = n;
  a->sign = sign;

  if (neg)
    a->n = ~n + 1;

  info.GetReturnValue().Set(info.Holder());
}

NAN_INLINE static bool IsNull(v8::Local<v8::Value> obj) {
  Nan::HandleScope scope;
  return obj->IsNull() || obj->IsUndefined();
}
