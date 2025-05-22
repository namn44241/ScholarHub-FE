import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTable } from "@/components/ui/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import type { FilterableColumns, SearchableColumns } from "@/components/ui/data-table-toolbar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { IUserProfile } from "@/features/user_profile"
import { Link } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { CheckCheck, Eye, MoreHorizontal, Trash2, X } from 'lucide-react'
import { SAMPLE_APPLICATIONS } from "../utils/constants"
import type { ApplicationStatusType, IScholarshipApplication } from "../utils/types"

export const ApplicationTable = () => {
    const [pageIndex, setPageIndex] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [paginatedData, setPaginatedData] = useState<IScholarshipApplication[]>([])
    const [isLoading, setIsLoading] = useState(false)
    
    const totalCount = SAMPLE_APPLICATIONS.length

    const fetchApplications = (page: number, size: number) => {
        setIsLoading(true)
        
        setTimeout(() => {
            const start = page * size
            const end = Math.min(start + size, SAMPLE_APPLICATIONS.length)
            
            const slicedData = SAMPLE_APPLICATIONS.slice(start, end)
        
            setPaginatedData(slicedData)
            setIsLoading(false)
        }, 100) 
    }
    
    useEffect(() => {
        fetchApplications(pageIndex, pageSize)
    }, [pageIndex, pageSize])
    
    const handlePaginationChange = (newPageIndex: number, newPageSize: number) => {
        setPageIndex(newPageIndex)
        setPageSize(newPageSize)
    }

    const searchableColumns: SearchableColumns[] = [
        {
            id: "id",
            title: "ID"
        },
        {
            id: "name",
            title: "Full Name",
        },
        {
            id: "contact_email",
            title: "Email",
        }
    ]

    const statusOptions = [
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
    ]

    const filterableColumns: FilterableColumns[] = [
        {
            id: "status",
            title: "Status",
            options: statusOptions,
            type: "select",
        },
        {
            id: "submission_date",
            title: "submission date",
            type: "date-range",
        },
        {
            id: "updated_at",
            title: "updated at",
            type: "date-range",
        }
    ]

    const applicationColumns: ColumnDef<IScholarshipApplication>[] = [
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
            accessorKey: "id",
            header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
            cell: ({ row }) => {
                const id = row.getValue("id") as number
                return <span className="font-medium">{id}</span>
            },
            enableSorting: false,
        },
        {
            accessorKey: "profile",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Applicant name" />,
            cell: ({ row }) => {
                const profile = row.getValue("profile") as IUserProfile
                const fullName = [profile.first_name, profile.middle_name, profile.last_name]
                    .filter(Boolean)
                    .join(" ")
                return <span>{fullName}</span>
            },
            enableSorting: false,
        },
        {
            accessorKey: "contact_email",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
            cell: ({ row }) => {
                const profile = row.getValue("profile") as IUserProfile
                return <span>{profile.contact_email || "N/A"}</span>
            },
            enableSorting: false,
        },
        {
            accessorKey: "job_title",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Job title" />,
            cell: ({ row }) => {
                const profile = row.getValue("profile") as IUserProfile
                return <span>{profile.job_title || "N/A"}</span>
            },
            enableSorting: false,
        },
        {
            accessorKey: "status",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
            cell: ({ row }) => {
                const status = row.getValue("status") as ApplicationStatusType
                return (
                    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        status === "approved" ? "bg-green-100 text-green-800" :
                            "bg-red-100 text-red-800"
                        }`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </div>
                )
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            },
        },
        {
            accessorKey: "submission_date",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Submitted" />,
            cell: ({ row }) => {
                const submissionDate = row.getValue("submission_date") as string
                return <div>{submissionDate ? new Date(submissionDate).toLocaleDateString(
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
            accessorKey: "updated_at",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Last Updated" />,
            cell: ({ row }) => {
                const updatedAt = row.getValue("updated_at") as string
                return <div>{updatedAt ? new Date(updatedAt).toLocaleDateString(
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
            id: "actions",
            cell: () => {
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
                            <DropdownMenuItem>
                                <CheckCheck className="size-4 text-green-500" />
                                <p className="text-green-500 hover:text-green-500">Approve</p>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <X className="size-4 text-destructive" />
                                <p className="text-destructive hover:text-destructive">Reject</p>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link
                                    to="/profile/$userId"
                                    params={{ userId: "1" }}
                                >
                                    <Eye className="size-4" />
                                    View
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Trash2 className="size-4 text-destructive" />
                                <p className="text-destructive hover:text-destructive">Delete</p>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-end">
                <p className="font-bold text-2xl">Scholarship Applications</p>
            </div>

            <DataTable
                columns={applicationColumns}
                data={paginatedData}
                searchableColumns={searchableColumns}
                filterableColumns={filterableColumns}
                isLoading={isLoading}
                manualPagination={true}
                pageCount={Math.ceil(totalCount / pageSize)}
                pageIndex={pageIndex}
                pageSize={pageSize}
                totalCount={totalCount}
                onPaginationChange={handlePaginationChange}
            />
        </div>
    )
}
