"""Build the dependency-free study website from its editable Markdown guide."""
from pathlib import Path
import contextlib
import hashlib
import html
import io
import re
import zipfile

ROOT = Path(__file__).resolve().parent
source = (ROOT / 'content/guide.md').read_text()


def inline(text):
    parts = re.split(r'(\x60[^\x60]+\x60)', text)
    result = []
    for part in parts:
        if part.startswith(chr(96)) and part.endswith(chr(96)):
            result.append('<code>' + html.escape(part[1:-1]) + '</code>')
            continue
        part = html.escape(part)
        part = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', part)
        part = re.sub(r'\[([^\]]+)\]\((https?://[^\s)]+)\)', r'<a href="\2">\1</a>', part)
        result.append(part)
    return ''.join(result)


example_no = 0
checklist_ids = []
fence = chr(96) * 3


def render(markdown):
    global example_no
    lines = markdown.strip().splitlines()
    out = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if not line.strip():
            i += 1
            continue
        if line.startswith(fence):
            lang = line[3:]
            block = []
            i += 1
            while i < len(lines) and lines[i] != fence:
                block.append(lines[i])
                i += 1
            code = '\n'.join(block)
            if lang == 'python':
                example_no += 1
                name = f'example_{example_no:02d}.py'
                (ROOT / 'examples' / name).write_text(code + '\n')
                following = '\n'.join(lines[i + 1:])
                expected = re.match(r'\s*' + fence + r'text\n(.*?)\n' + fence, following, re.S)
                if expected is None:
                    raise ValueError('Each Python example needs expected output')
                stream = io.StringIO()
                with contextlib.redirect_stdout(stream):
                    exec(compile(code, name, 'exec'), {})
                assert stream.getvalue().rstrip('\n') == expected.group(1), name
                out.append(f'<div class="code-block"><div class="code-bar"><span>PYTHON <span class="code-number">/ {example_no:02d}</span></span><div><a download href="examples/{name}">下载 .py</a><button type="button" class="copy-code" aria-label="复制示例 {example_no} 代码">复制代码</button></div></div><pre><code class="language-python">{html.escape(code)}</code></pre></div>')
            else:
                out.append(f'<div class="output-block"><span class="output-label">运行结果</span><pre><code>{html.escape(code)}</code></pre></div>')
            i += 1
            continue
        if line.startswith('|'):
            rows = []
            while i < len(lines) and lines[i].startswith('|'):
                rows.append([cell.strip() for cell in lines[i].strip('|').split('|')])
                i += 1
            out.append('<div class="table-scroll" tabindex="0" role="region" aria-label="知识点对照表"><table><thead><tr>' + ''.join('<th scope="col">' + inline(c) + '</th>' for c in rows[0]) + '</tr></thead><tbody>')
            for row in rows[2:]:
                out.append('<tr>' + ''.join('<td>' + inline(c) + '</td>' for c in row) + '</tr>')
            out.append('</tbody></table></div>')
            continue
        if line.startswith('- [ ] '):
            out.append('<div class="check-list">')
            while i < len(lines) and lines[i].startswith('- [ ] '):
                text = lines[i][6:]
                key = hashlib.sha256(text.encode()).hexdigest()[:12]
                checklist_ids.append(key)
                out.append(f'<label class="check-item"><input type="checkbox" data-check="{key}"><span>{inline(text)}</span></label>')
                i += 1
            out.append('</div>')
            continue
        heading = re.match(r'^(#{1,6}) (.*)', line)
        if heading:
            level = min(len(heading.group(1)) + 1, 6)
            out.append(f'<h{level}>{inline(heading.group(2))}</h{level}>')
            i += 1
            continue
        numbered = re.match(r'^(\d+)\. (.*)', line)
        if numbered:
            out.append(f'<ol start="{numbered.group(1)}" class="exercise-list">')
            while i < len(lines) and (m := re.match(r'^\d+\. (.*)', lines[i])):
                out.append('<li>' + inline(m.group(1)) + '</li>')
                i += 1
            out.append('</ol>')
            continue
        paragraph = [line]
        i += 1
        while i < len(lines) and lines[i].strip() and not re.match(r'^(#|\x60\x60\x60|\||- \[|\d+\. )', lines[i]):
            paragraph.append(lines[i])
            i += 1
        out.append('<p>' + inline(' '.join(paragraph)) + '</p>')
    return '\n'.join(out)


sections = re.split(r'^# (.+)\n', source, flags=re.M)
routes = [
    ('overview', '学习路线', '00'),
    ('self', 'self 与实例', '01'),
    ('init', '构造与初始化', '02'),
    ('encapsulation', '封装', '03'),
    ('inheritance', '继承', '04'),
    ('polymorphism', '多态', '05'),
    ('errors', '常见错误', '06'),
    ('answers', '练习参考', '07'),
    ('project', '综合练习', '08'),
    ('checklist', '掌握清单', '09'),
]
assert len(sections[1:]) == len(routes) * 2
articles = []
for n, (route, label, number) in enumerate(routes):
    heading, body = sections[1 + n * 2:3 + n * 2]
    if route == 'checklist':
        body = body.split('## 课堂与复习记录')[0]
    articles.append(f'<article class="lesson" id="{route}" data-title="{html.escape(label)}" {"" if n == 0 else "hidden"}><div class="lesson-heading"><span class="eyebrow">学习指南 / {number}</span><h2>{html.escape(heading)}</h2></div>{render(body)}</article>')

template = (ROOT / 'template.html').read_text()
nav = ''.join(f'<a href="#{r}" class="nav-link" data-route="{r}" {"aria-current=page" if n == 0 else ""}><span class="nav-number">{num}</span><span>{label}</span><span class="nav-arrow" aria-hidden="true">↗</span></a>' for n, (r, label, num) in enumerate(routes))
page = template.replace('<!-- NAVIGATION -->', nav).replace('<!-- LESSONS -->', '\n'.join(articles))
(ROOT / 'index.html').write_text(page)
with zipfile.ZipFile(ROOT / 'examples/python_oop_examples.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    for file in sorted((ROOT / 'examples').glob('*.py')):
        z.write(file, file.name)
print(f'Built index.html: {len(routes)} chapters, {example_no} verified examples, {len(checklist_ids)} checkboxes')
