const slackService = {
  insertTicket(db, ticket){
    return db('queue')
      .insert('ticket')
      .returning('*')
      .then(([ticket]) => ticket );
  }
}

module.exports = slackService;