
exports.up = function(knex) {
  return knex.schema.createTable('stores', function (table) {
    table.string('storeid').primary();
    table.string('name').notNullable();
    table.string('description').notNullable();
    table.float('lat').notNullable();
    table.float('lon').notNullable();
    table.string('categoria').notNullable();
    table.string('logoname');
    table.string('logourl');
    table.string('userid').notNullable();

    table.unique(['lat','lon']);
    table.foreign('userid').references('userid').inTable('users');
});
};

exports.down = function(knex) {
  return knex.schema.dropTable('stores');
};
