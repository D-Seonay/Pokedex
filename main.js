const totalPokemon = 1010; // Nombre total de Pokémon dans la base de données
const pokemonListElement = document.getElementById("pokemonList");
var isShiny = false; // Variable pour suivre l'état de l'image (normal ou chromatique)

function getPokemon() {
    var pokemonInput = document.getElementById("pokemonInput").value;

    // Vérifier si l'entrée est un numéro ou un nom de Pokémon
    if (pokemonInput) {
        fetchPokemon(pokemonInput);
    } else {
        console.log("Veuillez entrer un numéro ou nom de Pokémon valide !");
    }
}

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

function fetchRandomPokemon() {
    var randomId = Math.floor(Math.random() * totalPokemon) + 1; // Génère un ID aléatoire entre 1 et 1010
    fetchPokemon(randomId);
}

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
    
    // Récupération des données du Pokémon pour affichage
    var pokemonName = pokemonData.name;
    var pokemonNumber = pokemonData.id;
    var pokemonTypes = pokemonData.types.map(type => type.type.name).join(", ");
    var pokemonImage = pokemonData.sprites.front_default;
    var pokemonShinyImage = pokemonData.sprites.front_shiny;

    var imageElement = document.getElementById("pokemonImage");
    imageElement.src = pokemonImage;

    // Gestion du clic pour changer entre l'image normale et chromatique (shiny)
    imageElement.addEventListener("click", function() {
        isShiny = !isShiny; // Inverser l'état de l'image (normal ou chromatique)
        imageElement.src = isShiny ? pokemonShinyImage : pokemonImage;
    });

    // Affichage des informations du Pokémon
    document.getElementById("pokemonName").textContent = pokemonName;
    document.getElementById("pokemonType").textContent = "Type(s) : " + pokemonTypes;
    document.getElementById("pokemonNumber").textContent = "Numéro : " + pokemonNumber;

    var pokemonContainer = document.getElementById("pokemonContainer");
    pokemonContainer.style.display = "flex";
}

function fetchPokemonById(id) {
    const apiUrl = "https://pokeapi.co/api/v2/pokemon/" + id;

    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des données du Pokémon !");
            }
            return response.json();
        })
        .then(data => {
            // Limiter l'affichage aux 50 premiers Pokémon
            const pokemonId = data.id;
            if (pokemonId <= 50) {
                return data; // Retourne les données si l'ID est inférieur ou égal à 50
            } else {
                throw new Error("Limité aux 50 premiers Pokémon");
            }
        });
}

function displayCurrentPage() {
    const pageSize = 50; // Nombre maximum d'éléments par page
    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = currentPage * pageSize;

    // Limite au 50 premiers Pokémon
    for (let i = startIndex; i <= endIndex && i <= totalPokemon; i++) {
        fetchPokemonById(i)
            .then(data => {
                // Créer un élément de liste pour chaque Pokémon avec son image et son nom
                const liElement = document.createElement("li");
                const linkElement = document.createElement("a");
                const imgElement = document.createElement("img");

                imgElement.src = data.sprites.front_default;
                imgElement.alt = data.name;

                linkElement.textContent = data.id + " " + data.name;

                liElement.appendChild(imgElement);
                liElement.appendChild(linkElement);
                pokemonListElement.appendChild(liElement);

                // Ajouter un événement de clic pour afficher les détails du Pokémon
                liElement.addEventListener("click", function() {
                    displayPokemon(data);
                });
            })
            .catch(error => {
                console.log("Erreur : " + error);
            });
    }
}

// Appel à la fonction pour afficher les 50 premiers Pokémon
displayCurrentPage();

