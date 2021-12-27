const mongodb = require('mongodb').MongoClient
const url = 'mongodb+srv://alanadias:479856aa@cluster0.0h4vm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const client = new mongodb(url)

async function conectar() {
    try {
        await client.connect()
        console.log('Conectada ao Banco de dados')
    } catch (erro) {
        console.log('Infelizmente algo deu errado. Tente novamente')
    }
}
conectar()
module.exports = client