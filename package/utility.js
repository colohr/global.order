const fxy = require('fxy')
const {is} = fxy

const bundle = {
	get continent(){
		return get_data_map(
			require('countries-list').continents,
		 	(field,value)=>({code:field,name:value})
		)
	},
	get country(){
		return get_data_map(
			require('countries-list').countries,
			(field,value)=>(value.code=field,value)
		)
	},
	get language(){
		return get_data_map(
			require('countries-list').languages,
			(field,value)=>(value.code=field,value)
		)
	},
	get locator(){
		return get_data_map(
			require('countries-and-timezones').getAllCountries(),
			(field,value)=>(value.code=field,value)
		)
	},
	get timezone(){
		return {
			countries:name=>require('countries-and-timezones').getCountriesForTimezone(name),
			list:code=>require('countries-and-timezones').getTimezonesForCountry(code)
		}
	}
}

//exports
module.exports = {
	bundle:data_bundle,
	get data(){ return get_data() },
	languages:get_languages,
	locator:data_locator,
	text_list,
	tick:data_tick
}

//shared actions
function data_bundle(name){
	if(name in bundle) return bundle[name]
	return null
}

function data_locator(code_or_name){
	return data_tick(async ()=>{
		const locators = bundle.locator
		if(locators.has(code_or_name)) return locators.get(code_or_name)
		for(const locator of locators.values()){
			if(locator.name === code_or_name) return locator
			const id = {name:new RegExp(locator.name,'i'), code:new RegExp(locator.code,'i') }
			if(id.name.test(code_or_name)) return locator
			else if(id.code.test(code_or_name)) return locator
		}
		return null
	})
}

async function data_tick(tick,...x){
	return new Promise((success, error)=>{
		return process.nextTick(async ()=>{
			try{ return success(await tick(...x)) }
			catch(e){ return error(e) }
		})
	})
}

function get_languages(input){
	let accept_language = is.text(input) ? input:null
	if(!accept_language && is.data(input)){
		if('headers' in input) accept_language = input.headers['accept-language']
		else accept_language = input['accept-language']
	}
	if(!is.text(accept_language)) return []
	return accept_language.split(':')[1].match(/[a-zA-Z\-]{2,10}/g) || []
}

function get_data(){
	return new Proxy(Object.keys(bundle),{ get:get_value, has:has_value })
	//shared actions
	function get_data_value(field){
		return code=>{
			const data = bundle[field]
			if(data.has(code)) return data.get(code)
			return null
		}
	}
	function get_value(o,field){
		switch(field){
			case 'timezones':
			case 'country_timezones':
				return x=>data_tick(bundle.timezone.list,x)
			case 'timezone':
			case 'timezone_countries':
				return x=>data_tick(bundle.timezone.countries,x)
			default:
				if(field in bundle) return x=>data_tick(get_data_value(field),x)
		}
		return field in o ? (is.function(o[field]) ? o[field].bind(o):o[field]):null
	}
	function has_value(o,field){ return field in o || o.indexOf(field) >= 0 }
}

function get_data_field_map(data){
	return Object.keys(data)
				 .map(field=>[field,data[field]])
}

function get_data_map(data,prototype){
	return new Map(get_data_field_map(data).map(get_data_item))
	//shared actions
	function get_data_item([field,value]){

		return [
			field,
			is.function(prototype) ? prototype(field,value):value
		]
	}
}

function text_list(value){
	if(is.array(value)) return text_list_filter(...value)
	if(!is.nothing(value)){
		value = fxy.as.text(value)
		if(is.text(value)) return text_list_filter(...(value.split(',')))
	}
	return []
}

function text_list_filter(...value){
	return value.map(i=>fxy.as.text(i))
				.filter(i=>is.text(i))
				.map(i=>i.trim())
				.filter(i=>i.length)
}

