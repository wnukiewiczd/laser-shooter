const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();


const userAuthenticator = require('./authentication/authentication');

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

app.post('/login', async (req, res) => {
    const { login, password } = req.body;

    try {
        const { status, message, user } = await userAuthenticator.authenticateUser(login, password);


        if (user) {
            req.session.user = {
                id: user.id,
                login: user.login
            };
            req.session.save();
        }

        res.status(status).json({ message });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Something went wrong' });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to log out' });
        }

        res.status(200).json({ message: 'Logged out successfully' });
    });
});

app.get('/check-session', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'You are not authorized' });
    }

    res.status(200).json({ message: 'You are authorized', user: req.session.user });
});
