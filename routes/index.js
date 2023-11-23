const AuthRouter = require('./routers/AuthRouter')
const FoodRouter = require('./routers/FoodRouter')
const CateRouter = require('./routers/CateRouter')
const CartRouter = require('./routers/CartRouter')
const OrderRouter = require('./routers/OrderRouter')
const UserRouter = require('./routers/UserRouter')

function route(app){
    app.use('/api/v1/auth', AuthRouter)
    app.use('/api/v1/foods', FoodRouter)
    app.use('/api/v1/categories', CateRouter)
    app.use('/api/v1/carts', CartRouter)
    app.use('/api/v1/orders', OrderRouter)
    app.use('/api/v1/users', UserRouter)
}

module.exports = route