const AuthRouter = require('./routers/AuthRouter')

function route(app){
    app.use('/api/v1/auth', AuthRouter)
}

module.exports = route