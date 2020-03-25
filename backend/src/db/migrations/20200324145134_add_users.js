exports.up = async function(knex) {
  await knex.schema.createTable("users", table => {
    table.increments("id").primary();
    table.string("email");
    table.string("username");
    table.integer("tenant_id");
    table.timestamps(true, true);
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists("users");
};
