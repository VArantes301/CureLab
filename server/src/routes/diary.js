const express = require('express');
const router = express.Router();
const diaryController = require('../controller/diary');
const upload = require('../config/upload');

router.post('/:userId/diary', upload.array('images', 4), diaryController.create);
router.post('/:userId/diary', diaryController.create);

router.get('/:userId/diary/:diaryId', diaryController.getOne);
router.get('/:userId/diary', diaryController.list);

module.exports = router;