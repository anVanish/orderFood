

class ApiRes{
    constructor(){
        this.success = ''
        this.message = ''
        this.data = {}
    }

    setSuccess(message=''){
        this.success = true
        this.message = message
        return this
    }

    setFailure(message=''){
        this.success = false
        this.message = message
        return this
    }

    setData(field, data){
        this.data[field] = data
        return this
    }
}

module.exports = ApiRes