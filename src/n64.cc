/**
 * n64.cc - native int64 object for node.js.
 * Copyright (c) 2017, Christopher Jeffrey (MIT License)
 */

#include <node.h>
#include <nan.h>

#include <cmath>
#include <inttypes.h>
#include <stdlib.h>

#include "n64.h"

#define ARG_ERROR(name, len) ("N64#" #name " requires " #len " argument(s).")
#define TYPE_ERROR(name, type) ("`" #name "` must be a(n) " #type ".")

static Nan::Persistent<v8::FunctionTemplate> int64_constructor;

NAN_INLINE static bool IsNull(v8::Local<v8::Value> options);

static int64_t MAX_SAFE_INTEGER = 0x1fffffffffffff;

N64::N64() {
  n = 0;
  sign = false;
}

N64::~N64() {}

void
N64::Init(v8::Local<v8::Object> &target) {
  Nan::HandleScope scope;

  v8::Local<v8::FunctionTemplate> tpl =
    Nan::New<v8::FunctionTemplate>(N64::New);

  int64_constructor.Reset(tpl);

  tpl->SetClassName(Nan::New("N64").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  Nan::SetPrototypeMethod(tpl, "getHi", N64::GetHi);
  Nan::SetPrototypeMethod(tpl, "setHi", N64::SetHi);
  Nan::SetPrototypeMethod(tpl, "getLo", N64::GetLo);
  Nan::SetPrototypeMethod(tpl, "setLo", N64::SetLo);
  Nan::SetPrototypeMethod(tpl, "iadd", N64::Iadd);
  Nan::SetPrototypeMethod(tpl, "iaddn", N64::Iaddn);
  Nan::SetPrototypeMethod(tpl, "isub", N64::Isub);
  Nan::SetPrototypeMethod(tpl, "isubn", N64::Isubn);
  Nan::SetPrototypeMethod(tpl, "imul", N64::Imul);
  Nan::SetPrototypeMethod(tpl, "imuln", N64::Imuln);
  Nan::SetPrototypeMethod(tpl, "idiv", N64::Idiv);
  Nan::SetPrototypeMethod(tpl, "idivn", N64::Idivn);
  Nan::SetPrototypeMethod(tpl, "imod", N64::Imod);
  Nan::SetPrototypeMethod(tpl, "imodn", N64::Imodn);
  Nan::SetPrototypeMethod(tpl, "ipown", N64::Ipown);
  Nan::SetPrototypeMethod(tpl, "iand", N64::Iand);
  Nan::SetPrototypeMethod(tpl, "iandn", N64::Iandn);
  Nan::SetPrototypeMethod(tpl, "ior", N64::Ior);
  Nan::SetPrototypeMethod(tpl, "iorn", N64::Iorn);
  Nan::SetPrototypeMethod(tpl, "ixor", N64::Ixor);
  Nan::SetPrototypeMethod(tpl, "inot", N64::Inot);
  Nan::SetPrototypeMethod(tpl, "ixorn", N64::Ixorn);
  Nan::SetPrototypeMethod(tpl, "ishln", N64::Ishln);
  Nan::SetPrototypeMethod(tpl, "ishrn", N64::Ishrn);
  Nan::SetPrototypeMethod(tpl, "iushrn", N64::Iushrn);
  Nan::SetPrototypeMethod(tpl, "setn", N64::Setn);
  Nan::SetPrototypeMethod(tpl, "testn", N64::Testn);
  Nan::SetPrototypeMethod(tpl, "imaskn", N64::Imaskn);
  Nan::SetPrototypeMethod(tpl, "ineg", N64::Ineg);
  Nan::SetPrototypeMethod(tpl, "cmp", N64::Cmp);
  Nan::SetPrototypeMethod(tpl, "cmpn", N64::Cmpn);
  Nan::SetPrototypeMethod(tpl, "eq", N64::Eq);
  Nan::SetPrototypeMethod(tpl, "eqn", N64::Eqn);
  Nan::SetPrototypeMethod(tpl, "isZero", N64::IsZero);
  Nan::SetPrototypeMethod(tpl, "isNeg", N64::IsNeg);
  Nan::SetPrototypeMethod(tpl, "isOdd", N64::IsOdd);
  Nan::SetPrototypeMethod(tpl, "isEven", N64::IsEven);
  Nan::SetPrototypeMethod(tpl, "inject", N64::Inject);
  Nan::SetPrototypeMethod(tpl, "set", N64::Set);
  Nan::SetPrototypeMethod(tpl, "join", N64::Join);
  Nan::SetPrototypeMethod(tpl, "bitLength", N64::BitLength);
  Nan::SetPrototypeMethod(tpl, "isSafe", N64::IsSafe);
  Nan::SetPrototypeMethod(tpl, "toNumber", N64::ToNumber);
  Nan::SetPrototypeMethod(tpl, "toDouble", N64::ToDouble);
  Nan::SetPrototypeMethod(tpl, "toInt", N64::ToInt);
  Nan::SetPrototypeMethod(tpl, "toString", N64::ToString);
  Nan::SetPrototypeMethod(tpl, "fromNumber", N64::FromNumber);
  Nan::SetPrototypeMethod(tpl, "fromInt", N64::FromInt);
  Nan::SetPrototypeMethod(tpl, "fromBits", N64::FromBits);
  Nan::SetPrototypeMethod(tpl, "fromString", N64::FromString);

  v8::Local<v8::FunctionTemplate> ctor =
    Nan::New<v8::FunctionTemplate>(int64_constructor);

  target->Set(Nan::New("N64").ToLocalChecked(), ctor->GetFunction());
}

bool N64::HasInstance(v8::Local<v8::Value> val) {
  Nan::HandleScope scope;
  return Nan::New(int64_constructor)->HasInstance(val);
}

NAN_METHOD(N64::New) {
  if (!info.IsConstructCall())
    return Nan::ThrowError("N64 must be called with `new`.");

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(New, 1));

  if (!info[0]->IsBoolean())
    return Nan::ThrowTypeError(TYPE_ERROR(signed, boolean));

  N64 *obj = new N64();

  obj->sign = info[0]->BooleanValue();
  obj->Wrap(info.This());

  info.GetReturnValue().Set(info.This());
}

