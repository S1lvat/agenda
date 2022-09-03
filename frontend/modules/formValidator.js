const validator = require('validator')

export default class FormValidator {
    constructor(formClass) {
        this.form = document.querySelector(formClass)
        this.errors = false
    };
    init() {
        this.events()
    };
    events() {
        if (!this.form) return

        this.form.addEventListener('submit', e => {
            e.preventDefault()
            this.validator(e)
        })
    };
    validator(e) {
        const el = e.target
        const emailInput = el.querySelector("input[name='email']")
        const passwordInput = el.querySelector("input[name='password']")

        this.eraseErrors(emailInput)
        this.eraseErrors(passwordInput)

        if (emailInput.value) {
            fetch(`/login/buscaUser/${emailInput.value}`)
                .then(res => res.json())
                .then(data => {
                    if (data && data.email == emailInput.value) {
                        this.criaErrors('Usuario ja cadastrado!', emailInput)
                    }
                })
        }

        if (!validator.isEmail(emailInput.value)) this.criaErrors("Insira um e-mail válido!", emailInput)
        if (passwordInput.value.length < 3 || passwordInput.value.length > 50) this.criaErrors("A senha precisa ter entre 3 e 50 caracteres!", passwordInput)


        if(!this.errors) this.form.submit()
    };
    eraseErrors(destiny) {
        const exists = this.form.querySelector(`.${destiny.name}`)
        exists && exists.remove()
    };
    criaErrors(msg, destiny) {
        const divErrors = document.createElement('div')
        divErrors.classList.add(destiny.name)
        divErrors.innerHTML = msg
        divErrors.style = "font-size: 11px; margin: 5px 0; color: red;"

        destiny.insertAdjacentElement('afterend', divErrors)
        this.errors = true
    };
}