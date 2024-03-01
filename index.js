const express = require("express");
const mysql = require("mysql");

const app = express();
const port = process.env.PORT || 3000;

//database config
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "root",
    database: 'databaseweb3'
});

db.connect(err=>{
    if(err){
        console.error('Erro ao conectar ao MySQL', err);
    } else {
        console.log('Conectado ao Mysql');
    }
});

//json
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// get method

app.get('/api/usuarios',(_,res)=>{
    const q = 'SELECT * FROM usuario';
    db.query(q, (err, data)=>{
        if(err){
            console.error('Erro ao buscar registros ' + err.message);
            res.status(500).json({error: 'erro ao buscar registros'});
        } else {
            res.status(200).json(data);
        }
    });
});

//post method
app.post('/api/usuarios', (req, res) => {
    const {nome, email, senha} = req.body;

    const q = 'INSERT INTO usuario (nome,email, senha) VALUES (?,?,?)';
    db.query(q, [nome, email, senha], (err) => {
        if (err) {
            console.error('Erro ao inserir registro: ' + err.message)
            res.status(500).json({error: 'Erro ao inserir registro'})
        } else {
            console.log('Registro inserido com sucesso!');
            res.status(201).json({message: 'Registro inserido com sucesso'})
        }
    });
});
// put method
app.put('/api/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const {nome, email, senha} = req.body;

    const q = 'UPDATE usuario SET nome = ?, email = ?, senha = ?  WHERE id = ?';
    db.query(q, [nome, email, senha, id], (err) => {
        if (err) {
            console.error('Erro ao Atualizar registro: ' + err.message)
            res.status(500).json({error: 'Erro ao inserir registro'})
        } else {
            console.log('Registro Atualizado com sucesso!');
            res.status(201).json({message: 'Registro Atualizado com sucesso'})
        }
    });
});

//delete method
app.delete('/api/usuarios/:id', (req, res) => {
    const { id } = req.params;

    const q = 'DELETE FROM usuario WHERE id = ?';
    db.query(q, [id], (err, data) => {
        if (err) {
            console.error('Erro ao Excluir registro: ' + err.message)
            res.status(500).json({error: 'Erro ao Excluir registro'})
        } else {
            if (data.affectedRows > 0){
                console.log('Registro excluido com sucesso!');
                res.status(200).json({message: 'Registro excluido com sucesso'})
            } else {
                console.log('Registro não encontrado');
                res.status(404).json({message: 'Registro não encontrado'})
            }
        }
    });
});

app.listen(port, () => {
    console.log('Servidor iniciado')
})