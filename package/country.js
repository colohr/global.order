const utility = require('./utility')

//exports
module.exports.details = get_details
module.exports.flag = get_flag
module.exports.list = get_list
module.exports.language = get_language
module.exports.languages = get_languages
module.exports.timezones = get_timezones

//shared actions
function get_list(){ return utility.bundle('country') }

async function get_details(name_or_code){
	const locator = await utility.locator(name_or_code)
	if(locator) return utility.data.country(locator.code)
	return null
}

async function get_flag(country_code){
	return {
		code(){ return require('countries-list').getEmojiFlag(this.emoji) },
		emoji: require('countries-list').getEmojiFlag(country_code)
	}
}

function get_language(code){ return utility.data.language(code) }

function get_languages(...codes){ return Promise.all(codes.map(get_language)) }

function get_timezones(code){ return utility.data.timezones(code) }



