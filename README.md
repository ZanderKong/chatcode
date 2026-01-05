# Bento Blog

一个使用纯前端构建的 Bento 风格博客主页，模块内容均由 Markdown 驱动。

## 主要特点
- **Bento 卡片布局**：个人介绍、音乐、博文、日历与日程分块呈现。
- **Markdown 驱动**：主页模块位于 `content/home`，博文位于 `content/posts`。
- **轻量 Markdown 渲染器**：内置 `lib/marked-lite.js` 支持标题、列表、表格与代码块。
- **播放列表示例**：音乐模块附带可切换的在线播放列表。

## 目录结构
```
content/
  home/            # 首页各模块的 Markdown 文档
  posts/           # 博文 Markdown 文件与清单
index.html         # 主页入口
script.js          # 加载 Markdown、播放列表与文章逻辑
styles.css         # Bento 风格样式
lib/marked-lite.js # 轻量 Markdown 渲染器
```

## 添加新文章
1. 在 `content/posts/posts.json` 增加一条记录：
```json
{
  "slug": "your-slug",
  "title": "文章标题",
  "date": "2024-08-01",
  "tags": ["tag1", "tag2"],
  "summary": "摘要文案",
  "published": true
}
```
2. 新建 `content/posts/your-slug.md`，使用 Markdown 编写正文。
3. 设置 `published: false` 即可暂存草稿，首页不会展示。

## 开发与预览
直接在本地启动静态服务器或使用 VS Code Live Server 即可预览：
```
python -m http.server 8000
```
然后访问 http://localhost:8000 查看效果。
