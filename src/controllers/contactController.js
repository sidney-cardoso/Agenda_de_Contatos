const Contact = require('../models/ContactModel')

exports.index = (req, res) => {
    res.render('contact')
}
exports.register = async (req, res) => {
    try {
        const contact = new Contact(req.body)
        await contact.register()

        if (contact.errors.length > 0) {
            req.flash('errors', contact.errors)
            req.session.save(() => res.redirect('/contact/index'))
            return
        }
        req.flash('success', 'Contato registrado com sucesso')
        req.session.save(() => res.redirect('/'))
        return
    } catch (err) {
        console.error(err)
        return res.render('404')
    }
}
