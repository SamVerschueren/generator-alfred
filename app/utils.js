'use strict';
const url = require('url');
const uuid = require('uuid');
const _s = require('underscore.string');
const isScoped = require('is-scoped');

const uuids = new Map();

exports.generateUuid = key => {
	if (key && uuids.has(key)) {
		return uuids.get(key);
	}

	const id = uuid.v4().toUpperCase();

	if (key) {
		uuids.set(key, id);
	}

	return id;
};

exports.bundleId = props => {
	const parsed = url.parse(props.website);

	if (parsed.hostname === 'github.com') {
		return `com.${props.githubUsername.toLowerCase()}.${props.alfredName}`;
	}

	// Reverse hostname
	const parts = parsed.hostname.split('.');
	return `${parts[1]}.${parts[0]}.${props.alfredName}`;
};

exports.repoName = name => isScoped(name) ? name.split('/')[1] : name;

exports.slugifyPackageName = name => isScoped(name) ? name : _s.slugify(name);
