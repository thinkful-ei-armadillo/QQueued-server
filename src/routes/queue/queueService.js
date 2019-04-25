const QueueService ={
  getPointers(db){
    return db.from('pointers').select('*').first();
  },
  getAll(db) {
    return db.from('queue')
    .select('queue.description', 
      'queue.id',
      'queue.user_id',
      'queue.completed', 
      'queue.dequeue', 
      'queue.next',
      'user.name as studentName',
      'mentor.name as mentorName'
   )
    .where({completed: false})
    .rightJoin('user','queue.user_id', 'user.id')
    .leftJoin('user AS mentor', 'queue.mentor_id', 'mentor.id');
  }
};
module.exports = QueueService;