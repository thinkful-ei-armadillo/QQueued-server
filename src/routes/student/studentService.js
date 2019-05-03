const studentService = {

  updateDescription(db, id, description) {
    return db
      .from('queue')
      .where({ id })
      .update({ description }, ['description', 'queue.id']);
  }
};

module.exports = studentService;