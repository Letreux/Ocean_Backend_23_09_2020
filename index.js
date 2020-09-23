const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectID

// Criando um bloco assíncrono e já executando esse bloco
(async () => {


const connectionString = 'mongodb+srv://Letreux:7ync166yPZ0bg4iE@cluster0.q5h9c.mongodb.net/Ocean_MongoDB?retryWrites=true&w=majority'

// async/await

console.info('Conectando ao banco de dados');

const client = await mongodb.MongoClient.connect(connectionString, {
    useUnifiedTopology: true
})

console.info('Conectado ao banco de dados');

const app = express();
const port = process.env.PORT || 3000;

const jsonParser = bodyParser.json();
app.use(jsonParser);

app.get('/', (req, res) => {
    res.send('Hello world com MongoDB!');
});

// Endpoints de envio de mensagens
// CRUD -> Create, Read (Read All e Read Single), Update and Delete
// CRUD -> Criar, Ler (Ler tudo e ler individualmente), atualizar e remover

const db = await client.db('Ocean_MongoDB')

const mensagens = await db.collection('Mensagens');

// Read All
app.get('/mensagens', async (req, res) => {
const findResult = await mensagens.find({}).toArray();

    res.json(findResult);
});

// Create
app.post('/mensagens', async (req, res) => {
    const mensagem = req.body

    const resultado = await mensagens.insertOne(mensagem)

    const objetoInserido = resultado.ops[0]

    res.json(objetoInserido)
});

// Read Single
app.get('/mensagens/:id', async (req, res) => {
    const id = req.params.id

    const mensagem = await mensagens.findOne({ _id: ObjectId(id) })

    res.json(mensagem)
});

// Update
app.put('/mensagens/:id', async (req, res) => {
    const id = req.params.id

    const novaMensagem = req.body

    const mensagemAtual = await mensagens.findOne({ _id: ObjectId(id) })

    mensagemAtual.texto = novaMensagem.texto

    const resultado = await mensagens.updateOne({ _id: ObjectId(id) }, { $set: mensagemAtual })

    res.json(mensagemAtual)
});

// Delete
app.delete('/mensagens/:id', async (req, res) => {
    const id = req.params.id

    const resultado = await mensagens.deleteOne({ _id: mongodb.ObjectID(id) })

    res.send(`Mensagem ${id} removida com sucesso.`)
});

app.listen(port, () => {
    console.log(`App rodando em http://localhost:${port}`);
});

// Fecho o bloco assíncrono
})();