// Function: fetchPokemon
function fetchPokemon(identifier) {
	var apiUrlPokemon = "https://pokeapi.co/api/v2/pokemon/" + identifier;

	fetch(apiUrlPokemon)
		.then(response => {
			if (!response.ok) {
				throw new Error("Pokémon non trouvé !");
			}
			return response.json();
		})
		.then(data => {
			displayPokemon(data);
		})
		.catch(error => {
			console.log("Erreur : " + error);
		});
}
module.exports = fetchPokemon;