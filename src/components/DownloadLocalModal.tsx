import React, { useState } from 'react';
import { SLIDES_DATA } from '../data/slidesData';
import {
  QUESTIONNAIRE_METADATA,
  QUESTIONNAIRE_SECTIONS,
  QUESTIONNAIRE_APPENDICES,
} from '../data/questionnaireData';
import {
  Download,
  FileText,
  Presentation,
  FolderArchive,
  Globe,
  Check,
  X,
  Laptop,
  ArrowDownToLine,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

interface DownloadLocalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadLocalModal: React.FC<DownloadLocalModalProps> = ({ isOpen, onClose }) => {
  const [downloadedItem, setDownloadedItem] = useState<string | null>(null);

  if (!isOpen) return null;

  // 1. Generate Questionnaire Markdown
  const downloadQuestionnaireMarkdown = () => {
    let md = `# ${QUESTIONNAIRE_METADATA.title} (${QUESTIONNAIRE_METADATA.version})\n\n`;
    md += `> **版本**：${QUESTIONNAIRE_METADATA.version} | **发放时机**：${QUESTIONNAIRE_METADATA.stage} | **填写周期**：${QUESTIONNAIRE_METADATA.period}\n\n`;
    md += `## 填报说明\n\n`;
    QUESTIONNAIRE_METADATA.instructions.forEach((ins) => {
      md += `- **${ins.item}**：${ins.desc}\n`;
    });
    md += `\n> 🛡️ **保密声明**：${QUESTIONNAIRE_METADATA.confidentialStatement}\n\n`;
    md += `---\n\n`;

    QUESTIONNAIRE_SECTIONS.forEach((sec) => {
      md += `## ${sec.number}：${sec.title}\n\n`;
      md += `*${sec.description}*\n\n`;

      sec.subsections.forEach((sub) => {
        md += `### ${sub.title}\n\n`;
        if (sub.questions.length > 0) {
          md += `| 调研问题 | 说明与填写指引 | 示例/参考 |\n`;
          md += `| :--- | :--- | :--- |\n`;
          sub.questions.forEach((q) => {
            md += `| **${q.question}** | ${q.explanation} | ${q.example || '-'} |\n`;
          });
          md += `\n`;
        }

        if (sub.exampleData) {
          md += `#### 参考数据样例：\n\n`;
          md += `| ${sub.exampleData.headers.join(' | ')} |\n`;
          md += `| ${sub.exampleData.headers.map(() => ':---').join(' | ')} |\n`;
          sub.exampleData.rows.forEach((r) => {
            md += `| ${r.join(' | ')} |\n`;
          });
          md += `\n`;
        }
      });
      md += `---\n\n`;
    });

    md += `## 附录 A：问卷填写补充说明\n\n`;
    QUESTIONNAIRE_APPENDICES.appendixA.forEach((app) => {
      md += `- **${app.rule}**：${app.content}\n`;
    });
    md += `\n## 附录 B：问卷填报协作确认表\n\n`;
    md += `| ${QUESTIONNAIRE_APPENDICES.appendixBHeaders.join(' | ')} |\n`;
    md += `| ${QUESTIONNAIRE_APPENDICES.appendixBHeaders.map(() => ':---').join(' | ')} |\n`;
    QUESTIONNAIRE_APPENDICES.appendixBRows.forEach((r) => {
      md += `| ${r.join(' | ')} |\n`;
    });

    triggerDownload(md, '企业多智能体系统部署_信息采集标准问卷_V1.0.md', 'text/markdown');
    triggerSuccess('questionnaire');
  };

  // 2. Generate Slides Presentation & Speaker Notes Markdown
  const downloadSlidesMarkdown = () => {
    let md = `# 企业多智能体系统（Multi-Agent）部署 · 信息采集与现状调研宣贯方案\n\n`;
    md += `> **汇报定位**：面向企业高管与业务负责人的前置宣贯与统一认知全案\n`;
    md += `> **规格**：15 页全景幻灯片 + 图表矩阵 + 演讲逐字稿 (Speaker Notes)\n\n`;
    md += `---\n\n`;

    SLIDES_DATA.forEach((s) => {
      md += `## P${s.slideNumber.toString().padStart(2, '0')} [${s.category}] - ${s.actionTitle}\n\n`;
      if (s.subTitle) md += `**核心副标**：${s.subTitle}\n\n`;
      md += `**本页目标**：${s.objective}\n\n`;
      if (s.highlightBanner) {
        md += `> 💡 **核心洞察**：${s.highlightBanner}\n\n`;
      }

      if (s.cards && s.cards.length > 0) {
        md += `### 核心内容卡片：\n\n`;
        s.cards.forEach((c) => {
          md += `#### 【${c.title}】 (${c.badge})\n`;
          c.items.forEach((item) => {
            md += `- ${item}\n`;
          });
          md += `\n`;
        });
      }

      if (s.flowSteps && s.flowSteps.length > 0) {
        md += `### 流程步骤节点：\n\n`;
        s.flowSteps.forEach((st) => {
          md += `- **${st.step}：${st.label}**（主责：${st.role}）\n  ${st.desc}\n`;
        });
        md += `\n`;
      }

      if (s.timeline && s.timeline.length > 0) {
        md += `### 排期里程碑：\n\n`;
        s.timeline.forEach((tl) => {
          md += `#### ${tl.day}：${tl.phase}（负责：${tl.owner}）\n`;
          tl.tasks.forEach((t) => {
            md += `- ${t}\n`;
          });
          md += `\n`;
        });
      }

      if (s.table) {
        md += `### 评估对比矩阵：\n\n`;
        md += `| ${s.table.headers.join(' | ')} |\n`;
        md += `| ${s.table.headers.map(() => ':---').join(' | ')} |\n`;
        s.table.rows.forEach((r) => {
          md += `| ${r.join(' | ')} |\n`;
        });
        md += `\n`;
      }

      if (s.speakerNotes) {
        md += `> 🎙️ **主讲人演讲逐字稿（Speaker Notes）**：\n>\n`;
        md += `> ${s.speakerNotes.replace(/\n/g, '\n> ')}\n\n`;
      }

      md += `---\n\n`;
    });

    triggerDownload(md, '企业多智能体系统_宣贯汇报幻灯片与演讲逐字稿_V1.0.md', 'text/markdown');
    triggerSuccess('slides');
  };

  // 3. Generate Standalone Offline HTML File (can be opened in any browser offline)
  const downloadStandaloneHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>企业多智能体调研与宣贯全案 - 离线查阅版</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", sans-serif; line-height: 1.6; color: #1e293b; background: #f8fafc; margin: 0; padding: 24px; }
    .container { max-width: 1100px; margin: 0 auto; background: #fff; padding: 40px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    h1 { color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; font-size: 26px; }
    h2 { color: #1e40af; margin-top: 32px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; font-size: 20px; }
    h3 { color: #334155; font-size: 16px; margin-top: 20px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
    th { background: #f1f5f9; color: #0f172a; }
    blockquote { background: #eff6ff; border-left: 4px solid #2563eb; margin: 16px 0; padding: 12px 16px; border-radius: 4px; color: #1e3a8a; }
    .badge { display: inline-block; padding: 2px 8px; font-size: 11px; font-weight: 600; border-radius: 4px; background: #e0e7ff; color: #3730a3; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 12px 0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>企业多智能体调研与宣贯全案 · 离线归档版</h1>
    <p><strong>版本：</strong>V1.0 标准版 | <strong>生成时间：</strong>${new Date().toLocaleDateString()}</p>
    <p>包含：15 页高管汇报宣讲 PPT 讲稿大纲、10 大维度信息采集标准问卷、四步协同推进 SOP。</p>
    <hr/>
    <h2>第一部分：15 页宣贯汇报 PPT 核心讲稿</h2>
    ${SLIDES_DATA.map(
      (s) => `
      <div class="card">
        <span class="badge">P${s.slideNumber} · ${s.category}</span>
        <h3>${s.actionTitle}</h3>
        <p><strong>核心副标：</strong>${s.subTitle || '-'} | <strong>汇报目标：</strong>${s.objective}</p>
        ${s.highlightBanner ? `<blockquote>💡 <strong>核心观点：</strong>${s.highlightBanner}</blockquote>` : ''}
        ${
          s.cards
            ? s.cards
                .map(
                  (c) =>
                    `<div><strong>${c.title} (${c.badge})</strong><ul>${c.items
                      .map((it) => `<li>${it}</li>`)
                      .join('')}</ul></div>`
                )
                .join('')
            : ''
        }
        ${
          s.speakerNotes
            ? `<div style="background:#fef3c7; border:1px solid #fde68a; padding:10px; border-radius:6px; font-size:12px; color:#92400e; margin-top:8px;"><strong>🎙️ 演讲逐字稿：</strong>${s.speakerNotes}</div>`
            : ''
        }
      </div>
    `
    ).join('')}

    <h2>第二部分：10 大维度信息采集标准问卷</h2>
    ${QUESTIONNAIRE_SECTIONS.map(
      (sec) => `
      <div class="card">
        <h3>${sec.number}：${sec.title}</h3>
        <p><em>${sec.description}</em></p>
        ${sec.subsections
          .map(
            (sub) => `
          <h4>${sub.title}</h4>
          ${
            sub.questions.length > 0
              ? `<table>
              <thead><tr><th>调研问题</th><th>说明与指引</th><th>参考示例</th></tr></thead>
              <tbody>
                ${sub.questions
                  .map(
                    (q) =>
                      `<tr><td><strong>${q.question}</strong></td><td>${q.explanation}</td><td>${
                        q.example || '-'
                      }</td></tr>`
                  )
                  .join('')}
              </tbody>
            </table>`
              : ''
          }
        `
          )
          .join('')}
      </div>
    `
    ).join('')}
  </div>
</body>
</html>`;

    triggerDownload(htmlContent, '企业多智能体调研与宣贯全案_离线独立网页.html', 'text/html');
    triggerSuccess('html');
  };

  const triggerDownload = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const triggerSuccess = (type: string) => {
    setDownloadedItem(type);
    setTimeout(() => setDownloadedItem(null), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      id="download-local-modal"
    >
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="关闭"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0">
            <ArrowDownToLine className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-blue-700 font-editorial-mono uppercase tracking-wider block mb-0.5">
              Local Download & Codebase Export
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              下载到本地电脑
            </h3>
          </div>
        </div>

        {/* Download Options Grid */}
        <div className="space-y-4">
          <div className="text-xs text-slate-600">
            请选择您需要的本地下载形式（支持纯文本文档、离线独立网页、或完整全栈开发源码包）：
          </div>

          {/* Option 1: Questionnaire Markdown */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900">
                    10 大维度信息采集标准问卷 (.md)
                  </h4>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Markdown 格式
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  含 10 大维度全部表格、康源养老参考示例、填报说明及附录 A/B，可导入 Obsidian/Typora/Word。
                </p>
              </div>
            </div>

            <button
              onClick={downloadQuestionnaireMarkdown}
              id="download-opt-questionnaire"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-semibold rounded-lg shadow-2xs transition-colors shrink-0 cursor-pointer"
            >
              {downloadedItem === 'questionnaire' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>已下载到本地</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>下载 .md 问卷</span>
                </>
              )}
            </button>
          </div>

          {/* Option 2: Slides & Speaker Notes Markdown */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 mt-0.5">
                <Presentation className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900">
                    15 页宣贯 PPT 幻灯片与演讲逐字稿 (.md)
                  </h4>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    讲稿全案
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  完整 15 页高管汇报框架、卡片数据、排期表及主讲人演讲现场逐字发言稿（Speaker Notes）。
                </p>
              </div>
            </div>

            <button
              onClick={downloadSlidesMarkdown}
              id="download-opt-slides"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-blue-50 text-blue-800 border border-blue-300 text-xs font-semibold rounded-lg shadow-2xs transition-colors shrink-0 cursor-pointer"
            >
              {downloadedItem === 'slides' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-blue-600" />
                  <span>已下载到本地</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>下载 .md 讲稿</span>
                </>
              )}
            </button>
          </div>

          {/* Option 3: Offline Standalone HTML Document */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0 mt-0.5">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900">
                    单文件离线完整网页 (.html)
                  </h4>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                    离线即开即用
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  独立离线网页文件，无须配置 Node 环境，直接在任意内网电脑或浏览器双击打开查阅。
                </p>
              </div>
            </div>

            <button
              onClick={downloadStandaloneHtml}
              id="download-opt-html"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-indigo-50 text-indigo-800 border border-indigo-300 text-xs font-semibold rounded-lg shadow-2xs transition-colors shrink-0 cursor-pointer"
            >
              {downloadedItem === 'html' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-indigo-600" />
                  <span>已下载到本地</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>下载 .html 网页</span>
                </>
              )}
            </button>
          </div>

          {/* Option 4: Full Source Code ZIP Export Instructions */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                <FolderArchive className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900">
                    下载本系统全部源代码 (ZIP 源码包)
                  </h4>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                    Google AI Studio 原生导出
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  在 Google AI Studio 界面右上角的系统功能菜单中，可直接将全套 React + TypeScript 完整工程下载为 ZIP 压缩包或同步至 GitHub：
                </p>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1.5 ml-0 sm:ml-12 font-mono">
              <div className="flex items-center gap-2 text-slate-900 font-semibold font-sans">
                <Laptop className="w-3.5 h-3.5 text-blue-700" />
                <span>导出及本地运行 3 步指南：</span>
              </div>
              <div className="text-slate-600 font-sans">
                <strong>第 1 步</strong>：点击 Google AI Studio 窗口右上角菜单（三点或设置图标）中的 <strong>"Export"</strong> $\rightarrow$ <strong>"Download ZIP"</strong>；
              </div>
              <div className="text-slate-600 font-sans">
                <strong>第 2 步</strong>：在您的本地电脑解压缩该 zip 文件；
              </div>
              <div className="text-slate-600 font-sans">
                <strong>第 3 步</strong>：在终端输入并运行以下两行命令：
              </div>
              <div className="bg-slate-900 text-emerald-400 p-2.5 rounded text-[11px] select-all">
                <div>npm install</div>
                <div>npm run dev</div>
              </div>
              <div className="text-slate-500 text-[11px] font-sans">
                启动后在浏览器打开 <code>http://localhost:3000</code> 即可在本地完全自主运行与二次开发。
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-editorial-mono">
            ALL EXPORTS ARE 100% CLIENT-SIDE & CONFIDENTIAL
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
