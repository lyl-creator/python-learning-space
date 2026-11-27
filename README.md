# Python 学习空间

从 self、实例属性和实例方法开始的面向对象编程学习指南。包含生活类比、9 个验证过输出的 Python 示例、7 道练习、综合练习、掌握清单和课堂记录。

## 本地预览

不需要安装第三方依赖。

    python3 build.py
    python3 -m http.server 8765 --bind 127.0.0.1

在浏览器打开 http://127.0.0.1:8765/ 。

## 内容维护

修改 content/guide.md 后运行 python3 build.py。构建会重新生成 index.html、示例文件和下载压缩包，同时核对每个 Python 代码示例的输出。界面结构位于 template.html，样式与交互位于 assets。

## GitHub Pages

将此目录中的文件作为仓库根目录提交。在仓库 Settings → Pages 中选择 Deploy from a branch，分支选择 main，目录选择 / (root)。根目录的 .nojekyll 让 GitHub Pages 直接提供静态文件。

发布步骤参考 [GitHub 官方文档](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。

## 学习数据

掌握清单和课堂记录保存在当前站点、当前浏览器的 localStorage 中；不上传到 GitHub，也不与 ChatGPT Space 自动同步。可使用“导出进度”和“导入进度”在设备之间备份与合并。导入时同一知识点采用导入文件的勾选值，记录按 ID 合并。

Python 代码可复制或下载，在本地 Python 3 环境运行。网页中的 self 互动演示用 JavaScript 展示对象状态变化。
