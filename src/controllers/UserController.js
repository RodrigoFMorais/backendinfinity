const connection = require('../database/connection');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const saltRounds = 10;


module.exports = {
  async index(request, response) {
    const userid = request.headers.userid;
    const password = request.headers.password;

    const user = await connection('users')
      .where({
          'userid': userid
      })
      .select('passwd')
      .first();

    if ((!user) || (!(await bcrypt.compare(password, user.passwd)))) {
      return response.status(400).json({
          error: 'Você não tem permissão para listar usuários!'
        });
    }

    const users = await connection('users').select('name', 'userid', 'email', 'cpf');
  
    return response.json({users});
  },

  async create(request, response) {
    const {name, password, email, telephone, cpf} = request.body;

    if ((!name) || (!password) || (!email) || (!telephone) || (!cpf)) {
      return response.status(400).json("Todos os campos são obrigatórios!");
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
      return response.json({userid}); 
    })
    .catch(function(err) {
      if(err.message.includes('duplicate key value violates unique constraint')) {
        return response.status(400).json("E-mail já cadastrado!");
      } 
    });
  },

  async update(request, response) {
    const userid = request.headers.userid;
    const password = request.headers.password;

    const user = await connection('users')
        .where({
            'userid': userid
        })
        .select('passwd')
        .first();

    if ((!user) || (!(await bcrypt.compare(password, user.passwd)))) {
        return response.status(400).json({
            error: 'Você não possui permissão para realizar está tarefa.'
          });
    };

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