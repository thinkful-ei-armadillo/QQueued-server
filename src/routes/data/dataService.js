const dataService = {

  getData(db) {
    return db
      .from('studentData')
      .select('*');
  }

};

module.exports = dataService;