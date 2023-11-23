const Categories = require('./app/models/Categories')
const Foods = require('./app/models/Foods')
const Users = require('./app/models/Users')

const {cates} = require('./data/categories')
const {foods} = require('./data/foods')

const dotev = require('dotenv')
const db = require('./config/db')
const bcrypt = require('bcryptjs')
dotev.config()
db.connect()

async function seedAdmin(){
    try{
        const admin = await Users.findOne({isAdmin: true})
        if (!admin){
            const salt = bcrypt.genSaltSync()
            const adminUser = new Users({
                email: 'admin@gmail.com',
                password: bcrypt.hashSync('admin', salt),
                isAdmin: true,
                isVerified: true,
            })
            await adminUser.save()
        }
        console.log('Admin success to import')
    }catch(error){
        console.log(`Admin failure to import, ${error.message}`)
    }
}
async function seedCates(){
    try{
        await Categories.deleteMany({})
        for (var cate of cates){
            const category = new Categories(cate)
            await category.save() 
        }
        console.log('Categories success to import')
    }catch(error){
        console.log(`Categories failure to import, ${error.message}`)
    }
}
async function seedFoods(){
    try{
        await Foods.deleteMany({})
        for (var foodItem of foods){
            const food = new Foods(foodItem)
            await food.save() 
        }
        console.log('Foods success to import')
    }catch(error){
        console.log(`Foods failure to import, ${error.message}`)
    }
}

seedAdmin()
seedCates()
seedFoods()