'use strict';
const express = require('express');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

const controller = require('../controllers/blog');
const router = express.Router();

router.get('/ping', controller.ping);

router.post('/upload/image', multipartMiddleware, controller.uploadImage);

router.get('/boards', controller.boards);
router.get('/boards/tag', controller.boardsByTag);
router.get('/board', controller.board);
router.post('/board', controller.addBoard);

router.get('/tags/recently', controller.tagsByRecently);
router.get('/tags/best', controller.tagsByBest);

module.exports = router;