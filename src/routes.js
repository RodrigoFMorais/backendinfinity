const express = require('express');
const multer = require('multer');
const multerConfig = require('./config/multer');

const UserController = require('./controllers/UserController');
const SessionController = require('./controllers/SessionController');
const StoreController = require('./controllers/StoreController');

const routes = express.Router();

// Lista usuários
routes.get('/users', UserController.index);

// Cria usuário
routes.post('/users', UserController.create);

// Atualizar usuário
routes.post('/users/update' , UserController.update);

// Cria uma sessão
routes.post('/session', SessionController.create);

// Cria uma Loja
routes.post('/store', multer(multerConfig).single("file"), StoreController.create);

// Lista Lojas
routes.get('/store', StoreController.index);

// Deletar uma Loja
routes.delete('/store/:storeid' , StoreController.delete);

// Editar uma Loja
routes.post('/store/:storeid' , StoreController.update);

module.exports = routes;