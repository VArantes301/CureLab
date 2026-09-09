const express = require('express');
const router = express.Router()
const userController = require('../controller/user')

router.post('/create', userController.create);

router.get('/list', userController.list);

router.patch('/:userId/mascot', userController.updateMascot);

module.exports = router;