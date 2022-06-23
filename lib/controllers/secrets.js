const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const Secret = require('../models/Secret');

module.exports = Router()
    .get('/', [authenticate, authorize], async(req, res, next) => {
        try {
            const secretList = await Secret.getAll();
            res.json(secretList);
        } catch(e) {
            next(e);
        }
    })
    
    .post('/', [authenticate, authorize], async(req, res, next) => {
        try {
            const newSecret = await Secret.insert(req.body);
            res.json(newSecret);
        } catch(e) {
            next(e);
        }
    })