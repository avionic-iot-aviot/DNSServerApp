exports.up = async function(knex) {
  await knex.schema.createTable("device_registrations", table => {
    table.increments("id").primary();
    table.string("mac_address");
    table.string("name");
    table.timestamps(true, true);
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists("device_registrations");
};
