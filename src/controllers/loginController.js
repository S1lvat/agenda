const Login = require("../models/LoginModels")

exports.index = (req, res) => {
    if (req.session.user) return res.redirect("/")
    return res.render('login')
};
exports.register = async (req, res) => {
    try {
        const login = new Login(req.body)
        await login.register()

        if (login.errors.length > 0) {
            req.flash('errors', login.errors)
            req.session.save(function () {
                return res.redirect('/login')
            })
            return
        } else {
            req.flash('success', "Usuario cadastrado com sucesso!")
            req.session.save(function () {
                return res.redirect('/login')
            })
            return
        }
    } catch (e) {
        console.log(e)
    }
};
exports.findUser = async (req, res) => {
   const exists = new Login(req.params)
   const user = await exists.findUser()
   res.json(user) 
};
exports.login = async (req, res) => {
    try {
        const login = new Login(req.body)
        await login.login()

        if (login.errors.length > 0) {
            req.flash('errors', login.errors)
            req.session.save(function () {
                return res.redirect('/login')
            })
            return
        } else {
            req.flash('success', "Usuario logado com sucesso!")
            req.session.user = login.user
            req.session.save(function () {
                return res.redirect('/')
            })
            return
        }
    } catch (e) {
        console.log(e)
    }
};
exports.logout = (req, res) => {
    req.session.user = null
    req.session.contato = null
    req.flash('success', 'Deslogado com sucesso!')
    req.session.save(() => res.redirect('/'))
};