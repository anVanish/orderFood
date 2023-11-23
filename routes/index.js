const AuthRouter = require('./routers/AuthRouter')
const FoodRouter = require('./routers/FoodRouter')

function route(app){
    app.use('/api/v1/auth', AuthRouter)
    app.use('/api/v1/foods', FoodRouter)
}

module.exports = route