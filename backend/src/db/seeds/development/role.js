exports.seed = function (knex, Promise) {
    let tableName = 'roles';
    let rows = [
        { name: 'admin' },
        { name: 'super_admin'},
    ];
  
    return await knex(tableName)
      .del()
      .then(function () {
        return knex.insert(rows).into(tableName);
      });
  
  };