import { useState, useMemo } from 'react';

/**
 * 分页逻辑 Hook
 * @param {Array} data - 数据数组
 * @param {number} initialPageSize - 初始每页条数，默认10
 * @returns {Object} 分页状态和方法
 */
const usePagination = (data, initialPageSize = 10) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(initialPageSize);

    // 计算总页数
    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(data.length / pageSize));
    }, [data.length, pageSize]);

    // 当数据或每页条数变化时，确保当前页有效
    useMemo(() => {
        if (currentPage > totalPages) {
            setCurrentPage(Math.max(1, totalPages));
        }
    }, [totalPages, currentPage]);

    // 获取当前页的数据
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return data.slice(startIndex, endIndex);
    }, [data, currentPage, pageSize]);

    // 跳转到指定页
    const goToPage = (page) => {
        const targetPage = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(targetPage);
    };

    // 下一页
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    // 上一页
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    // 修改每页条数
    const changePageSize = (newSize) => {
        setPageSize(newSize);
        setCurrentPage(1); // 重置到第一页
    };

    // 重置到第一页（用于搜索等场景）
    const resetPage = () => {
        setCurrentPage(1);
    };

    return {
        currentPage,
        pageSize,
        totalPages,
        totalItems: data.length,
        paginatedData,
        goToPage,
        nextPage,
        prevPage,
        changePageSize,
        resetPage,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1
    };
};

export default usePagination;
