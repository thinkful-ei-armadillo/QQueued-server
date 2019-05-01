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
      
    const data = await QueueService.enqueue(db, studentInLine).then(
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
    return data;
  },
  async deleteStudentFromQueue(db, res, queuetoDeleteId, titleOfUser, user_name){
    const pointer = await QueueService.getPointers(db);

    if(pointer.head === null)
      return res.status(404).json({
        error: 'no one is in line to remove'
      });
    
    else if(pointer.head === queuetoDeleteId && pointer.head === pointer.tail){
      await QueueService.updateBothPointers(db, null)
      await QueueService.removeFromQueue(db, pointer.head);
      return res.status(204).end()
    }
    
    let queueBefore = await QueueService.getById(db, pointer.head);

    if(pointer.head === queueBefore.id && pointer.head === queuetoDeleteId){
      await QueueService.updateHeadPointer(db, queueBefore.next)
      await QueueService.removeFromQueue(db, queueBefore.id);
      return res.status(204).end()
    }

    if(queueBefore.next === null)
      res.status(404).json({
        error: 'you are not in line'
      });
    
    let currentQueue = await QueueService.getById(db, queueBefore.next);
    
    while(currentQueue.id !== queuetoDeleteId && currentQueue.next !== null){
      queueBefore = currentQueue;
      currentQueue = await QueueService.getById(db, currentQueue.next)
    } 

    if(currentQueue.next === null && currentQueue.id !== queuetoDeleteId)
      return res.status(404).json({
        error: 'the queue position you submitted doesn\'t exist'
      })

    else if(currentQueue.user_name !== user_name && titleOfUser === 'student')
      return res.status(400).json({
        error:`you do not have permission to remove ${currentQueue.studentName} from the line`
      });
    
    if(currentQueue.id === queuetoDeleteId && currentQueue.next === null){
      await QueueService.updateQueue(db, queueBefore.id, currentQueue.next);
      await QueueService.removeFromQueue(db, currentQueue.id);
      await QueueService.updateTailPointer(db, queueBefore.id)
      return res.status(204).end()
    }

    await QueueService.updateQueue(db, queueBefore.id, currentQueue.next);
    await QueueService.removeFromQueue(db, currentQueue.id);
      
  }
  
};

module.exports = helperQueue;