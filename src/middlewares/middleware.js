exports.myMiddleware = (req, res, next) => {
    next()
}

exports.otherMiddleware = (req, res, next) => {
    next()
}

exports.checkCSRFError = (err, req, res, next) => {
    if (err && 'EBADCSRFTOKEN' === err.code) {
        return res.render('error')
    }
}

exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken()
    next()
}
