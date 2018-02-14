const sxy = require('sxy')
const country = require('../country')
class CountryDetails extends sxy.ModulePoint({process,__filename},'CountryDetails'){
	async continent(){ return require('../continent')(this.get('continent')) }
	get currency_codes(){ return this.get('currency') }
	async currencies(){ return await get_currencies(this) }
	async flag(){
		return {
			code:this.get('emoji_u'),
			emoji:this.get('emoji')
		}
	}
	async languages(){
		const LanguageDetails = require('./LanguageDetails')
		if(!this.has('languages')) return []
		return (await country.languages(...this.get('languages'))).map(i=>new LanguageDetails(i))
	}
	get phone_codes(){ return this.get('phone') }
	async timezones(){
		const TimezoneDetails = require('./TimezoneDetails')
		return (await country.timezones(this.code)).map(i=>new TimezoneDetails(i))
	}
}

//exports
module.exports = CountryDetails

//shared actions
async function get_currencies(country){
	const CurrencyOrder = load_currency()
	if(CurrencyOrder && country.has('currency')) {
		const utility = require('../utility')
		const codes = utility.text_list(country.get('currency')).filter(code=>CurrencyOrder.formatter.exists(code))
		return codes.map(code => CurrencyOrder.Struct(code))
	}
	return []
}

function load_currency(){
	try{
		return require('currency.order')
	}catch(e){

	}
	return null
}