NAN_METHOD(N64::GetHi) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

  int32_t hi = (int32_t)(a->n >> 32);

  info.GetReturnValue().Set(Nan::New<v8::Int32>(hi));
}

NAN_METHOD(N64::SetHi) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(setHi, 1));

  if (!info[0]->IsNumber())
    return Nan::ThrowTypeError(TYPE_ERROR(hi, number));

  uint32_t hi = info[0]->Uint32Value();

  a->n = ((uint64_t)hi << 32) | (a->n & 0xffffffff);

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(N64::GetLo) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

  int32_t lo = (int32_t)(a->n & 0xffffffff);

  info.GetReturnValue().Set(Nan::New<v8::Int32>(lo));
}

NAN_METHOD(N64::SetLo) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(setLo, 1));

  if (!info[0]->IsNumber())
    return Nan::ThrowTypeError(TYPE_ERROR(lo, number));

  uint32_t lo = info[0]->Uint32Value();

  a->n &= ~0xffffffff;
  a->n |= lo;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(N64::Iadd) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(iadd, 1));

  if (!N64::HasInstance(info[0]))
    return Nan::ThrowTypeError(TYPE_ERROR(operand, int64));

  N64 *b = ObjectWrap::Unwrap<N64>(info[0].As<v8::Object>());

  if (a->sign)
    a->n = (int64_t)a->n + (int64_t)b->n;
  else
    a->n += b->n;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(N64::Iaddn) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

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

NAN_METHOD(N64::Isub) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(isub, 1));

  if (!N64::HasInstance(info[0]))
    return Nan::ThrowTypeError(TYPE_ERROR(operand, int64));

  N64 *b = ObjectWrap::Unwrap<N64>(info[0].As<v8::Object>());

  if (a->sign)
    a->n = (int64_t)a->n - (int64_t)b->n;
  else
    a->n -= b->n;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(N64::Isubn) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

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

