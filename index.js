const express = require('express')
const app = express()
const client = require('./conexao')
const dbo = client.db('cafeteria')
const porta = 3000
const exphbs = require('express-handlebars')
const hbs = exphbs.create({
    partialsDir: 'views/partials',
});
const ObjectId = require('mongodb').ObjectId; 

app.engine('handlebars',hbs.engine)
app.set('view engine','handlebars')

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res)=>{
  res.render('home')
})

app.get('/cadastrarFuncionarios', (req, res)=>{
  let acao = "Cadastrar"
  res.render('cadastrarFuncionarios', {acao})
})

app.post('/cadastrarFuncionarios', (req,res)=>{
    const funcionarios = {
        nomeFunc: req.body.nomeFunc,
        enderecoFunc: req.body.enderecoFunc,
        emailFunc: req.body.emailFunc,
        salarioFunc: req.body.salarioFunc
    }

    if(req.body.idFuncionario == ""){    
    dbo.collection('funcionarios').insertOne(funcionarios,(erro,resultado)=>{
        if(erro) throw erro
        res.redirect('/cadastrarFuncionarios')
      })
    }else{
      let idFuncionario = req.body.idFuncionario
      let objFuncionario = new ObjectId(idFuncionario)
      dbo.collection('funcionarios').updateOne(
        {_id:objFuncionario},
        {$set:funcionarios},
        {upsert:true}, (erro, resultado)=>{
          if(erro)throw erro
        })
      res.redirect('/listarFuncionarios')
    }
   
})

app.get('/listarFuncionarios', (req,res)=>{
    dbo.collection('funcionarios').find({}).toArray((erro,resultado)=>{
        if(erro)throw erro
        res.render('listarFuncionarios', {resultado})
    })
})

app.get('/deletarFuncionarios/:id', (req,res)=>{
  let idFuncionario = req.params.id
  let obj_id = new ObjectId(idFuncionario)
  dbo.collection('funcionarios').deleteOne({_id:obj_id}, (erro, resultado)=>{
      if(erro)throw erro
      res.redirect('/listarFuncionarios')
  })  
})

app.get('/editarFuncionarios/:id',(req,res)=>{
  let idFuncionario = req.params.id
  let obj_id = new  ObjectId(idFuncionario)
  let acao = "Salvar"
  dbo.collection('funcionarios').findOne({_id:obj_id},(erro,resultado)=>{
    if(erro)throw erro
    res.render('cadastrarFuncionarios',{resultado, acao})
  })
})


app.get('/cadastrarClientes', (req, res)=>{
  let acao = "Cadastrar"
  res.render('cadastrarClientes', {acao})
})

app.post('/cadastrarClientes', (req,res)=>{
    const clientes = {
        nomeCliente: req.body.nomeCliente,
        cpfCliente:req.body.cpfCliente,
        emailCliente: req.body.emailCliente,
        enderecoCliente: req.body.enderecoCliente,      
    }

    if(req.body.idCliente == ""){    
    dbo.collection('clientes').insertOne(clientes,(erro,resultado)=>{
        if(erro) throw erro
        res.redirect('/cadastrarClientes')
      })
    }else{
      let idCliente = req.body.idCliente
      let objCliente = new ObjectId(idCliente)
      dbo.collection('clientes').updateOne(
        {_id:objCliente},
        {$set:clientes},
        {upsert:true}, (erro, resultado)=>{
          if(erro)throw erro
        })
      res.redirect('/listarClientes')
    }
   
})

app.get('/listarClientes', (req,res)=>{
    dbo.collection('clientes').find({}).toArray((erro,resultado)=>{
        if(erro)throw erro
        res.render('listarClientes', {resultado})
    })
})

app.get('/deletarClientes/:id', (req,res)=>{
  let idCliente = req.params.id
  let obj_id = new ObjectId(idCliente)
  dbo.collection('clientes').deleteOne({_id:obj_id}, (erro, resultado)=>{
      if(erro)throw erro
      res.redirect('/listarClientes')
  })  
})

app.get('/editarClientes/:id',(req,res)=>{
  let idCliente = req.params.id
  let obj_id = new  ObjectId(idCliente)
  let acao = "Salvar"
  dbo.collection('clientes').findOne({_id:obj_id},(erro,resultado)=>{
    if(erro)throw erro
    res.render('cadastrarClientes',{resultado, acao})
  })
})

app.listen(porta, ()=>{
  console.log('Servidor rodando... Porta: ' + porta)
})
