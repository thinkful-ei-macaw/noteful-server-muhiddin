const NotesService = {
  getAllNotes(knex) {
    return knex.select('*').from('notes_table');
  },

  insertNote(knex, newNote) {
    return knex
      .insert(newNote)
      .into('notes_table')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  getById(knex, note_id) {
    return knex
      .from('notes_table')
      .select('*')
      .where('note_id', note_id)
      .first();
  },

  deleteNote(knex, note_id) {
    return knex('notes_table')
      .where({ note_id })
      .delete();
  },

  updateNote(knex, note_id, newNoteFields) {
    return knex('notes_table')
      .where({ note_id })
      .update(newNoteFields);
  },
};

module.exports = NotesService;