NAN_METHOD(N64::Imul) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(imul, 1));

  if (!N64::HasInstance(info[0]))
    return Nan::ThrowTypeError(TYPE_ERROR(multiplicand, int64));

  N64 *b = ObjectWrap::Unwrap<N64>(info[0].As<v8::Object>());

  if (a->sign)
    a->n = (int64_t)a->n * (int64_t)b->n;
  else
    a->n *= b->n;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(N64::Imuln) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

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

NAN_METHOD(N64::Idiv) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(idiv, 1));

  if (!N64::HasInstance(info[0]))
    return Nan::ThrowTypeError(TYPE_ERROR(divisor, int64));

  N64 *b = ObjectWrap::Unwrap<N64>(info[0].As<v8::Object>());

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

NAN_METHOD(N64::Idivn) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

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

NAN_METHOD(N64::Imod) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(imod, 1));

  if (!N64::HasInstance(info[0]))
    return Nan::ThrowTypeError(TYPE_ERROR(divisor, int64));

  N64 *b = ObjectWrap::Unwrap<N64>(info[0].As<v8::Object>());

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

NAN_METHOD(N64::Imodn) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

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

NAN_METHOD(N64::Ipown) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

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

NAN_METHOD(N64::Iand) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(iand, 1));

  if (!N64::HasInstance(info[0]))
    return Nan::ThrowTypeError(TYPE_ERROR(operand, int64));

  N64 *b = ObjectWrap::Unwrap<N64>(info[0].As<v8::Object>());

  if (a->sign)
    a->n = (int64_t)a->n & (int64_t)b->n;
  else
    a->n &= b->n;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(N64::Iandn) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

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

NAN_METHOD(N64::Ior) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(ior, 1));

  if (!N64::HasInstance(info[0]))
    return Nan::ThrowTypeError(TYPE_ERROR(operand, int64));

  N64 *b = ObjectWrap::Unwrap<N64>(info[0].As<v8::Object>());

  if (a->sign)
    a->n = (int64_t)a->n | (int64_t)b->n;
  else
    a->n |= b->n;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(N64::Iorn) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

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

NAN_METHOD(N64::Ixor) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(ixor, 1));

  if (!N64::HasInstance(info[0]))
    return Nan::ThrowTypeError(TYPE_ERROR(operand, int64));

  N64 *b = ObjectWrap::Unwrap<N64>(info[0].As<v8::Object>());

  if (a->sign)
    a->n = (int64_t)a->n ^ (int64_t)b->n;
  else
    a->n ^= b->n;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(N64::Ixorn) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

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

NAN_METHOD(N64::Inot) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

  a->n = ~a->n;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(N64::Ishln) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

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

NAN_METHOD(N64::Ishrn) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

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

NAN_METHOD(N64::Iushrn) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(ushrn, 1));

  if (!info[0]->IsNumber())
    return Nan::ThrowTypeError(TYPE_ERROR(bits, number));

  uint32_t bits = info[0]->Uint32Value() & 63;

  a->n >>= bits;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(N64::Setn) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

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

NAN_METHOD(N64::Testn) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

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

NAN_METHOD(N64::Imaskn) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(imaskn, 1));

  if (!info[0]->IsNumber())
    return Nan::ThrowTypeError(TYPE_ERROR(bit, number));

  uint32_t bit = info[0]->Uint32Value() & 63;

  a->n &= (1ull << bit) - 1;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(N64::Ineg) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

  a->n = ~a->n + 1;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(N64::Cmp) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(cmp, 1));

  if (!N64::HasInstance(info[0]))
    return Nan::ThrowTypeError(TYPE_ERROR(value, int64));

  N64 *b = ObjectWrap::Unwrap<N64>(info[0].As<v8::Object>());
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

NAN_METHOD(N64::Cmpn) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

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

NAN_METHOD(N64::Eq) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(eq, 1));

  if (!N64::HasInstance(info[0]))
    return Nan::ThrowTypeError(TYPE_ERROR(value, int64));

  N64 *b = ObjectWrap::Unwrap<N64>(info[0].As<v8::Object>());
  bool r = false;

  if (a->n == b->n)
    r = true;

  info.GetReturnValue().Set(Nan::New<v8::Boolean>(r));
}

