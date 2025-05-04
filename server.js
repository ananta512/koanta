// server.js
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import net from 'net';
import { Buffer } from 'buffer';

const PORT = process.env.PORT || 8080;
const httpServer = createServer();
const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', (ws, req) => {
  const b64 = req.url.slice(1);               // "/cG93ZXI..."
  let target;
  try {
    target = Buffer.from(b64, 'base64').toString(); // "host:port"
  } catch (_) {
    ws.close(1008, 'Bad base64'); return;
  }
  const [host, port] = target.split(':');
  if (!host || !port) { ws.close(1008, 'Bad host'); return; }

  const tcp = net.connect({ host, port: +port }, () => {
    // Relay bytes in both directions
    ws.on('message', data => tcp.write(data));
    tcp.on('data', data => ws.send(data));
  });

  // propagate errors & closes
  const closeBoth = () => { ws.close(); tcp.destroy(); };
  tcp.on('error', closeBoth); ws.on('close', closeBoth);
});

httpServer.listen(PORT, () => {
  console.log('Proxy listening on', PORT);
});
