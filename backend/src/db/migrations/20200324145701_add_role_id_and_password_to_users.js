exports.up = async function(knex) {
    await knex.schema.table("users", table => {
      table.string("password");
      table.integer("role_id");
    });
  };
  
  exports.down = async function(knex) {
    await knex.schema.table("users", table => {
      table.dropColumn("password");
      table.dropColumn("role_id");
    });
  };
  