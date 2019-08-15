'use strict';
const {api} = require('../_core/http');
const {encodeToken} = require('../_core/auth');
const blogModel = require('../models/blog');
const accountModel = require('../models/account');
const {condition} = require('../_core/utils');

const controller = {};

controller.ping = api(async ({isAuth}, {ok}) => {  
  return ok({isSuccess: true, isAuth, message: 'pong', data: {}});
});

controller.checkLogin = api(async ({isAuth}, {ok}) => {      
  return ok({isSuccess: true, isAuth, message: '', data: {}});
});

controller.login = api(async ({body, isAuth}, {ok}) => {
  const account = body('account');
  const password = body('password');

  const accountNo = await accountModel.no(account, password);
  const authKey = await accountModel.authKey(accountNo);

  const isSuccess = condition.isNotNull(accountNo); 
  const message = isSuccess ? '정상적으로 인증되었습니다.' : '로그인에 실패하였습니다.'; 
  const data = isSuccess ? {token: encodeToken({accountNo, authKey})} : {}
  return ok({isSuccess, isAuth, message, data});
});

controller.boards = api(async ({isAuth}, {ok}) => {    
  const boards = await blogModel.boards(isAuth);

  return ok({isSuccess: true, isAuth, message: '', data: {boards}});
});

controller.boardsByTag = api(async ({query, isAuth}, {ok}) => {    
  const name = query('name');

  const boards = await blogModel.boardsByTagName(name, isAuth);

  return ok({isSuccess: true, isAuth, message: '', data: {boards}});
});

controller.board = api(async ({query, isAuth}, {ok}) => {    
  const no = query('no');

  const board = await blogModel.board(no, isAuth);

  return ok({isSuccess: true, isAuth, message: '', data: {board}});
});

controller.addBoard = api(async ({body, isAuth}, {ok}) => {
  const title = body('title');    
  const contents = body('contents');
  const tags = body('tags');
  const isPublic = body('isPublic');
  
  await blogModel.addBoard(title, contents, tags, isPublic);
  
  return ok({isSuccess: true, isAuth, message: '', data: {}});
});

controller.tagsByRecently = api(async ({isAuth}, {ok}) => {      
  const tags = await blogModel.tagsByRecently();

  return ok({isSuccess: true, isAuth, message: '', data: {tags}});
});

controller.tagsByBest = api(async ({isAuth}, {ok}) => {
  const tags = await blogModel.tagsByBest();

  return ok({isSuccess: true, isAuth, message: '', data: {tags}});
});

module.exports = controller;