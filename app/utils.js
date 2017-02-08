'use strict';
const url = require('url');
const uuid = require('uuid');

const uuids = new Set();

exports.generateUuid = key => {
	if (key && uuids.has(key)) {
		return key;
	}

	const id = uuid.v4().toUpperCase();

	if (key) {
		uuids.add(id);
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
