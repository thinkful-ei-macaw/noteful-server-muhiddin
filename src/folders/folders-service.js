const FoldersService = {
  getAllFolders(knex) {
    return knex.select('*').from('folders_table');
  },

  getFolderNotes(db, folder_id) {
    return db
      .from('notes_table')
      .select('*')
      .where('folder_id', folder_id)
      .orderBy('modified', 'desc');
  },

  insertFolder(knex, newFolder) {
    return knex
      .insert(newFolder)
      .into('folders_table')
      .returning('*')
      .then(rows => {
        return rows[0];
      })
      .catch((err) => {
        console.log(err);
      });
  },

  getById(knex, folder_id) {
    return knex
      .from('folders_table')
      .select('*')
      .where('folder_id', folder_id)
      .first();
  },

  deleteFolder(knex, folder_id) {
    return knex('folders_table')
      .where({ folder_id })
      .delete();
  },

  updateFolder(knex, folder_id, newFolderFields) {
    return knex('folders_table')
      .where({ folder_id })
      .update(newFolderFields);
  },
};

module.exports = FoldersService;