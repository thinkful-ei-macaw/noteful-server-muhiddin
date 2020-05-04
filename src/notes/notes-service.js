const NotesService = {
  getAllNotes(knex) {
    return knex.select('*').from('notes_table')
  },

  insertNote(knex, newNote) {
    return knex
      .insert(newNote)
      .into('notes_table')
      .returning('*')
      .then(rows => {
        return rows[0]
      });
  },

  getById(knex, id) {
    return knex
      .from('notes_table')
      .select('*')
      .where('id', id)
      .first();
  },

  deleteNote(knex, id) {
    return knex('notes_table')
      .where({ id })
      .delete();
  },

  updateNote(knex, id, newNoteFields) {
    return knex('notes_table')
      .where({ id })
      .update(newNoteFields);
  },
};

module.exports = NotesService;