import { useMemo, useState } from 'react'
import { TreeDataGrid, type Column, type RenderGroupCellProps, type SortColumn } from 'react-data-grid'
import 'react-data-grid/lib/styles.css'
import './DataGridEx2.css'

type Subtask = {
  id: string
  taskId: string
  task: string
  title: string
  owner: string
  priority: 'High' | 'Medium' | 'Low'
  status: 'Backlog' | 'In progress' | 'Done'
  estimate: number
}

type Task = {
  id: string
  task: string
  owner: string
  priority: 'High' | 'Medium' | 'Low'
  status: 'Backlog' | 'In progress' | 'Done'
  estimate: number
}

const tasks: Task[] = [
  {
    id: 'TASK-101',
    task: 'Build onboarding flow',
    owner: 'Gio',
    priority: 'High',
    status: 'In progress',
    estimate: 9
  },
  {
    id: 'TASK-102',
    task: 'Improve billing page',
    owner: 'Sara',
    priority: 'High',
    status: 'In progress',
    estimate: 9
  },
  {
    id: 'TASK-103',
    task: 'Refine project dashboard',
    owner: 'Elena',
    priority: 'Medium',
    status: 'In progress',
    estimate: 8
  },
  {
    id: 'TASK-104',
    task: 'Prepare reporting center',
    owner: 'Marco',
    priority: 'Medium',
    status: 'Backlog',
    estimate: 10
  },
  {
    id: 'TASK-105',
    task: 'Harden account security',
    owner: 'Nadia',
    priority: 'High',
    status: 'Backlog',
    estimate: 7
  }
]

const rows: Subtask[] = [
  {
    id: 'TASK-101-1',
    taskId: 'TASK-101',
    task: 'Build onboarding flow',
    title: 'Design welcome screen',
    owner: 'Gio',
    priority: 'High',
    status: 'In progress',
    estimate: 4
  },
  {
    id: 'TASK-101-2',
    taskId: 'TASK-101',
    task: 'Build onboarding flow',
    title: 'Add account setup checklist',
    owner: 'Marta',
    priority: 'Medium',
    status: 'Backlog',
    estimate: 3
  },
  {
    id: 'TASK-101-3',
    taskId: 'TASK-101',
    task: 'Build onboarding flow',
    title: 'Track completion events',
    owner: 'Luca',
    priority: 'Low',
    status: 'Backlog',
    estimate: 2
  },
  {
    id: 'TASK-102-1',
    taskId: 'TASK-102',
    task: 'Improve billing page',
    title: 'Fix invoice export',
    owner: 'Sara',
    priority: 'High',
    status: 'Done',
    estimate: 5
  },
  {
    id: 'TASK-102-2',
    taskId: 'TASK-102',
    task: 'Improve billing page',
    title: 'Add payment method empty state',
    owner: 'Nadia',
    priority: 'Medium',
    status: 'In progress',
    estimate: 3
  },
  {
    id: 'TASK-102-3',
    taskId: 'TASK-102',
    task: 'Improve billing page',
    title: 'Review renewal copy',
    owner: 'Marco',
    priority: 'Low',
    status: 'Backlog',
    estimate: 1
  },
  {
    id: 'TASK-103-1',
    taskId: 'TASK-103',
    task: 'Refine project dashboard',
    title: 'Add dashboard filters',
    owner: 'Elena',
    priority: 'High',
    status: 'In progress',
    estimate: 6
  },
  {
    id: 'TASK-103-2',
    taskId: 'TASK-103',
    task: 'Refine project dashboard',
    title: 'Clean account menu states',
    owner: 'Gio',
    priority: 'Medium',
    status: 'Done',
    estimate: 2
  },
  {
    id: 'TASK-104-1',
    taskId: 'TASK-104',
    task: 'Prepare reporting center',
    title: 'Define report templates',
    owner: 'Marco',
    priority: 'Medium',
    status: 'Backlog',
    estimate: 3
  },
  {
    id: 'TASK-104-2',
    taskId: 'TASK-104',
    task: 'Prepare reporting center',
    title: 'Add scheduled export form',
    owner: 'Luca',
    priority: 'Medium',
    status: 'Backlog',
    estimate: 4
  },
  {
    id: 'TASK-104-3',
    taskId: 'TASK-104',
    task: 'Prepare reporting center',
    title: 'Validate CSV download state',
    owner: 'Sara',
    priority: 'Low',
    status: 'Backlog',
    estimate: 3
  },
  {
    id: 'TASK-105-1',
    taskId: 'TASK-105',
    task: 'Harden account security',
    title: 'Add trusted device list',
    owner: 'Nadia',
    priority: 'High',
    status: 'Backlog',
    estimate: 3
  },
  {
    id: 'TASK-105-2',
    taskId: 'TASK-105',
    task: 'Harden account security',
    title: 'Review password reset flow',
    owner: 'Gio',
    priority: 'High',
    status: 'Backlog',
    estimate: 2
  },
  {
    id: 'TASK-105-3',
    taskId: 'TASK-105',
    task: 'Harden account security',
    title: 'Add session timeout warning',
    owner: 'Marta',
    priority: 'Medium',
    status: 'Backlog',
    estimate: 2
  }
]

