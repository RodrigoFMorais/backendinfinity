const connection = require('../database/connection');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

function parseToken(token){
  var decode = jwt.verify(token, process.env.SECRET);
  return decode;
};

module.exports = {
  async index(request, response) {

    const users = await connection('users').select('name', 'userid', 'email', 'cpf');
  
    return response.json({users});
  },

  async create(request, response) {
    const {name, password, email, telephone, cpf} = request.body;

    if ((!name) || (!password) || (!email) || (!telephone) || (!cpf)) {
      return response.status(422).json({erros: [{title: 'Operação não permitida', detail: 'Todos os campos são obrigatórios!'}]});
    }

    const userid = crypto.randomBytes(4).toString('HEX');
  
    const passwd = await bcrypt.hash(password, saltRounds);
  
    await connection('users').insert({
      userid,
      name,
      passwd,
      email,
      telephone,
      cpf,
    }).then(function(){
      return response.status(200).json({userid: userid}); 
    })
    .catch(function(err) {
      if(err.message.includes('duplicate key value violates unique constraint')) {
        return response.status(403).send({erros: [{title: 'Operação não permitida', detail: 'E-mail já é cadastrado!'}]});
      } 
    });
  },

  async update(request, response) {
    const token = request.headers.authorization;
    const data = parseToken(token);  
    const userid = data.userid;

    const {name, email, telephone, cpf} = request.body;

    if ((!name) || (!email) || (!telephone) || (!cpf)) {
      return response.status(400).json("Todos os campos são obrigatórios!");
    }

    await connection('users')
    .where({
      'userid': userid,
    })
    .update({
      name,
      email,
      telephone,
      cpf,
    }).then(function(){
      return response.json("Atulização realizada com sucesso!"); 
    });
  }

};