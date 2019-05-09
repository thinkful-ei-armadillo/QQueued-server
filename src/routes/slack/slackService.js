const slackService = {
  insertTicket(db, ticket){
    return db('queue')
      .insert(ticket)
      .returning('*')
      .then(([ticket]) => ticket );
  },
  getByUserName(db, user_name){
    return db.into('user').select('*').where({user_name}).first();
  },
  updateSlackId(db, user_name, slack_user_id){
    return db.into('user').where({user_name}).update({slack_user_id});
  }
};

module.exports = slackService;