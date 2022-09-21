require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

const urlConnection = process.env.CONNECTIONSTRING
const config = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose
    .connect(urlConnection, config)
    .then(() => app.emit('done'))
    .catch(error => console.error(error))

const session = require('express-session')
const MongoStore = require('connect-mongo')
const flashMessages = require('connect-flash')
const path = require('path')
const routes = require('./routes')
const helmet = require('helmet')
const csrf = require('csurf')
const {
    myMiddleware,
    checkCSRFError,
    csrfMiddleware
} = require('./src/middlewares/middleware')

app.use(helmet())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'public')))

const sessionOptions = session({
    secret: 'Shut up Meg', // Family Guy reference
    store: MongoStore.create({ mongoUrl: urlConnection }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
})
app.use(sessionOptions)
app.use(flashMessages())

app.set('views', path.resolve(__dirname, 'src', 'views', 'pages'))
app.set('view engine', 'ejs')

app.use(csrf())
app.use(myMiddleware)
app.use(checkCSRFError)
app.use(csrfMiddleware)
app.use(routes)

app.on('done', () => {
    app.listen(3000, () => console.log('Server is running on 3000'))
})
