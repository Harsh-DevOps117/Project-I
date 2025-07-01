import React, { useState, useMemo, useEffect } from "react";
import type { SortingState, ColumnFiltersState } from "@tanstack/react-table";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  ChevronDown,
  Filter,
  Download,
  Upload,
  Share2,
  Plus,
  Search,
  Eye,
  MoreHorizontal,
  ArrowUpDown,
  ChevronUp,
  Bell,
} from "lucide-react";

interface SpreadsheetCell {
  [key: string]: string | number;
}

// Create initial data with many empty rows and columns
const createInitialData = () => {
  const columns = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
  ];
  const data: SpreadsheetCell[] = [];

  // Add sample data for first few rows
  const sampleData = [
    {
      A: "Launch social media campaign for pro...",
      B: "15-11-2024",
      C: "In-process",
      D: "Aisha Patel",
      E: "www.aishapatel...",
      F: "Sophie Choudhury",
      G: "Medium",
      H: "20-11-2024",
      I: "6,200,000",
    },
    {
      A: "Update press kit for company redesign",
      B: "28-10-2024",
      C: "Need to start",
      D: "Irfan Khan",
      E: "www.irfankhan...",
      F: "Tejas Pandey",
      G: "High",
      H: "30-10-2024",
      I: "3,500,000",
    },
    {
      A: "Finalize user testing feedback for app...",
      B: "05-12-2024",
      C: "In-process",
      D: "Mark Johnson",
      E: "www.markjohns...",
      F: "Rachel Lee",
      G: "Medium",
      H: "10-12-2024",
      I: "4,750,000",
    },
    {
      A: "Design new features for the website",
      B: "10-01-2025",
      C: "Complete",
      D: "Emily Green",
      E: "www.emilygreen...",
      F: "Tom Wright",
      G: "Low",
      H: "15-01-2025",
      I: "5,900,000",
    },
    {
      A: "Prepare financial report for Q4",
      B: "25-01-2025",
      C: "Blocked",
      D: "Jessica Brown",
      E: "www.jessicabro...",
      F: "Kevin Smith",
      G: "Low",
      H: "30-01-2025",
      I: "2,800,000",
    },
  ];

  // Add sample data
  sampleData.forEach((row, index) => {
    const dataRow: SpreadsheetCell = { id: index + 1 };
    columns.forEach((col) => {
      dataRow[col] = row[col] || "";
    });
    data.push(dataRow);
  });

  // Add 95 more empty rows (total 100 rows)
  for (let i = 5; i < 100; i++) {
    const emptyRow: SpreadsheetCell = { id: i + 1 };
    columns.forEach((col) => {
      emptyRow[col] = "";
    });
    data.push(emptyRow);
  }

  return data;
};

// Helper function to get status badge styling
const getStatusBadge = (status: string) => {
  const statusLower = status.toLowerCase();

  if (statusLower === "in-process") {
    return "bg-yellow-100 text-yellow-800 border border-yellow-200";
  } else if (statusLower === "need to start") {
    return "bg-blue-100 text-blue-800 border border-blue-200";
  } else if (statusLower === "complete") {
    return "bg-green-100 text-green-800 border border-green-200";
  } else if (statusLower === "blocked") {
    return "bg-red-100 text-red-800 border border-red-200";
  }

  return "bg-gray-100 text-gray-800 border border-gray-200";
};

// Helper function to get priority badge styling
const getPriorityBadge = (priority: string) => {
  const priorityLower = priority.toLowerCase();

  if (priorityLower === "high") {
    return "bg-red-100 text-red-800 border border-red-200";
  } else if (priorityLower === "medium") {
    return "bg-yellow-100 text-yellow-800 border border-yellow-200";
  } else if (priorityLower === "low") {
    return "bg-blue-100 text-blue-800 border border-blue-200";
  }

  return "bg-gray-100 text-gray-800 border border-gray-200";
};

