const express = require('express')
const app = express()
const path = require('path');

// Serve only the static files form the dist directory
app.use(express.static(path.join(__dirname, '/dist/taba-apui')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/dist/taba-apui/index.html'));
});

app.get('/test', function (req, res) {
    res.send("ok");
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);