const express = require('express');

const app = express();
const port = 5000;

app.use(express.json());

app.listen(port, () => {
    console.log(`HTTP Server running on http://localhost:${port}`);
});

app.get('/api', (req, res) => {
    res.send('HTTP Server is working!');
});