/**
 * n64.cc - native int64 object for node.js.
 * Copyright (c) 2017, Christopher Jeffrey (MIT License)
 */

#include <node.h>
#include <nan.h>

#include "int64.h"
#include "n64.h"

NAN_MODULE_INIT(init) {
  Int64::Init(target);
}

NODE_MODULE(n64, init)
