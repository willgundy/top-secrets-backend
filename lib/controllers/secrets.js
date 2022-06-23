const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Secret = require('../models/User');

module.exports = Router()
    .get('/', [authenticate], async(req, res) => {
        const secretList = await Secret.getAll();
        res.json(secretList);
    });