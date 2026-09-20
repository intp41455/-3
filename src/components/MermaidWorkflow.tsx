import React, { useState } from 'react';
import {
  Copy,
  Check,
  ArrowRight,
  Users,
  FileText,
  CheckCircle2,
  AlertTriangle,
  GitBranch,
  ShieldAlert,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

const RAW_MERMAID = `graph TD
    A[📋 问卷正式发放] --> B[👤 指定问卷总协调人]
    B --> C[📤 分解派发至各业务与IT部门]
    C --> D[📝 各部门分头填写对应模块]
    D --> E[🔄 协调人统一汇总与格式清洗]
    E --> F[✅ 内部交叉审核与质检]
    F --> G{指标与接口是否完备？}
    G -->|否 需补充| D
    G -->|是 确认无误| H[📎 附上历史台账与接口数据附件]
    H --> I[📩 各业务负责人签署确认并提交]
    I --> J[🚀 交付架构团队，启动落地实施蓝图设计]`;

interface StepNode {
  id: string;
  code: string;
  title: string;
  role: string;
  desc: string;
  phaseId: 'phase1' | 'phase2' | 'phase3' | 'phase4';
  phaseName: string;
  deliverable: string;
  riskNote: string;
}

const STEPS: StepNode[] = [
  {
    id: 'A',
    code: 'STEP 01',
    title: '问卷正式发放',
    role: '项目筹备组 / 数字化推进办',
    desc: '正式项目启动前 1~2 周统一下发问卷模板、宣贯 PPT 讲稿及填报标准。',
    phaseId: 'phase1',
    phaseName: '阶段一：启动与派发',
    deliverable: '全套问卷模板、部门填报任务清单',
    riskNote: '必须同步附带高管宣贯讲话要点，避免被业务部门当作普通例行公事而忽视。',
  },
  {
    id: 'B',
    code: 'STEP 02',
    title: '指定单一问卷总协调人',
    role: '分管高管 / 数字化办公室总监',
    desc: '在企业内部指定唯一接口总负责人，专职负责跨部门拉通、进度催办与疑难解答。',
    phaseId: 'phase1',
    phaseName: '阶段一：启动与派发',
    deliverable: '总协调人任命通知与联络方式',
    riskNote: '切忌多头汇报或未设总接口人，否则跨部门协作极易出现责任真空与推诿。',
  },
  {
    id: 'C',
    code: 'STEP 03',
    title: '分解派发至各业务与 IT 部门',
    role: '问卷总协调人',
    desc: '将 10 大维度问卷按职能拆解：业务部门认领维度 1-4，IT 认领维度 5-7，财务法务认领维度 9-10。',
    phaseId: 'phase1',
    phaseName: '阶段一：启动与派发',
    deliverable: '10 大模块责任认领表（附录 B）',
    riskNote: '各认领人需由部门主管背书，确保填报人为熟悉一线业务与系统的骨干专家。',
  },
  {
    id: 'D',
    code: 'STEP 04',
    title: '各部门并行精细化填报',
    role: '各业务骨干 / 系统开发与运维组',
    desc: '如实梳理业务痛点、流程 SOP、IT 接口清单；遇不确定数据标注 [估算] 并注明口径。',
    phaseId: 'phase2',
    phaseName: '阶段二：分布式填报',
    deliverable: '各部门分卷初稿与疑问台账',
    riskNote: '禁止凭空编造不存在的理想数据；宁可标注“待调研”，不可提供虚假结论。',
  },
  {
    id: 'E',
    code: 'STEP 05',
    title: '统一汇总与跨模块口径清洗',
    role: '问卷总协调人',
    desc: '收拢各部门分卷，核对业务与 IT 之间的数据口径冲突（如业务说有接口，IT 说未开放）。',
    phaseId: 'phase3',
    phaseName: '阶段三：审核与质检',
    deliverable: '合并清洗版全景问卷草案',
    riskNote: '总协调人需主持 1 次 30 分钟对齐会，现场澄清业务与技术侧的认知分歧。',
  },
  {
    id: 'F',
    code: 'STEP 06',
    title: '内部交叉审核与完整性核查',
    role: '各业务线负责人 + IT 总监',
    desc: '重点审查是否所有标红关键问题均已作答、IT 接口参数与字段是否完备。',
    phaseId: 'phase3',
    phaseName: '阶段三：审核与质检',
    deliverable: '审核通过意见书（或驳回补充清单）',
    riskNote: '若存在未闭环的重要问题，果断打回对应部门在 24 小时内补全。',
  },
  {
    id: 'H',
    code: 'STEP 07',
    title: '附上历史台账与接口数据附件',
    role: '各部门对接人',
    desc: '收集脱敏真实业务报表、老员工经验笔记、系统数据字典与 API Swagger 文档，统一编号。',
    phaseId: 'phase3',
    phaseName: '阶段三：审核与质检',
    deliverable: '标准化附件压缩包与索引清单',
    riskNote: '关键数据必须先完成脱敏处理，杜绝个人隐私与最高机密数据未经审批流转。',
  },
  {
    id: 'I',
    code: 'STEP 08',
    title: '各业务长签字知悉并正式提交',
    role: '各业务长 + 协调人 + 数字化分管高管',
    desc: '签署知悉回执，正式向多智能体实施项目组交接全部问卷与技术输入材料。',
    phaseId: 'phase4',
    phaseName: '阶段四：提交与转化',
    deliverable: '签署版《调研问卷全案》及全部附件',
    riskNote: '签署代表业务部门对现状真实性负责，后续方案以本次输入作为基线前提。',
  },
  {
    id: 'J',
    code: 'STEP 09',
    title: '交付架构团队，启动实施方案设计',
    role: '多智能体解决方案架构团队',
    desc: '基于扎实的实地数据，构建符合企业实际状况的 Multi-Agent 系统部署落地蓝图。',
    phaseId: 'phase4',
    phaseName: '阶段四：提交与转化',
    deliverable: '《企业多智能体落地实施蓝图与 ROI 评估报告》',
    riskNote: '确保设计方案紧贴现有 IT 基础设施，严禁“空中楼阁”式的脱节规划。',
  },
];

const PHASES = [
  {
    id: 'phase1',
    number: '01',
    name: '启动与派发',
    timeline: 'Day 1 ~ Day 2',
    owner: '数字化办公室 + 协调人',
    coreGoal: '任命单一总协调人，下发问卷与宣贯材料，完成各部门任务认领',
  },
  {
    id: 'phase2',
    number: '02',
    name: '分布式填报',
    timeline: 'Day 3 ~ Day 5',
    owner: '各业务线骨干 + IT运维组',
    coreGoal: '并行梳理 10 大维度现状，据实填写指标与接口，遇疑问即时沟通',
  },
  {
    id: 'phase3',
    number: '03',
    name: '审核与质检',
    timeline: 'Day 6 ~ Day 7',
    owner: '总协调人 + 各部门主管',
    coreGoal: '统一数据口径清洗，交叉质检；不达标打回补充，打包数据附件',
  },
  {
    id: 'phase4',
    number: '04',
    name: '提交与转化',
    timeline: 'Day 8 ~ Day 10',
    owner: '业务长审批 + 架构团队',
    coreGoal: '签署确认回执正式提交，架构团队全面启动落地蓝图深化设计',
  },
];

export const MermaidWorkflow: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [selectedStepId, setSelectedStepId] = useState<string>('A');

  const handleCopy = () => {
    navigator.clipboard.writeText(RAW_MERMAID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeStep = STEPS.find((s) => s.id === selectedStepId) || STEPS[0];

  return (
    <div className="space-y-4" id="workflow-container">
      {/* 1. Top Executive Banner */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                协同推进 SOP 规范
              </span>
              <span className="text-xs text-slate-500 font-editorial-mono">
                标准周期：7 ~ 10 工作日 · 闭环质检保障
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              多智能体调研问卷 · 四步闭环填报工作流
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed max-w-3xl">
              构建“单一接口人总揽 + 部门矩阵式填报 + 交叉口径清洗 + 附件证据链打包”的正规协同流程，确保调研数据高保真交付。
            </p>
          </div>

          <button
            onClick={handleCopy}
            id="copy-mermaid-btn"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200 rounded-md transition-colors shadow-2xs self-start sm:self-center cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '已复制 Mermaid 代码' : '复制流程图源码'}</span>
          </button>
        </div>
      </div>

      {/* 2. Four Phases Architecture Grid (结构组成一目了然) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {PHASES.map((p) => (
          <div
            key={p.id}
            className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-2 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-editorial-mono text-sm font-bold text-blue-700">
                  阶段 {p.number}
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {p.timeline}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-2">{p.name}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{p.coreGoal}</p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              主导角色：<span className="font-medium text-slate-700">{p.owner}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Interactive Step Navigator & Step Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 items-start">
        {/* Step Nodes List */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-blue-700" />
              <h3 className="text-sm font-bold text-slate-900">
                九大关键节点操作指引 (点击节点查看质检要求与交付物)
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-editorial-mono">
              NODES 01 - 09
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {STEPS.map((step) => {
              const isSelected = step.id === selectedStepId;
              return (
                <button
                  key={step.id}
                  onClick={() => setSelectedStepId(step.id)}
                  className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-300 shadow-xs'
                      : 'bg-slate-50/60 hover:bg-slate-100/70 border-slate-200/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider font-editorial-mono ${
                        isSelected ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {step.code}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                      {step.phaseName}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 mb-1">
                    {step.title}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    负责方：{step.role}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Node Detail Inspector Panel */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4 lg:sticky lg:top-20">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-xs font-bold text-blue-700 font-editorial-mono">
              [ {activeStep.code} 节点深度说明 ]
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
              {activeStep.phaseName}
            </span>
          </div>

          <div>
            <h4 className="text-base font-bold text-slate-900 mb-1">
              {activeStep.title}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {activeStep.desc}
            </p>
          </div>

          <div className="space-y-3 pt-1 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
              <span className="font-bold text-slate-800 block">👤 主责角色</span>
              <span className="text-slate-600">{activeStep.role}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
              <span className="font-bold text-slate-800 block">📦 关键输出物 (Deliverables)</span>
              <span className="text-slate-600 font-medium">{activeStep.deliverable}</span>
            </div>

            <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200/80 space-y-1 text-amber-900">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                <span>质量控制与红线提示</span>
              </div>
              <p className="text-slate-700 leading-relaxed pt-0.5">
                {activeStep.riskNote}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Responsible RACI Matrix (各部门分工矩阵) */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-700" />
            <h3 className="text-sm font-bold text-slate-900">
              跨部门协同责任分工矩阵 (RACI Matrix)
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            R=负责填报，A=主管审批，C=协同提供，I=抄送知悉
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-800 font-semibold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="p-2.5 border-r border-slate-200">调研维度模块</th>
                <th className="p-2.5 border-r border-slate-200 text-center">业务线骨干</th>
                <th className="p-2.5 border-r border-slate-200 text-center">IT/信息化组</th>
                <th className="p-2.5 border-r border-slate-200 text-center">财务/运营部</th>
                <th className="p-2.5 border-r border-slate-200 text-center">法务/安全合规</th>
                <th className="p-2.5 text-center">总协调人</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {[
                { name: '维度 01 战略目标与建设预期', b: 'A/R', it: 'C', f: 'C', l: 'I', c: 'C' },
                { name: '维度 02 组织架构与角色权责', b: 'A/R', it: 'I', f: 'I', l: 'I', c: 'C' },
                { name: '维度 03 业务现状与核心痛点', b: 'R', it: 'C', f: 'C', l: 'I', c: 'C' },
                { name: '维度 04 业务流程与标准化 (SOP)', b: 'R', it: 'C', f: 'I', l: 'I', c: 'C' },
                { name: '维度 05 数据资产现状', b: 'C', it: 'A/R', f: 'I', l: 'I', c: 'C' },
                { name: '维度 06 知识库与规则库', b: 'R', it: 'C', f: 'I', l: 'I', c: 'C' },
                { name: '维度 07 IT系统拓扑与 API 开放', b: 'I', it: 'A/R', f: 'I', l: 'I', c: 'C' },
                { name: '维度 08 多智能体协同场景诉求', b: 'R', it: 'C', f: 'C', l: 'I', c: 'A' },
                { name: '维度 09 数据安全与合规要求', b: 'I', it: 'C', f: 'I', l: 'A/R', c: 'C' },
                { name: '维度 10 资源预算、周期与预期ROI', b: 'C', it: 'C', f: 'A/R', l: 'I', c: 'A' },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60">
                  <td className="p-2.5 font-semibold text-slate-900 border-r border-slate-100">
                    {row.name}
                  </td>
                  <td className="p-2.5 text-center border-r border-slate-100 font-bold text-blue-700">
                    {row.b}
                  </td>
                  <td className="p-2.5 text-center border-r border-slate-100 font-bold text-emerald-700">
                    {row.it}
                  </td>
                  <td className="p-2.5 text-center border-r border-slate-100 font-medium text-slate-700">
                    {row.f}
                  </td>
                  <td className="p-2.5 text-center border-r border-slate-100 font-medium text-slate-700">
                    {row.l}
                  </td>
                  <td className="p-2.5 text-center font-bold text-slate-900">
                    {row.c}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
