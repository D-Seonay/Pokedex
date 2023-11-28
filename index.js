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
    var randomId = Math.floor(Math.random() * 1010) + 1; // Génère un ID aléatoire entre 1 et 898
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


function fetchPokemonById(id) {
    const apiUrl = "https://pokeapi.co/api/v2/pokemon/" + id;

    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des données du Pokémon !");
            }
            return response.json();
        });
}

function createPokemonListSequentially(totalPokemon, currentId = 1) {
    if (currentId <= totalPokemon) {
        fetchPokemonById(currentId)
            .then(data => {

                const liElement = document.createElement("li");
                const linkElement = document.createElement("a");
                const imgElement = document.createElement("img");

                imgElement.src = data.sprites.front_default;
                imgElement.alt = data.name;

                linkElement.textContent = data.id + " " + data.name;

                liElement.appendChild(imgElement);
                liElement.appendChild(linkElement);
                pokemonListElement.appendChild(liElement);

                setTimeout(() => {
                    createPokemonListSequentially(totalPokemon, currentId + 1);
                }, 50);
                liElement.addEventListener("click", function() {
                    fetchPokemon(data.name);
                });
            })
            .catch(error => {
                console.log("Erreur : " + error);
            });
    }
}
createPokemonListSequentially(1011);



// Sélectionnez les boutons de génération par leur classe ou leur ID
const generationButtons = document.querySelectorAll('.generation-button');

// Ajoutez un gestionnaire d'événements à chaque bouton de génération
generationButtons.forEach(button => {
    button.addEventListener('click', function() {
        const generation = this.getAttribute('data-generation');
        filterPokemonByGeneration(generation);
    });
});
const generations = [
    { name: "red-blue", id: 1 },
    { name: "gold-silver", id: 2 },
    { name: "ruby-sapphire", id: 3 },
    { name: "diamond-pearl", id: 4 },
    { name: "black-white", id: 5 },
    { name: "sun-moon", id: 6 },
];


// Fonction pour filtrer les Pokémon par génération
function filterPokemonByGeneration(generation) {
    // Effacez la liste actuelle des Pokémon
    pokemonListElement.innerHTML = '';

    // Réinitialisez la liste de Pokémon de manière séquentielle pour la génération sélectionnée
    createPokemonListSequentially(totalPokemon, 1, generation);
}

// Fonction récursive pour créer la liste de Pokémon de manière séquentielle pour une génération spécifique
/*function createPokemonListSequentiallyGenaration(totalPokemon, currentId = 1, generation = 0) {
    if (currentId <= totalPokemon) {
        fetchPokemonById(currentId)
            .then(data => {
                if (generation === 0 || data.generation.name === `generation-${generation}`) {
                    
                    const liElement = document.createElement("li");
                    const linkElement = document.createElement("a");
                    const imgElement = document.createElement("img");

                    imgElement.src = data.sprites.front_default;
                    imgElement.alt = data.name;

                    liElement.textContent = data.id + " " + data.name;

                    linkElement.href = "#";
                    linkElement.appendChild(imgElement);
                    linkElement.appendChild(liElement);

                    pokemonListElement.appendChild(linkElement);
                }

                // Attendez un peu avant d'appeler la fonction pour le Pokémon suivant
                setTimeout(() => {
                    createPokemonListSequentially(totalPokemon, currentId + 1, generation);
                }, 100); // Délai de 100 millisecondes (ajustez selon vos besoins)
            })
            .catch(error => {
                console.log("Erreur : " + error);
            });
    }
}

// Appelez la fonction pour créer la liste de tous les Pokémon au chargement de la page
createPokemonListSequentially(1010); // Par exemple, créez une liste pour les 10 premiers Pokémon*/
