import { useMemo, useState } from 'react'
import { DataGrid, type Column, type SortColumn } from 'react-data-grid'
import 'react-data-grid/lib/styles.css'
import './DataGridEx1.css'

type Issue = {
  id: number
  title: string
  owner: string
  priority: 'High' | 'Medium' | 'Low'
  status: 'Backlog' | 'In progress' | 'Done'
  estimate: number
}

const rows: Issue[] = [
  { id: 101, title: 'Design login form', owner: 'Gio', priority: 'High', status: 'In progress', estimate: 5 },
  { id: 102, title: 'Add dashboard filters', owner: 'Marta', priority: 'Medium', status: 'Backlog', estimate: 3 },
  { id: 103, title: 'Fix invoice export', owner: 'Luca', priority: 'High', status: 'Done', estimate: 8 },
  { id: 104, title: 'Improve table keyboard flow', owner: 'Sara', priority: 'Low', status: 'Backlog', estimate: 2 },
  { id: 105, title: 'Review notification copy', owner: 'Nadia', priority: 'Medium', status: 'In progress', estimate: 1 },
  { id: 106, title: 'Ship settings page', owner: 'Marco', priority: 'High', status: 'Backlog', estimate: 6 },
  { id: 107, title: 'Clean account menu states', owner: 'Elena', priority: 'Low', status: 'Done', estimate: 2 },
  { id: 108, title: 'Add empty state view', owner: 'Gio', priority: 'Medium', status: 'In progress', estimate: 4 }
]

function rowKeyGetter(row: Issue) {
  return row.id
}

function compareValues(a: string | number, b: string | number) {
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b
  }

  return String(a).localeCompare(String(b))
}

function DataGridEx1() {
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([])

  const columns = useMemo<Column<Issue>[]>(
    () => [
      { key: 'id', name: 'ID', width: 72, frozen: true, sortable: true },
      { key: 'title', name: 'Task', minWidth: 240, resizable: true, sortable: true },
      { key: 'owner', name: 'Owner', width: 120, resizable: true, sortable: true },
      {
        key: 'priority',
        name: 'Priority',
        width: 120,
        sortable: true,
        renderCell({ row }) {
          return <span className={`priority priority-${row.priority.toLowerCase()}`}>{row.priority}</span>
        }
      },
      { key: 'status', name: 'Status', width: 140, resizable: true, sortable: true },
      {
        key: 'estimate',
        name: 'Estimate',
        width: 110,
        sortable: true,
        renderCell({ row }) {
          return `${row.estimate}h`
        }
      }
    ],
    []
  )

  const sortedRows = useMemo(() => {
    if (sortColumns.length === 0) {
      return rows
    }

    return [...rows].sort((rowA, rowB) => {
      for (const sort of sortColumns) {
        const columnKey = sort.columnKey as keyof Issue
        const direction = sort.direction === 'ASC' ? 1 : -1
        const result = compareValues(rowA[columnKey], rowB[columnKey])

        if (result !== 0) {
          return result * direction
        }
      }

      return 0
    })
  }, [sortColumns])

  return (
    <>
      <header className="toolbar">
        <div>
          <h1>React Data Grid</h1>
          <p>Click any header to sort the rows</p>
        </div>
      </header>

      <section className="grid-panel">
        <DataGrid
          columns={columns}
          rows={sortedRows}
          rowKeyGetter={rowKeyGetter}
          sortColumns={sortColumns}
          onSortColumnsChange={setSortColumns}
          defaultColumnOptions={{ resizable: true }}
          className="task-grid"
        />
      </section>
    </>
  )
}

export default DataGridEx1