const Spreadsheet = () => {
  const [data, setData] = useState(createInitialData());
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectedCell, setSelectedCell] = useState<{
    rowIndex: number;
    columnId: string;
  } | null>(null);
  const [editingCell, setEditingCell] = useState<{
    rowIndex: number;
    columnId: string;
  } | null>(null);

  const columnHelper = createColumnHelper<SpreadsheetCell>();

  // Define column headers
  const columnHeaders = [
    "",
    "Job Request",
    "Submitted",
    "Status",
    "Submitter",
    "URL",
    "Assigned",
    "Priority",
    "Due Date",
    "Est. Value",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
  ];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell) return;

      const table = document.querySelector("table");
      if (!table) return;

      const rows = table.querySelectorAll("tbody tr");
      const currentRow = rows[selectedCell.rowIndex];
      if (!currentRow) return;

      const cells = currentRow.querySelectorAll("td");
      const currentCellIndex = Array.from(cells).findIndex(
        (cell) => cell.getAttribute("data-column-id") === selectedCell.columnId
      );

      let newRowIndex = selectedCell.rowIndex;
      let newColumnIndex = currentCellIndex;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          newRowIndex = Math.max(0, selectedCell.rowIndex - 1);
          console.log(`Navigating up to row ${newRowIndex + 1}`);
          break;
        case "ArrowDown":
          e.preventDefault();
          newRowIndex = Math.min(rows.length - 1, selectedCell.rowIndex + 1);
          console.log(`Navigating down to row ${newRowIndex + 1}`);
          break;
        case "ArrowLeft":
          e.preventDefault();
          newColumnIndex = Math.max(0, currentCellIndex - 1);
          console.log(`Navigating left to column ${newColumnIndex + 1}`);
          break;
        case "ArrowRight":
          e.preventDefault();
          newColumnIndex = Math.min(cells.length - 1, currentCellIndex + 1);
          console.log(`Navigating right to column ${newColumnIndex + 1}`);
          break;
        case "Enter":
          e.preventDefault();
          setEditingCell(selectedCell);
          console.log(
            `Editing cell: Row ${selectedCell.rowIndex + 1}, Column ${selectedCell.columnId}`
          );
          break;
        case "Escape":
          e.preventDefault();
          setEditingCell(null);
          console.log("Stopped editing cell");
          break;
        default:
          return;
      }

      if (
        newRowIndex !== selectedCell.rowIndex ||
        newColumnIndex !== currentCellIndex
      ) {
        const newRow = rows[newRowIndex];
        const newCells = newRow.querySelectorAll("td");
        const newCell = newCells[newColumnIndex];
        const newColumnId = newCell?.getAttribute("data-column-id");

        if (newColumnId) {
          setSelectedCell({ rowIndex: newRowIndex, columnId: newColumnId });
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedCell]);

  const updateCellValue = (
    rowIndex: number,
    columnId: string,
    value: string
  ) => {
    setData((prev) => {
      const newData = [...prev];
      newData[rowIndex] = { ...newData[rowIndex], [columnId]: value };
      return newData;
    });
    console.log(
      `Updated cell: Row ${rowIndex + 1}, Column ${columnId}, Value: ${value}`
    );
  };

  // Calculate status counts
  const statusCounts = useMemo(() => {
    const counts = {
      "In-process": 0,
      "Need to start": 0,
      Complete: 0,
      Blocked: 0,
      All: data.length,
    };

    data.forEach((row) => {
      const status = row.C as string;
      if (status && counts.hasOwnProperty(status)) {
        counts[status as keyof typeof counts]++;
      }
    });

    return counts;
  }, [data]);

  const columns = useMemo(() => {
    const cols = [
      // Row number column
      columnHelper.accessor("id", {
        header: "",
        cell: (info) => (
          <div className="text-center text-sm text-gray-500 font-medium">
            {info.getValue()}
          </div>
        ),
        size: 50,
        enableSorting: false,
        enableResizing: false,
      }),
      // Data columns A-T with proper headers and wider sizes
      ...[
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
      ].map((col, index) =>
        columnHelper.accessor(col, {
          header: columnHeaders[index + 1] || col,
          cell: (info) => {
            const rowIndex = info.row.index;
            const columnId = info.column.id;
            const value = info.getValue() as string;
            const isEditing =
              editingCell?.rowIndex === rowIndex &&
              editingCell?.columnId === columnId;

            if (isEditing) {
              return (
                <input
                  type="text"
                  value={value}
                  onChange={(e) =>
                    updateCellValue(rowIndex, columnId, e.target.value)
                  }
                  onBlur={() => setEditingCell(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setEditingCell(null);
                    }
                  }}
                  className="w-full border-none outline-none bg-transparent"
                  autoFocus
                />
              );
            }

            // Special styling for Status column (C)
            if (columnId === "C" && value) {
              return (
                <div className="w-full h-full min-h-[20px] text-sm">
                  <span
                    className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${getStatusBadge(value)}`}
                  >
                    {value}
                  </span>
                </div>
              );
            }

            // Special styling for Priority column (G)
            if (columnId === "G" && value) {
              return (
                <div className="w-full h-full min-h-[20px] text-sm">
                  <span
                    className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${getPriorityBadge(value)}`}
                  >
                    {value}
                  </span>
                </div>
              );
            }

            return (
              <div className="w-full h-full min-h-[20px] text-sm">{value}</div>
            );
          },
          // Set specific widths for different columns to prevent wrapping
          size:
            index === 0
              ? 5000 // Job Request - wider for long text
              : index === 1
                ? 120 // Submitted - date
                : index === 2
                  ? 130 // Status - badge
                  : index === 3
                    ? 150 // Submitter - name
                    : index === 4
                      ? 180 // URL - link
                      : index === 5
                        ? 150 // Assigned - name
                        : index === 6
                          ? 100 // Priority - badge
                          : index === 7
                            ? 1000 // Due Date - date
                            : index === 8
                              ? 120 // Est. Value - number
                              : 100, // Other columns - default
        })
      ),
    ];
    return cols;
  }, [editingCell, columnHeaders]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableColumnResizing: true,
    columnResizeMode: "onChange",
  });

  const handleToolbarAction = (action: string) => {
    console.log(`${action} clicked`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
              </div>
              <span className="text-sm font-medium text-gray-700">
                Workspace
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-gray-400">›</span>
            <span className="text-sm text-gray-600">Folder 2</span>
            <span className="text-gray-400">›</span>
            <span className="text-sm font-medium text-gray-900">
              Spreadsheet 3
            </span>
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search within sheet"
                className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={globalFilter}
                onChange={(e) => {
                  setGlobalFilter(e.target.value);
                  console.log(`Search: ${e.target.value}`);
                }}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-gray-400" />
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">JD</span>
              </div>
              <span className="text-sm font-medium text-gray-700">
                John Doe
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleToolbarAction("Tool bar")}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
            >
              Tool bar
              <ChevronDown className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleToolbarAction("Hide Fields")}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
            >
              <Eye className="w-4 h-4" />
              Hide Fields
            </button>
            <button
              onClick={() => handleToolbarAction("Sort")}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
            >
              <ArrowUpDown className="w-4 h-4" />
              Sort
            </button>
            <button
              onClick={() => handleToolbarAction("Filter")}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button
              onClick={() => handleToolbarAction("Cell view")}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
            >
              Cell view
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleToolbarAction("Import")}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 border border-gray-300 rounded-md"
            >
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button
              onClick={() => handleToolbarAction("Export")}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 border border-gray-300 rounded-md"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => handleToolbarAction("Share")}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 border border-gray-300 rounded-md"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={() => handleToolbarAction("New Action")}
              className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700"
            >
              New Action
            </button>
          </div>
        </div>
      </div>

      {/* Action Tabs */}
      <div className="bg-white border-b border-gray-200 px-4">
        <div className="flex items-center justify-between">
          <div className="flex space-x-6">
            <button
              onClick={() => handleToolbarAction("Q3 Financial Overview")}
              className="flex items-center space-x-2 px-3 py-3 border-b-2 border-blue-500 text-sm font-medium text-blue-600"
            >
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              Q3 Financial Overview
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => handleToolbarAction("ABC")}
              className="px-3 py-3 text-sm text-gray-600 hover:text-gray-900 bg-green-50 rounded-t"
            >
              ABC
            </button>
            <button
              onClick={() => handleToolbarAction("Answer a question")}
              className="px-3 py-3 text-sm text-gray-600 hover:text-gray-900 bg-purple-50 rounded-t"
            >
              Answer a question
            </button>
            <button
              onClick={() => handleToolbarAction("Extract")}
              className="px-3 py-3 text-sm text-gray-600 hover:text-gray-900 bg-orange-50 rounded-t"
            >
              Extract
            </button>
            <button
              onClick={() => handleToolbarAction("Add tab")}
              className="px-3 py-3 text-gray-400 hover:text-gray-600"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Spreadsheet */}
      <div className="bg-white flex-1 flex flex-col">
        <div className="overflow-auto flex-1">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 cursor-pointer hover:bg-gray-100 relative"
                      style={{ width: header.getSize() }}
                      onClick={() => {
                        if (header.column.getCanSort()) {
                          header.column.toggleSorting();
                          console.log(`Sorting column: ${header.id}`);
                        }
                      }}
                    >
                      <div className="flex items-center justify-center">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                      {header.column.getCanResize() && (
                        <div
                          className="absolute right-0 top-0 h-full w-1 bg-transparent hover:bg-blue-300 cursor-col-resize"
                          onMouseDown={header.getResizeHandler()}
                        />
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map((row, index) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      data-column-id={cell.column.id}
                      className={`px-2 py-1 border-r border-gray-200 text-sm cursor-pointer ${
                        selectedCell?.rowIndex === index &&
                        selectedCell?.columnId === cell.column.id
                          ? "bg-blue-100 ring-1 ring-blue-500"
                          : ""
                      } ${cell.column.id === "id" ? "bg-gray-50 text-center" : ""}`}
                      style={{ width: cell.column.getSize() }}
                      onClick={() => {
                        if (cell.column.id !== "id") {
                          setSelectedCell({
                            rowIndex: index,
                            columnId: cell.column.id,
                          });
                          console.log(
                            `Cell selected: Row ${index + 1}, Column ${cell.column.id}`
                          );
                        }
                      }}
                      onDoubleClick={() => {
                        if (cell.column.id !== "id") {
                          setEditingCell({
                            rowIndex: index,
                            columnId: cell.column.id,
                          });
                          console.log(
                            `Editing cell: Row ${index + 1}, Column ${cell.column.id}`
                          );
                        }
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Status Summary Bar - Sticky Bottom */}
        <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-gray-50 px-4 py-3 z-10">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">All</span>
              <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                {statusCounts.All}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Order</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                {statusCounts["Need to start"]}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Pending</span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                {statusCounts["In-process"]}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Received</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                {statusCounts["Complete"]}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Arrived</span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                {statusCounts["Blocked"]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Spreadsheet;
