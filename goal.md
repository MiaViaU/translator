# Goal

开发一个现代化、高性能的浏览器翻译脚本（Userscript）。

目标不是简单调用翻译接口，而是成为一个拥有优秀用户体验、可扩展、多翻译源支持的网页翻译工具。

---

# 第一阶段（MVP）

仅实现最核心能力。

## 功能一：网页翻译

支持：

- 翻译整个网页
- 翻译当前可见区域
- 自动跳过代码块
- 自动跳过 input、textarea
- 自动跳过 script/style
- 保留网页原始 DOM 结构
- 不破坏页面样式
- 不影响网页事件

要求：

- 尽可能少修改 DOM
- 仅替换文本节点
- 支持恢复原文
- 支持再次翻译

---

## 功能二：划词翻译

用户选中文本后：

显示一个小按钮

点击后：

弹出翻译窗口

窗口显示：

原文

译文

支持复制结果

支持 ESC 关闭

支持点击空白关闭

---

## 功能三：翻译接口

第一阶段仅支持：

Microsoft Translator

接口调用方式参考：

https://update.greasyfork.org/scripts/573432/网页翻译器.user.js

注意：

不要复制源码。

仅参考：

- 请求流程
- Token 获取方式
- 参数构造
- 请求头

要求：

将微软接口封装成 Provider。

例如：

Provider

translate(text)

translateBatch(texts)

detect(text)

未来可以新增：

Google

DeepL

OpenAI

Gemini

腾讯

火山

阿里

有道

百度

无需修改其它代码。

---

# 项目结构

推荐：

src/

    main.js

    translator/

        provider.js

        microsoft.js

    dom/

        walker.js

        replacer.js

        observer.js

    selection/

        popup.js

        selection.js

    ui/

        toast.js

        dialog.js

        icon.js

    utils/

        cache.js

        debounce.js

        dom.js

        request.js

        storage.js

    styles/

        popup.css

        dialog.css

---

# 网页翻译设计

不要：

innerHTML

不要：

document.body.innerHTML

不要：

大量 clone DOM

必须：

TreeWalker

遍历 TextNode

过滤：

空文本

script

style

textarea

input

svg

code

pre（可配置）

仅翻译真正需要翻译的文本。

---

# 批量翻译

不要：

一个节点一个请求。

应该：

收集文本

组成数组

一次请求几十条

减少请求次数。

要求：

自动切片。

例如：

50 条

100 条

可配置。

---

# 缓存

必须实现缓存。

缓存 Key：

provider

language

text

缓存位置：

Memory

未来支持：

localStorage

IndexedDB

重复文本不要再次请求。

---

# MutationObserver

网页变化后：

自动发现新增文本。

例如：

Twitter

YouTube

Bilibili

Reddit

ChatGPT

动态内容。

要求：

增量翻译。

不要重新扫描整个页面。

---

# 划词翻译

监听：

mouseup

selectionchange

获取：

Selection

Range

若文本为空：

隐藏按钮。

若有文本：

按钮出现在选区附近。

点击按钮：

调用 Provider

弹出 Popup。

---

# Popup

需要：

现代 UI

圆角

阴影

毛玻璃

支持：

深色模式

浅色模式

自动跟随系统

动画：

Fade

Scale

关闭：

ESC

点击空白

---

# 性能要求

不能卡网页。

要求：

requestIdleCallback

分批扫描

长页面渐进翻译

避免阻塞主线程。

---

# 错误处理

网络失败：

Toast

接口失效：

提示

Token 失效：

自动重新获取

请求超时：

自动重试

不要无限重试。

---

# 可配置项

目标语言

源语言

是否自动翻译

是否翻译动态页面

是否翻译代码块

是否显示划词按钮

是否缓存

批量大小

接口超时

---

# 国际化

UI 文本不要写死。

所有字符串集中管理。

例如：

zh-CN

en-US

未来方便增加语言。

---

# 代码要求

全部使用：

ES Module

现代 JavaScript

禁止：

jQuery

禁止：

全局变量污染

要求：

模块化

低耦合

高内聚

每个模块职责单一。

---

# 可维护性

所有 Provider 必须遵循统一接口。

DOM 操作独立。

UI 独立。

翻译逻辑独立。

缓存独立。

未来新增翻译源时：

原则上只新增一个 Provider 文件即可。

---

# 第二阶段（未来）

支持：

Google Translate

DeepL

OpenAI

Gemini

腾讯翻译

百度翻译

有道翻译

阿里翻译

---

支持：

自动检测网页语言

自动翻译

黑名单网站

白名单网站

快捷键翻译

右键菜单

图片 OCR 翻译

PDF 翻译

iframe 翻译

Shadow DOM

---

# 第三阶段（长期）

打造一个接近沉浸式翻译（Immersive Translate）体验的 Userscript。

重点：

高性能

优秀 UI

高度模块化

多 Provider

良好可维护性

方便后续扩展为浏览器扩展（Chrome Extension / Firefox Add-on）。

---

# 开发原则

1. 优先保证稳定性。
2. 优先保证性能。
3. 优先保证网页兼容性。
4. 所有功能模块化设计。
5. 避免重复请求。
6. 尽量不破坏网页原始结构。
7. 保持代码易读、易维护、易扩展。