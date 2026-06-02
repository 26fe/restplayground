import { useMemo, useState } from 'react'
import { DataGrid, SelectColumn, type Column } from 'react-data-grid'
import 'react-data-grid/lib/styles.css'
import './ReactDataGridExample1.css'

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

function ReactDataGridExample1() {
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<number>>(() => new Set())

  const columns = useMemo<Column<Issue>[]>(
    () => [
      SelectColumn,
      { key: 'id', name: 'ID', width: 72, frozen: true },
      { key: 'title', name: 'Task', minWidth: 240, resizable: true },
      { key: 'owner', name: 'Owner', width: 120, resizable: true },
      {
        key: 'priority',
        name: 'Priority',
        width: 120,
        renderCell({ row }) {
          return <span className={`priority priority-${row.priority.toLowerCase()}`}>{row.priority}</span>
        }
      },
      { key: 'status', name: 'Status', width: 140, resizable: true },
      {
        key: 'estimate',
        name: 'Estimate',
        width: 110,
        renderCell({ row }) {
          return `${row.estimate}h`
        }
      }
    ],
    []
  )

  return (
    <>
      <header className="toolbar">
        <div>
          <h1>React Data Grid</h1>
          <p>{selectedRows.size} selected</p>
        </div>
      </header>

      <section className="grid-panel">
        <DataGrid
          columns={columns}
          rows={rows}
          rowKeyGetter={rowKeyGetter}
          selectedRows={selectedRows}
          onSelectedRowsChange={setSelectedRows}
          defaultColumnOptions={{ resizable: true }}
          className="task-grid"
        />
      </section>
    </>
  )
}

export default ReactDataGridExample1
