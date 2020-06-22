const connection = require('../database/connection');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const aws = require('aws-sdk');
const jwt = require('jsonwebtoken');

function parseToken(token){
  var decode = jwt.verify(token, process.env.SECRET);
  return decode;
};

module.exports = {
  /* 
  * Lista as lojas cadastradas 
  */
  async index(request, response) {
    const filterObj = {...request.query};
    const removeFields = ['page', 'sort', 'limit', 'direc'];
    removeFields.forEach(el => delete filterObj[el]);

    if ((request.query.sort) && (request.query.direc)) {
      const stores = await connection('stores').where(filterObj).select('*').orderBy(request.query.sort, request.query.direc);
      return response.json(stores);
    }else{
      const stores = await connection('stores').where(filterObj).select('*');
      return response.json(stores);
    }
  },

  /* 
  * Cria o cadastro da loja 
  */
  async create(request, response) {
    const {token} = request.params;
    const data = parseToken(token);  
    const userid = data.userid;

    const {name, description, lat, lon, categoria} = request.body;
    //const { key: logoname, location: logourl} = request.file;

    //const logname = " ";
    //const logurl = " ";

    if ((!name) || (!description) || (!lat) || (!lon) || (!categoria)) {
      return response.status(400).json("Todos aqui os campos são obrigatórios!");
    }

    const storeid = crypto.randomBytes(5).toString('HEX');

    await connection('stores').insert({
      storeid, 
      name,
      description,
      lat,
      lon,
      categoria,
//      logoname,
//      logourl,
      userid,
    }).then(function(){
      return response.json({storeid}); 
    }).catch(function(err) {
      if(err.message.includes('duplicate key value violates unique constraint')) {
        return response.status(400).json("Loja já é cadastrado!");
      } 
    });
  },

  /* 
  * Deleta o cadastro da loja 
  */
  async delete(request, response) {
    const {storeid,token} = request.params;
    const data = parseToken(token);  
    const userid = data.userid;

    //const s3 = new aws.S3();

    const store = await connection('stores')
        .where('storeid', storeid)
        .select('userid','logoname')
        .first();
    
    if (store.userid != userid) {
        return response.status(400).json({
            error: 'Você não possui permissão para realizar está tarefa.'
          });
    };

    /*
    await s3.deleteObject({
      Bucket: process.env.BUCKET_NAME,
      Key: store.logoname,
    }, function(err, data) {
      if (err) console.log(err, err.stack);
      else     console.log(data);    
    });
    */

    //console.log(store.logoname);
    await connection('stores').where('storeid',storeid).delete();
    
    return response.status(204).send();
  },

  /* 
  * Atualiza o cadastro da loja 
  */
  async update(request, response) {
    const {storeid,token} = request.params;
    const data = parseToken(token);  
    const userid = data.userid;
  
    const store = await connection('stores')
    .where('storeid', storeid)
    .select('userid')
    .first();

    if (store.userid != userid) {
      return response.status(400).json({
          error: 'Você não possui permissão para realizar está tarefa.'
        });
  };

    const {name, description, lat, lon, categoria} = request.body;

    if ((!name) || (!description) || (!lat) || (!lon) || (!categoria)) {
      return response.status(400).json("Todos os campos são obrigatórios!");
    }

    await connection('stores')
    .where({
      'storeid': storeid,
    })
    .update({
      name,
      description,
      lat,
      lon,
      categoria,
    }).then(function(){
      return response.json("Cadastro da Loja modicado com sucesso!"); 
    }).catch(function(err) {
      if(err.message.includes('duplicate key value violates unique constraint')) {
        return response.status(400).json("Loja já é cadastrado!");
      } 
    });
  }

};