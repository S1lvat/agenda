import 'core-js/stable'
import 'regenerator-runtime/runtime'

import FormValidator from './modules/formValidator'

const login =  new FormValidator('.form-login')
const register = new FormValidator('.form-cadastro')

login.init()
register.init()