const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')

const LoginSchema = new mongoose.Schema({
    email: { type: String, require: true },
    password: { type: String, require: true }
})

const LoginModel = mongoose.model('Login', LoginSchema)

class Login {
    constructor(body) {
        this.body = body
        this.errors = []
        this.user = null
    }
    async register() {
        this.validate()
        if (this.errors.length > 0) return

        await this.userAlreadyExists()

        if (this.errors.length > 0) return

        const salt = bcryptjs.genSaltSync()
        this.body.password = bcryptjs.hashSync(this.body.password, salt)

        try {
            this.user = await LoginModel.create(this.body)
        } catch (error) {
            console.error(error)
        }
    }
    async userAlreadyExists() {
        const user = await LoginModel.findOne({ email: this.body.email })

        if (user) this.errors.push('Usuário já existente')
    }
    validate() {
        this.cleanUp()
        if (!validator.isEmail(this.body.email)) {
            this.errors.push('E-mail inválido')
        }

        if (this.body.password.length < 5 || this.body.password.length > 30) {
            this.errors.push('Senha deve ter entre 5 e 30 caracteres.')
        }
    }
    cleanUp() {
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') this.body[key] = ''
        }
        this.body = {
            email: this.body.email,
            password: this.body.password
        }
    }
}
module.exports = Login
