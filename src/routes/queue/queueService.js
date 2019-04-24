const QueueService ={
  getAll(db) {
    return db.from('queue').select('*').where({completed: false});  }
};
module.exports = QueueService;