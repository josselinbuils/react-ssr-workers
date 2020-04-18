import path from 'path';
import { MESSAGE_TYPE } from './worker/constants';
import { WorkerPool } from './WorkerPool';

const workerPool = new WorkerPool(path.join(__dirname, 'worker/worker.js'), 4);

export function requestHandler(req, res) {
  workerPool.exec(
    (worker) =>
      new Promise((resolve) => {
        let sharedBuffer;

        function endRequest() {
          res.end();
          worker.off('message', messageHandler);
          resolve();
        }

        function messageHandler({ type, payload }) {
          switch (type) {
            case MESSAGE_TYPE.BUFFER:
              sharedBuffer = Buffer.from(payload);
              break;

            case MESSAGE_TYPE.CHUNK:
              const { byteOffset, byteLength } = payload;

              res.write(
                sharedBuffer
                  .slice(byteOffset, byteOffset + byteLength)
                  .toString()
              );
              break;

            case MESSAGE_TYPE.END:
              endRequest();
              break;

            case MESSAGE_TYPE.ERROR:
              console.error(payload);
              endRequest();
              break;

            default:
              console.error(`Unknown message type: ${type}`);
              endRequest();
          }
        }

        worker.on('message', messageHandler);
        worker.postMessage('');
      })
  );
}
