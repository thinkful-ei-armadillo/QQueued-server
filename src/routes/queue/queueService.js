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
        'queue.slack_user_id',
        'user.user_name as studentName',
        'mentor.user_name as mentorName'
      )
      .where({completed: false})
      .rightJoin('user','queue.user_name', 'user.user_name')
      .leftJoin('user AS mentor', 'queue.mentor_user_name', 'mentor.user_name');
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
  }
};


module.exports = QueueService;