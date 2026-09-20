import React, { useState, useMemo } from 'react';
import {
  QUESTIONNAIRE_METADATA,
  QUESTIONNAIRE_SECTIONS,
  QUESTIONNAIRE_APPENDICES,
} from '../data/questionnaireData';
import {
  Search,
  Copy,
  Check,
  Download,
  Shield,
  FileCheck2,
  ChevronDown,
  ChevronRight,
  Grid,
  FileText,
  BookmarkCheck,
} from 'lucide-react';

export const QuestionnaireViewer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    sec1: true,
    sec2: true,
    sec3: true,
  });
  const [copied, setCopied] = useState(false);

  // Toggle single section
  const toggleSection = (secId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [secId]: !prev[secId],
    }));
  };

  // Expand or collapse all
  const toggleAll = (expand: boolean) => {
    const next: Record<string, boolean> = {};
    QUESTIONNAIRE_SECTIONS.forEach((s) => {
      next[s.id] = expand;
    });
    setExpandedSections(next);
  };

  // Jump to specific section and expand it
  const scrollToSection = (secId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [secId]: true,
    }));
    setTimeout(() => {
      const el = document.getElementById(`section-card-${secId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  // Filtered sections
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return QUESTIONNAIRE_SECTIONS;
    const query = searchQuery.toLowerCase();

    return QUESTIONNAIRE_SECTIONS.map((sec) => {
      const matchTitle =
        sec.title.toLowerCase().includes(query) || sec.description.toLowerCase().includes(query);

      const filteredSubs = sec.subsections
        .map((sub) => {
          const matchSubTitle = sub.title.toLowerCase().includes(query);
          const matchedQuestions = sub.questions.filter(
            (q) =>
              q.question.toLowerCase().includes(query) ||
              q.explanation.toLowerCase().includes(query) ||
              (q.example && q.example.toLowerCase().includes(query))
          );

          if (matchSubTitle || matchedQuestions.length > 0) {
            return {
              ...sub,
              questions: matchSubTitle ? sub.questions : matchedQuestions,
            };
          }
          return null;
        })
        .filter(Boolean) as typeof sec.subsections;

      if (matchTitle || filteredSubs.length > 0) {
        return {
          ...sec,
          subsections: matchTitle ? sec.subsections : filteredSubs,
        };
      }
      return null;
    }).filter(Boolean) as typeof QUESTIONNAIRE_SECTIONS;
  }, [searchQuery]);

  // Generate full Markdown document
  const generateFullMarkdown = () => {
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

    return md;
  };

  const handleCopyMarkdown = () => {
    const md = generateFullMarkdown();
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const md = generateFullMarkdown();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '企业多智能体系统部署_信息采集标准问卷_V1.0.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4" id="questionnaire-viewer">
      {/* 1. Top Executive Banner */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                10 大调研维度标准资产
              </span>
              <span className="text-xs text-slate-500 font-editorial-mono">
                版本：{QUESTIONNAIRE_METADATA.version} · 周期：{QUESTIONNAIRE_METADATA.period}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {QUESTIONNAIRE_METADATA.title}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed max-w-3xl">
              为多智能体架构师与实施团队提供完备的数据资产、IT 拓扑与业务规章底图。支持结构化查阅、定位直达与全量 Markdown 导出。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleCopyMarkdown}
              id="copy-markdown-btn"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200 rounded-md transition-colors shadow-2xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '已复制到剪贴板' : '复制全文 Markdown'}</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              id="download-markdown-btn"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-medium rounded-md transition-colors shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>下载 .md 文档</span>
            </button>
          </div>
        </div>

        {/* Confidentiality & Core Principle Notice */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 block mb-0.5">法律级保密声明</strong>
              <span className="text-slate-600 leading-relaxed">
                {QUESTIONNAIRE_METADATA.confidentialStatement}
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-start gap-2.5">
            <FileCheck2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 block mb-0.5">填报核心原则</strong>
              <div className="text-slate-600 space-y-0.5">
                <div>① 能提供数据/文档的直接附后，正文标注附件索引；</div>
                <div>② 暂无精确数据的提供合理估算，标注 [估算]；确实无法回答标“待调研”。</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 10 Dimensions Executive Grid (结构组成一目了然的矩阵导航卡) */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Grid className="w-4 h-4 text-blue-700" />
            <span>10 大调研维度速览导览（点击任一维度直达对应章节）</span>
          </div>
          <span className="text-[11px] text-slate-400 font-editorial-mono">DIM 01 - DIM 10</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {QUESTIONNAIRE_SECTIONS.map((sec) => {
            const isExp = !!expandedSections[sec.id];
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`p-2.5 text-left rounded-lg border transition-all cursor-pointer ${
                  isExp
                    ? 'bg-blue-50/70 border-blue-200 hover:bg-blue-100/70'
                    : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/70'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-editorial-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-blue-800 border border-blue-200/60">
                    {sec.number}
                  </span>
                  {isExp && <span className="text-[9px] text-blue-700 font-semibold">展开中</span>}
                </div>
                <div className="text-xs font-semibold text-slate-800 line-clamp-1">
                  {sec.title}
                </div>
                <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                  {sec.subsections.length} 个细分子项
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Search & Global Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索问卷维度、问题、指标或示例 (如 康源、API、SOP)..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center text-xs">
          <button
            onClick={() => toggleAll(true)}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-md transition-colors cursor-pointer shadow-2xs"
          >
            全部展开
          </button>
          <button
            onClick={() => toggleAll(false)}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-md transition-colors cursor-pointer shadow-2xs"
          >
            全部收起
          </button>
        </div>
      </div>

      {/* 4. 10 Sections Content Cards */}
      <div className="space-y-3">
        {filteredSections.map((sec) => {
          const isExpanded = !!expandedSections[sec.id];
          return (
            <div
              key={sec.id}
              id={`section-card-${sec.id}`}
              className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs transition-all"
            >
              {/* Section Header Accordion Trigger */}
              <button
                onClick={() => toggleSection(sec.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-blue-50 text-blue-700 border border-blue-200 font-editorial-mono">
                    {sec.number}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {sec.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{sec.description}</p>
                  </div>
                </div>

                <div className="p-1 rounded-md text-slate-400 hover:text-slate-700">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Subsections Content */}
              {isExpanded && (
                <div className="p-5 pt-0 border-t border-slate-100 space-y-5">
                  {sec.subsections.map((sub, sIdx) => (
                    <div key={sIdx} className="space-y-2.5 pt-3">
                      <div className="flex items-center gap-2 pb-1">
                        <span className="text-xs font-bold text-blue-700">§</span>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-800">{sub.title}</h4>
                      </div>

                      {/* Questions Table */}
                      <div className="overflow-x-auto rounded-lg border border-slate-200">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead className="bg-slate-50 text-slate-800 font-semibold border-b border-slate-200">
                            <tr>
                              <th className="p-2.5 w-1/4 border-r border-slate-200">调研问题</th>
                              <th className="p-2.5 w-1/3 border-r border-slate-200">说明与填写指引</th>
                              <th className="p-2.5">参考示例 (康源养老实战参考)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            {sub.questions.map((q, qIdx) => (
                              <tr key={qIdx} className="hover:bg-slate-50/60">
                                <td className="p-2.5 font-semibold text-slate-900 align-top border-r border-slate-100">
                                  {q.question}
                                </td>
                                <td className="p-2.5 text-slate-600 align-top leading-relaxed border-r border-slate-100">
                                  {q.explanation}
                                </td>
                                <td className="p-2.5 text-slate-700 align-top leading-relaxed">
                                  {q.example ? (
                                    <span className="bg-slate-50 px-2 py-1 rounded border border-slate-200 inline-block text-[11px] text-slate-800">
                                      {q.example}
                                    </span>
                                  ) : (
                                    <span className="text-slate-300">-</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Custom Example Matrix if present */}
                      {sub.exampleData && (
                        <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200 space-y-1.5">
                          <span className="text-[11px] font-bold text-slate-700 block">
                            填报参考数据矩阵表：
                          </span>
                          <div className="overflow-x-auto rounded border border-slate-200 bg-white">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead className="bg-slate-100/70 border-b border-slate-200 text-[11px] text-slate-700">
                                <tr>
                                  {sub.exampleData.headers.map((h, i) => (
                                    <th key={i} className="p-2 border-r border-slate-200 last:border-r-0">
                                      {h}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-slate-700">
                                {sub.exampleData.rows.map((row, rI) => (
                                  <tr key={rI} className="hover:bg-slate-50/50">
                                    {row.map((cell, cI) => (
                                      <td key={cI} className="p-2 border-r border-slate-100 last:border-r-0 font-medium">
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 5. Appendices Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Appendix A */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-3">
          <div className="border-b border-slate-100 pb-2">
            <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              附录 A
            </span>
            <h4 className="text-base font-bold text-slate-900 mt-1">
              问卷填写补充规则
            </h4>
          </div>
          <div className="space-y-2 text-xs text-slate-700">
            {QUESTIONNAIRE_APPENDICES.appendixA.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
                <strong className="text-slate-900 block mb-0.5">
                  {item.rule}
                </strong>
                <span className="text-slate-600 leading-relaxed">{item.content}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Appendix B */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-3">
          <div className="border-b border-slate-100 pb-2">
            <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              附录 B
            </span>
            <h4 className="text-base font-bold text-slate-900 mt-1">
              问卷填报协作确认责任表
            </h4>
          </div>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-800 font-semibold text-[11px] border-b border-slate-200">
                <tr>
                  {QUESTIONNAIRE_APPENDICES.appendixBHeaders.map((h, i) => (
                    <th key={i} className="p-2.5 border-r border-slate-200 last:border-r-0">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {QUESTIONNAIRE_APPENDICES.appendixBRows.map((r, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/50">
                    {r.map((c, cIdx) => (
                      <td key={cIdx} className="p-2.5 border-r border-slate-100 last:border-r-0">
                        {cIdx === 0 ? (
                          <span className="font-bold text-slate-900">{c}</span>
                        ) : (
                          <span className="text-slate-400 font-editorial-mono text-[11px]">[待填入确认]</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            * 提示：正式提交前，请总协调人收齐各业务长、IT 负责人的签字或电子知悉回执。
          </p>
        </div>
      </div>
    </div>
  );
};
