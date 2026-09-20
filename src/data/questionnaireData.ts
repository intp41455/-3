import { QuestionnaireSection } from '../types';

export const QUESTIONNAIRE_METADATA = {
  title: '企业多智能体系统部署 · 信息采集标准问卷',
  version: 'V1.0',
  stage: '方案策划启动前 1-2 周',
  period: '建议 7-10 个工作日',
  confidentialStatement:
    '本问卷所涉及的企业数据（包括但不限于组织架构、运营数据、财务信息、人员信息等）仅用于本次多智能体系统方案设计。未经贵方书面许可，不得向任何第三方披露或在其他项目中使用。所有数据在方案交付后将进行加密归档或按约定销毁。',
  instructions: [
    { item: '发放时机', desc: '方案策划启动前 1-2 周，预留客户准备数据的时间' },
    { item: '填写方式', desc: '由企业项目对接人牵头，协调各业务部门配合填写' },
    { item: '填写周期', desc: '建议 7-10 个工作日' },
    { item: '填写原则', desc: '① 能提供数据/文档的直接附上；② 暂无精确数据的提供估算；③ 确实无法回答的标注“待调研”' },
    { item: '提交格式', desc: '建议提交本问卷的 Markdown 或 Word 版本，并将相关数据附件打包一并提交' }
  ]
};

