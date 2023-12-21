const totalPokemon = 1017; // Nombre total de Pokémon dans la base de données
const pokemonListElement = document.getElementById("pokemonList");
var isShiny = false; // Variable pour suivre l'état de l'image (normal ou chromatique)
var currentPage = 1; // Page actuelle
const pageSize = 50; // Nombre maximum d'éléments par page

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


function displayCurrentPage(pageNumber) {
    const startIndex = (pageNumber - 1) * pageSize + 1;
    const endIndex = pageNumber * pageSize;

    // Efface le contenu actuel de la liste de Pokémon
    pokemonListElement.innerHTML = '';

    const promises = [];

    // Limite au maximum de 50 Pokémon par page
    for (let i = startIndex; i <= endIndex && i <= totalPokemon; i++) {
        promises.push(fetchPokemonById(i));
    }

    Promise.all(promises)
        .then(pokemonDataArray => {
            pokemonDataArray.forEach(data => {
                // Crée un élément de liste pour chaque Pokémon avec son image et son nom
                const liElement = document.createElement("li");
                const linkElement = document.createElement("a");
                const imgElement = document.createElement("img");

                imgElement.src = data.sprites.front_default;
                imgElement.alt = data.name;

                linkElement.textContent = data.id + " " + data.name;

                liElement.appendChild(imgElement);
                liElement.appendChild(linkElement);
                pokemonListElement.appendChild(liElement);

                // Ajoute un événement de clic pour afficher les détails du Pokémon
                liElement.addEventListener("click", function() {
                    displayPokemon(data);
                });
            });
        })
        .catch(error => {
            console.log("Erreur : " + error);
        });
}


// Affiche la première page de Pokémon au chargement
setTimeout(() => {
    displayCurrentPage(currentPage);
}, 1000);

// Gestion des boutons de pagination
const firstButton = document.getElementById("firstButton");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const lastButton = document.getElementById("lastButton");


firstButton.addEventListener("click", function() {
    currentPage = 1;
    displayCurrentPage(currentPage);
});

// Gestion des clics sur le bouton "Suivant"
nextButton.addEventListener("click", function() {
    if (currentPage < Math.ceil(totalPokemon / pageSize)) {
        currentPage++;
        displayCurrentPage(currentPage);
    }
});

// Gestion des clics sur le bouton "Précédent"
prevButton.addEventListener("click", function() {
    if (currentPage > 1) {
        currentPage--;
        displayCurrentPage(currentPage);
    }
});

lastButton.addEventListener("click", function() {
    currentPage = Math.ceil(totalPokemon / pageSize);
    displayCurrentPage(currentPage);
});

const totalPages = Math.ceil(totalPokemon / pageSize); // Calcul du nombre total de pages

function displayPaginationButtons(currentPage) {
    const paginationElement = document.getElementById("pagination");
    paginationElement.innerHTML = ''; // Efface le contenu actuel des boutons de pagination

    const maxPageButtons = 8; // Nombre maximal de boutons de page à afficher

    let startPage = currentPage - Math.floor(maxPageButtons / 2);
    startPage = Math.max(startPage, 1); // Empêche d'avoir des numéros de page inférieurs à 1

    let endPage = startPage + maxPageButtons - 1;
    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(endPage - maxPageButtons + 1, 1); // Ajuste le début pour conserver 5 boutons si totalPages < maxPageButtons
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.addEventListener("click", function() {
            currentPage = i;
            displayCurrentPage(currentPage);
            displayPaginationButtons(currentPage);
        });
        if (i === currentPage) {
            pageButton.classList.add("active"); // Ajoute une classe pour indiquer la page actuelle
        }
        paginationElement.appendChild(pageButton);
    }

    // Gestion des clics sur les boutons de navigation
    firstButton.addEventListener("click", function() {
        if (currentPage !== 1) {
            currentPage = 1;
            displayPaginationButtons(currentPage);
        }
    });

    prevButton.addEventListener("click", function() {
        if (currentPage > 1) {
            currentPage--;
            displayPaginationButtons(currentPage);
        }
    });

    nextButton.addEventListener("click", function() {
        if (currentPage < totalPages) {
            currentPage++;
            displayPaginationButtons(currentPage);
        }
    });

    lastButton.addEventListener("click", function() {
        if (currentPage !== totalPages) {
            currentPage = totalPages;
            displayPaginationButtons(currentPage);
        }
    });
}

// Au chargement initial, affiche les boutons de pagination pour la première page
setTimeout(() => {
    displayPaginationButtons(currentPage);
}, 1000);
