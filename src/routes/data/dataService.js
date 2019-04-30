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


};

module.exports = dataService;