const Contato = require('../models/contatoModel')

exports.index = async (req, res) => {
    if (req.session.user) {
        const contatos = await Contato.buscaContatos(req.session.user.email)
        res.render("index", { contatos })
    } else {
        res.render("index", {contatos: {}})
    }
};
