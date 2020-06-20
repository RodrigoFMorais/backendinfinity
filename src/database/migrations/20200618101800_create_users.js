
exports.up = function(knex) {
  return knex.schema.createTable('users', function (table) {
    table.string('userid').primary();
    table.string('name').notNullable();
    table.string('passwd').notNullable();
    table.string('email').unique().notNullable();
    table.string('telephone').notNullable();
    table.string('cpf').notNullable();
});
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
