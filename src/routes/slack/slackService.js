const slackService = {
  insertUser(db, user){
    return db('queue')
      .insert('user')
      .returning('*')
      .then(([user]) => user );
  }
}

module.exports = slackService;