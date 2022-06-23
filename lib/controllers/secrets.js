const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const Secret = require('../models/Secret');

module.exports = Router()
    .get('/', [authenticate], async(req, res, next) => {
        try {
            const secretList = await Secret.getAll();
            res.json(secretList);
        } catch(e) {
            next(e);
        }
    });