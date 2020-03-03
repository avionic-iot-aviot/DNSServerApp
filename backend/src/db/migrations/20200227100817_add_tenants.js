exports.up = async function(knex) {
  await knex.schema.createTable("tenants", table => {
    table.increments("id").primary();
    table.string("edge_interface_name");
    table.text("description");

    table.timestamps(true, true);
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists("tenants");
};
