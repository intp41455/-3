# 更新日志

> **关于历史记录**：本仓库此前的开发过程未按版本提交留痕，Git 提交历史只有 `Initial commit` 与初始化提交两条。
> 因此本文件**不虚构历史版本条目**，只记录两件事：
> ① 从代码中可核实的版本标识；② 自本文件建立之日起的真实变更。

---

## 版本标识（从代码中核实）

| 位置 | 值 |
|---|---|
| `questionnaireData.ts` → `QUESTIONNAIRE_METADATA.version` | `V1.0` |
| `slidesData.ts` 第 1 页 `cards[1].items[0]` | `版本号：V1.0 标准宣贯版` |
| `App.tsx` 页脚 | `ENTERPRISE MULTI-AGENT BASELINE · V1.0` |

**当前版本：`1.0.0`**

---

## [1.0.0] — 2026-09-20

### 新增
- **文档补齐**：新增 `README.md`（仓库主页）、`docs/` 五册技术文档、`LICENSE`（MIT）、本变更日志

### 变更
- 修正 `package.json` 元信息：`name` 由 AI Studio 模板默认值 `react-example` 改为 `multi-agent-survey-workspace`，`version` 由 `0.0.0` 对齐实际产品版本 `1.0.0`，并补充 `description` / `license`
- `index.html` 的 `<html lang>` 由 `en` 改为 `zh-CN`（全站内容为中文，原值影响屏幕阅读器与搜索引擎语言判定）

### 说明
本次提交为**文档补齐 + 元信息修正**，未改动任何业务代码、数据内容或交互逻辑。

---

## 未版本化的早期开发（可核实的功能沉淀）

以下内容均可在当前代码中直接验证，作为功能清单留档（非提交历史）：

| 功能 | 实现位置 |
|---|---|
| 三工作台 Tab 切换（演讲 / 问卷 / 流程图） | `src/App.tsx` → `currentTab` |
| 15 页幻灯片 + 逐字稿 | `src/data/slidesData.ts` → `SLIDES_DATA` |
| 10 种幻灯片页型 | `src/types.ts` → `SlideData['layout']` |
| 键盘导航（←/→/PageUp/PageDown/空格）与 `F` 全屏 | `src/components/PresentationViewer.tsx` |
| 10 部分 / 20 小节 / 78 问问卷 | `src/data/questionnaireData.ts` → `QUESTIONNAIRE_SECTIONS` |
| 问卷全文检索 + Markdown 全量导出 | `src/components/QuestionnaireViewer.tsx` |
| Mermaid 流程图 + 9 步四要素卡片（含 `riskNote`） | `src/components/MermaidWorkflow.tsx` |
| Google 登录（申请 Slides + Drive 作用域） | `src/services/auth.ts` |
| Google Slides 分块批量导出（CHUNK_SIZE=5） | `src/services/slidesExport.ts` |
| 导出进度条与失败重试 | `src/components/GoogleSlidesExportModal.tsx` |
| 本地导出：问卷 MD / 讲稿 MD / 离线单文件 HTML | `src/components/DownloadLocalModal.tsx` |
| Firebase 应用配置（Auth） | `firebase-applet-config.json` |
