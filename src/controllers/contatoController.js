const Contato = require('../models/contatoModel')

exports.index = (req, res) => {
    res.render("contato")
};
exports.contatoFill = (req, res, next) => {
    if (req.session.contato) {
        res.locals.contato = req.session.contato
    } else {
        res.locals.contato = {}
    }
    next()
};
exports.dataReset = (req, res, next) => {
    res.locals.contato = {};

    next()
}
exports.register = async (req, res) => {
    try {
        const contato = new Contato(req.body, req.session)
        await contato.register()

        if (contato.errors.length > 0) {
            req.flash("errors", contato.errors)
            req.session.contato = contato.body
            req.session.save(() => {
                res.redirect('/contato')
            })
            return
        } else {
            req.flash('success', "Contato criado com sucesso!")
            req.session.contato = contato.contato
            req.session.save(function () {
                return res.redirect(`/contato/${contato.contato._id}`)
            })
            return
        };
    } catch (error) {
        console.log(error)
        return res.render('securityError')
    }
};
exports.editaContato = async (req, res) => {
    if (!req.params.id) return res.render('securityError')

    const contato = await Contato.buscaContato(req.params.id)
    if (!contato) return res.render('securityError')
    res.locals.contato = contato
    res.render("contato")
};
exports.edit = async (req, res) => {
    if (!req.params.id) return res.render('securityError')
    const contato = new Contato(req.body)

    await contato.edit(req.params.id)

    if (contato.errors.length > 0) {
        req.flash("errors", contato.errors)
        req.session.contato = contato.body
        req.session.save(() => {
            res.redirect('/contato')
        })
        return
    } else {
        req.session.contato = contato.contato
        req.flash('success', `Contato ${contato.contato.nome} editado com sucesso!`)
        req.session.save(function () {
            return res.redirect(`/`)
        })
        return
    };
};
exports.delete = async (req, res, next) => {
    if (!req.params.id) return res.render('securityError')

    const contato = await Contato.delete(req.params.id)

    req.flash('success', `Contato ${contato.nome} apagado com sucesso!`)
    req.session.save(() => res.redirect('/'))
}