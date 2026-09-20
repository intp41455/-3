import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { initAuth, googleSignIn, logout } from './services/auth';
import { Navbar } from './components/Navbar';
import { PresentationViewer } from './components/PresentationViewer';
import { QuestionnaireViewer } from './components/QuestionnaireViewer';
import { MermaidWorkflow } from './components/MermaidWorkflow';
import { GoogleSlidesExportModal } from './components/GoogleSlidesExportModal';
import { DownloadLocalModal } from './components/DownloadLocalModal';
import { Sparkles, Layers, FileSpreadsheet, ShieldCheck } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'presentation' | 'questionnaire' | 'workflow'>('presentation');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
      },
      () => {
        setCurrentUser(null);
        setAccessToken(null);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setAccessToken(res.accessToken);
      }
    } catch (err: any) {
      console.error('Login error:', err);
    }
  };

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    setAccessToken(null);
  };

  const handleOpenExportModal = () => {
    setIsExportModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-800 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onOpenExportModal={handleOpenExportModal}
        onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 w-full mx-auto p-4 sm:p-6 lg:p-8 max-w-[1600px]">
        {currentTab === 'presentation' && (
          <PresentationViewer
            onOpenExportModal={handleOpenExportModal}
            onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
          />
        )}

        {currentTab === 'questionnaire' && <QuestionnaireViewer />}

        {currentTab === 'workflow' && <MermaidWorkflow />}
      </main>

      {/* Google Slides Export Modal */}
      <GoogleSlidesExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        accessToken={accessToken}
        onRequireLogin={handleLogin}
      />

      {/* Download to Local Modal */}
      <DownloadLocalModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />

      {/* Executive Clean Footer */}
      <footer className="w-full border-t border-slate-200/90 bg-white py-4 px-4 sm:px-8 text-slate-500 text-[11px] sm:text-xs">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-editorial-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span className="font-semibold text-slate-700">ENTERPRISE MULTI-AGENT BASELINE · V1.0</span>
            <span className="text-slate-400">| 企业级多智能体前置调研与宣贯全案</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>MARKDOWN EXPORT ENABLED</span>
            <span>•</span>
            <span>GOOGLE SLIDES SYNC READY</span>
            <span>•</span>
            <span>DATA CONFIDENTIALITY PROTECTED</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
