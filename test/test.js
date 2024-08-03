import fs from 'node:fs';
import path from 'node:path';
import test from 'ava';
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';
import {temporaryDirectory as makeTemporaryDirectory} from 'tempy';

const __dirname = import.meta.dirname;

test('generates expected files', async () => {
	const temporaryDirectory = makeTemporaryDirectory();

	await helpers
		.run(path.join(__dirname, '../app'), {
			cwd: temporaryDirectory,
		})
		.withAnswers({
			moduleName: 'my-awesome-module',
			githubUsername: 'testperson',
			website: 'http://test.com',
		});

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
		'info.plist',
	]);

	const packageJson = JSON.parse(fs.readFileSync(path.join(temporaryDirectory, 'package.json')));
	console.log(packageJson);
	assert(packageJson.name === 'my-awesome-module');
	assert(packageJson.repository === 'testperson/my-awesome-module');

	assert.noFile('cli.js');
});
