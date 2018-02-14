const sxy = require('sxy')
const get_value = require('../../utility').text_list
//exports
module.exports = sxy.scalar('TextList','any-A list of text that usually originates from a comma separated value.',{
	get:get_value,
	literal:get_value,
	value:get_value
})
