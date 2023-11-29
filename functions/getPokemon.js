//Function to get the pokemon from the API
const fetchPokemon = require("./fetchPokemon");
function getPokemon() {
	var pokemonInput = document.getElementById("pokemonInput").value;

	// Vérifier si l'entrée est un numéro ou un nom de Pokémon
	if (pokemonInput) {
		fetchPokemon(pokemonInput);
	} else {
		console.log("Veuillez entrer un numéro ou nom de Pokémon valide !");
	}
}

module.exports = getPokemon;