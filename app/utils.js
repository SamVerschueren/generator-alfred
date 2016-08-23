'use strict';
const url = require('url');
const uuid = require('uuid');

const uuids = Object.create(null);

exports.generateUuid = key => {
	if (key && uuids[key]) {
		return uuids[key];
	}

	const id = uuid.v4().toUpperCase();

	if (key) {
		uuids[key] = id;
	}

	return id;
};

exports.bundleId = props => {
	let website = props.website;

	if (!/^https?:\/\//.test(website)) {
		// Make sure website starts with the protocol. `Url.parse` could not handle `test.com` for instance.
		website = `http://${website}`;
	}

	const parsed = url.parse(website);

	if (parsed.hostname === 'github.com') {
		return `com.${props.githubUsername.toLowerCase()}.${props.moduleName}`;
	}

	// Reverse hostname
	const parts = parsed.hostname.split('.');
	return `${parts[1]}.${parts[0]}.${props.moduleName}`;
};
