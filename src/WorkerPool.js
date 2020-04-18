import { Worker } from 'worker_threads';

export class WorkerPool {
  constructor(workerPath, size) {
    this.execQueue = [];
    this.workers = this.createWorkers(workerPath, size);
  }

  createWorkers(workerPath, size) {
    const workers = [];

    for (let i = 0; i < size; i++) {
      workers.push({
        busy: false,
        worker: new Worker(workerPath),
      });
    }

    return workers;
  }

  exec(func) {
    const worker = this.getAvailableWorker();

    if (worker !== undefined) {
      worker.busy = true;

      func(worker.worker).then(() => {
        worker.busy = false;

        if (this.execQueue.length > 0) {
          this.exec(this.execQueue.shift());
        }
      });
    } else {
      this.execQueue.push(func);
    }
  }

  getAvailableWorker() {
    return this.workers.find((worker) => !worker.busy);
  }
}
