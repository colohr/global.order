const sxy = require('sxy')
class TimezoneDetails extends sxy.ModulePoint({process,__filename},'TimezoneDetails'){
	get offset(){ return this.get('offset_str') }
}

//exports
module.exports = TimezoneDetails