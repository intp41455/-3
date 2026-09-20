export interface SlideContentCard {
  title: string;
  badge?: string;
  items: string[];
  type?: 'primary' | 'secondary' | 'accent' | 'warning' | 'success';
}

export interface SlideTable {
  headers: string[];
  rows: string[][];
}

export interface SlideData {
  id: number;
  slideNumber: number;
  category: string;
  badge: string;
  actionTitle: string;
  subTitle?: string;
  objective: string;
  layout: 'cover' | 'agenda' | 'compare' | 'matrix' | 'flow' | 'detail' | 'pyramid' | 'split' | 'gantt' | 'conclusion';
  cards?: SlideContentCard[];
  table?: SlideTable;
  flowSteps?: { step: string; label: string; desc: string; role: string; highlight?: boolean }[];
  pyramidLevels?: { level: string; title: string; desc: string; target: string }[];
  timeline?: { day: string; phase: string; tasks: string[]; owner: string }[];
  highlightBanner?: string;
  speakerNotes: string;
}

export interface QuestionnaireQuestion {
  question: string;
  explanation: string;
  example?: string;
}

export interface ExampleTableData {
  headers: string[];
  rows: string[][];
}

export interface QuestionnaireSection {
  id: string;
  number: string;
  title: string;
  description: string;
  subsections: {
    title: string;
    questions: QuestionnaireQuestion[];
    exampleData?: ExampleTableData;
  }[];
}
