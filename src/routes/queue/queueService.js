const QueueService = {
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
        'queue.slack_user_id',
        'user.full_name as studentName',
        'mentor.full_name as mentorName'
      )
      .where({completed: false})
      .rightJoin('user','queue.user_name', 'user.user_name')
      .leftJoin('user AS mentor', 'queue.mentor_user_name', 'mentor.user_name')
      .orderBy('id', 'asc');
  },

  getCompleted(db) {
    return db.from('queue')
      .select(
        'queue.id',
        'queue.description',
        'queue.user_name',
        'user.full_name as studentName'
      )
      .where({ completed: true })
      .rightJoin('user', 'queue.user_name', 'user.user_name')
      .orderBy('id', 'asc');
  },

  enqueue(db, data){
    return db
      .insert(data)
      .into('queue')
      .returning('*')
      .then(([queue]) => queue)
      .then(queue =>
        QueueService.getById(db, queue.id)
      );
  },

  addStudentData(db, data) {
    return db
      .insert(data)
      .into('studentData');
  },

  updateStudentData(db, id, data) {
    return db
      .into('studentData')
      .where({ queue_id: id })
      .update({ helped_by: data });
  },

  getById(db, id) {
    return QueueService.getAll(db)
      .where('queue.id', id)
      .first();
  },
  updateQueue(db, idToUpdate, newTailId){
    return db
      .into('queue')
      .where({ id: idToUpdate })
      .update({next: newTailId});
  },
  updateTailPointer(db, newTailId){
    return db.into('pointers').update({tail: newTailId});
  },
  updateHeadPointer(db, newHeadId){
    return db.into('pointers').update({head: newHeadId});
  },
  dequeue(db, idToUpdate, data){
    return db.into('queue').where({id: idToUpdate}).update(data);
  },
  updateBothPointers(db, newHeadId){
    return db.into('pointers').update({head: newHeadId, tail: newHeadId});
  },
  updateSessionToComplete(db, idForSession, completed){
    return db.into('queue').where({id: idForSession}).update(completed);
  }
};


module.exports = QueueService;