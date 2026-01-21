import React from 'react';

/**
 * 操作按钮组件
 * @param {Object} props
 * @param {React.ReactNode} props.icon - 图标
 * @param {string} props.label - 按钮文字
 * @param {Function} props.onClick - 点击回调
 * @param {string} props.color - 按钮颜色主题 ('blue' | 'green' | 'orange' | 'default')
 * @param {boolean} props.darkMode - 暗色模式
 */
const ActionButton = ({ icon, label, onClick, color = 'default', darkMode = false }) => {
    // 根据颜色主题和暗色模式设置样式
    const colorStyles = darkMode ? {
        blue: 'bg-blue-900/50 text-blue-300 hover:bg-blue-500 hover:text-white border border-blue-700/50',
        green: 'bg-green-900/50 text-green-300 hover:bg-green-500 hover:text-white border border-green-700/50',
        orange: 'bg-orange-900/50 text-orange-300 hover:bg-orange-500 hover:text-white border border-orange-700/50',
        default: 'text-slate-400 hover:bg-slate-600 hover:text-white'
    } : {
        blue: 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white',
        green: 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white',
        orange: 'bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white',
        default: 'text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm'
    };

    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-bold rounded-md transition-all uppercase ${colorStyles[color] || colorStyles.default}`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
};

export default ActionButton;
