const QueueService = require('./queueService');

const helperQueue = {
  async getQueueData(db) {
    const pointer = await QueueService.getPointers(db);
    const mentorList = await QueueService.getAll(db);
    let queueList = [];
    let hasBeenHelpedList = [];

    const currentlyBeingHelped = mentorList.filter(list => list.dequeue === true && list.completed === false);
    hasBeenHelpedList = await QueueService.getCompleted(db);

    if (pointer.head !== null)
      queueList = mentorList.filter(listItem => listItem.id >= pointer.head);
    return { queueList, currentlyBeingHelped, hasBeenHelpedList };
  }

};

module.exports = helperQueue;