const dataService = {
  getStudentData(db, user_name) {
    return db.from('queue')
      .select(
        'queue.id',
        'queue.description',
        'queue.user_name',
        'queue.room',
        'queue.mentor_notes',
        'queue.student_notes',
        'user.full_name as studentName',
        'mentor.full_name as mentorName'
      )
      .where({ completed: true })
      .andWhere('queue.user_name', user_name)
      .rightJoin('user', 'queue.user_name', 'user.user_name')
      .leftJoin('user AS mentor', 'queue.mentor_user_name', 'mentor.user_name')
      .orderBy('id', 'dsc');
  },

  getNotes(db) {
    return db.from('queue')
      .select(
        'queue.user_name',
        'queue.mentor_notes AS note',
        'user.full_name as studentName'
      )
      .leftJoin('user', 'queue.user_name', 'user.user_name');
  },
  getByNoteId(db, noteHash){
    return db.from('queue').select('mentor_user_name','user_name').where({room: noteHash}).first();
  },
  updateNote(db, noteHash, note){
    return db.into('queue').where({room: noteHash}).update(note)
  },
 
};

module.exports = dataService;