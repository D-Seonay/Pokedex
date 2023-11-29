var isShiny = false; 

function displayPokemon(pokemonData) {
	// Obtenir l'URL de la ressource "pokemon-form" à partir des données du Pokémon
	const pokemonFormUrl = pokemonData.forms[0].url; // Vous pouvez ajuster [0] selon vos besoins

	// Effectuer une requête HTTP pour obtenir les détails de la forme du Pokémon
	fetch(pokemonFormUrl)
		.then(response => {
			if (!response.ok) {
				throw new Error("Détails de la forme du Pokémon non trouvés !");
			}
			return response.json();
		})
		.then(formData => {
			// formData contient maintenant les détails de la forme du Pokémon
			const versionName = formData.version_group.name;
			document.getElementById("pokemonVersions").textContent = "Versions : " + versionName;
		})
		.catch(error => {
			console.log("Erreur lors de la récupération des détails de la forme du Pokémon : " + error);
		});
	var pokemonName = pokemonData.name;
	var pokemonNumber = pokemonData.id;
	var pokemonTypes = pokemonData.types.map(type => type.type.name).join(", ");
	var pokemonImage = pokemonData.sprites.front_default;
	var pokemonShinyImage = pokemonData.sprites.front_shiny;
	console.log(pokemonData)


	var imageElement = document.getElementById("pokemonImage");
	imageElement.src = pokemonImage;

	imageElement.addEventListener("click", function() {
		isShiny = !isShiny; // Inverser l'état de l'image (normal ou chromatique)
		imageElement.src = isShiny ? pokemonShinyImage : pokemonImage;
	});

	document.getElementById("pokemonName").textContent = pokemonName;
	document.getElementById("pokemonType").textContent = "Type(s) : " + pokemonTypes;
	document.getElementById("pokemonNumber").textContent = "Numéro : " + pokemonNumber;

	var pokemonContainer = document.getElementById("pokemonContainer");
	pokemonContainer.style.display = "flex";

}
module.exports = displayPokemon;
