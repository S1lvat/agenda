const express = require('express');
const router = express.Router()

const homeController = require("./src/controllers/homeController")
const loginController = require("./src/controllers/loginController")
const contatoController = require("./src/controllers/contatoController")
const { loginRequired } = require('./src/middlewares/middlewareGlobal')

// Pagina inicial
//               é possível acresentar quantas funcoes forem necessarias / aqui o middleware vai afetar apenas uma rota.
router.get('/', homeController.index)

// Login
router.get('/login', loginController.index)
router.get('/login/buscaUser/:email', loginController.findUser)
router.post('/login/register', loginController.register)
router.post('/login/login', loginController.login)
router.get('/login/logout', loginController.logout)

// Contatos

// Criacao
router.get('/contato/', loginRequired, contatoController.contatoFill, contatoController.dataReset, contatoController.index)
router.post('/contato/register', loginRequired, contatoController.contatoFill, contatoController.register)
// Edicao
router.get('/contato/:id', loginRequired, contatoController.contatoFill, contatoController.editaContato)
router.post('/contato/edit/:id', loginRequired, contatoController.edit)
// Apagar
router.get('/contato/delete/:id', loginRequired, contatoController.delete)



module.exports = router