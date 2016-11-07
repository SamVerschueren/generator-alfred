'use strict';
const superb = require('superb');
const normalizeUrl = require('normalize-url');
const humanizeUrl = require('humanize-url');
const yeoman = require('yeoman-generator');
const _s = require('underscore.string');
const moduleName = require('./module-name');
const utils = require('./utils');

module.exports = class extends yeoman.Base {

	init() {
		return this.prompt([
			{
				name: 'moduleName',
				message: 'What do you want to name your module?',
				default: _s.slugify(this.appname),
				filter: x => moduleName.slugify(x)
			},
			{
				name: 'moduleDescription',
				message: 'What is your module description?',
				default: `My ${superb()} module`
			},
			{
				name: 'alfredKeyword',
				message: 'What is the Alfred activation keyword?',
				default: props => props.moduleName.replace(/^alfred-/, '')
			},
			{
				name: 'alfredTitle',
				message: 'What is the Alfred title?',
				default: props => props.moduleDescription
			},
			{
				name: 'alfredCategory',
				message: 'What is the Alfred category?',
				type: 'list',
				default: 'Uncategorised',
				choices: [
					'Tools',
					'Internet',
					'Productivity',
					'Uncategorised'
				]
			},
			{
				name: 'githubUsername',
				message: 'What is your GitHub username?',
				store: true,
				validate: x => x.length > 0 ? true : 'You have to provide a username'
			},
			{
				name: 'website',
				message: 'What is the URL of your website?',
				store: true,
				validate: x => x.length > 0 ? true : 'You have to provide a website URL',
				filter: x => normalizeUrl(x)
			}
		]).then(props => {
			const repoName = moduleName.repoName(props.moduleName);

			const alfredName = props.moduleName.replace(/^alfred-/, '');
			const alfredBundleId = utils.bundleId(props);

			const tpl = {
				moduleName: props.moduleName,
				moduleDescription: props.moduleDescription,
				alfredName,
				alfredBundleId,
				alfredCategory: props.alfredCategory,
				alfredKeyword: props.alfredKeyword,
				alfredTitle: props.alfredTitle,
				githubUsername: this.options.org || props.githubUsername,
				repoName,
				name: this.user.git.name(),
				email: this.user.git.email(),
				website: props.website,
				humanizedWebsite: humanizeUrl(props.website),
				uuid: utils.generateUuid
			};

			const mv = (from, to) => {
				this.fs.move(this.destinationPath(from), this.destinationPath(to));
			};

			this.fs.copyTpl([
				`${this.templatePath()}/**`
			], this.destinationPath(), tpl);

			mv('editorconfig', '.editorconfig');
			mv('gitattributes', '.gitattributes');
			mv('gitignore', '.gitignore');
			mv('travis.yml', '.travis.yml');
			mv('_package.json', 'package.json');
		});
	}

	git() {
		this.spawnCommandSync('git', ['init']);
	}

	install() {
		this.npmInstall(null, {ignoreScripts: true});
	}
};
