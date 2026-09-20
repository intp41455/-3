import React, { useState, useEffect, useRef } from 'react';
import { SLIDES_DATA } from '../data/slidesData';
import { SlideData } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  MessageSquareText,
  Copy,
  Check,
  Share2,
  FileSpreadsheet,
  CheckCircle2,
  ArrowRight,
  Compass,
  ArrowDownToLine,
} from 'lucide-react';

// 4 Executive Phases grouping the 15 slides
const EXECUTIVE_PHASES = [
  {
    id: 'phase1',
    title: '一、战略背景与认知对齐 (Why)',
    subTitle: '认知升级与调研必要性',
    slideRange: [1, 2, 3],
    badge: 'Why 为什么做',
  },
  {
    id: 'phase2',
    title: '二、调研核心·10大维度框架 (What)',
    subTitle: '从业务、数据到IT拓扑',
    slideRange: [4, 5, 6, 7, 8],
    badge: 'What 调研什么',
  },
  {
    id: 'phase3',
    title: '三、推进机制与协同工作流 (How)',
    subTitle: '闭环协作与填报原则',
    slideRange: [9, 10, 11],
    badge: 'How 怎么推进',
  },
  {
    id: 'phase4',
    title: '四、实战案例与推进排期 (Outcome)',
    subTitle: '康源案例、排期与交付物',
    slideRange: [12, 13, 14, 15],
    badge: 'Outcome 产出交付',
  },
];

interface PresentationViewerProps {
  onOpenExportModal: () => void;
  onOpenDownloadModal?: () => void;
}

