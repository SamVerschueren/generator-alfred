import {v4} from 'uuid';
import _s from 'underscore.string';
import isScoped from 'is-scoped';

const uuids = new Map();

export const generateUuid = key => {
	if (key && uuids.has(key)) {
		return uuids.get(key);
	}

	const id = v4().toUpperCase();

	if (key) {
		uuids.set(key, id);
	}

	return id;
};

export const bundleId = properties => {
	const parsed = new URL(properties.website);

	if (parsed.hostname === 'github.com') {
		return `com.${properties.githubUsername.toLowerCase()}.${properties.alfredName}`;
	}

	// Reverse hostname
	const parts = parsed.hostname.split('.');
	return `${parts[1]}.${parts[0]}.${properties.alfredName}`;
};

export const repoName = name => (isScoped(name) ? name.split('/')[1] : name);

export const slugifyPackageName = name =>
	isScoped(name) ? name : _s.slugify(name);
