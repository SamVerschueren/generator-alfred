import test from 'ava';
import {generateUuid} from '../app/utils';

test('remembers UUIDs by key', t => {
	const foo1 = generateUuid('foo');
	const foo2 = generateUuid('foo');
	const bar = generateUuid('bar');

	t.is(foo1, foo2);
	t.not(foo1, bar);
});
