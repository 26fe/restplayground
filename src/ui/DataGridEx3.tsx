import { useMemo, useState } from 'react'
import { DataGrid, type Column, type SortColumn } from 'react-data-grid'
import 'react-data-grid/lib/styles.css'
import './DataGridEx3.css'

type Issue = {
  id: number
  title: string
  owner: string
  priority: 'High' | 'Medium' | 'Low'
  status: 'Backlog' | 'In progress' | 'Done'
  estimate: number
}

type Filters = {
  idInput: string
  idTags: string[]
  title: string
  ownerInput: string
  ownerTags: string[]
  priorityTags: Issue['priority'][]
  statusTags: Issue['status'][]
  estimate: string
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

const priorityOptions: Issue['priority'][] = ['High', 'Medium', 'Low']
const statusOptions: Issue['status'][] = ['Backlog', 'In progress', 'Done']
const ownerOptions = Array.from(new Set(rows.map((row) => row.owner))).sort()

function rowKeyGetter(row: Issue) {
  return row.id
}

function compareValues(a: string | number, b: string | number) {
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b
  }

  return String(a).localeCompare(String(b))
}

function normalizeIdTag(value: string) {
  return value.trim()
}

function normalizeOwnerTag(value: string) {
  return value.trim()
}

function DataGridEx3() {
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([])
  const [filters, setFilters] = useState<Filters>({
    idInput: '',
    idTags: [],
    title: '',
    ownerInput: '',
    ownerTags: [],
    priorityTags: [],
    statusTags: [],
    estimate: ''
  })

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
          return <span className={`example3-priority example3-priority-${row.priority.toLowerCase()}`}>{row.priority}</span>
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

  function addIdTag() {
    setFilters((current) => {
      const idTag = normalizeIdTag(current.idInput)

      if (idTag === '' || current.idTags.includes(idTag)) {
        return { ...current, idInput: '' }
      }

      return { ...current, idInput: '', idTags: [...current.idTags, idTag] }
    })
  }

  function removeIdTag(idTag: string) {
    setFilters((current) => ({ ...current, idTags: current.idTags.filter((tag) => tag !== idTag) }))
  }

  function addOwnerTag() {
    setFilters((current) => {
      const ownerTag = normalizeOwnerTag(current.ownerInput)

      if (ownerTag === '' || current.ownerTags.includes(ownerTag)) {
        return { ...current, ownerInput: '' }
      }

      return { ...current, ownerInput: '', ownerTags: [...current.ownerTags, ownerTag] }
    })
  }

  function removeOwnerTag(ownerTag: string) {
    setFilters((current) => ({ ...current, ownerTags: current.ownerTags.filter((tag) => tag !== ownerTag) }))
  }

  function addPriorityTag(priorityTag: Issue['priority']) {
    setFilters((current) => {
      if (current.priorityTags.includes(priorityTag)) {
        return current
      }

      return { ...current, priorityTags: [...current.priorityTags, priorityTag] }
    })
  }

  function removePriorityTag(priorityTag: Issue['priority']) {
    setFilters((current) => ({
      ...current,
      priorityTags: current.priorityTags.filter((tag) => tag !== priorityTag)
    }))
  }

  function addStatusTag(statusTag: Issue['status']) {
    setFilters((current) => {
      if (current.statusTags.includes(statusTag)) {
        return current
      }

      return { ...current, statusTags: [...current.statusTags, statusTag] }
    })
  }

  function removeStatusTag(statusTag: Issue['status']) {
    setFilters((current) => ({
      ...current,
      statusTags: current.statusTags.filter((tag) => tag !== statusTag)
    }))
  }

  const filteredRows = useMemo(() => {
    const taskFilter = filters.title.trim().toLowerCase()
    const estimateFilter = filters.estimate.trim()

    return rows.filter((row) => {
      if (filters.idTags.length > 0 && !filters.idTags.some((idTag) => String(row.id).includes(idTag))) {
        return false
      }

      if (taskFilter !== '' && !row.title.toLowerCase().includes(taskFilter)) {
        return false
      }

      if (
        filters.ownerTags.length > 0 &&
        !filters.ownerTags.some((ownerTag) => row.owner.toLowerCase().includes(ownerTag.toLowerCase()))
      ) {
        return false
      }

      if (filters.priorityTags.length > 0 && !filters.priorityTags.includes(row.priority)) {
        return false
      }

      if (filters.statusTags.length > 0 && !filters.statusTags.includes(row.status)) {
        return false
      }

      if (estimateFilter !== '' && !String(row.estimate).includes(estimateFilter)) {
        return false
      }

      return true
    })
  }, [filters])

  const sortedRows = useMemo(() => {
    if (sortColumns.length === 0) {
      return filteredRows
    }

    return [...filteredRows].sort((rowA, rowB) => {
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
  }, [filteredRows, sortColumns])

  return (
    <>
      <header className="example3-toolbar">
        <div>
          <h1>Data Grid Example 3</h1>
          <p>Filter rows and click any header to sort</p>
        </div>
      </header>

      <section className="example3-grid-panel">
        <form className="example3-filters">
          <label className="example3-filter-field">
            <span>ID</span>
            <div className="example3-token-field">
              {filters.idTags.map((idTag) => (
                <span className="example3-token" key={idTag}>
                  {idTag}
                  <button type="button" aria-label={`Remove ID ${idTag}`} onClick={() => removeIdTag(idTag)}>
                    x
                  </button>
                </span>
              ))}

              <input
                type="text"
                inputMode="numeric"
                value={filters.idInput}
                onBlur={addIdTag}
                onChange={(event) => setFilters((current) => ({ ...current, idInput: event.target.value }))}
                onKeyDown={(event) => {
                  if (event.key === ' ' || event.key === 'Enter') {
                    event.preventDefault()
                    addIdTag()
                  }
                }}
              />
            </div>
          </label>

          <label className="example3-filter-field">
            <span>Task</span>
            <input
              type="text"
              value={filters.title}
              onChange={(event) => setFilters((current) => ({ ...current, title: event.target.value }))}
            />
          </label>

          <label className="example3-filter-field">
            <span>Owner</span>
            <div className="example3-token-field">
              {filters.ownerTags.map((ownerTag) => (
                <span className="example3-token" key={ownerTag}>
                  {ownerTag}
                  <button type="button" aria-label={`Remove owner ${ownerTag}`} onClick={() => removeOwnerTag(ownerTag)}>
                    x
                  </button>
                </span>
              ))}

              <input
                type="text"
                list="example3-owner-options"
                value={filters.ownerInput}
                onBlur={addOwnerTag}
                onChange={(event) => setFilters((current) => ({ ...current, ownerInput: event.target.value }))}
                onKeyDown={(event) => {
                  if (event.key === ' ' || event.key === 'Enter') {
                    event.preventDefault()
                    addOwnerTag()
                  }
                }}
              />
            </div>
            <datalist id="example3-owner-options">
              {ownerOptions.map((owner) => (
                <option key={owner} value={owner} />
              ))}
            </datalist>
          </label>

          <label className="example3-filter-field">
            <span>Priority</span>
            <div className="example3-token-field">
              {filters.priorityTags.map((priorityTag) => (
                <span className="example3-token" key={priorityTag}>
                  {priorityTag}
                  <button
                    type="button"
                    aria-label={`Remove priority ${priorityTag}`}
                    onClick={() => removePriorityTag(priorityTag)}
                  >
                    x
                  </button>
                </span>
              ))}

              <select
                value=""
                onChange={(event) => {
                  if (event.target.value !== '') {
                    addPriorityTag(event.target.value as Issue['priority'])
                  }
                }}
              >
                <option value="">Add priority</option>
                {priorityOptions.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>
          </label>

          <label className="example3-filter-field">
            <span>Status</span>
            <div className="example3-token-field">
              {filters.statusTags.map((statusTag) => (
                <span className="example3-token" key={statusTag}>
                  {statusTag}
                  <button
                    type="button"
                    aria-label={`Remove status ${statusTag}`}
                    onClick={() => removeStatusTag(statusTag)}
                  >
                    x
                  </button>
                </span>
              ))}

              <select
                value=""
                onChange={(event) => {
                  if (event.target.value !== '') {
                    addStatusTag(event.target.value as Issue['status'])
                  }
                }}
              >
                <option value="">Add status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </label>

          <label className="example3-filter-field">
            <span>Estimate</span>
            <input
              type="text"
              inputMode="numeric"
              value={filters.estimate}
              onChange={(event) => setFilters((current) => ({ ...current, estimate: event.target.value }))}
            />
          </label>
        </form>

        <DataGrid
          columns={columns}
          rows={sortedRows}
          rowKeyGetter={rowKeyGetter}
          sortColumns={sortColumns}
          onSortColumnsChange={setSortColumns}
          defaultColumnOptions={{ resizable: true }}
          className="example3-task-grid"
        />
      </section>
    </>
  )
}

export default DataGridEx3
