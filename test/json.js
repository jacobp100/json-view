/* globals describe it */

import * as assert from 'assert';
import { parse } from '../src/json';

const assertParse = (input) => {
  const { error, value } = parse(input);
  assert.strictEqual(error, null, `Error for input ${input}`);
  const expected = JSON.parse(input);
  assert.deepStrictEqual(value, expected, `No value for input ${input}`);
};

const assertFailsWithNoValue = (input) => {
  const { error, value } = parse(input);
  assert.ok(error, `No error for input ${input}`);
  assert.strictEqual(value, undefined, `Got value for input ${input}`);
};

const assertFailsWithRecovery = ([input, expected]) => {
  const { error, value } = parse(input);
  assert.ok(error, `For input ${input}`);
  assert.deepStrictEqual(value, expected, `For input ${input}`);
};

describe('json', () => {
  describe('parse is consistent with native JSON parse', () => {
    it('parses null', () => {
      ['null'].forEach(assertParse);
    });

    it('parses booleans', () => {
      ['true', 'false'].forEach(assertParse);
    });

    it('parses numbers', () => {
      [
        '0', '5', '50', '500', '5.00', '5.12', '0.12', '1E2', '1E20', '1E0', '1E-0', '-0', '-5',
        '-5.00', '-5.12', '-0.12', '-1E2', '-1E20', '-1E0', '-1E-0',
      ].forEach(assertParse);
    });

    it('parses strings', () => {
      ['"test"', '"\'"', '"\\""', '"\\\\"'].forEach(assertParse);
    });

    it('parses arrays', () => {
      [
        '[]', '[null]', '[true]', '["test"]', '[5]', '[[]]', '[{}]', '[1,2,3]',
      ].forEach(assertParse);
    });

    it('parses objects', () => {
      [
        '{}', '{ "test": null }', '{ "test": true }', '{ "test": "test" }', '{ "test": 5 }',
        '{ "a": 1, "b": 2, "c": 3 }', '{ "a": {} }',
      ].forEach(assertParse);
    });
  });

  describe('parse throws for', () => {
    it('invalid numbers', () => {
      ['00', '1E0.5', '-'].forEach(assertFailsWithNoValue);
    });

    it('invalid strings', () => {
      ['"\\\\""', '"test'].forEach(assertFailsWithNoValue);
    });
  });

  describe('parse throws for, but partially parses', () => {
    it('invalid arrays', () => {
      [
        ['[,]', []],
        ['[1,]', [1]],
        ['[1,2,]', [1, 2]],
        ['{ "test": [1,2,] }', { test: [1, 2] }],
      ].forEach(assertFailsWithRecovery);
    });

    it('invalid objects', () => {
      [
        ['{,}', {}],
        ['{ 5 }', {}],
        ['{ "a }', {}],
        ['{ "a" }', {}],
        ['{ "a": }', {}],
        ['{ "a" 5 }', {}],
        ['{ "a": 5, }', { a: 5 }],
        ['{ "a": 5, " }', { a: 5 }],
        ['{ "a": 5 " }', { a: 5 }],
        ['{ "a": 5 5 }', { a: 5 }],
        ['{ "a": 5 : }', { a: 5 }],
        ['{ "a": 5, "b }', { a: 5 }],
        ['{ "a": 5, "b" }', { a: 5 }],
        ['{ "a": 5, "b": }', { a: 5 }],
        ['{ "a": 5, "b": 5, }', { a: 5, b: 5 }],
        ['[{ "a": 5, "b": 5, }]', [{ a: 5, b: 5 }]],
      ].forEach(assertFailsWithRecovery);
    });
  });
});
