const express = require('express');
const userController = require('../controller/user.controller');
const authController = require('../controller/auth.controller');
const router = express.Router();

// 회원가입 endpoint
router.post('/', userController.createUser);
router.post('/login', userController.loginWithEmail);

//토큰을 통해서 user id 가져와서 이 id로 user 객체 찾아서 보내주기
router.get('/me', authController.authenticate, userController.getUser);

module.exports = router;