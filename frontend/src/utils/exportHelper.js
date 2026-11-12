/**
 * 账号导出工具函数
 * 导出格式：----连接账号，密码，和2fa，若有辅助邮箱放在最后
 */

/**
 * 判断是否包含有效的辅助邮箱
 * 过滤空值以及历史占位符如 "无"、"-"、"none" 等
 * @param {string} recovery 辅助邮箱字符串
 * @returns {boolean}
 */
export const hasRecoveryEmail = (recovery) => {
    if (!recovery) return false;
    const clean = recovery.trim().toLowerCase();
    return clean !== '' && clean !== '无' && clean !== '-' && clean !== '--' && clean !== 'none' && clean !== 'null';
};

/**
 * 格式化单个账号为导出字符串
 * @param {Object} acc 账号对象
 * @returns {string} 格式化后的字符串
 */
export const formatAccount = (acc) => {
    if (!acc) return '';
    const email = (acc.email || '').trim();
    const password = (acc.password || '').trim();
    const secret = (acc.secret || '').replace(/\s/g, '').trim();
    const recovery = (acc.recovery || '').trim();

    const parts = [email, password, secret];
    if (hasRecoveryEmail(recovery)) {
        parts.push(recovery);
    }
    return parts.join('----');
};

/**
 * 批量格式化账号列表为导出文本（换行分隔）
 * @param {Array} accounts 账号数组
 * @returns {string} 多行导出文本
 */
export const formatAccountsBatch = (accounts = []) => {
    if (!Array.isArray(accounts)) return '';
    return accounts.map(formatAccount).join('\n');
};

/**
 * 触发纯文本文件下载
 * @param {string} content 文本内容
 * @param {string} filename 文件名
 */
export const downloadTextFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
