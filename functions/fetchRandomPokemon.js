const fetchPokemon = require("./fetchPokemon");
function fetchRandomPokemon() {
	var randomId = Math.floor(Math.random() * totalPokemon) + 1; // Génère un ID aléatoire entre 1 et 898
	fetchPokemon(randomId);
}
module.exports = fetchRandomPokemon;
