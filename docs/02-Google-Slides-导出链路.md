# 02 · Google Slides 导出链路

本模块让应用能在用户的 Google 账号下**真实创建一份在线演示文稿**，而不是导出 PPTX 文件。

实现位置：`src/services/slidesExport.ts`（12 KB）+ `src/components/GoogleSlidesExportModal.tsx`。

---

## 一、前置授权

导出需要 `accessToken`。它由 Firebase Auth 的 Google 登录流程产出，并在 OAuth 请求里**额外申请两个作用域**：

```ts
// src/services/auth.ts
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/presentations'); // Slides 读写
provider.addScope('https://www.googleapis.com/auth/drive.file');   // 对本应用创建的文件读写
provider.setCustomParameters({ prompt: 'select_account' });
```

| 作用域 | 为什么需要 |
|---|---|
| `presentations` | 创建演示文稿、执行 `batchUpdate` 写入内容 |
| `drive.file` | 让创建出的文件归属当前应用，用户能在 Drive 里看到 |

`prompt: 'select_account'` 让每次登录都弹账号选择器——多账号环境下避免默默用了错误的账号。

### 令牌生命周期（当前实现的行为）

`auth.ts` 把 access token 缓存在模块级变量 `cachedAccessToken` 中，**不写 localStorage、不持久化**：

```ts
let cachedAccessToken: string | null = null;
```

后果：

| 场景 | 行为 |
|---|---|
| 同一会话内刷新页面 | `onAuthStateChanged` 会触发，但缓存令牌已丢 → 回调 `onAuthFailure()` → 用户需重新点击登录 |
| 切到别的 Tab 再回来 | 正常，模块级变量仍在内存中 |
| 关闭标签页 | 令牌丢失，重新登录 |

这是**安全优先**的取舍：令牌不落盘，代价是刷新后需重登。若产品上需要「刷新不掉登录」，应改用 `GoogleAuthProvider` 的 re-auth 流程（`reauthenticateWithPopup`）或后端换取 refresh token——**不要**简单地把令牌写进 localStorage。

---

## 二、导出流程

`exportToGoogleSlides(accessToken, slides, onProgress)` 分三步。

### 步骤 1 · 创建演示文稿（进度 10% → 25%）

```http
POST https://slides.googleapis.com/v1/presentations
Authorization: Bearer {accessToken}
Content-Type: application/json

{ "title": "企业多智能体系统（Multi-Agent）部署 · 信息采集与现状调研宣贯方案" }
```

响应里拿到 `presentationId`，并拼出直达链接：

```ts
const presentationUrl = `https://docs.google.com/presentation/d/${presentationId}/edit`;
```

同时记下默认生成的第一页 `presData.slides?.[0]?.objectId`，用于步骤 3 删除。

失败时抛出 `创建 Google Slides 失败: {status} {原始响应文本}`——**带上原始响应**，便于区分是作用域未授权、配额超限还是请求体问题。

### 步骤 2 · 分块批量写入（进度 25% → 90%）

```ts
const CHUNK_SIZE = 5;
const totalChunks = Math.ceil(slides.length / CHUNK_SIZE);   // 15 页 → 3 块
```

**为什么要分块**：Slides API 的 `batchUpdate` 请求体有大小上限，15 页的全部请求一次性提交容易被服务端拒绝。5 页一切是「请求数」与「单请求体积」的折中。

每页在一个 chunk 内生成一组 `requests`：

```text
1. createSlide                 objectId = `slide_mas_${slide.id}`
                               insertionIndex = 全局序号
                               slideLayoutReference = { predefinedLayout: 'BLANK' }
                               
2. createShape (顶部色带)        objectId = `hdr_bg_${slide.id}`
                               RECTANGLE, 720 × 75 PT, 定位 (0, 0)

3. updateShapeProperties       填充 #0F172A（深色科技藏青，rgb 0.06/0.09/0.16）
                               outline: NOT_RENDERED

4. createShape (标题文本框)      objectId = `title_${slide.id}`
                               TEXT_BOX, 680 × 40 PT, 定位 (24, 10)

5. insertText                  文本模板：`【P{n} · {category}】 {actionTitle}`

6. updateTextStyle             标题字号 / 前景色

