module.exports = {
	get bundle(){ return require('./bundle') },
	get ChronologicalOrder(){ return require('./ChronologicalOrder') },
	get Point(){ return require('./ChronologicalOrder') },
	get share(){ return share_point }
}

//shared actions
function share_point(){
	const location = require('fxy').join(__dirname,'ChronologicalOrder')
	return location
}