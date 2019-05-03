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
      .then(data => {
        const studentName = db
          .select('full_name')
          .from('user')
          .where('user_name', data.user_name);
        return [
          studentName,
          ...data,
        ];
      });
  }

  // update description on queue edit route

};

module.exports = dataService;