function rowKeyGetter(row: Subtask) {
  return row.id
}

function compareValues(a: string | number, b: string | number) {
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b
  }

  return String(a).localeCompare(String(b))
}

function getTaskId(task: string) {
  return getTask(task)?.id ?? ''
}

function getTask(task: string) {
  return tasks.find((taskRow) => taskRow.task === task)
}

function rowGrouper(rows: readonly Subtask[], columnKey: string) {
  const groups: Record<string, Subtask[]> = {}

  for (const row of rows) {
    const groupKey = String(row[columnKey as keyof Subtask])
    groups[groupKey] ??= []
    groups[groupKey].push(row)
  }

  return groups
}

function renderTaskGroupCell({ childRows, groupKey, isExpanded, toggleGroup }: RenderGroupCellProps<Subtask>) {
  const task = String(groupKey)
  const taskId = getTaskId(task)
  const taskEstimate = getTask(task)?.estimate ?? childRows.reduce((total, row) => total + row.estimate, 0)

  return (
    <button className="example2-group-button" type="button" onClick={toggleGroup}>
      <span className="example2-group-caret">{isExpanded ? 'v' : '>'}</span>
      <span className="example2-task-id">{taskId}</span>
      <span>{task}</span>
      <span className="example2-group-meta">
        {childRows.length} subtasks, {taskEstimate}h
      </span>
    </button>
  )
}

function renderTaskIdGroupCell({ groupKey }: RenderGroupCellProps<Subtask>) {
  return <span className="example2-task-id">{getTaskId(String(groupKey))}</span>
}

function renderTaskOwnerGroupCell({ groupKey }: RenderGroupCellProps<Subtask>) {
  return <span className="example2-group-value">{getTask(String(groupKey))?.owner}</span>
}

function renderTaskPriorityGroupCell({ groupKey }: RenderGroupCellProps<Subtask>) {
  const priority = getTask(String(groupKey))?.priority

  if (priority == null) {
    return null
  }

  return <span className={`example2-priority example2-priority-${priority.toLowerCase()}`}>{priority}</span>
}

function renderTaskStatusGroupCell({ groupKey }: RenderGroupCellProps<Subtask>) {
  return <span className="example2-group-value">{getTask(String(groupKey))?.status}</span>
}

function renderTaskEstimateGroupCell({ groupKey }: RenderGroupCellProps<Subtask>) {
  const estimate = getTask(String(groupKey))?.estimate

  return <span className="example2-group-value">{estimate == null ? '' : `${estimate}h`}</span>
}

function DataGridEx2() {
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([])
  const [expandedGroupIds, setExpandedGroupIds] = useState<ReadonlySet<unknown>>(() => new Set())

  const columns = useMemo<Column<Subtask>[]>(
    () => [
      {
        key: 'task',
        name: 'Task',
        minWidth: 280,
        frozen: true,
        resizable: true,
        sortable: true,
        renderGroupCell: renderTaskGroupCell,
        renderCell({ row }) {
          return <span className="example2-subtask-name">{row.title}</span>
        }
      },
      {
        key: 'id',
        name: 'ID',
        width: 130,
        resizable: true,
        sortable: true,
        renderGroupCell: renderTaskIdGroupCell
      },
      {
        key: 'owner',
        name: 'Owner',
        width: 120,
        resizable: true,
        sortable: true,
        renderGroupCell: renderTaskOwnerGroupCell
      },
      {
        key: 'priority',
        name: 'Priority',
        width: 120,
        sortable: true,
        renderGroupCell: renderTaskPriorityGroupCell,
        renderCell({ row }) {
          return <span className={`example2-priority example2-priority-${row.priority.toLowerCase()}`}>{row.priority}</span>
        }
      },
      {
        key: 'status',
        name: 'Status',
        width: 140,
        resizable: true,
        sortable: true,
        renderGroupCell: renderTaskStatusGroupCell
      },
      {
        key: 'estimate',
        name: 'Estimate',
        width: 110,
        sortable: true,
        renderGroupCell: renderTaskEstimateGroupCell,
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
        const columnKey = sort.columnKey as keyof Subtask
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
      <header className="example2-toolbar">
        <div>
          <h1>Grouped Tasks</h1>
          <p>Click a task row to show or hide its subtasks</p>
        </div>
      </header>

      <section className="example2-grid-panel">
        <TreeDataGrid
          columns={columns}
          rows={sortedRows}
          rowKeyGetter={rowKeyGetter}
          groupBy={['task']}
          rowGrouper={rowGrouper}
          expandedGroupIds={expandedGroupIds}
          onExpandedGroupIdsChange={setExpandedGroupIds}
          sortColumns={sortColumns}
          onSortColumnsChange={setSortColumns}
          defaultColumnOptions={{ resizable: true }}
          className="example2-task-grid"
        />
      </section>
    </>
  )
}

export default DataGridEx2
