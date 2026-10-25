'use strict';

var globals = require('globals');

// Funkcije, ki jih brskalnik PS4 morda nima (novejše od ES5).
var es5Properties = [
  { object: 'Object', property: 'assign', message: 'Ni ES5.' },
  { object: 'Object', property: 'entries', message: 'Ni ES5.' },
  { object: 'Object', property: 'values', message: 'Ni ES5.' },
  { object: 'Array', property: 'from', message: 'Ni ES5.' },
  { object: 'Array', property: 'of', message: 'Ni ES5.' },
  { object: 'Number', property: 'isNaN', message: 'Ni ES5, uporabi isNaN.' },
  { object: 'Number', property: 'isFinite', message: 'Ni ES5, uporabi isFinite.' },
  { object: 'Math', property: 'sign', message: 'Ni ES5.' },
  { object: 'Math', property: 'trunc', message: 'Ni ES5.' }
];

var es5Globals = [
  { name: 'Promise', message: 'Ni ES5.' },
  { name: 'Map', message: 'Ni ES5.' },
  { name: 'Set', message: 'Ni ES5.' },
  { name: 'WeakMap', message: 'Ni ES5.' },
  { name: 'Symbol', message: 'Ni ES5.' }
];

var commonRules = {
  'no-undef': 'error',
  'no-unused-vars': ['error', { args: 'none', caughtErrors: 'none' }],
  'no-redeclare': 'error',
  'no-restricted-properties': ['error'].concat(es5Properties),
  'no-restricted-globals': ['error'].concat(es5Globals),
  'eqeqeq': ['error', 'always'],
  'strict': ['error', 'function']
};

// Dvojni izvoz: module/require samo v Node.js (testi), PinPin v brskalniku.
var dualExportGlobals = {
  module: 'readonly',
  require: 'readonly'
};

module.exports = [
  {
    ignores: ['node_modules/**', 'src/graphic/**']
  },
  {
    // config in core: čisti podatki in pravila, brez API-jev brskalnika
    files: ['src/js/pinpin.js', 'src/js/config/**/*.js', 'src/js/core/**/*.js'],
    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'script',
      globals: dualExportGlobals
    },
    rules: commonRules
  },
  {
    // platform, render, app: brskalnik
    files: ['src/js/platform/**/*.js', 'src/js/render/**/*.js', 'src/js/app/**/*.js'],
    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'script',
      globals: globals.browser
    },
    rules: commonRules
  },
  {
    // orodja in testi tečejo v Node.js
    files: ['eslint.config.js', 'test/**/*.js', 'tools/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: globals.node
    },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': ['error', { args: 'none' }]
    }
  }
];