export const QUESTIONNAIRE_SECTIONS: QuestionnaireSection[] = [
  {
    id: 'sec1',
    number: '第一部分',
    title: '企业基本信息',
    description: '全面摸清企业概况与当前数字化转型基线，厘清业务板块营收占比与现有系统应用深度。',
    subsections: [
      {
        title: '1.1 企业概况',
        questions: [
          { question: '企业全称', explanation: '工商注册全称', example: '陕西康源投资集团有限公司' },
          { question: '所属行业', explanation: '主行业 + 细分领域', example: '养老服务（机构养老 + 社区居家 + 养老教育 + 智慧养老）' },
          { question: '成立时间', explanation: '成立年/月', example: '2004 年' },
          { question: '总部所在地', explanation: '省市及核心办公地', example: '陕西省西安市' },
          { question: '分支机构数量', explanation: '含子公司、分公司、直营机构等', example: '7 家机构（西安 4 家、成都 2 家、云南曲靖 1 家）+ 30 余个日间照料中心' },
          { question: '员工总数', explanation: '含全职、兼职与外包人员', example: '约 500 人' },
          { question: '年营收规模', explanation: '尽可能提供近一年数据或区间', example: '约 X 亿元' },
          { question: '核心业务板块', explanation: '列出 2-5 个主要业务板块及各自营收占比', example: '机构养老（60%）、社区居家（20%）、养老教育（15%）、智慧养老（5%）' }
        ]
      },
      {
        title: '1.2 数字化转型现状',
        questions: [
          { question: '是否已制定数字化战略/规划？', explanation: '有/无，如有请简要描述发展目标', example: '已成立深圳瑞康瀚云科技，专注智慧康养解决方案' },
          { question: '现有 IT 系统清单及供应商', explanation: '列出核心系统（ERP/OA/CRM/HIS 等）及供应商', example: '智慧康养大数据平台（自研，2024年上线）；钉钉OA（2021年）；财务系统（用友，2018年）' },
          { question: '现有系统的上线时间', explanation: '各系统分别标注投入生产运行的年份' },
          { question: '数据标准化程度', explanation: '各系统间数据格式是否统一？是否存在“数据孤岛”？', example: '各机构运营数据格式未统一，存在数据孤岛' },
          { question: '是否已有 BI/数据分析看板？', explanation: '有/无，如有说明覆盖范围及实时性' },
          { question: '企业内对 AI 技术的应用情况', explanation: '已使用 / 试点中 / 未使用', example: '目前尚未应用 AI 技术' }
        ]
      }
    ]
  },
  {
    id: 'sec2',
    number: '第二部分',
    title: '组织架构与人员现状',
    description: '梳理企业管理治理关系、跨部门数据流转节点，明确多智能体系统各类使用者的画像与素养。',
    subsections: [
      {
        title: '2.1 组织架构与流转路径',
        questions: [
          { question: '企业组织架构图', explanation: '直接附 PDF/图片附件，或文字描述层级关系' },
          { question: '总部与分支机构的管理关系', explanation: '直管 / 矩阵式 / 独立运营' },
          { question: '各业务板块间的数据流转路径', explanation: '谁产出数据？谁需要数据？通过什么方式流转？' },
          { question: '关键决策流程', explanation: '日常运营决策和战略决策分别由谁做出、经过哪些环节审批？' }
        ]
      },
      {
        title: '2.2 人员画像（系统使用者）',
        questions: [
          { question: '核心用户群体', explanation: '主要使用者角色（高层管理者、机构院长、财务、一线护理等）' },
          { question: '各用户群体规模与数字化素养', explanation: '人数规模与数字化能力高/中/低评估' },
          { question: '各用户群体的核心诉求', explanation: '他们最希望通过智能体系统解决什么日常痛点？' },
          { question: '是否有专职 IT/信息化团队？', explanation: '团队规模、技能图谱与自研能力', example: 'IT 团队约 8 人，主要负责智慧养老平台运维，具备基础开发能力' }
        ],
        exampleData: {
          headers: ['角色', '规模', '数字化素养', '核心诉求'],
          rows: [
            ['集团管理层', '约 10 人', '高', '实时掌握全局运营数据与决策建议'],
            ['各机构院长', '约 7 人', '中', '关注本院运营指标与合规情况'],
            ['财务人员', '约 15 人', '高', '高效完成月度结算与跨机构核对'],
            ['一线护理主管', '约 30 人', '较低', '了解排班、工单与服务质量数据']
          ]
        }
      }
    ]
  },
  {
    id: 'sec3',
    number: '第三部分',
    title: '各业务板块数据详情',
    description: '下沉到具体业务单元与基层台账，穿透数据来源、更新频次、统计耗时与人工瓶颈。',
    subsections: [
      {
        title: '3.1 业务板块清单与运营模式',
        questions: [
          { question: '共有几个核心业务板块？', explanation: '列出各板块名称及核心业务说明' },
          { question: '各板块的运营模式', explanation: 'B2B / B2C / B2G / 混合' },
          { question: '各板块营收占比及关注指标', explanation: '各板块收入比重及各自关注的 KPI' }
        ]
      },
      {
        title: '3.2 各板块具体数据（分板块实操深潜）',
        questions: [
          { question: '该板块的规模底数', explanation: '如机构数、总床位数、日服务人次', example: '机构养老：自营 7 家机构，床位 1051 张，入住率 82%' },
          { question: '核心数据源与更新频率', explanation: '来自哪个系统/Excel/设备？每日/每周/每月？', example: '各机构 Excel 台账 + 智慧养老平台，每日手动更新' },
          { question: '历史数据保留时长与数据格式', explanation: '历史跨度、Excel/CSV/数据库/API/纸质', example: '已积累 3 年历史数据，格式各机构不统一' },
          { question: '标准化模板执行情况', explanation: '是否有标准化模板？执行是否一致？', example: '已建立标准模板，但分支机构执行不一' },
          { question: '目前数据报告耗时', explanation: '从原始数据到生成完整报告需要多少工作日？', example: '每月需耗时 3-5 个工作日进行多机构手工合并' },
          { question: '目前数据流转最大瓶颈', explanation: '哪个环节最耗时、最容易出错？', example: '格式不统一导致跨表核验繁重，易出人为差错' }
        ]
      }
    ]
  },
  {
    id: 'sec4',
    number: '第四部分',
    title: '现有 IT 系统与技术环境',
    description: '盘点 IT 软硬件底座、网络带宽、云上与本地部署、数据唯一标识（One-ID）与数据治理规范。',
    subsections: [
      {
        title: '4.1 系统清单与接口能力',
        questions: [
          { question: '核心业务系统清单', explanation: '系统名称、供应商、上线时间、主要功能' },
          { question: '各系统的数据接口与导出格式', explanation: '是否开放 API 接口？能否定制导出？' },
          { question: '数据存储位置与互通情况', explanation: '本地服务器 / 云端 / 混合；完全孤岛 / 部分打通 / 深度打通' }
        ]
      },
      {
        title: '4.2 网络、硬件与数据治理',
        questions: [
          { question: '各分支机构网络环境', explanation: '带宽、稳定性、是否专线、有无边缘设备' },
          { question: '物联网设备部署', explanation: '如长者睡眠监测雷达、智能手环、定位设备及数量' },
          { question: '数据治理与 One-ID 现状', explanation: '是否存在“同一客户在不同系统有不同 ID”问题？' },
          { question: '数据备份机制与灾备演练', explanation: '备份频次、冷热备份位置与恢复测试记录' }
        ]
      }
    ]
  },
  {
    id: 'sec5',
    number: '第五部分',
    title: '具体业务规则与流程',
    description: '沉淀企业成文制度与非成文经验，将老骨干的“脑中直觉”与 200+ 标准规章转化为智能体规则链。',
    subsections: [
      {
        title: '5.1 核心业务流程与经验依赖',
        questions: [
          { question: '各板块核心业务流程图', explanation: '优先附 Visio/PPT/图片附件' },
          { question: '流程中已标准化的环节', explanation: '列出已形成刚性制度文件的节点' },
          { question: '依赖老员工经验的环节', explanation: '哪些判定极度依赖“老院长的经验直觉”？' },
          { question: '流程中的例外与容错情况', explanation: '哪些突发情况不走标准流程？如何特批处理？' }
        ]
      },
      {
        title: '5.2 规则体系（以康源美宏 213 项标准为例）',
        questions: [
          { question: '规则体系全称与规则总数', explanation: '成文规则总数及主要类别划分', example: '康源美宏养老服务标准化体系，共 213 项（服务提供 98 项、服务保障 83 项等）' },
          { question: '规则执行与版本管理', explanation: '人工执行 / 系统强制；是否有修订版本记录', example: '目前全部由人工执行，最新版本为 V3.0，近 12 个月调整约 15 次' },
          { question: '规则变更审批流程', explanation: '由谁发起修订、谁审批（如标准化委员会）' },
          { question: '异常识别与智能体协助期待', explanation: '希望智能体如何处理异常？自动识别/多级告警/应对建议/闭环修复' }
        ]
      }
    ]
  },
  {
    id: 'sec6',
    number: '第六部分',
    title: '外部数据与政策信息',
    description: '规划“政策雷达 Agent”，自动化监控行业新规、医保政策、标杆对标及外部第三方 API 接口。',
    subsections: [
      {
        title: '6.1 政策监控与对标需求',
        questions: [
          { question: '主要关注的外部政策源', explanation: '民政厅、卫健委、医保局官网通知与权威发布' },
          { question: '政策影响时效与应对要求', explanation: '政策发布后需当月/当季还是当年完成业务适配？' },
          { question: '希望智能体如何赋能政策', explanation: '仅推送提醒 / 自动解析业务影响范围 / 给出具体应对建议' },
          { question: '行业对标与竞对监测', explanation: '关注哪些同业标杆数据？有无数据交换机制？' }
        ]
      },
      {
        title: '6.2 外部 API 与数据集成',
        questions: [
          { question: '已对接的外部系统', explanation: '如医保结算系统、银行支付渠道、社保监管平台' },
          { question: '未来优先对接的外部系统', explanation: '按业务紧迫度排定一期、二期对接优先级' }
        ]
      }
    ]
  },
  {
    id: 'sec7',
    number: '第七部分',
    title: '合规与安全要求',
    description: '牢筑数据安全防线，界定敏感数据隔离红线，确立等保合规要求与 RTO/RPO 业务连续性指标。',
    subsections: [
      {
        title: '7.1 数据合规红线',
        questions: [
          { question: '涉及的敏感数据类型', explanation: '长者健康病历、家属个人隐私、财务收支明细等' },
          { question: '数据内网边界要求', explanation: '完全不可出内网 / 部分脱敏可出 / 允许加密传输' },
          { question: '行业专项合规与跨境要求', explanation: '医疗健康数据安全管理办法等；是否涉及跨境数据？' }
        ]
      },
      {
        title: '7.2 系统安全与连续性',
        questions: [
          { question: '等保安全等级要求', explanation: '等保二级 / 等保三级 或其他商业认证' },
          { question: '认证与审计要求', explanation: '是否需要双因素认证（MFA）？日志留存时长（≥180天）' },
          { question: '灾备连续性指标', explanation: '可接受的 RTO（恢复时间目标）与 RPO（恢复点目标）' }
        ]
      }
    ]
  },
  {
    id: 'sec8',
    number: '第八部分',
    title: '用户交互与体验偏好',
    description: '尊重用户既有办公习惯，设计 Web、移动端、大屏多端展示与钉钉/企微多级告警推送机制。',
    subsections: [
      {
        title: '8.1 访问端与报表呈现',
        questions: [
          { question: '主要访问设备偏好', explanation: '高管大屏看板 / 移动端小程序 / Web管理后台 / 离线支持' },
          { question: '数据报告获取形式', explanation: '主动看板查询 / 系统定时主动推送简报 / 两者兼备' },
          { question: '报表推送周期偏好', explanation: '日报（晨报/夕会）、周度分析、月度全面经营分析' }
        ]
      },
      {
        title: '8.2 多级告警与事件响应',
        questions: [
          { question: '需要监控的异常事件类型', explanation: '运营指标偏离、安全服务合规、财务结算异常、设备掉线' },
          { question: '告警接收渠道', explanation: '钉钉工作通知 / 企业微信 / 邮件 / 短信 / 系统内置' },
          { question: '分级响应时效', explanation: '轻微异常推给现场主管；重大合规风险 1 小时内直达集团副总裁' }
        ]
      }
    ]
  },
  {
    id: 'sec9',
    number: '第九部分',
    title: '技术约束与集成偏好',
    description: '明确技术栈喜好、模型服务商选型（如 DeepSeek）、集成优先级与系统 SLA 可用性承诺。',
    subsections: [
      {
        title: '9.1 底层模型与技术栈偏好',
        questions: [
          { question: '指定的 AI 模型/服务商偏好', explanation: '如 DeepSeek、通义千问、文心一言、开源本地部署等' },
          { question: '云厂商偏好与部署方式', explanation: '阿里云 / 腾讯云 / 华为云 / 本地自建算力机房' },
          { question: '开源方案 vs 商业闭源方案', explanation: '偏好纯开源自主可控 / 偏好成熟商业闭源支持' }
        ]
      },
      {
        title: '9.2 集成优先级与运维支持',
        questions: [
          { question: '现有系统集成优先级', explanation: '一期必须集成（如大数据平台+OA） vs 二期后续扩展' },
          { question: '系统可用性 SLA 期望', explanation: '如 99.9% / 99.5% / 仅工作时间保障' },
          { question: '培训赋能期望', explanation: '是否需要面向管理层、院长、一线主管的分层赋能培训' }
        ]
      }
    ]
  },
  {
    id: 'sec10',
    number: '第十部分',
    title: '预算与时间期望',
    description: '锁定项目投资边界、硬性里程碑交付节点与量化验收 KPI，确立项目双赢交付基准。',
    subsections: [
      {
        title: '10.1 预算总盘与时间里程碑',
        questions: [
          { question: '项目预算大致范围', explanation: '具体数字或立项预算区间，是否包含硬件与后续年保' },
          { question: '期望的项目启动时间', explanation: '方案评审完成后预计正式动工日期' },
          { question: '硬性时间截止节点', explanation: '如赶在某次集团董事会或年度经营总结前演示上线' },
          { question: '可接受的敏捷交付节奏', explanation: '如按月交付功能模块，持续迭代上线' }
        ]
      },
      {
        title: '10.2 成功量化标准与验收流程',
        questions: [
          { question: '如何衡量项目是否成功？', explanation: '列出 3-5 个具体的业务与管理衡量指标' },
          { question: '可量化的提升期望', explanation: '如“全局经营报表生成时间从 3~5 天缩减至 1 小时以内”' },
          { question: '底线不容妥协要求', explanation: '如“长者健康档案与财务数据绝对零泄露”' },
          { question: '验收流程与决策人', explanation: '由谁组织终审验收、经过哪些层级签字签批' }
        ]
      }
    ]
  }
];

export const QUESTIONNAIRE_APPENDICES = {
  appendixA: [
    { rule: 'A.1 “信息不可用”的处理', content: '如某项信息确实无法获取（如历史数据未记录），请标注“待调研”或“暂无”，严禁空留。' },
    { rule: 'A.2 评估准确度标注体系', content: '【精确】来自系统导出核算；【估算】业务骨干理性核实；【初步】一线经验感知需后续核准。' },
    { rule: 'A.3 大体量数据提交方式', content: '大量数据样本直接作为附件打包提交，正文仅标注“见附件 1：XX 机构运营数据样本”。' },
    { rule: 'A.4 核心流程附图', content: '审批流、数据流优先使用 Visio、PPT 或手绘流程图作为附件提交。' },
    { rule: 'A.5 多部门协调人负责制', content: '指定一名总协调人负责统筹分发、进度催办、格式统一与内部确认。' }
  ],
  appendixBHeaders: ['角色', '姓名', '部门', '职务', '联系方式'],
  appendixBRows: [
    ['问卷总协调人', '', '', '', ''],
    ['业务线填写人', '', '', '', ''],
    ['IT线填写人', '', '', '', ''],
    ['管理决策确认', '', '', '', '']
  ]
};
