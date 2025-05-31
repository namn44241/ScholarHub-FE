import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTable } from "@/components/ui/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import type { SearchableColumns } from "@/components/ui/data-table-toolbar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { Eye, FileUser, MoreHorizontal, PenLine, Plus, Trash2 } from "lucide-react"
import * as React from "react"
import { useState } from "react"
import { useScholarshipFormDialog } from "../hooks/use-scholarship-form-dialog"
import { useGetScholarships } from "../hooks/use-scholarship-management"
import { ScholarshipActionBar } from "./scholarship-action-bar"
import { ScholarshipFormDialog } from "./scholarship-form-dialog"
import type { IScholarship } from "@/types/scholarship"
import { truncateText } from "@/utils/functions"

export const ScholarshipTable = () => {
  const [limit, setLimit] = useState(10)
  const [offset, setOffset] = useState(0)
  const { data: scholarships = [], isLoading: isLoadingScholarship } = useGetScholarships({
    limit,
    offset,
  })

  const handlePageChange = (newPageIndex: number, newPageSize: number) => {
    setLimit(newPageSize)
    setOffset(newPageIndex * newPageSize)
  }

  const {
    isOpen,
    setIsOpen,
    formType,
    form,
    isSubmitting,
    onSubmit,
    openDialog,
    scholarshipId,
  } = useScholarshipFormDialog()

  const searchableColumns: SearchableColumns[] = [
    {
      id: "title",
      title: "Title",
    },
    {
      id: "type",
      title: "Type",
    },
    {
      id: "degree_level",
      title: "Degree Level",
    },
  ]


  const scholarshipColumns: ColumnDef<IScholarship>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "index",
      header: ({ column }) => <DataTableColumnHeader column={column} title="No." />,
      cell: ({ row }) => {
        const index = row.index + 1
        return <span>{index}</span>
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
      cell: ({ row }) => {
        const id = row.getValue("id") as string
        return <span>{truncateText(id, 10)}</span>
      },
    },
    {
      accessorKey: "title",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
      cell: ({ row }) => {
        const title = row.getValue("title") as string
        return <span className="font-medium">{title}</span>
      },
      enableSorting: true,
    },
    {
      accessorKey: "type",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
      cell: ({ row }) => {
        const type = row.getValue("type") as string
        return <span>{type || "N/A"}</span>
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "degree_level",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Degree Level" />,
      cell: ({ row }) => {
        const degreeLevel = row.getValue("degree_level") as string
        return <span className="capitalize">{degreeLevel || "N/A"}</span>
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "deadline",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Deadline" />,
      cell: ({ row }) => {
        const deadline = row.getValue("deadline") as string
        return <div>{deadline ? new Date(deadline).toLocaleDateString(
          "vi-VN",
          {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }
        ) : "N/A"}</div>
      },
      filterFn: (row, id, filterValue) => {
        if (!filterValue) return true;
        const date = row.getValue(id) as string;
        if (!date) return false;

        const { from, to } = filterValue as { from: Date; to: Date };
        const rowDate = new Date(date);
        return rowDate >= from && rowDate <= to;
      },
    },
    {
      accessorKey: "posted_at",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Posted At" />,
      cell: ({ row }) => {
        const postedAt = row.getValue("posted_at") as string
        return <div>{postedAt ? new Date(postedAt).toLocaleDateString(
          "vi-VN",
          {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }
        ) : "N/A"}</div>
      },
      filterFn: (row, id, filterValue) => {
        if (!filterValue) return true;
        const date = row.getValue(id) as string;
        if (!date) return false;

        const { from, to } = filterValue as { from: Date; to: Date };
        const rowDate = new Date(date);
        return rowDate >= from && rowDate <= to;
      },
      enableColumnFilter: false,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const currentScholarship = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 size-8">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openDialog("read", currentScholarship)}>
                <Eye className="size-4" />View details
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to="/scholarship-management/$scholarshipId"
                  params={{ scholarshipId: String(scholarshipId) }}
                >
                  <FileUser className="size-4" />See applications
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem >
                <PenLine className="size-4" />Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openDialog("delete", currentScholarship)}>
                <Trash2 className="size-4 text-destructive" />
                <p className="text-destructive hover:text-destructive">Delete</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      enablePinning: true,
    },
  ]

  const renderActionBar = React.useCallback((table: any) => {
    return <ScholarshipActionBar
      table={table}
    />
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <p className="font-bold text-2xl">Scholarships Management</p>
        <Button onClick={() => openDialog("create")}>
          <Plus className="mr-2 size-4" /> New Scholarship
        </Button>
      </div>

      <DataTable
        columns={scholarshipColumns}
        data={scholarships}
        searchableColumns={searchableColumns}
        renderActionBar={renderActionBar}
        isLoading={isLoadingScholarship}
        onPaginationChange={handlePageChange}
        manualPagination={true}
        pageIndex={offset / limit}
        pageSize={limit}
      />

      <ScholarshipFormDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        formType={formType}
        form={form}
        isSubmitting={isSubmitting}
        isLoading={false}
        onSubmit={onSubmit}
        handleDelete={() => console.log("Delete scholarship")}
        scholarshipId={scholarshipId || ""}
      />
    </div>
  )
}