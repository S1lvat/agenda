const mongoose = require('mongoose')
const validator = require('validator')

const ContatoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    sobrenome: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    belongTo: {type: String, required: true}, 
    criadoEm: { type: Date, default: Date.now }
})

const ContatoModel = mongoose.model('Contato', ContatoSchema)

function Contato(body, session) {
    this.body = body
    this.errors = []
    this.owner = session.user.email
    this.contato = null
};
Contato.prototype.register = async function () {
    if(!this.owner) return this.errors.push('Voce precisa estar logado!')
    this.valida()
    if (this.errors.length > 0) return

    this.contato = await ContatoModel.create(this.body)
};
Contato.prototype.valida = function () {
    this.cleanUp()
    if (!this.body.nome) this.errors.push("Nome é um campo necessario!")
    if (this.body.email && !validator.isEmail(this.body.email)) this.errors.push('Informe um e-mail valido!');
    if (!this.body.email && !this.body.telefone) this.errors.push('Informe pelo menos um e-mail ou telefone!');
};
Contato.prototype.cleanUp = function () {
    for (let key in this.body) {
        if (typeof this.body[key] !== 'string') {
            this.body[key] = '';
        }
    };

    this.body = {
        nome: this.body.nome,
        sobrenome: this.body.sobrenome,
        telefone: this.body.telefone,
        email: this.body.email,
        belongTo: this.owner
    };
};
Contato.prototype.edit = async function (id) {
    if (typeof id !== 'string') return;
    this.valida()
    if (this.errors.length > 0) return;

    this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true });
};
// metodos estaticos
Contato.buscaContato = async function (id) {
    const contato = await ContatoModel.findById(id)
    return contato
};
Contato.buscaContatos = async function (user) {
    const contatos = await ContatoModel.find({belongTo: user})
        .sort({ criadoEm: -1 })

    return contatos
};
Contato.delete = async function (id) {
    if (typeof id !== 'string') return;
    const contato = await ContatoModel.findOneAndDelete({ _id: id })

    return contato
};
module.exports = Contato;