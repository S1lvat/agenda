exports.middlewareGlobal = (req, res, next) => {
    res.locals.errors = req.flash('errors')
    res.locals.success = req.flash('success')
    res.locals.user = req.session.user
    next()
}

exports.checaCsrfError = (err, req, res, next) => {
    if (err) return res.render("securityError")

    next()
}

exports.csrfToken = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken()
    
    next()
}

exports.loginRequired = (req, res, next) => {
    if (!req.session.user) {
        req.flash('errors', 'Voce precisa estar logado!');
        req.session.save(() => res.redirect('/login'));
        return
    }

    next()
};
