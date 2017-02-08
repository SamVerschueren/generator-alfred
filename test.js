import path from 'path';
import test from 'ava';
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';
import pify from 'pify';
import tempfile from 'tempfile';

test.beforeEach(async t => {
	await pify(helpers.testDirectory)(tempfile());
	t.context.generator = helpers.createGenerator('alfred', [path.join(__dirname, 'app')], null, {skipInstall: true});
});

test.serial('generates expected files', async t => {
	const generator = t.context.generator;

	helpers.mockPrompt(generator, {
		moduleName: 'test',
		githubUsername: 'test',
		website: 'http://test.com'
	});

	await pify(generator.run.bind(generator))();

	assert.file([
		'.editorconfig',
		'.git',
		'.gitattributes',
		'.gitignore',
		'.travis.yml',
		'index.js',
		'license',
		'package.json',
		'readme.md',
		'test.js',
		'info.plist'
	]);

	assert.noFile('cli.js');
});
