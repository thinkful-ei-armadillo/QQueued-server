const QueueService = require('./queueService');

const helperQueue = {
  async getQueueData(req) {
      const pointer = await QueueService.getPointers(req.app.get('db'));
      const list = await QueueService.getAll(req.app.get('db'));
      const queueList = list.filter(listItem => listItem.id >= pointer.head);
      const currentlyBeingHelped = list.filter(list => list.dequeue === true && list.completed === false);

      return {queueList, currentlyBeingHelped}
  }

}

module.exports = helperQueue;