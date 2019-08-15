'use strict';
const express = require('express');
const auth = require('../_core/auth');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

const accountModel = require('../models/account');

const controller = require('../controllers/blog');
const others = require('../controllers/others');
const router = express.Router();

auth.isAuthCustom = async token => {  
  return await accountModel.checkAuthKey(token.accountNo, token.authKey);
};

router.get('/ping', auth.authType(auth.OPTIONAL), controller.ping);
router.get('/login', auth.authType(auth.REQUIRED), controller.checkLogin);
router.post('/login', auth.authType(auth.OPTIONAL), controller.login);

router.get('/boards', auth.authType(auth.OPTIONAL), controller.boards);
router.get('/boards/tag', auth.authType(auth.OPTIONAL), controller.boardsByTag);
router.get('/board', auth.authType(auth.OPTIONAL), controller.board);
router.post('/board', auth.authType(auth.REQUIRED), controller.addBoard);

router.get('/tags/recently', auth.authType(auth.OPTIONAL), controller.tagsByRecently);
router.get('/tags/best', auth.authType(auth.OPTIONAL), controller.tagsByBest);

router.post('/upload/image', auth.authType(auth.REQUIRED), multipartMiddleware, others.uploadImage);

module.exports = router;