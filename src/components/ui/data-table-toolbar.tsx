import type { Table } from "@tanstack/react-table"
import { X } from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"
import { type DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DatePickerWithRange } from "../common/date-picker-with-range"
import { DateTimePicker24h } from "../common/date-time-picker-24h"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { DataTableViewOptions } from "./data-table-view-options"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filterableColumns?: FilterableColumns[]
  searchableColumns?: SearchableColumns[]
  deleteRowsAction?: React.MouseEventHandler<HTMLButtonElement>
}

export type FilterableColumns = {
  id: string
  title?: string
  options?: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
  type?: FilterType
}

export type FilterType = "select" | "date-range" | "date-time"

export type SearchableColumns = {
  id: string
  title?: string
}

export function DataTableToolbar<TData>({
  table,
  filterableColumns = [],
  searchableColumns = [],
  deleteRowsAction,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const hasSearchableColumns = searchableColumns.length > 0
  const hasFilterableColumns = filterableColumns.length > 0

  // State for date picker values
  const [dateRanges, setDateRanges] = useState<Record<string, DateRange | undefined>>({})
  const [dateTimes, setDateTimes] = useState<Record<string, Date | undefined>>({})

  useEffect(() => {
    const dateRangeColumns = filterableColumns.filter(col => col.type === "date-range").map(col => col.id);
    const dateTimeColumns = filterableColumns.filter(col => col.type === "date-time").map(col => col.id);

    const columnFilters = table.getState().columnFilters;

    const newDateRanges: Record<string, DateRange | undefined> = {};
    dateRangeColumns.forEach(columnId => {
      const filter = columnFilters.find(f => f.id === columnId);
      if (filter?.value) {
        newDateRanges[columnId] = filter.value as DateRange;
      } else {
        newDateRanges[columnId] = undefined;
      }
    });

    const newDateTimes: Record<string, Date | undefined> = {};
    dateTimeColumns.forEach(columnId => {
      const filter = columnFilters.find(f => f.id === columnId);
      if (filter?.value) {
        newDateTimes[columnId] = filter.value as Date;
      } else {
        newDateTimes[columnId] = undefined;
      }
    });

    if (JSON.stringify(newDateRanges) !== JSON.stringify(dateRanges)) {
      setDateRanges(newDateRanges);
    }

    if (JSON.stringify(newDateTimes) !== JSON.stringify(dateTimes)) {
      setDateTimes(newDateTimes);
    }
  }, [table.getState().columnFilters, filterableColumns]);

  const handleDateRangeChange = (columnId: string, dateRange: DateRange | undefined) => {
    if (!dateRange || !dateRange.from) {
      table.getColumn(columnId)?.setFilterValue(undefined);
      return;
    }

    table.getColumn(columnId)?.setFilterValue({
      from: dateRange.from,
      to: dateRange.to || dateRange.from
    });
  };

  const handleDateTimeChange = (columnId: string, dateTime: Date | undefined) => {
    table.getColumn(columnId)?.setFilterValue(dateTime);
  };

  const handleResetFilters = () => {
    table.resetColumnFilters();
  }

  return (
    <div className="flex flex-wrap justify-between items-center gap-2">
      <div className="flex flex-wrap flex-1 items-center gap-2 space-x-2">
        {hasSearchableColumns && (
          <Input
            placeholder="Search..."
            value={(table.getColumn(searchableColumns[0]?.id)?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn(searchableColumns[0]?.id)?.setFilterValue(event.target.value)}
            className="w-[150px] lg:w-[250px] h-9"
          />
        )}
        {hasFilterableColumns &&
          filterableColumns.map((column) => {
            if (!table.getColumn(column.id)) return null;

            if (column.type === "date-range") {
              return (
                <div key={column.id} className="flex flex-col gap-1 min-w-[240px]">
                  <DatePickerWithRange
                    date={dateRanges[column.id]}
                    onChange={(dateRange) => handleDateRangeChange(column.id, dateRange)}
                    placeholder={column.title ?
                      `${column.title ? `Select ${column.title} range` : "Select date range"}`
                      : "Pick a date range"}
                  />
                </div>
              );
            }

            if (column.type === "date-time") {
              return (
                <div key={column.id} className="flex flex-col gap-1 min-w-[240px]">
                  {column.title && (<p className="font-medium text-sm">{column.title}</p>)}
                  <DateTimePicker24h
                    date={dateTimes[column.id]}
                    onChange={(date) => handleDateTimeChange(column.id, date)}
                  />
                </div>
              );
            }

            if (column.options) {
              return (
                <DataTableFacetedFilter
                  key={column.id}
                  column={table.getColumn(column.id)}
                  title={column.title}
                  options={column.options}
                />
              );
            }

            return null;
          })}
        {isFiltered && (
          <Button variant="ghost" onClick={handleResetFilters} className="px-2 lg:px-3 h-9">
            Reset
            <X className="ml-2 size-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {deleteRowsAction && table.getSelectedRowModel().rows.length > 0 && (
          <Button variant="destructive" size="sm" onClick={deleteRowsAction} className="h-9">
            Delete ({table.getSelectedRowModel().rows.length})
          </Button>
        )}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}