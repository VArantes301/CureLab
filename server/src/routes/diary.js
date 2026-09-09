const express = require('express');
const router = express.Router();
const diaryController = require('../controller/diary');

router.post('/:userId/diary', diaryController.create);
router.get('/:userId/diary', diaryController.list);

module.exports = router;