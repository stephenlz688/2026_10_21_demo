// 文迹降级版生产静态服务器
// 托管 frontend/dist，并把 /api/* 代理到后端 8082（去掉 /api 前缀）
const http = require('http');
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, 'dist');
const BACKEND_HOST = process.env.BACKEND_HOST || '127.0.0.1';
const BACKEND_PORT = Number(process.env.BACKEND_PORT || 8082);
const PORT = Number(process.env.PORT || 8090);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.wasm': 'application/wasm',
};

const server = http.createServer((req, res) => {
  const url = req.url || '/';

  // ---- API 代理：/api/* -> 后端（去掉 /api 前缀） ----
  if (url.startsWith('/api/')) {
    const targetPath = url.slice(4); // '/api/xxx' -> '/xxx'
    const proxyReq = http.request(
      {
        host: BACKEND_HOST,
        port: BACKEND_PORT,
        path: targetPath,
        method: req.method,
        headers: { ...req.headers, host: `${BACKEND_HOST}:${BACKEND_PORT}` },
      },
      (pRes) => {
        res.writeHead(pRes.statusCode, pRes.headers);
        pRes.pipe(res);
      }
    );
    proxyReq.on('error', (e) => {
      res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('后端暂不可用: ' + e.message);
    });
    req.pipe(proxyReq);
    return;
  }

  // ---- 静态文件（含 SPA fallback） ----
  const pathName = url.split('?')[0];
  let filePath = path.normalize(path.join(DIST, pathName));
  if (!filePath.startsWith(DIST)) filePath = path.join(DIST, 'index.html');

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isFile()) {
      res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      fs.readFile(path.join(DIST, 'index.html'), (e, data) => {
        if (e || !data) { res.writeHead(404); res.end('Not Found'); return; }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data);
      });
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`文迹降级版前端服务器已启动: http://0.0.0.0:${PORT}/ (后端 ${BACKEND_HOST}:${BACKEND_PORT})`);
});
