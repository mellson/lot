/* Copyright © 2023 Exact Realty Limited.
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 * OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

if (typeof __buildtimeSettings__ !== 'object')
	Reflect.set(globalThis, '__buildtimeSettings__', {});

Reflect.set(__buildtimeSettings__, 'hardenGlobals', true);

import assert from 'node:assert/strict';
import hardenGlobals, { disableURLStaticMethods } from './hardenGlobals.js';

describe('Hardened functions', () => {
	describe('hardenGlobals', () => {
		before(() => {
			hardenGlobals();
		});

		it('should make eval inert', () => {
			assert.throws(() => {
				eval('2 + 2');
			}, /call to eval\(\) blocked by CSP/);
		});

		it('should make Function inert', () => {
			assert.throws(() => {
				Function('2 + 2');
			}, /call to Function\(\) blocked by CSP/);
		});

		it('should make (()=>{}).constructor inert', () => {
			assert.throws(() => {
				(() => {}).constructor('2 + 2');
			}, /call to Function\(\) blocked by CSP/);
		});

		it('should make (async ()=>{}).constructor inert', () => {
			assert.throws(() => {
				(async () => {}).constructor('2 + 2');
			}, /call to Function\(\) blocked by CSP/);
		});

		it('should make (function* () {}).constructor inert', () => {
			assert.throws(() => {
				(function* () {}).constructor('2 + 2');
			}, /call to Function\(\) blocked by CSP/);
		});

		it('should make (async function* () {}).constructor inert', () => {
			assert.throws(() => {
				(async function* () {}).constructor('2 + 2');
			}, /call to Function\(\) blocked by CSP/);
		});

		it('should make setTimeout only accept functions as callbacks', () => {
			assert.throws(() => {
				setTimeout('console.log("hi")', 1000);
			}, /call to eval\(\) blocked by CSP/);
		});

		it('should make setInterval only accept functions as callbacks', () => {
			assert.throws(() => {
				setInterval('console.log("hi")', 1000);
			}, /call to eval\(\) blocked by CSP/);
		});
	});

	describe('disableURLStaticMethods', () => {
		before(() => {
			disableURLStaticMethods();
		});

		it('should replace URL.createObjectURL', () => {
			const obj = new Blob([]);
			const result = URL.createObjectURL(obj);
			assert.equal(typeof result, 'string');
		});

		it('should replace URL.revokeObjectURL', () => {
			const result = URL.revokeObjectURL('test');
			assert.equal(result, undefined);
		});
	});
});