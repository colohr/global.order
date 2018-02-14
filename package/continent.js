const utility = require('./utility')

//exports
module.exports = get_continent
module.exports.list = get_continents

//shared actions
function get_continent(code){ return utility.data.continent(code) }
function get_continents(){ return utility.bundle('continent') }