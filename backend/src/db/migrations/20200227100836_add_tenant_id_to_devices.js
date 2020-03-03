exports.up = async function(knex) {
  await knex.schema.table("devices", table => {
    table.integer("tenant_id");
  });
};

exports.down = async function(knex) {
  await knex.schema.table("devices", table => {
    table.dropColumn("tenant_id");
  });
};
