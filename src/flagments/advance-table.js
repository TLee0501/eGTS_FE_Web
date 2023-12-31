import React, { useCallback, useMemo, useState } from "react";
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table";
import Dialog from "./dialog";
import { Tooltip } from 'react-tooltip'

/**
 * @param {JSON} data dữ liệu đầu vào dưới dạng json
 * @param {Array} columns một mảng xác định các cột của bảng
 * @param {Array} initialState một mảng chứa các giá trị dựa theo initialState của React-table.
 * @param {JSON} dialogs một mảng chứa các chức năng cho dialog: tạo: dialogCreate, 
 * sửa: dialogEdit, xóa: dialogDelete.
 * @returns bảng giá trị được sắp xếp và có các chức năng: tìm kiếm, phân trang và dialog cho CRUD.
 */

export const AdvanceTable = ({ data, columns: initialColumns, initialState, dialogs, viewData }) => {
    const tableId = Math.random().toString(36).slice(2, 11);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [status, setStatus] = useState('1');
    const [hasIsLocked, setHasIsLocked] = useState(false);
    const { dialogCreate, dialogView, dialogEdit, dialogDelete } = dialogs ? dialogs : {};

    const options = [
        { value: 0, label: 'All' },
        { value: 1, label: 'Hoạt động' },
        { value: 2, label: 'Bị khóa' },
    ];

    const columns = useMemo(
        () => {
            const commonColumns = initialColumns;
            return (dialogs || viewData)
                ? [
                    ...commonColumns,
                    {
                        Header: (
                            <div className="dialog-actions">
                                <span>Hoạt Động Quản Lý</span>
                            </div>
                        ),
                        accessor: 'managementActions',
                        Cell: ({ row }) => (
                            <div className="table-actions">
                                {dialogView &&
                                    <span onClick={() => handleAction(dialogView, row.original)} title={dialogView.title ? dialogView.title : 'View'}>
                                        {dialogView.icon ? dialogView.icon : dialogView.title ? dialogView.title : 'View'}
                                    </span>
                                }
                                {viewData &&
                                    <span onClick={() => viewData.setDataView(row.original)} title={viewData.title ? viewData.title : 'View'}>
                                        {viewData.icon ? viewData.icon : viewData.title ? viewData.title : 'View'}
                                    </span>
                                }
                                {dialogEdit &&
                                    <span onClick={() => handleAction(dialogEdit, row.original)} title={dialogEdit.title ? dialogEdit.title : 'Edit'}>
                                        {dialogEdit.icon ? dialogEdit.icon : dialogEdit.title ? dialogEdit.title : 'Edit'}
                                    </span>
                                }
                                {dialogDelete &&
                                    <span onClick={() => handleAction(dialogDelete, row.original)} title={dialogDelete.title ? dialogDelete.title : 'Delete'}>
                                        {dialogDelete.icon ? dialogDelete.icon : dialogDelete.title ? dialogDelete.title : 'Delete'}
                                    </span>
                                }
                            </div>
                        ),
                        disableSortBy: true,
                        disableGlobalFilter: true,
                        width: dialogs && ((Object.keys(dialogs).length + (viewData ? 1 : 0)) * 50)
                    },
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                ] : commonColumns
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [initialColumns, dialogView, dialogEdit, dialogDelete]
    );

    const handleAction = (mode, rowData) => {
        setDialogMode(mode);
        setSelectedRow(rowData);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    const handleCreate = () => {
        setDialogMode(dialogCreate);
        setSelectedRow(null);
        setIsDialogOpen(true);
    };

    const booleanSortFunction = (rowA, rowB, columnId) => {
        const valueA = rowA.values[columnId] ? 1 : 0;
        const valueB = rowB.values[columnId] ? 1 : 0;

        return valueA - valueB;
    };

    const customColumns = useMemo(() => {
        return columns.map((column) => {
            if (column.accessor === 'isDelete') {
                setHasIsLocked(true);
                return {
                    ...column,
                    sortType: booleanSortFunction,
                    // Sử dụng custom sort function cho cột kiểu boolean
                    disableSortBy: status !== '0'
                };
            }
            return column;
        });
    }, [columns, status]);

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    }

    const handleData = useCallback(() => {
        if (data) {
            if (status === '1')
                return data.filter(row => !row.isDelete);
            if (status === '2')
                return data.filter(row => row.isDelete);
        }
        return data;
    }, [data, status]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        canNextPage,
        previousPage,
        canPreviousPage,
        gotoPage,
        pageCount,
        prepareRow,
        state,
        setGlobalFilter,
        setPageSize
    } = useTable(
        useMemo(() => ({
            columns: customColumns,
            data: handleData(),
            initialState: initialState,
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }), [customColumns, handleData]
        ), useGlobalFilter, useSortBy, usePagination
    );

    const { globalFilter, pageIndex, pageSize } = state;

    return (
        <>
            <div className="common-options">
                <div className="page-size">
                    <span>Hiển thị:{' '}</span>
                    <select value={pageSize} onChange={(e) => {
                        const newSize = Number(e.target.value);
                        if (newSize !== pageSize) {
                            setPageSize(newSize);
                        }
                    }} title="Page Size">
                        {
                            [10, 25, 50].map((pageSize) => (
                                <option key={pageSize} value={pageSize}>
                                    {pageSize}
                                </option>
                            ))
                        }
                    </select>
                </div>
                <div className="search-bar">
                    <span>
                        Tìm kiếm: {' '}
                        <input value={globalFilter || ''} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Tìm kiếm" />
                        {' '}<i className="fa-solid fa-circle-exclamation" data-tooltip-id={`search-tooltip-${tableId}`} />
                    </span>
                </div>
                {dialogCreate &&
                    <div className="button-create">
                        <button type="button" className="any-button" onClick={handleCreate}>
                            {dialogCreate.icon &&
                                <span className="icon-create">
                                    {dialogCreate.icon}
                                </span>
                            }
                            {dialogCreate.title}
                        </button>
                    </div>
                }

            </div>
            <table {...getTableProps()} className="custom-table">
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())} style={{ width: column.width }} title="">
                                    <div className="flex">
                                        {column.render("Header")}
                                        {column.disableSortBy ? null : (
                                            <span className="sort-toggle" title="Sort">
                                                {column.isSorted ?
                                                    (column.isSortedDesc ?
                                                        <i className="fa-solid fa-sort-up" /> : <i className="fa-solid fa-sort-down" />
                                                    ) : <i className="fa-solid fa-sort" />
                                                }
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {data.length > 0 ? page.map((row) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => (
                                    <td {...cell.getCellProps()}>
                                        {cell.render("Cell")}
                                    </td>
                                ))}
                            </tr>
                        )
                    }) : (
                        <tr>
                            <td colSpan={columns.length} style={{ textAlign: "center" }}>
                                <span className="status-error">Không có dữ liệu</span>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="common-options">
                {pageCount > 1 &&
                    <>
                        <div className="pagination-goto">
                            <span>Đến trang: {' '}</span>
                            <input type='number' defaultValue={pageIndex + 1} min="1"
                                onChange={(e) => {
                                    const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
                                    gotoPage(pageNumber);
                                }}
                            />
                        </div>
                        <div className="pagination-buttons">
                            <div className="pagination-previous-buttons">
                                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} type="button">{'<<'}</button>
                                <button onClick={() => previousPage()} disabled={!canPreviousPage} type="button">Trước</button>
                            </div>
                            <span className="current-page">{(pageIndex + 1) + ' / ' + pageCount}</span>
                            <div className="pagination-next-buttons">
                                <button onClick={() => nextPage()} disabled={!canNextPage} type="button">Sau</button>
                                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} type="button">{'>>'}</button>
                            </div>
                        </div>
                    </>
                }
                {hasIsLocked &&
                    <div className="show-all-checkbox">
                        <label>
                            Trạng Thái:
                            <select onChange={handleStatusChange} value={status}>
                                {options.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                }
            </div>
            {isDialogOpen && (
                <Dialog mode={dialogMode} rowData={selectedRow} onClose={handleCloseDialog} />
            )}
            <Tooltip id={`search-tooltip-${tableId}`}>
                <TooltipCustom data={customColumns} />
            </Tooltip>
        </>
    )
};

export const LoadingTable = () => {
    return (
        <div className="loading-table">
            <table className="custom-table">
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {Array(5).fill(null).map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            {Array(6).fill(null).map((_, cellIndex) => (
                                <td key={cellIndex}></td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="loading-overlay">
                <i className="fa-solid fa-spinner fa-spin-pulse"></i>
                <span>Đang tải dữ liệu...</span>
            </div>
        </div>
    )
}

const TooltipCustom = ({ data }) => {
    const searchableColumns = data.filter((column) => !column.disableGlobalFilter);

    return (
        <>
            <span>Tìm kiếm theo:</span>
            <ul>
                {searchableColumns.map((item, index) => (
                    <li key={index}>{item.Header}</li>
                ))}
            </ul>
        </>
    )
}