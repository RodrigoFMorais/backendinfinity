const connection = require('../database/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function parseToken(token){
    var decode = jwt.verify(token, process.env.SECRET);
    return decode;
};

module.exports = {
    async create(request, response) {

        const {
            email,
            password
        } = request.body;

        const user = await connection('users')
            .where({
                'email': email
            })
            .select('name', 'userid', 'passwd')
            .first();

        if (!user) {
            return response.status(400).json({
                error: 'Falha no login! Verique e-mail e senha!'
            });
        }

        if (!(await bcrypt.compare(password, user.passwd))) {
            return response.status(400).json({
                error: 'Falha no login! Verique e-mail e senha!'
            });
        }

        const token = jwt.sign({
            userid: user.userid,
            password: password,
          }, process.env.SECRET, { expiresIn: '1h' });

        return response.json(token);

    },


    async autMid(request, response, next) {
        const token = request.headers.authorization;

        if (token) {
            
            const data = parseToken(token);            
            
            const {
                userid,
                password,
            } = data;

            const user = await connection('users')
                .where({
                    'userid': userid,
                })
                .select('passwd')
                .first();

            if ((!user) || (!(await bcrypt.compare(password, user.passwd)))) {
                return response.status(422).send({erros: [{title: 'Você não tem autorização!', detail: 'Você precisa logar para ter acesso!'}]})
            }
            next();

        } else {
            return response.status(422).send({erros: [{title: 'Você não tem autorização!', detail: 'Você precisa logar para ter acesso!'}]})
        }
    }
};