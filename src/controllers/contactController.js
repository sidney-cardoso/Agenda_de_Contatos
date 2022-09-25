const Contact = require('../models/ContactModel')

exports.index = (req, res) => {
    res.render('contact', {
        contact: {}
    })
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
        req.session.save(() =>
            res.redirect(`/contact/index/${contact.contact._id}`)
        )
        return
    } catch (err) {
        console.error(err)
        return res.render('404')
    }
}

exports.editIndex = async (req, res) => {
    if (!req.params.id) return res.render('404')

    const contact = await Contact.searchID(req.params.id)

    if (!contact) return res.render('404')
    res.render('contact', { contact })
}

exports.edit = async (req, res) => {
    try {
        if (!req.params.id) return res.render('404')
        const contact = new Contact(req.body)
        await contact.edit(req.params.id)

        if (contact.errors.length > 0) {
            req.flash('errors', contact.errors)
            req.session.save(() => res.redirect('/'))
            return
        }
        req.flash('success', 'Contato editado com sucesso!')
        req.session.save(() =>
            res.redirect(`/contact/index/${contact.contact._id}`)
        )
        return
    } catch (err) {
        console.error(err)
        res.render('404')
    }
}
