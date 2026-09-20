import React from 'react';
import { User } from 'firebase/auth';
import { Presentation, FileText, GitBranch, LogIn, LogOut, Share2, Shield, Layers, ArrowDownToLine } from 'lucide-react';

interface NavbarProps {
  currentTab: 'presentation' | 'questionnaire' | 'workflow';
  onSelectTab: (tab: 'presentation' | 'questionnaire' | 'workflow') => void;
  currentUser: User | null;
  onLogin: () => void;
  onLogout: () => void;
  onOpenExportModal: () => void;
  onOpenDownloadModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onLogin,
  onLogout,
  onOpenExportModal,
  onOpenDownloadModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 lg:px-8 py-3 transition-colors">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
        {/* Brand & Document Identity */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              <Layers className="w-4 h-4 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-none">
                  企业多智能体调研与宣贯全案
                </h1>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60 leading-none">
                  V1.0 标准版
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 hidden sm:block">
                Multi-Agent System Baseline Survey & Executive Presentation
              </p>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onOpenDownloadModal}
              className="p-1.5 rounded-md border border-slate-200 text-blue-700 bg-blue-50 text-xs hover:bg-blue-100"
              title="下载到本地"
            >
              <ArrowDownToLine className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenExportModal}
              className="p-1.5 rounded-md border border-slate-200 text-slate-700 bg-white text-xs hover:bg-slate-50"
              title="导出 Google Slides"
            >
              <Share2 className="w-4 h-4 text-amber-600" />
            </button>
          </div>
        </div>

        {/* Core Logical Structure Tabs (3 Pillars) */}
        <nav className="flex items-center bg-slate-100/90 p-1 rounded-lg border border-slate-200/70 text-xs font-medium w-full md:w-auto justify-center shadow-xs">
          <button
            onClick={() => onSelectTab('presentation')}
            id="tab-btn-presentation"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md transition-all cursor-pointer ${
              currentTab === 'presentation'
                ? 'bg-white text-blue-900 font-semibold shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Presentation className="w-3.5 h-3.5 text-blue-700" />
            <span>宣贯演讲幻灯片 (15页)</span>
          </button>

          <button
            onClick={() => onSelectTab('questionnaire')}
            id="tab-btn-questionnaire"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md transition-all cursor-pointer ${
              currentTab === 'questionnaire'
                ? 'bg-white text-blue-900 font-semibold shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-700" />
            <span>信息采集问卷 (10大维度)</span>
          </button>

          <button
            onClick={() => onSelectTab('workflow')}
            id="tab-btn-workflow"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md transition-all cursor-pointer ${
              currentTab === 'workflow'
                ? 'bg-white text-blue-900 font-semibold shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5 text-indigo-700" />
            <span>四步闭环工作流</span>
          </button>
        </nav>

        {/* Actions & Account Status */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Download to Local Button */}
          <button
            onClick={onOpenDownloadModal}
            id="navbar-download-local-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-300 shadow-2xs transition-all cursor-pointer"
            title="下载全套问卷、PPT或源码到本地"
          >
            <ArrowDownToLine className="w-3.5 h-3.5 text-blue-700" />
            <span>下载到本地</span>
          </button>

          {/* Export to Google Slides */}
          <button
            onClick={onOpenExportModal}
            id="navbar-export-slides-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-50/80 hover:bg-amber-100 text-amber-900 text-xs font-medium border border-amber-300/80 shadow-2xs transition-all cursor-pointer"
          >
            <span className="text-sm leading-none">📊</span>
            <span>导出 Google Slides</span>
          </button>

          {/* User Sign In Status */}
          {currentUser ? (
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 pl-2 pr-1.5 py-1 rounded-md">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  className="w-5 h-5 rounded-full border border-slate-300"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-blue-800 text-white text-[10px] flex items-center justify-center font-bold">
                  {currentUser.email?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <span className="text-xs text-slate-700 max-w-[110px] truncate font-medium">
                {currentUser.displayName || currentUser.email}
              </span>
              <button
                onClick={onLogout}
                id="logout-btn"
                className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                title="退出登录"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              id="google-login-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-all cursor-pointer shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>登录 Google 账号</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
