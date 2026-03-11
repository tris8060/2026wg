# 中科闻歌官网组件化说明

## 项目结构

```
2026wg/
├── components/           # 公共组件文件夹
│   ├── head.html        # 公共 head 内容（CSS、字体、基础样式）
│   ├── nav.html         # 导航栏组件
│   ├── footer.html      # Footer 组件
│   └── components.js    # 组件加载脚本
├── pages/               # 二级页面文件夹
│   ├── about.html       # 关于我们页面
│   └── news.html        # 新闻报道页面
├── index.html           # 首页（需要改造）
├── template.html        # 页面模板（参考）
└── README-组件化.md     # 本说明文档
```

## 核心优势

✅ **一处修改，全站同步**：修改 `nav.html` 或 `footer.html`，所有页面自动更新  
✅ **代码复用**：避免重复代码，提高开发效率  
✅ **维护简单**：结构清晰，易于维护  
✅ **纯静态实现**：无需构建工具，直接部署

## 使用方法

### 1. 创建新页面

复制 `template.html` 作为起点，修改以下内容：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <title>页面标题 - 中科闻歌</title>
    <script>
        // 加载公共 head 内容
        fetch('/components/head.html')
            .then(response => response.text())
            .then(html => {
                const head = document.head;
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                while (tempDiv.firstChild) {
                    head.appendChild(tempDiv.firstChild);
                }
            });
    </script>
</head>
<body class="font-sans text-modern-dark bg-modern-bg">

    <!-- 导航栏（自动加载） -->
    <div id="nav-container"></div>

    <!-- 页面主内容 -->
    <main>
        <!-- 在这里添加页面内容 -->
    </main>

    <!-- Footer（自动加载） -->
    <div id="footer-container"></div>

    <!-- 组件加载脚本 -->
    <script src="/components/components.js"></script>
</body>
</html>
```

### 2. 修改公共组件

#### 修改导航栏

编辑 `components/nav.html`，修改后所有页面自动生效。

#### 修改 Footer

编辑 `components/footer.html`，修改后所有页面自动生效。

#### 修改公共样式

编辑 `components/head.html` 中的 `<style>` 部分。

### 3. 页面间链接

使用相对路径进行页面跳转：

```html
<!-- 首页 -->
<a href="/index.html">首页</a>

<!-- 二级页面 -->
<a href="/pages/about.html">关于我们</a>
<a href="/pages/news.html">新闻报道</a>
```

## 已创建的页面

| 页面 | 路径 | 说明 |
|------|------|------|
| 关于我们 | `/pages/about.html` | 公司简介、发展历程 |
| 新闻报道 | `/pages/news.html` | 新闻列表页面 |

## 注意事项

1. **路径问题**：确保所有路径以 `/` 开头，表示从根目录开始
2. **本地开发**：使用 `python3 -m http.server 8000` 启动本地服务器
3. **部署上线**：确保服务器支持静态文件访问

## 预览地址

- 首页：http://localhost:8000/index.html
- 关于我们：http://localhost:8000/pages/about.html
- 新闻报道：http://localhost:8000/pages/news.html
