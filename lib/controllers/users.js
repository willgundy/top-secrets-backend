const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const User = require('../models/User');
const UserService = require('../services/UserService');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
    .post('/', async (req, res, next) => {
        try {
            const user = await UserService.create(req.body);
            res.json(user);
        } catch(e) {
            next(e);
        }
    })
    
    .post('/sessions', async(req, res, next) => {
        try {
            const { email, password } = req.body;
            const token = await UserService.signIn({ email, password });

            res.cookie(process.env.COOKIE_NAME, token, { httpOnly: true, maxAge: ONE_DAY_IN_MS });
            res.json({ message: 'Signed in successfully!'});
        } catch(e) {
            next(e);
        }
    })
    
    .get('/me', authenticate, async(req, res) => {
        res.json(req.user);
    })
    
    .delete('/sessions', (req, res, next) => {
        try {
            res.clearCookie(process.env.COOKIE_NAME);
            res.json({ success: true, message: 'Signed out successfully!'});
        } catch(e) {
            next(e);
        }
    });