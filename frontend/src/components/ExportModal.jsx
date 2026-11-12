import React, { useState, useMemo } from 'react';
import { X, Download, Copy, Check, FileText, CheckCircle2 } from 'lucide-react';
import { formatAccountsBatch, downloadTextFile } from '../utils/exportHelper';

/**
 * 全部账号导出弹窗组件
 */
const ExportModal = ({
    isOpen,
    onClose,
    accounts = [],
    copyToClipboard,
    darkMode
}) => {
    // 导出范围: 'all' | 'unsold' | 'sold'
    const [exportScope, setExportScope] = useState('all');
    // 复制成功临时状态
    const [copied, setCopied] = useState(false);

    // 根据选定的范围筛选账号
    const targetAccounts = useMemo(() => {
        if (!Array.isArray(accounts)) return [];
        if (exportScope === 'unsold') {
            return accounts.filter(acc => acc.soldStatus !== 'sold');
        }
        if (exportScope === 'sold') {
            return accounts.filter(acc => acc.soldStatus === 'sold');
        }
        return accounts;
    }, [accounts, exportScope]);

    // 生成导出的文本内容
    const exportContent = useMemo(() => {
        return formatAccountsBatch(targetAccounts);
    }, [targetAccounts]);

    if (!isOpen) return null;

    // 处理复制到剪切板
    const handleCopy = () => {
        if (!exportContent) return;
        copyToClipboard(exportContent, `导出的 ${targetAccounts.length} 个账号信息`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // 处理下载 TXT 文件
    const handleDownload = () => {
        if (!exportContent) return;
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
        const scopeLabel = exportScope === 'unsold' ? '未售出' : exportScope === 'sold' ? '已售出' : '全部';
        const filename = `google_accounts_${scopeLabel}_${dateStr}.txt`;
        downloadTextFile(exportContent, filename);
    };

    const unsoldAccountsCount = accounts.filter(acc => acc.soldStatus !== 'sold').length;
    const soldAccountsCount = accounts.filter(acc => acc.soldStatus === 'sold').length;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div
                className={`rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] ${
                    darkMode ? 'bg-slate-800 text-slate-100 border border-slate-700' : 'bg-white text-slate-800'
                }`}
            >
                {/* 弹窗头部 */}
                <div className={`p-6 border-b flex justify-between items-center ${
                    darkMode ? 'border-slate-700 bg-slate-800/80' : 'border-slate-100 bg-slate-50'
                }`}>
                    <div className="flex items-center gap-2.5">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl text-white shadow-md shadow-indigo-500/20">
                            <Download size={20} />
                        </div>
                        <div>
                            <h3 className={`text-xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                                全部账号导出
                            </h3>
                            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                格式：<span className="font-mono font-medium text-indigo-400">账号----密码----2FA----辅助邮箱</span>（若无辅助邮箱则不带）
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-xl transition-all ${
                            darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                        }`}
                        title="关闭"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* 弹窗内容 */}
                <div className="p-6 space-y-4 overflow-y-auto flex-1">
                    {/* 范围选择 */}
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                            darkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                            导出范围
                        </label>
                        <div className={`flex gap-1.5 p-1.5 rounded-2xl ${darkMode ? 'bg-slate-700/50' : 'bg-slate-100'}`}>
                            <button
                                type="button"
                                onClick={() => setExportScope('all')}
                                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                                    exportScope === 'all'
                                        ? (darkMode ? 'bg-slate-600 text-white shadow' : 'bg-white text-slate-800 shadow')
                                        : (darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700')
                                }`}
                            >
                                <span>全部账号</span>
                                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                                    exportScope === 'all' ? 'bg-indigo-500 text-white' : (darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600')
                                }`}>
                                    {accounts.length}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setExportScope('unsold')}
                                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                                    exportScope === 'unsold'
                                        ? 'bg-green-500 text-white shadow'
                                        : (darkMode ? 'text-green-400 hover:bg-green-900/30' : 'text-green-600 hover:bg-green-50')
                                }`}
                            >
                                <span>未售出账号</span>
                                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                                    exportScope === 'unsold' ? 'bg-white/20 text-white' : (darkMode ? 'bg-slate-800 text-green-400' : 'bg-green-100 text-green-700')
                                }`}>
                                    {unsoldAccountsCount}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setExportScope('sold')}
                                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                                    exportScope === 'sold'
                                        ? 'bg-red-500 text-white shadow'
                                        : (darkMode ? 'text-red-400 hover:bg-red-900/30' : 'text-red-600 hover:bg-red-50')
                                }`}
                            >
                                <span>已售出账号</span>
                                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                                    exportScope === 'sold' ? 'bg-white/20 text-white' : (darkMode ? 'bg-slate-800 text-red-400' : 'bg-red-100 text-red-700')
                                }`}>
                                    {soldAccountsCount}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* 文本预览 */}
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${
                                darkMode ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                                <FileText size={14} />
                                导出内容预览 ({targetAccounts.length} 条)
                            </span>
                            <span className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                                每行一个账号
                            </span>
                        </div>
                        <div className="relative">
                            <textarea
                                readOnly
                                value={exportContent || '（无符合条件的账号）'}
                                rows={8}
                                className={`w-full font-mono text-xs px-4 py-3 rounded-2xl border outline-none resize-none transition-all leading-relaxed ${
                                    darkMode
                                        ? 'bg-slate-900/80 border-slate-700 text-slate-200 focus:border-indigo-500'
                                        : 'bg-slate-50 border-slate-200 text-slate-700 focus:border-indigo-500'
                                }`}
                                onClick={(e) => e.target.select()}
                            />
                        </div>
                    </div>
                </div>

                {/* 弹窗底部操作按钮 */}
                <div className={`p-6 border-t flex flex-col sm:flex-row gap-3 justify-end items-center ${
                    darkMode ? 'border-slate-700 bg-slate-800/80' : 'border-slate-100 bg-slate-50'
                }`}>
                    <button
                        type="button"
                        onClick={onClose}
                        className={`w-full sm:w-auto px-5 py-2.5 border rounded-xl font-medium transition-all text-sm ${
                            darkMode
                                ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                                : 'border-slate-200 text-slate-600 hover:bg-white'
                        }`}
                    >
                        关闭
                    </button>

                    <button
                        type="button"
                        onClick={handleCopy}
                        disabled={targetAccounts.length === 0}
                        className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm ${
                            copied
                                ? 'bg-green-600 text-white'
                                : (darkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-100' : 'bg-slate-200 hover:bg-slate-300 text-slate-800')
                        } ${targetAccounts.length === 0 ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        <span>{copied ? '已复制到剪切板' : '复制到剪切板'}</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleDownload}
                        disabled={targetAccounts.length === 0}
                        className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all shadow-lg active:scale-95 ${
                            targetAccounts.length === 0
                                ? 'bg-slate-400 opacity-50 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-indigo-500/25'
                        }`}
                    >
                        <Download size={16} />
                        <span>下载 TXT 文件</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportModal;