export const PresentationViewer: React.FC<PresentationViewerProps> = ({
  onOpenExportModal,
  onOpenDownloadModal,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedNote, setCopiedNote] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentSlide: SlideData = SLIDES_DATA[currentSlideIndex] || SLIDES_DATA[0];

  // Identify current executive phase
  const currentPhase = EXECUTIVE_PHASES.find(
    (p) => currentSlide.slideNumber >= p.slideRange[0] && currentSlide.slideNumber <= p.slideRange[p.slideRange.length - 1]
  ) || EXECUTIVE_PHASES[0];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrev();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'n' || e.key === 'N') {
        setShowSpeakerNotes((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex]);

  // Autoplay timer
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % SLIDES_DATA.length);
      }, 7000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying]);

  const handleNext = () => {
    if (currentSlideIndex < SLIDES_DATA.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const handleCopySpeakerNote = () => {
    if (currentSlide.speakerNotes) {
      navigator.clipboard.writeText(currentSlide.speakerNotes);
      setCopiedNote(true);
      setTimeout(() => setCopiedNote(false), 2000);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`w-full space-y-4 ${isFullscreen ? 'bg-slate-50 p-6 h-screen overflow-y-auto' : ''}`}
      id="presentation-viewer"
    >
      {/* 1. Top Executive 4-Phases Navigation Bar (一目了然的四大结构组成) */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3 sm:p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Compass className="w-4 h-4 text-blue-700" />
            <span>宣贯汇报体系全景结构 (四大篇章推进脉络)</span>
          </div>
          <div className="text-xs text-slate-500 font-editorial-mono">
            当前处于：<span className="font-semibold text-blue-700">{currentPhase.title}</span>
          </div>
        </div>

        {/* 4 Phase Quick Jump Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-3">
          {EXECUTIVE_PHASES.map((phase, idx) => {
            const isActive = phase.id === currentPhase.id;
            return (
              <button
                key={phase.id}
                onClick={() => setCurrentSlideIndex(phase.slideRange[0] - 1)}
                className={`p-2.5 text-left rounded-lg border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-50/80 border-blue-300 shadow-xs'
                    : 'bg-slate-50/50 hover:bg-slate-100/70 border-slate-200/70'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      isActive ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    篇章 0{idx + 1}
                  </span>
                  <span className="text-[11px] font-editorial-mono text-slate-400">
                    P{phase.slideRange[0].toString().padStart(2, '0')}-P{phase.slideRange[phase.slideRange.length - 1].toString().padStart(2, '0')}
                  </span>
                </div>
                <div className={`text-xs font-bold leading-tight ${isActive ? 'text-blue-950' : 'text-slate-800'}`}>
                  {phase.title.split(' ')[0]}
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">{phase.subTitle}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Main Workspace (Left Outline + Right Slide Stage) */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 items-start">
        {/* Left Sidebar: Detailed Outline Tree */}
        <aside className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-900 block">幻灯片目录清单</span>
              <span className="text-[11px] text-slate-500">共 15 页高管汇报宣贯全案</span>
            </div>
            <span className="font-editorial-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              {currentSlide.slideNumber}/15
            </span>
          </div>

          {/* Scrollable Slide List */}
          <div className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-y-auto lg:max-h-[640px] pr-1 scrollbar-thin">
            {SLIDES_DATA.map((slide, idx) => {
              const isSelected = idx === currentSlideIndex;
              return (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`p-2.5 rounded-lg text-left transition-all cursor-pointer shrink-0 lg:shrink w-48 lg:w-full border ${
                    isSelected
                      ? 'bg-blue-50 border-blue-300 text-blue-950 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-100 hover:border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={`font-editorial-mono text-[11px] font-bold ${
                        isSelected ? 'text-blue-700' : 'text-slate-400'
                      }`}
                    >
                      P{slide.slideNumber.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[80px]">
                      {slide.badge}
                    </span>
                  </div>
                  <div className="text-xs font-semibold leading-tight line-clamp-2">
                    {slide.actionTitle}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Export Quick Action */}
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            {onOpenDownloadModal && (
              <button
                onClick={onOpenDownloadModal}
                className="w-full text-center py-2 px-3 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <ArrowDownToLine className="w-3.5 h-3.5 text-blue-700" />
                <span>下载全套讲稿到本地</span>
              </button>
            )}
            <button
              onClick={onOpenExportModal}
              className="w-full text-center py-2 px-3 rounded-lg text-xs font-medium bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>📊 导出至 Google Slides</span>
            </button>
          </div>
        </aside>

        {/* Right Stage: Slide Canvas & Speaker Notes */}
        <section className="flex flex-col gap-4">
          {/* Main Slide Card */}
          <div
            className="bg-white border border-slate-200/90 rounded-xl p-6 sm:p-8 lg:p-10 shadow-xs relative flex flex-col justify-between min-h-[580px]"
            id="slide-stage"
          >
            {/* Slide Header */}
            <div className="mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-editorial-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                    {currentPhase.badge}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Section {currentSlide.slideNumber.toString().padStart(2, '0')} · {currentSlide.category}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {currentSlide.badge}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-slate-900 tracking-tight leading-snug mb-2">
                {currentSlide.actionTitle}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
                {currentSlide.subTitle && (
                  <span className="font-semibold text-slate-800 mr-2">
                    {currentSlide.subTitle} —
                  </span>
                )}
                <span>{currentSlide.objective}</span>
              </p>
            </div>

            {/* Slide Body Content */}
            <div className="flex-1 mb-6 overflow-y-auto">
              {/* Highlight Banner if present */}
              {currentSlide.highlightBanner && (
                <div className="mb-5 p-3 rounded-lg bg-blue-50/70 border border-blue-200/70 text-xs sm:text-sm text-blue-950 font-medium flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none">💡</span>
                    <span>{currentSlide.highlightBanner}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider bg-white px-2 py-0.5 rounded border border-blue-200 shrink-0">
                    核心观点
                  </span>
                </div>
              )}

              {/* Cover Layout */}
              {currentSlide.layout === 'cover' && (
                <div className="py-2 space-y-6 max-w-4xl">
                  <div className="bg-slate-50/60 p-5 rounded-xl border border-slate-200/80">
                    <span className="text-xs uppercase font-bold text-blue-800 tracking-wider block mb-1">
                      Enterprise Multi-Agent Baseline Initiative
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                      以精准数据与业务规则，筑基企业级智能体协同底座
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      在大模型与多智能体落地前全面摸清业务脉络、系统接口与管理规则。为智能体架构师提供完备的数据资产、IT 拓扑与业务规章底图，避免无用功与认知脱节。
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentSlide.cards?.map((card, idx) => (
                      <div key={idx} className="p-4 rounded-lg bg-white border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="font-bold text-sm text-slate-900">
                            {card.title}
                          </span>
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            {card.badge}
                          </span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                          {card.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-blue-600 font-bold shrink-0">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Agenda Layout */}
              {currentSlide.layout === 'agenda' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-2">
                  {currentSlide.cards?.map((card, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50/60 border border-slate-200 space-y-2 flex flex-col justify-between">
                      <div>
                        <span className="font-editorial-mono text-xl font-bold text-blue-700 block mb-1">
                          0{idx + 1}
                        </span>
                        <h3 className="font-bold text-sm text-slate-900 mb-2">
                          {card.title}
                        </h3>
                        <ul className="space-y-1.5 text-xs text-slate-600 leading-relaxed">
                          {card.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-blue-600 font-medium shrink-0">→</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-2 border-t border-slate-200/60 mt-3">
                        <span className="text-[10px] font-medium text-slate-500">
                          {card.badge}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Compare Layout */}
              {currentSlide.layout === 'compare' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                  {currentSlide.cards?.map((card, idx) => {
                    const isAgent = idx === 1;
                    return (
                      <div
                        key={idx}
                        className={`p-5 rounded-xl border ${
                          isAgent
                            ? 'border-blue-300 bg-blue-50/40 shadow-xs'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                          <h4 className="font-bold text-sm sm:text-base text-slate-900">
                            {card.title}
                          </h4>
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                              isAgent
                                ? 'bg-blue-700 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {card.badge}
                          </span>
                        </div>
                        <ul className="space-y-2 text-xs text-slate-700">
                          {card.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span
                                className={`font-mono text-xs shrink-0 ${
                                  isAgent ? 'text-blue-700 font-bold' : 'text-slate-400'
                                }`}
                              >
                                {isAgent ? '✓' : '—'}
                              </span>
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Matrix Layout */}
              {currentSlide.layout === 'matrix' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-2">
                  {currentSlide.cards?.map((card, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-white border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-[11px] font-bold text-blue-700">
                          {card.badge}
                        </span>
                        <span className="text-[10px] text-slate-400 font-editorial-mono">
                          DIM 0{idx * 2 + 1} & 0{idx * 2 + 2}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{card.title}</h4>
                      <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                        {card.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-blue-600 font-medium shrink-0">→</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Flow Layout */}
              {currentSlide.layout === 'flow' && (
                <div className="space-y-4 py-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {currentSlide.flowSteps?.map((st, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border ${
                          st.highlight
                            ? 'border-blue-300 bg-blue-50/50'
                            : 'border-slate-200 bg-white'
                        } space-y-2`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-editorial-mono text-xs font-bold text-blue-700 bg-blue-100/60 px-1.5 py-0.5 rounded">
                            {st.step}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {st.role}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                          {st.label}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
                      </div>
                    ))}
                  </div>

                  {currentSlide.cards && (
                    <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 mt-3">
                      <h4 className="text-xs uppercase font-bold text-slate-800 mb-2.5">
                        {currentSlide.cards[0].title}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {currentSlide.cards[0].items.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed flex items-start gap-2"
                          >
                            <span className="text-blue-600 font-bold shrink-0">✓</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Pyramid Layout */}
              {currentSlide.layout === 'pyramid' && currentSlide.pyramidLevels && (
                <div className="space-y-3 max-w-4xl py-2">
                  {currentSlide.pyramidLevels.map((lvl, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {lvl.level}
                          </span>
                          <h4 className="font-bold text-sm sm:text-base text-slate-900">
                            {lvl.title}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-600">{lvl.desc}</p>
                      </div>
                      <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 shrink-0">
                        核心指标：{lvl.target}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Gantt / Timeline Layout */}
              {currentSlide.layout === 'gantt' && currentSlide.timeline && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 py-2">
                  {currentSlide.timeline.map((tl, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50/60 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-700 text-white">
                          {tl.day}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {tl.owner}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 pt-1">{tl.phase}</h4>
                      <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                        {tl.tasks.map((task, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-blue-600 font-medium shrink-0">•</span>
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Table Layout */}
              {currentSlide.table && (
                <div className="overflow-x-auto rounded-lg border border-slate-200 my-2">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 text-slate-800 font-semibold uppercase text-[11px] border-b border-slate-200">
                      <tr>
                        {currentSlide.table.headers.map((h, i) => (
                          <th key={i} className="p-3 border-r border-slate-200 last:border-r-0">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {currentSlide.table.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50/80">
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className={`p-3 border-r border-slate-100 last:border-r-0 ${
                                cIdx === 0
                                  ? 'font-bold text-slate-900 whitespace-nowrap'
                                  : cIdx === 2
                                  ? 'font-medium text-blue-700'
                                  : 'text-slate-600'
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Detail / Split / Conclusion generic cards */}
              {(currentSlide.layout === 'detail' ||
                currentSlide.layout === 'split' ||
                currentSlide.layout === 'conclusion') &&
                currentSlide.cards && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                    {currentSlide.cards.map((card, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-50/50 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                          <h4 className="font-bold text-sm sm:text-base text-slate-900">
                            {card.title}
                          </h4>
                          {card.badge && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-200/70 text-slate-700">
                              {card.badge}
                            </span>
                          )}
                        </div>
                        <ul className="space-y-2 text-xs sm:text-sm text-slate-600 pt-1">
                          {card.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-blue-600 font-bold shrink-0 mt-0.5">•</span>
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
            </div>

            {/* Bottom Control Bar inside Stage */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-500 font-editorial-mono">
                [ SLIDE {currentSlide.slideNumber} OF {SLIDES_DATA.length} ] · 键盘左右方向键支持快速翻页
              </div>

              {/* Clean Action Controls */}
              <div className="flex items-center gap-1.5" id="slide-controls">
                <button
                  onClick={handlePrev}
                  disabled={currentSlideIndex === 0}
                  className="px-3 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-medium disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                  title="Previous Slide (←)"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>上一页</span>
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-all cursor-pointer shadow-2xs flex items-center gap-1 ${
                    isPlaying
                      ? 'bg-blue-700 border-blue-700 text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                  title="自动播放"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? '暂停' : '轮播'}</span>
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentSlideIndex === SLIDES_DATA.length - 1}
                  className="px-3 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-medium disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                  title="Next Slide (→)"
                >
                  <span>下一页</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <div className="w-[1px] h-4 bg-slate-200 mx-1" />

                <button
                  onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
                  className={`px-2.5 py-1.5 rounded-md border text-xs font-medium transition-all cursor-pointer shadow-2xs flex items-center gap-1 ${
                    showSpeakerNotes
                      ? 'bg-slate-100 border-slate-300 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                  }`}
                  title="显示/隐藏逐字稿 (N)"
                >
                  <MessageSquareText className="w-3.5 h-3.5" />
                  <span>逐字稿</span>
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
                  title="全屏模式 (F)"
                >
                  {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Speaker Notes Drawer / Section (大方典雅的逐字稿板块) */}
          {showSpeakerNotes && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs transition-all">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-800 flex items-center justify-center">
                    <MessageSquareText className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900">
                      P{currentSlide.slideNumber} 高管汇报演讲逐字稿与发言重点
                    </span>
                    <span className="text-[11px] text-slate-400 ml-2">
                      （供主讲人在业务宣贯会或高管会现场提词使用）
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCopySpeakerNote}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-700 px-2 py-1 rounded hover:bg-slate-50 transition-colors cursor-pointer"
                  title="复制本页逐字稿"
                >
                  {copiedNote ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedNote ? '已复制' : '复制逐字稿'}</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal bg-slate-50/70 p-3.5 rounded-lg border border-slate-100">
                {currentSlide.speakerNotes}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
