const QueueService ={
  getPointers(db){
    return db.from('pointers').select('*').first();
  },
  getAll(db) {
    return db.from('queue')
    .select('queue.description', 
      'queue.id',
      'queue.user_name',
      'queue.completed', 
      'queue.dequeue', 
      'queue.next',
      'user.name as studentName',
      'mentor.name as mentorName'
   )
    .where({completed: false})
    .rightJoin('user','queue.user_name', 'user.user_name')
    .leftJoin('user AS mentor', 'queue.mentor_user_name', 'mentor.user_name');
  }
};
module.exports = QueueService;