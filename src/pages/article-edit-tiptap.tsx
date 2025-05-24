import React, { useState, useRef, useCallback } from "react";
import { RiEditLine, RiEyeLine, RiClipboardLine, RiDeleteBinLine } from "react-icons/ri";
import { TiptapEditor, EditorRefMethods } from "@components/TiptapEditor";
import styles from "@styles/pages/article-edit-tiptap.module.scss";

// 默认 HTML 内容
const defaultHtml = `<h1>Tiptap 富文本编辑器</h1>

<p>这是一个功能强大的富文本编辑器，基于 <strong>Tiptap</strong> 构建，类似 <em>Notion</em> 的体验。</p>

<h2>✨ 主要功能</h2>

<ul>
  <li><strong>丰富的文本格式</strong>：粗体、斜体、<u>下划线</u>、<s>删除线</s>、<mark>高亮</mark>、<sup>上标</sup>、<sub>下标</sub></li>
  <li><strong>多级标题</strong>：支持 H1-H6 六级标题</li>
  <li><strong>智能列表</strong>：有序列表、无序列表、任务列表</li>
  <li><strong>代码支持</strong>：行内 <code>代码</code> 和代码块，支持语法高亮</li>
  <li><strong>表格和媒体</strong>：插入表格、图片、链接</li>
</ul>

<h3>📝 任务列表示例</h3>

<ul data-type="taskList">
  <li data-type="taskItem" data-checked="true">完成富文本编辑器开发</li>
  <li data-type="taskItem" data-checked="false">添加更多扩展功能</li>
  <li data-type="taskItem" data-checked="false">编写用户文档</li>
</ul>

<h3>💻 代码示例</h3>

<pre><code class="language-javascript">// JavaScript 代码示例
function createEditor() {
  const editor = useEditor({
    extensions: [StarterKit, Placeholder],
    content: defaultContent,
    editable: true
  });
  
  return editor;
}</code></pre>

<blockquote>
  <p><strong>提示</strong>：选中文本时会出现气泡菜单，空行时会显示浮动菜单，让编辑更加便捷！</p>
</blockquote>

<h3>🎨 文本对齐和样式</h3>

<p style="text-align: center">这是居中对齐的段落</p>

<p style="text-align: right">这是右对齐的段落</p>

<h3>📊 表格示例</h3>

<table>
  <tr>
    <th>功能</th>
    <th>支持程度</th>
    <th>说明</th>
  </tr>
  <tr>
    <td>文本格式</td>
    <td>✅ 完全支持</td>
    <td>粗体、斜体、下划线等</td>
  </tr>
  <tr>
    <td>代码高亮</td>
    <td>✅ 完全支持</td>
    <td>支持多种编程语言</td>
  </tr>
  <tr>
    <td>段落移动</td>
    <td>✅ 完全支持</td>
    <td>类似 Notion 的体验</td>
  </tr>
</table>

<hr>

<p><strong>开始使用：</strong>尝试选择文本、创建列表、插入代码块，体验丰富的编辑功能！</p>`;

const ArticleEditTiptap: React.FC = () => {
    // 编辑器引用
    const editorRef = useRef<EditorRefMethods>(null);

    // 状态管理
    const [readonly, setReadonly] = useState<boolean>(false);
    const [htmlContent, setHtmlContent] = useState<string>(defaultHtml);

    // 切换只读/编辑模式
    const toggleReadonly = useCallback(() => {
        const currentHtml = editorRef.current?.getHtml() || "";
        setHtmlContent(currentHtml);
        setReadonly(prev => !prev);
    }, []);

    // 复制 HTML 内容到剪贴板
    const copyHtml = useCallback(() => {
        const html = editorRef.current?.getHtml() || "";
        navigator.clipboard
            .writeText(html)
            .then(() => {
                alert("HTML 内容已复制到剪贴板");
            })
            .catch(err => {
                console.error("复制失败:", err);
            });
    }, []);

    // 复制纯文本内容到剪贴板
    const copyText = useCallback(() => {
        const text = editorRef.current?.getText() || "";
        navigator.clipboard
            .writeText(text)
            .then(() => {
                alert("纯文本内容已复制到剪贴板");
            })
            .catch(err => {
                console.error("复制失败:", err);
            });
    }, []);

    // 清空内容
    const clearContent = useCallback(() => {
        editorRef.current?.clear();
        setHtmlContent("");
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Tiptap 富文本编辑器</h1>

                <div className={styles.controls}>
                    <div className={styles.switch}>
                        <span>模式</span>
                        <button className={styles.button} onClick={toggleReadonly}>
                            {readonly ? (
                                <>
                                    <RiEditLine /> 切换到编辑模式
                                </>
                            ) : (
                                <>
                                    <RiEyeLine /> 切换到只读模式
                                </>
                            )}
                        </button>
                    </div>

                    <button className={styles.button} onClick={copyHtml}>
                        <RiClipboardLine /> 复制 HTML
                    </button>

                    <button className={styles.button} onClick={copyText}>
                        <RiClipboardLine /> 复制纯文本
                    </button>

                    <button className={`${styles.button} ${styles.danger}`} onClick={clearContent}>
                        <RiDeleteBinLine /> 清空内容
                    </button>
                </div>
            </div>

            <div className={styles.editorWrapper}>
                <TiptapEditor
                    ref={editorRef}
                    defaultValue={htmlContent}
                    readonly={readonly}
                    placeholder="开始输入您的文档内容..."
                    height="calc(100vh - 200px)"
                />
            </div>
        </div>
    );
};

export default ArticleEditTiptap;
