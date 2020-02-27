exports.up = async function(knex) {
  await knex.schema.table("device_registrations", table => {
    table.integer("tenant_id");
  });
};

exports.down = async function(knex) {
  await knex.schema.table("device_registrations", table => {
    table.dropColumn("tenant_id");
  });
};
