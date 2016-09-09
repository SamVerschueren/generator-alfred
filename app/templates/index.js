'use strict';
const alfy = require('alfy');
const alfredNotifier = require('alfred-notifier');

alfredNotifier();

alfy.output([
	{
		title: 'Unicorn',
		subtitle: alfy.input
	}
]);
