#!/bin/bash
rm -rf dist

npm run build

# 切换到dist目录
cd dist

# 初始化git仓库
git init

# 添加所有文件到暂存区
git add .

# 提交更改
git commit -m "publish"

git  branch -m main gh-pages

# 添加远程仓库
git remote add origin git@github.com:fzxiang/webcontainers-express-app.git

# 推送到远程仓库的gh-pages分支
git push -u origin gh-pages -f
