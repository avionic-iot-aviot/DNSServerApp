exports.up = async function(knex) {
  await knex.schema.createTable("tenants", table => {
    table.increments("id").primary();
    table.string("name");
    table.timestamps(true, true);
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists("tenants");
};
