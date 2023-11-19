

function route(app){
    app.use('/', function(req, res){
        res.json('Hello world') 
    })
}

module.exports = route