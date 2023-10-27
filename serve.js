import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'url';

const { dirname } = path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();


// 设置响应头
// app.use((req, res, next) => {
//   res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
//   res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
//   next();
// });


// 设置静态文件目录为 'dist'
app.use(express.static(path.join(__dirname, 'dist')));


// 如果没有找到其他路由，那么默认返回index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 服务器监听3000端口
app.listen(3000, () => {
  console.log('App is listening on port 3000!', "http://localhost:3000");
});
