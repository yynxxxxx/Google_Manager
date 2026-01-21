import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';

/**
 * 登录页面组件
 */
const LoginPage = ({ onLoginSuccess, darkMode }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [banned, setBanned] = useState(false);
    const [banMessage, setBanMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // 检查是否被封禁
    useEffect(() => {
        const checkBanStatus = async () => {
            try {
                const result = await api.checkAuth();
                if (result.banned) {
                    setBanned(true);
                    setBanMessage(result.message);
                }
            } catch (err) {
                console.error('检查封禁状态失败:', err);
            }
        };
        checkBanStatus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password.trim()) {
            setError('请输入密码');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await api.login(password);
            if (result.success) {
                // 登录成功，保存到 localStorage（带时间戳，7天有效期）
                localStorage.setItem('loginData', JSON.stringify({
                    timestamp: Date.now()
                }));
                onLoginSuccess();
            } else {
                setError(result.message);
                // 检查是否被封禁
                if (result.message && result.message.includes('封禁')) {
                    setBanned(true);
                    setBanMessage(result.message);
                }
            }
        } catch (err) {
            setError('登录失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
            <div className={`w-full max-w-md p-8 rounded-3xl shadow-2xl ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                {/* Logo 和标题 */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg shadow-blue-200">
                        <ShieldCheck className="text-white w-8 h-8" />
                    </div>
                    <h1 className={`text-2xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                        GoogleManager
                    </h1>
                    <p className={`mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        请输入管理员密码以访问系统
                    </p>
                </div>

                {/* 封禁提示 */}
                {banned ? (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-lg font-bold text-red-600 mb-2">访问被拒绝</h2>
                        <p className="text-red-500 text-sm">{banMessage}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 密码输入 */}
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                管理员密码
                            </label>
                            <div className="relative">
                                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="请输入密码"
                                    className={`w-full pl-12 pr-12 py-4 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode
                                        ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-500'
                                        : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'}`}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={`absolute right-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* 错误提示 */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                <AlertTriangle size={16} />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* 登录按钮 */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-bold text-white transition-all ${loading
                                ? 'bg-slate-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200'}`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    验证中...
                                </span>
                            ) : (
                                '进入系统'
                            )}
                        </button>

                        {/* 提示信息 */}
                        <p className={`text-center text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            连续输错 3 次密码将被封禁 24 小时
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
