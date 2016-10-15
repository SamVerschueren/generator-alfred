import test from 'ava';
import alfyTest from 'alfy-test';

test(async t => {
	const alfy = alfyTest();
	const result = await alfy('Rainbow');

	t.deepEqual(result, [
		{
			title: 'Unicorn',
			subtitle: 'Rainbow'
		}
	]);
});
