require('@babel/register');

const { parentPort } = require('worker_threads');
const { MESSAGE_TYPE } = require('./constants');
const { render } = require('./render');

const BUFFER_BYTE_LENGTH = 10000;

const sharedArrayBuffer = new SharedArrayBuffer(BUFFER_BYTE_LENGTH);
const sharedBuffer = Buffer.from(sharedArrayBuffer);

parentPort.on('message', () => {
  try {
    let byteOffset = 0;

    postMessage(MESSAGE_TYPE.BUFFER, sharedArrayBuffer);

    render()
      .on('data', (data) => {
        const { byteLength } = data;

        sharedBuffer.fill(data, byteOffset);
        byteOffset += byteLength;

        postMessage(MESSAGE_TYPE.CHUNK, { byteOffset, byteLength });
      })
      .on('end', () => postMessage(MESSAGE_TYPE.END));
  } catch (error) {
    postMessage(MESSAGE_TYPE.ERROR, error.stack);
  }
});

function postMessage(type, payload) {
  parentPort.postMessage({ type, payload });
}
