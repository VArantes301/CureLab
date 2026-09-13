const express = require('express');
const router = express.Router();
const achievementController = require('../controller/achievement');

router.get('/:userId/achievements', achievementController.list);

module.exports = router;