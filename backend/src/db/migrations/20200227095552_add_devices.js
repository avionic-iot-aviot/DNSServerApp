exports.up = async function(knex) {
  await knex.schema.createTable("devices", table => {
    table.increments("id").primary();
    table.string("mac_address");
    table.string("dns_name_auto");
    table.string("dns_name_manual");
    table.text("description");
    table.boolean("is_gw");
    table.integer("gw_id");
    
    table.timestamps(true, true);
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists("devices");
};
