require('dotenv').config()
const express = require('express')
const path = require('path')
const router = require("./router")
const helmet = require('helmet')
const csurf = require('csurf')
const { middlewareGlobal, checaCsrfError, csrfToken } = require('./src/middlewares/middlewareGlobal')

const mongoose = require('mongoose')
const session = require('express-session')
const MongoStorage = require('connect-mongo')
const flash = require('connect-flash')

const app = express()

mongoose.connect(process.env.URL_MongoDB)
    .then(() => app.emit('conectado'))
    .catch(e => console.log(e))

app.use(session({
    secret: "oainosindawoin",
    store: MongoStorage.create({ mongoUrl: process.env.URL_MongoDB }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
    }
}))

app.use(flash())

// configurar o corpo da requisicao
app.use(express.urlencoded({ extended: true }))
// configurar dados recebidos
app.use(express.json())

app.use(express.static(path.resolve(__dirname, "public")))

app.set("views", path.resolve(__dirname, "src", "views"))
app.set('view engine', 'ejs')

app.use(helmet())
app.use(csurf())

app.use(middlewareGlobal)

app.use(checaCsrfError)
app.use(csrfToken)

app.use(router)

app.on("conectado", () => {
    app.listen(3000, () => {
        console.log('Acesse: http://localhost:3000')
        console.log('Servidor executando na porta 3000!')
    })
})