7. 按 layout 灌内容              cards / flowSteps / pyramidLevels / table / timeline
```

**命名约定**：所有对象 ID 都由 `slide.id` 派生（`slide_mas_1` / `hdr_bg_1` / `title_1`），保证可预测、可调试。

**内容灌入分支**（`slidesExport.ts` 内约第 252–295 行）：

```ts
slide.cards?.forEach((card, idx) => { card.items.forEach(...) });
slide.flowSteps?.forEach((st) => ...);
slide.pyramidLevels?.forEach((pl) => ...);
slide.table?.rows.forEach((r) => ...);
slide.timeline?.forEach((tl) => { tl.tasks.forEach(...) });
```

进度计算：

```ts
const currentPercent = 25 + Math.round(((c + 1) / totalChunks) * 65);  // 25 → 90
```

### 步骤 3 · 清理默认空白页（进度 → 100%）

新创建的演示文稿会带一个默认标题页，按 `defaultSlideId` 删除：

```http
POST .../presentations/{id}:batchUpdate
{ "requests": [{ "deleteObject": { "objectId": "{defaultSlideId}" } }] }
```

此步**失败不中断**（`console.warn` 后忽略）——留一个多余空白页比让整个导出报错体验更好。

---

## 三、进度反馈

```ts
export interface ExportProgress {
  step: string;                 // 人类可读的当前动作
  percent: number;              // 0-100
  presentationId?: string;
  presentationUrl?: string;
}
```

进度节点：

| 阶段 | percent | step 文案 |
|---|---|---|
| 开始 | 10 | 正在创建 Google Slides 演示文稿... |
| 创建完成 | 25 | 演示文稿创建成功，正在批量构建 15 页幻灯片内容... |
| 每块完成 | 25 → 90 | 已写入 {n} / 15 页幻灯片... |
| 完成 | 100 | Google Slides 演示文稿生成完成！可直接在云端查看与演讲。 |

`GoogleSlidesExportModal` 消费这些回调渲染进度条；完成后展示 `presentationUrl` 直达链接。

---

## 四、异常处理与排查

| 现象 | 可能原因 | 排查方向 |
|---|---|---|
| 弹窗提示「请先登录 Google 账号」 | `accessToken` 为空 | 点弹窗内登录按钮；注意刷新页面后需重登（令牌不落盘） |
| `创建 Google Slides 失败: 401` | 令牌过期或被撤销 | 重新登录 |
| `创建 Google Slides 失败: 403` | **作用域未授权**（用户拒绝了 Slides/Drive 权限），或 Slides API 未在项目内启用，或 API 配额超限 | 到 Google Cloud Console 检查 Slides API / Drive API 是否启用；确认 OAuth 同意屏幕已包含两个作用域 |
| 显示了进度但生成的文稿缺页 | 某个 chunk 的 `batchUpdate` 返回非 2xx | **当前实现只 `console.warn` 不抛出**——需打开浏览器控制台搜索 `Batch update chunk warning` |
| 文稿里残留一个空白页 | 步骤 3 删除失败 | 亦为 `console.warn` 忽略；手动删除即可 |

### ⚠️ 已知健壮性缺口（诚实记录）

分块写入失败时**不会中断、不会上报、最终仍报 100% 成功**：

```ts
if (!updateRes.ok) {
  const err = await updateRes.text();
  console.warn('Batch update chunk warning:', err);   // ← 只警告
}
```

这意味着用户可能在「导出成功」的提示下拿到一份**内容不全**的文稿。生产化改造建议见下方。

---

## 五、生产化改造建议

| 项 | 建议 |
|---|---|
| **chunk 失败要可见** | 收集失败块，在 `ExportProgress` 里加 `failedChunks`；或在 `onProgress` 之外增加 `onError` 回调，弹窗明确提示「部分页面未写入，可重试」 |
| **支持断点续传** | 把 `presentationId` 返回给调用方，失败时用同一个 ID 重试只补写缺失块，而不是新建文稿（当前每次重试都会产生一个孤儿文稿） |
| **令牌持久化** | 见上文「令牌生命周期」——优先 re-auth 而非落盘 |
| **导出前预检** | 调一次 `GET /v1/presentations/{id}` 确认可用，再开始批量写入 |
| **支持导出到指定文件夹** | 用 `drive.file` 作用域调 Drive API 的 `files.update` 设置 `parents` |
| **不要依赖 Emoji 一致性** | 流程图数据里有 Emoji（📋/👤/🚀），Slides 端字体渲染与浏览器不同，视觉可能不一致 |

---

## 六、本地导出的对照

如果只想拿到内容、不想要云端文稿，用 `DownloadLocalModal` 的另外三条通道（详见 [01-三个工作台.md](01-三个工作台.md) 与 README 第 7 节）：

| 通道 | 产物 | 是否需要登录 |
|---|---|---|
| 问卷 Markdown | `.md` | ❌ |
| 幻灯片 + 逐字稿 Markdown | `.md` | ❌ |
| 单文件离线 HTML | `.html` | ❌ |
| Google Slides | 云端文稿 | ✅ |

**除 Google Slides 之外，其余功能全部离线可用。**
