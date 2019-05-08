const slackService = {
  insertTicket(db, ticket){
    return db('queue')
      .insert(ticket)
      .returning('*')
      .then(([ticket]) => ticket );
  },
  getByUserName(db, user_name){
    return db.into('user').select('*').where({user_name}).first();
  }
}

module.exports = slackService;