const express = require('express');
const app = express();

// Importer les routes
const routesPokemon = require('./routes/routesPokemon');

// Utiliser les routes
app.use('/', routesPokemon);

// Démarrer le serveur
const port = 3000;
app.listen(port, () => {
    console.log(`Serveur lancé sur le port ${port} http://localhost:${port}`);
});
