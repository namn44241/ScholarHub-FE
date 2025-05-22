"use client"

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import * as React from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar, type FilterableColumns, type SearchableColumns } from "./data-table-toolbar"

import {
  DataTableActionBar,
  DataTableActionBarSelection
} from "./data-table-action-bar"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchableColumns?: SearchableColumns[]
  filterableColumns?: FilterableColumns[]
  deleteRowsAction?: React.MouseEventHandler<HTMLButtonElement>
  isLoading?: boolean
  renderActionBar?: (table: any) => React.ReactNode
  totalCount?: number
  pageCount?: number
  pageSize?: number
  pageIndex?: number
  onPaginationChange?: (pageIndex: number, pageSize: number) => void
  manualPagination?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterableColumns = [],
  searchableColumns = [],
  deleteRowsAction,
  isLoading = false,
  renderActionBar,
  totalCount,
  pageCount,
  pageSize = 10,
  pageIndex = 0,
  onPaginationChange,
  manualPagination = false,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])

  const [internalPageIndex, setInternalPageIndex] = React.useState(pageIndex)
  const [internalPageSize, setInternalPageSize] = React.useState(pageSize)

  const currentPageIndex = manualPagination ? pageIndex : internalPageIndex
  const currentPageSize = manualPagination ? pageSize : internalPageSize

  const calculatedPageCount = pageCount ?? Math.ceil((totalCount ?? data.length) / currentPageSize)

  const handlePaginationChange = React.useCallback(
    (newPageIndex: number, newPageSize: number) => {
      if (manualPagination && onPaginationChange) {
        onPaginationChange(newPageIndex, newPageSize)
      } else {
        setInternalPageIndex(newPageIndex)
        setInternalPageSize(newPageSize)
      }
    },
    [manualPagination, onPaginationChange]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageIndex: currentPageIndex,
        pageSize: currentPageSize,
      },
    },
    pageCount: calculatedPageCount,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === 'function'
          ? updater({ pageIndex: currentPageIndex, pageSize: currentPageSize })
          : updater

      handlePaginationChange(newPagination.pageIndex, newPagination.pageSize)
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: manualPagination ? undefined : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination,
  })

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        filterableColumns={filterableColumns}
        searchableColumns={searchableColumns}
        deleteRowsAction={deleteRowsAction}
      />
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        table={table}
        totalCount={totalCount}
        manualPagination={manualPagination}
      />

      {renderActionBar ? (
        renderActionBar(table)
      ) : (
        <DataTableActionBar table={table}>
          <DataTableActionBarSelection table={table} />
        </DataTableActionBar>
      )}
    </div>
  )
}
