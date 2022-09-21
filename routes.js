const express = require('express')
const route = express.Router()
const homeController = require('./src/controllers/homeController')
const contactController = require('./src/controllers/contactController')

route.get('/', homeController.homePage)
route.post('/', homeController.sendForm)

// Contato
route.get('/contact', contactController.showContact)

module.exports = route
