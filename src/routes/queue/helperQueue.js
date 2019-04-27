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
  },
  async addToQueue(db, studentInLine){
    const pointer = await QueueService.getPointers(db);
      
      await QueueService.enqueue(db, studentInLine).then(
        res => (studentInLine = res)
      );

      if (pointer.head === null)
        await QueueService.updateBothPointers(
          db,
          studentInLine.id
        );
      else {
        await QueueService.updateTailPointer(
          db,
          studentInLine.id
        );
        await QueueService.updateQueue(
          db,
          pointer.tail,
          studentInLine.id
        );
      }
  }
};

module.exports = helperQueue;