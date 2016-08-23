import test from 'ava';
import alfyTest from 'alfy-test';

test.beforeEach(t => {
	t.context.alfy = alfyTest();
});

test(async t => {
	const result = await t.context.alfy('Rainbow');

	t.deepEqual(result, [
		{
			title: 'Unicorn',
			subtitle: 'Rainbow'
		}
	]);
});
