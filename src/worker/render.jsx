import React from 'react';
import ReactDOMServer from 'react-dom/server';

export function render() {
  return ReactDOMServer.renderToNodeStream(
    <html>
      <head>
        <title>React SSR Workers</title>
      </head>
      <body>
        <div id="app">Hello :)</div>
      </body>
    </html>
  );
}
