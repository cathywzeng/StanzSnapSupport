# 部署到阿里云 ECS

## 1. 上传网站文件
把整个项目上传到服务器，例如 `/var/www/stanzsnap`。

需要上传的目录和文件：

```
stanzsnap/              ← 静态网站（用户指南页面）
stanzsnap/server/       ← Node.js 后端（留言处理）
index.html              ← 根目录入口（链接到 /stanzsnap/intro.html）
```

## 2. 使用 Nginx 托管静态页面

```nginx
server {
    listen 80;
    server_name your-domain-or-ip;
    root /var/www/stanzsnap;

    # 托管 stanzsnap/ 目录下的静态文件
    location /stanzsnap/ {
        alias /var/www/stanzsnap/stanzsnap/;
    }

    # 将 API 请求代理到 Node 后端
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

然后执行：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 3. 配置 HTTPS（Let's Encrypt + acme.sh）

### 安装 acme.sh

```bash
curl https://get.acme.sh | sh
source ~/.bashrc
acme.sh --set-default-ca --server letsencrypt
```

### 申请并安装证书

**注意：** 申请前确保域名已解析到服务器 IP，且 80 端口可访问（acme.sh 会自动启动临时 HTTP 服务器做验证）。

```bash
# 申请证书（Nginx 模式）
acme.sh --issue -d your-domain.com --nginx

# 安装证书到 Nginx 目录
mkdir -p /etc/nginx/ssl
acme.sh --install-cert -d your-domain.com \
  --key-file       /etc/nginx/ssl/your-domain.key \
  --fullchain-file /etc/nginx/ssl/your-domain.crt \
  --reloadcmd      "systemctl reload nginx"
```

acme.sh 会自动在 crontab 添加每日检查任务，证书到期前 30 天自动续期。

### 更新 Nginx 配置（开启 HTTPS + HTTP 跳转）

管理后台通过 Node API 密码保护，Nginx 不做额外限制。

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate     /etc/nginx/ssl/your-domain.crt;
    ssl_certificate_key /etc/nginx/ssl/your-domain.key;

    root /var/www/stanzsnap;

    location /stanzsnap/ {
        alias /var/www/stanzsnap/stanzsnap/;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 4. 安装并启动 Node.js 后端

### 安装依赖
```bash
cd /var/www/stanzsnap/stanzsnap/server
npm install
```

### 配置环境变量

```bash
# GitHub Token（可选）— 管理员在后台手动提交留言到 Issues 时需要
export GITHUB_TOKEN=你的GitHubPersonalAccessToken

# 管理员密码（必填）— Node API 验证使用，admin.html 登录页面需输入此密码
export ADMIN_PASSWORD=你的密码
```

不设置 `GITHUB_TOKEN` 的话，留言仍然正常收集，只是无法提交到 GitHub Issues。

### 启动服务
```bash
# 安装 PM2 进程管理
npm install -g pm2

# 启动
GITHUB_TOKEN=你的Token ADMIN_PASSWORD=你的密码 pm2 start server.js --name stanzsnap-feedback

# 保存 PM2 配置，确保开机自启
pm2 save
pm2 startup
```

## 5. 开放端口
确保阿里云安全组允许入站 **80（HTTP）和 443（HTTPS）** 端口（Node 端口 3001 不需要开放，通过 Nginx 反向代理访问即可）。

## 6. 访问地址

| 页面 | URL |
|------|-----|
| 首页（跳转） | https://你的域名/ |
| 用户指南 | https://你的域名/stanzsnap/intro.html |
| 管理后台 | https://你的域名/stanzsnap/admin.html |
| 隐私政策 | https://你的域名/stanzsnap/privacy.html |
