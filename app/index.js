import {randomSuperbWord} from 'superb';
import normalizeUrl from 'normalize-url';
import humanizeUrl from 'humanize-url';
import Generator from 'yeoman-generator';
import _s from 'underscore.string';
import * as utils from './utils.js';

export default class AlfredGenerator extends Generator {
	constructor(arguments_, options, features) {
		super(arguments_, options, {
			...features,
			customInstallTask: () => {
				this.spawnCommandSync('npm install --ignore-scripts');
			},
		});
	}

	async prompting() {
		this.responses = await this.prompt([
			{
				name: 'moduleName',
				message: 'What do you want to name your module?',
				default: _s.slugify(this.appname),
				filter(input) {
					let name = utils.slugifyPackageName(input);
					if (!name.startsWith('alfred-')) {
						name = `alfred-${name}`;
					}

					return name;
				},
			},
			{
				name: 'moduleDescription',
				message: 'What is your module description?',
				default: `My ${randomSuperbWord()} module`,
			},
			{
				name: 'alfredKeyword',
				message: 'What is the Alfred activation keyword?',
				default: ({moduleName}) => moduleName.replace(/^alfred-/, ''),
			},
			{
				name: 'alfredTitle',
				message: 'What is the Alfred title?',
				default: ({moduleDescription}) => moduleDescription,
			},
			{
				name: 'alfredCategory',
				message: 'What is the Alfred category?',
				type: 'list',
				default: 'Uncategorised',
				choices: ['Tools', 'Internet', 'Productivity', 'Uncategorised'],
			},
			{
				name: 'githubUsername',
				message: 'What is your GitHub username?',
				store: true,
				validate: username =>
					username.length > 0 ? true : 'You have to provide a username',
			},
			{
				name: 'website',
				message: 'What is the URL of your website?',
				store: true,
				validate: url =>
					url.length > 0 ? true : 'You have to provide a website URL',
				filter: url => normalizeUrl(url),
			},
		]);
	}

	writing() {
		const tpl = {
			moduleName: this.responses.moduleName,
			moduleDescription: this.responses.moduleDescription,
			alfredName: this.responses.moduleName.replace(/^alfred-/, ''),
			alfredBundleId: utils.bundleId(this.responses),
			alfredCategory: this.responses.alfredCategory,
			alfredKeyword: this.responses.alfredKeyword,
			alfredTitle: this.responses.alfredTitle,
			githubUsername: this.options.org || this.responses.githubUsername,
			repoName: utils.repoName(this.responses.moduleName),
			name: this.simpleGit.name,
			email: this.simpleGit.email,
			website: this.responses.website,
			humanizedWebsite: humanizeUrl(this.responses.website),
			uuid: utils.generateUuid,
		};

		this.fs.copyTpl([`${this.templatePath()}/**`], this.destinationPath(), tpl);

		for (const [from, to] of [
			['editorconfig', '.editorconfig'],
			['gitattributes', '.gitattributes'],
			['gitignore', '.gitignore'],
			['travis.yml', '.travis.yml'],
			['_package.json', 'package.json'],
		]) {
			this.fs.move(this.destinationPath(from), this.destinationPath(to));
		}
	}

	git() {
		this.spawnSync('git', ['init']);
	}
}
