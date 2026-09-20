import React, { useState } from 'react';
import { exportToGoogleSlides, ExportProgress } from '../services/slidesExport';
import { SLIDES_DATA } from '../data/slidesData';
import { ExternalLink, CheckCircle, AlertCircle, Loader2, Presentation, X, ShieldCheck } from 'lucide-react';

interface GoogleSlidesExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  accessToken: string | null;
  onRequireLogin: () => void;
}

export const GoogleSlidesExportModal: React.FC<GoogleSlidesExportModalProps> = ({
  isOpen,
  onClose,
  accessToken,
  onRequireLogin,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState<ExportProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartExport = async () => {
    if (!accessToken) {
      onRequireLogin();
      return;
    }

    setIsExporting(true);
    setError(null);
    setProgress({ step: '正在连接 Google Slides API 服务...', percent: 5 });

    try {
      const res = await exportToGoogleSlides(accessToken, SLIDES_DATA, (p) => {
        setProgress(p);
      });
      setResultUrl(res.presentationUrl);
    } catch (err: any) {
      console.error('Export failed:', err);
      setError(err.message || '导出到 Google Slides 失败，请检查 Google 账号授权状态后重试。');
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = () => {
    setProgress(null);
    setError(null);
    setResultUrl(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      id="google-slides-modal"
    >
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleReset}
          disabled={isExporting}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
          aria-label="关闭"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-xl shrink-0">
            📊
          </div>
          <div>
            <span className="text-[11px] font-semibold text-blue-700 font-editorial-mono uppercase tracking-wider block mb-0.5">
              Google Workspace Slides Integration
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              导出到 Google Slides 幻灯片
            </h3>
          </div>
        </div>

        {/* Content Body */}
        {!resultUrl && !error && (
          <div className="space-y-5">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm text-slate-700 space-y-3">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">
                    授权与操作说明：
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    本次操作将使用您的 Google 账号权限，在您的 Google 云端硬盘中创建一个全新的演示文稿：
                    <strong className="text-slate-900 ml-1 font-semibold">
                      《企业多智能体系统（Multi-Agent）部署 · 信息采集与现状调研宣贯方案》
                    </strong>
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/70 grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>15 页全景高管汇报 PPT</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>标准图文卡片与表格排版</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>演讲逐字稿备注 (Notes)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>康源养老实战案例与排期</span>
                </div>
              </div>
            </div>

            {/* Progress indicator */}
            {isExporting && progress && (
              <div className="space-y-2 py-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-700 font-semibold flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {progress.step}
                  </span>
                  <span className="text-slate-900 font-bold font-editorial-mono">{progress.percent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-blue-700 transition-all duration-300 rounded-full"
                    style={{ width: `${progress.percent}%` }}
                  ></div>
                </div>
              </div>
            )}

            {!accessToken && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-center justify-between">
                <span>尚未连接 Google 账号，需先完成授权登录</span>
                <button
                  onClick={onRequireLogin}
                  id="modal-login-btn"
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium transition-colors cursor-pointer"
                >
                  前往授权登录
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handleReset}
                disabled={isExporting}
                className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleStartExport}
                disabled={isExporting}
                id="start-export-slides-btn"
                className="px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white text-xs font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>正在创建并写入...</span>
                  </>
                ) : (
                  <>
                    <Presentation className="w-3.5 h-3.5" />
                    <span>开始导出到 Google Slides</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Success State */}
        {resultUrl && (
          <div className="space-y-5 text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">
                Google Slides 幻灯片创建成功！
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                已成功在您的 Google 云端硬盘中生成 15 页高管汇报宣贯演示文稿，包含排版卡片、图表与逐字稿。
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={resultUrl}
                target="_blank"
                rel="noreferrer"
                id="open-slides-link"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
              >
                <span>在 Google Slides 中立即打开</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-4 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                完成并返回
              </button>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="space-y-4 py-2">
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-red-800">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>导出失败</span>
              </div>
              <p className="leading-relaxed">{error}</p>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setError(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                返回重试
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
