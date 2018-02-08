module.exports = {
	get calendar(){ return require('chrono-node') },
	get regions(){ return require('countries-and-timezones') },
	get timezone(){ return require('./timezone') }
}