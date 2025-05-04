// proxy.js
const WebSocket = require('ws');
const net       = require('net');

const PORT = process.env.PORT || 8080;
const wss  = new WebSocket.Server({ port: PORT });

wss.on('connection', (ws, req) => {
  // URL format: /<base64(host:port)>, e.g. /bWlub3RhdXJ4Lm5hLm1pbmUuenBvb2wuY2E6NzAxOQ==
  const b64 = req.url.slice(1);
  const [host, port] = Buffer.from(b64, 'base64').toString().split(':');

  const upstream = net.connect(+port, host);

  // pipe traffic both ways
  ws.on('message',  data => upstream.write(data));
  upstream.on('data',chunk => ws.send(chunk));

  // tidy up on close/error
  const closer = () => { try { upstream.destroy(); } catch {} try { ws.close(); } catch {} };
  ws.on('close', closer);
  upstream.on('close', closer);
  ws.on('error',  closer);
  upstream.on('error', closer);
});

console.log(`WSS proxy listening on :${PORT}`);