NAN_METHOD(N64::Eqn) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

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

NAN_METHOD(N64::IsZero) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());
  bool r = false;

  if (a->n == 0)
    r = true;

  info.GetReturnValue().Set(Nan::New<v8::Boolean>(r));
}

NAN_METHOD(N64::IsNeg) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());
  bool r = false;

  if (a->sign && (int64_t)a->n < 0)
    r = true;

  info.GetReturnValue().Set(Nan::New<v8::Boolean>(r));
}

NAN_METHOD(N64::IsOdd) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());
  bool r = false;

  if ((a->n & 1) == 1)
    r = true;

  info.GetReturnValue().Set(Nan::New<v8::Boolean>(r));
}

NAN_METHOD(N64::IsEven) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());
  bool r = false;

  if ((a->n & 1) == 0)
    r = true;

  info.GetReturnValue().Set(Nan::New<v8::Boolean>(r));
}

NAN_METHOD(N64::Inject) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(inject, 1));

  if (!N64::HasInstance(info[0]))
    return Nan::ThrowTypeError(TYPE_ERROR(value, int64));

  N64 *b = ObjectWrap::Unwrap<N64>(info[0].As<v8::Object>());

  a->n = b->n;
}

NAN_METHOD(N64::Set) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

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

NAN_METHOD(N64::Join) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

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

NAN_METHOD(N64::BitLength) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());
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

NAN_METHOD(N64::IsSafe) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());
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

NAN_METHOD(N64::ToNumber) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());
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

NAN_METHOD(N64::ToDouble) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());
  double r = 0;

  if (a->sign)
    r = (double)((int64_t)a->n);
  else
    r = (double)a->n;

  info.GetReturnValue().Set(Nan::New<v8::Number>(r));
}

NAN_METHOD(N64::ToInt) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());
  double r = 0;

  if (a->sign)
    r = (double)((int32_t)a->n);
  else
    r = (double)((uint32_t)a->n);

  info.GetReturnValue().Set(Nan::New<v8::Number>(r));
}

NAN_METHOD(N64::ToString) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

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

NAN_METHOD(N64::FromNumber) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(fromNumber, 1));

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

NAN_METHOD(N64::FromInt) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

  if (info.Length() < 1)
    return Nan::ThrowError(ARG_ERROR(fromInt, 1));

  if (!info[0]->IsNumber())
    return Nan::ThrowTypeError(TYPE_ERROR(integer, number));

  uint32_t num = info[0]->Uint32Value();

  if (a->sign)
    a->n = (uint64_t)((int64_t)((int32_t)num));
  else
    a->n = (uint64_t)num;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(N64::FromBits) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

  if (info.Length() < 2)
    return Nan::ThrowError(ARG_ERROR(fromBits, 2));

  if (!info[0]->IsNumber())
    return Nan::ThrowTypeError(TYPE_ERROR(hi, number));

  if (!info[1]->IsNumber())
    return Nan::ThrowTypeError(TYPE_ERROR(lo, number));

  uint32_t hi = info[0]->Uint32Value();
  uint32_t lo = info[1]->Uint32Value();

  a->n = ((uint64_t)hi << 32) | lo;

  info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(N64::FromString) {
  N64 *a = ObjectWrap::Unwrap<N64>(info.Holder());

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

  int32_t base = 10;

  if (info.Length() > 1 && !IsNull(info[1])) {
    if (!info[1]->IsNumber())
      return Nan::ThrowTypeError(TYPE_ERROR(base, integer));

    base = info[1]->Int32Value();

    if (info[1]->NumberValue() != (double)base)
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

  if (neg)
    a->n = ~n + 1;

  info.GetReturnValue().Set(info.Holder());
}

NAN_INLINE static bool IsNull(v8::Local<v8::Value> obj) {
  Nan::HandleScope scope;
  return obj->IsNull() || obj->IsUndefined();
}

NAN_MODULE_INIT(init) {
  N64::Init(target);
}

NODE_MODULE(n64, init)
