const express = require('express');
const app = express();

// Importer les routes
const routesPokemon = require('./routes/routesPokemon');

// Utiliser les routes
app.use('/', routesPokemon);

fetch('/fetchPokemon', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
})
.then(response => response.json())
.then(data => console.log(data))
.catch((error) => {
    console.error('Erreur:', error);
});

// Démarrer le serveur
const port = 3000;
app.listen(port, () => {
    console.log(`Serveur lancé sur le port ${port} http://localhost:${port}`);
});
