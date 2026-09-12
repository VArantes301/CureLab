const express = require('express');
const router = express.Router()
const userController = require('../controller/user')

router.post('/create', userController.create);
router.post('/login', userController.login);

router.get('/list', userController.list);

router.patch('/:userId/mascot', userController.updateMascot);
router.patch('/:userId/addiction', userController.updateAddiction);
router.patch('/:userId/phone', userController.updatePhone1);

module.exports = router;