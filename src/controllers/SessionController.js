const connection = require('../database/connection');
const bcrypt = require('bcrypt');

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

        return response.json(user);

    },

};