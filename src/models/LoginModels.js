const mongoose = require('mongoose')
const validator = require('validator')
const bEncrypt = require("bcryptjs")

const LoginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
});

const LoginModel = mongoose.model('Login', LoginSchema)

class Login {
    constructor(body) {
        this.body = body
        this.errors = []
        this.user = null
    };
    valida() {
        this.cleanUp()
        if (!validator.isEmail(this.body.email)) this.errors.push('Informe um e-mail valido!')

        if (this.body.password.length < 3 || this.body.password.length > 50) {
            this.errors.push('A senha precisa ter entre 3 e 50 caracteres!')
        };
    };
    async register() {
        this.valida()

        if (await this.findUser()) this.errors.push('Usuario ja cadastrado!')
        this.encryptPassword()

        if (this.errors.length > 0) return

        this.user = await LoginModel.create(this.body)
    };
    encryptPassword() {
        const salt = bEncrypt.genSaltSync()
        this.body.password = bEncrypt.hashSync(this.body.password, salt)
    };
    cleanUp() {
        for (let key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        };

        this.body = {
            email: this.body.email,
            password: this.body.password
        };
    };
    async findUser() {
        const user = await LoginModel.findOne({ email: this.body.email })

        return user
    };
    async login() {
        this.valida()
        if (this.errors.length > 0) return
        
        this.user = await this.findUser()

        if (!this.user) {
            this.errors.push('Usuario nao encontrado!');
            return
        };

        if (!bEncrypt.compareSync(this.body.password, this.user.password)) {
            this.errors.push('Senha incorreta!')
            this.user = null
        }
    }
}

module.exports = Login;