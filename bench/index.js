'use strict';

var bench = require('./bench');
var Native = require('../lib/native');
var Int64 = require('../lib/int64');
var BN = require('bn.js');

function addn(N, name) {
  var end = bench('addn (' + name + ')');
  var A = new BN(0);
  var i, j, a;

  for (i = 0; i < 1000000; i++) {
    a = A.clone();
    for (j = 0; j < 5; j++)
      a.iaddn(0x3ffffff);
  }

  end(i * 5);
}

function add(N, name) {
  var end = bench('add (' + name + ')');
  var A = new N(0);
  var B = new N(0x100000000);
  var i, j, a, b;

  for (i = 0; i < 1000000; i++) {
    a = A.clone();
    b = B.clone();
    for (j = 0; j < 5; j++)
      a.iadd(b);
  }

  end(i * 5);
}

function muln(N, name) {
  var end = bench('muln (' + name + ')');
  var A = new N(1);
  var i, j, a;

  for (i = 0; i < 1000000; i++) {
    a = A.clone();
    for (j = 0; j < 3; j++)
      a.imuln(0xffffff);
  }

  end(i * 3);
}

function mul(N, name) {
  var end = bench('mul (' + name + ')');
  var A = new N(0);
  var B = new N(0xffffff);
  var i, j, a, b;

  for (i = 0; i < 1000000; i++) {
    a = A.clone();
    b = B.clone();
    for (j = 0; j < 3; j++)
      a.imul(b);
  }

  end(i * 3);
}

function divn(N, name) {
  var end = bench('divn (' + name + ')');
  var A = new N('ffffffffffffffff', 16);
  var i, j, a;

  for (i = 0; i < 1000000; i++) {
    a = A.clone();
    for (j = 0; j < 2; j++)
      a.idivn(0xffffff);
  }

  end(i * 2);
}

function div(N, name) {
  var end = bench('div (' + name + ')');
  var A = new N('ffffffffffffffff', 16);
  var B = new N(0xffffff);
  var i, j, a, b;

  for (i = 0; i < 1000000; i++) {
    a = A.clone();
    b = B.clone();
    for (j = 0; j < 2; j++)
      a = a.div(b);
  }

  end(i * 2);
}

function modn(N, name) {
  var end = bench('modn (' + name + ')');
  var A = new N('ffffffffffffffff', 16);
  var i, j, a;

  if (!A.imodn)
    return;

  for (i = 0; i < 1000000; i++) {
    a = A.clone();
    for (j = 0; j < 2; j++)
      a.imodn(0xffffff);
  }

  end(i * 2);
}

function mod(N, name) {
  var end = bench('mod (' + name + ')');
  var A = new N('ffffffffffffffff', 16);
  var B = new N(0xffffff);
  var i, j, a, b;

  for (i = 0; i < 1000000; i++) {
    a = A.clone();
    b = B.clone();
    for (j = 0; j < 2; j++)
      a.mod(b);
  }

  end(i * 2);
}

function muldiv(N, name) {
  var end = bench('muldiv (' + name + ')');
  var n = new N(10);
  var ten = new N(10);
  var i;

  for (i = 0; i < 1000000; i++) {
    n.imul(ten);
    n = n.div(ten);
  }

  end(i * 2);
}

function muldivn(N, name) {
  var end = bench('muldivn (' + name + ')');
  var n = new N(10);
  var i;

  for (i = 0; i < 1000000; i++) {
    n.imuln(10);
    n.idivn(10);
  }

  end(i * 2);
}

function run() {
  addn(Int64, 'js');
  addn(Native, 'native');
  addn(BN, 'bn.js');

  console.log('--');

  add(Int64, 'js');
  add(Native, 'native');
  add(BN, 'bn.js');

  console.log('--');

  muln(Int64, 'js');
  muln(Native, 'native');
  muln(BN, 'bn.js');

  console.log('--');

  mul(Int64, 'js');
  mul(Native, 'native');
  mul(BN, 'bn.js');

  console.log('--');

  divn(Int64, 'js');
  divn(Native, 'native');
  divn(BN, 'bn.js');

  console.log('--');

  div(Int64, 'js');
  div(Native, 'native');
  div(BN, 'bn.js');

  console.log('--');

  modn(Int64, 'js');
  modn(Native, 'native');
  modn(BN, 'bn.js');

  console.log('--');

  mod(Int64, 'js');
  mod(Native, 'native');
  mod(BN, 'bn.js');

  console.log('--');

  muldiv(Int64, 'js');
  muldiv(Native, 'native');
  muldiv(BN, 'bn.js');

  console.log('--');

  muldivn(Int64, 'js');
  muldivn(Native, 'native');
  muldivn(BN, 'bn.js');
}

run();
