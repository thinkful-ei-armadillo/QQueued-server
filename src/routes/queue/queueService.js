const QueueService ={
  getPointers(db){
    return db.from('pointers').select('*').first();
  },
  getAll(db) {
    return db.from('queue').select('*').where({completed: false});
  }
};
module.exports = QueueService;