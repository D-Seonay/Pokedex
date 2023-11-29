// routes/routesPokemon.js

const express = require('express');
const router = express.Router();
const { readFileSync } = require('fs');
const axios = require('axios');


// Fonction pour renvoyer un fichier statique
function serveStaticFile(path, contentType, res) {
    const data = readFileSync(path, 'utf-8');
    res.writeHead(200, { 'Content-Type': contentType });
    res.write(data);
    res.end();
}

router.get('/', (req, res) => {
    serveStaticFile('./src/index.html', 'text/html', res);
});

router.get('/css/styles.css', (req, res) => {
    serveStaticFile('./src/styles.css', 'text/css', res);
});

router.get('/js/app.js', (req, res) => {
    serveStaticFile('./src/js/app.js', 'text/javascript', res);
});
// Si aucune route correspond, retourne une erreur 404
router.use((req, res) => {
    res.status(404).send('Page not found!');
});

module.exports = router;
