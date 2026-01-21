import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

/**
 * 分页组件
 * @param {Object} props
 * @param {number} props.currentPage - 当前页码
 * @param {number} props.totalPages - 总页数
 * @param {number} props.totalItems - 总条数
 * @param {number} props.pageSize - 每页条数
 * @param {Function} props.onPageChange - 页码变化回调
 * @param {Function} props.onPageSizeChange - 每页条数变化回调
 * @param {boolean} props.hasNextPage - 是否有下一页
 * @param {boolean} props.hasPrevPage - 是否有上一页
 */
const Pagination = ({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
    onPageSizeChange,
    hasNextPage,
    hasPrevPage
}) => {
    // 生成页码列表
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5; // 最多显示5个页码

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // 始终显示第一页
            pages.push(1);

            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            // 调整范围确保显示足够的页码
            if (currentPage <= 3) {
                end = 4;
            } else if (currentPage >= totalPages - 2) {
                start = totalPages - 3;
            }

            // 添加省略号
            if (start > 2) {
                pages.push('...');
            }

            // 添加中间页码
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            // 添加省略号
            if (end < totalPages - 1) {
                pages.push('...');
            }

            // 始终显示最后一页
            pages.push(totalPages);
        }

        return pages;
    };

    const pageSizeOptions = [10, 20, 50];

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-slate-50/50 border-t border-slate-100">
            {/* 左侧：显示信息 */}
            <div className="text-sm text-slate-500">
                共 <span className="font-bold text-slate-700">{totalItems}</span> 条记录，
                第 <span className="font-bold text-slate-700">{currentPage}</span> / {totalPages} 页
            </div>

            {/* 中间：页码导航 */}
            <div className="flex items-center gap-1">
                {/* 首页 */}
                <button
                    onClick={() => onPageChange(1)}
                    disabled={!hasPrevPage}
                    className={`p-2 rounded-lg transition-all ${hasPrevPage
                        ? 'text-slate-600 hover:bg-slate-200 hover:text-blue-600'
                        : 'text-slate-300 cursor-not-allowed'
                        }`}
                    title="首页"
                >
                    <ChevronsLeft size={18} />
                </button>

                {/* 上一页 */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!hasPrevPage}
                    className={`p-2 rounded-lg transition-all ${hasPrevPage
                        ? 'text-slate-600 hover:bg-slate-200 hover:text-blue-600'
                        : 'text-slate-300 cursor-not-allowed'
                        }`}
                    title="上一页"
                >
                    <ChevronLeft size={18} />
                </button>

                {/* 页码按钮 */}
                <div className="flex items-center gap-1 mx-2">
                    {getPageNumbers().map((page, index) =>
                        page === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-2 text-slate-400">
                                ...
                            </span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`min-w-[36px] h-9 px-3 rounded-lg font-medium transition-all ${page === currentPage
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                    : 'text-slate-600 hover:bg-slate-200 hover:text-blue-600'
                                    }`}
                            >
                                {page}
                            </button>
                        )
                    )}
                </div>

                {/* 下一页 */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!hasNextPage}
                    className={`p-2 rounded-lg transition-all ${hasNextPage
                        ? 'text-slate-600 hover:bg-slate-200 hover:text-blue-600'
                        : 'text-slate-300 cursor-not-allowed'
                        }`}
                    title="下一页"
                >
                    <ChevronRight size={18} />
                </button>

                {/* 末页 */}
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={!hasNextPage}
                    className={`p-2 rounded-lg transition-all ${hasNextPage
                        ? 'text-slate-600 hover:bg-slate-200 hover:text-blue-600'
                        : 'text-slate-300 cursor-not-allowed'
                        }`}
                    title="末页"
                >
                    <ChevronsRight size={18} />
                </button>
            </div>

            {/* 右侧：每页条数选择 */}
            <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>每页</span>
                <select
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                    {pageSizeOptions.map(size => (
                        <option key={size} value={size}>{size} 条</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default Pagination;
