const sxy = require('sxy')
const LanguageDirection = {
	ltr:'left_to_right',
	rtl:'right_to_left'
}

class LanguageDetails extends sxy.ModulePoint({process,__filename},'LanguageDetails'){
	get direction(){
		for(const name in LanguageDirection){
			if(this.has(name) && this.get(name) === true){
				return LanguageDirection[name]
			}
		}
		return 'left_to_right'
	}
}

//exports
module.exports = LanguageDetails


