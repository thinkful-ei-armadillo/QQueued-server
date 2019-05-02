const dataService = {

  getCompleted(db) {
    return db.from('queue')
      .select(
        'queue.id',
        'queue.description',
        'queue.user_name',
        'user.full_name as studentName',
        'mentor.full_name as mentorName'
      )
      .where({ completed: true })
      .rightJoin('user','queue.user_name', 'user.user_name')
      .leftJoin('user AS mentor', 'queue.mentor_user_name', 'mentor.user_name')
      .orderBy('id', 'dsc');
  },

  getStudent(db, user_name) {
    return db.from('queue')
      .select(
        'queue.id',
        'queue.description',
        'queue.user_name',
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
    return db.from('studentData')
      .select(
        'studentData.user_name',
        'note',
        'user.full_name as studentName'
      )
      .leftJoin('user', 'studentData.user_name', 'user.user_name');
  },

  postNote(db, note, queue_id) {
    return db
      .into('studentData')
      .where({ queue_id })
      .update({ note }, ['user_name', 'note'])
      .then(note => note);
  }

};

module.exports = dataService;