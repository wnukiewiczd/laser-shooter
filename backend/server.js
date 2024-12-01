const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const logout = require('./api/logout');
const checkSession = require('./api/check-session');
const login = require('./api/login');
const getSessionUser = require('./api/get-session-user');
const listUserPlayers = require('./api/list-user-players');
const getUserSettings = require('./api/get-user-settings');
const updateUserSettings = require('./api/update-user-settings');

const app = express();

const protocol = process.env.SERVER_PROTOCOL || "http";
const host = process.env.SERVER_HOST || "localhost";
const port = process.env.SERVER_PORT || 5000;

// Middleweare
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST'],
}));

app.use(session({
    secret: process.env.SECRET_KEY || "SUPERSECRET",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000, // 1 Hour session
        secure: false
    }
}));


app.listen(port, () => {
    console.log(`Server running on ${protocol}://${host}:${port}`);
});

app.post('/login', login);
app.post('/logout', logout);
app.get('/check-session', checkSession);
app.get('/getSessionUser', getSessionUser);

app.post('/getUserSettings', getUserSettings);
app.post('/updateUserSettings', updateUserSettings);

app.post('/getPlayers', async (req, res) => {
    try {
        const players = await listUserPlayers(req, res);  // Pass the table name
        return res.status(200).json(players);
    } catch (error) {
        return res.status(500).json({ message: 'Problem with players' });
    }
});
