const express = require('express');
const multer = require('multer');
const multerConfig = require('./config/multer');

const UserController = require('./controllers/UserController');
const SessionController = require('./controllers/SessionController');
const StoreController = require('./controllers/StoreController');

const routes = express.Router();

// Lista usuários
routes.get('/users', SessionController.autMid, UserController.index);

// Lista usuários
routes.get('/viewuser/:token', SessionController.autMid, UserController.viewuser);

// Cria usuário
routes.post('/users', UserController.create);

// Atualizar usuário
routes.post('/users/update' ,SessionController.autMid, UserController.update);

// Cria uma sessão
routes.post('/session', SessionController.create);

// Cria uma Loja
routes.post('/store', SessionController.autMid, multer(multerConfig).single("file"), StoreController.create);

// Lista Lojas
routes.get('/store', SessionController.autMid, StoreController.index);

// Deletar uma Loja
routes.delete('/store/:storeid' , SessionController.autMid, StoreController.delete);

// Editar uma Loja
routes.post('/store/:storeid' , SessionController.autMid, StoreController.update);

module.exports = routes;