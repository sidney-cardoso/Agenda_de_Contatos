const mongoose = require('mongoose')

const validator = require('validator')

const ContactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: false, default: '' },
    tel: { type: String, required: true },
    email: { type: String, required: false, default: '' },
    createdIn: { type: Date, default: Date.now }
})

const ContactModel = mongoose.model('Contact', ContactSchema)

class Contact {
    constructor(body) {
        this.body = body
        this.errors = []
        this.contact = null
    }

    async register() {
        this.validate()
        if (this.errors.length > 0) return
        this.contact = await ContactModel.create(this.body)
    }
    validate() {
        this.cleanUp()
        if (this.body.email && !validator.isEmail(this.body.email)) {
            this.errors.push('E-mail inválido')
        }
        if (!this.body.name)
            this.errors.push('O campo nome deve ser preenchido')
        if (!this.body.tel)
            this.errors.push('O campo telefone deve ser preenchido')
    }
    cleanUp() {
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') this.body[key] = ''
        }
        this.body = {
            name: this.body.name,
            surname: this.body.surname,
            email: this.body.email,
            tel: this.body.tel
        }
    }
    async edit(id) {
        if (typeof id !== 'string') return
        this.validate()
        if (this.errors.length > 0) return
        this.contact = await ContactModel.findByIdAndUpdate(id, this.body, {
            new: true
        })
    }
    static async searchID(id) {
        if (typeof id !== 'string') return
        const contact = await ContactModel.findById(id)
        return contact
    }
    static async searchContacts() {
        const contacts = await ContactModel.find().sort({ createdIn: -1 })
        return contacts
    }
    static async delete(id) {
        if (typeof id !== 'string') return
        const contact = await ContactModel.findOneAndDelete({ _id: id })
        return contact
    }
}

module.exports = Contact
