import { useState } from 'react'
import DataGridEx1 from './DataGridEx1'
import DataGridEx2 from './DataGridEx2'
import DataGridEx3 from './DataGridEx3'
import './App.css'

const examples = [
  { id: 'example-1', name: 'DataGridEx1', component: DataGridEx1 },
  { id: 'example-2', name: 'DataGridEx2', component: DataGridEx2 },
  { id: 'example-3', name: 'DataGridEx3', component: DataGridEx3 }
] as const

const collapsedSidebarWidth = 56
const defaultSidebarWidth = 260
const maxSidebarWidth = 420
const minSidebarWidth = 180

function App() {
  const [selectedExampleId, setSelectedExampleId] = useState<(typeof examples)[number]['id']>('example-1')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(defaultSidebarWidth)
  const selectedExample = examples.find((example) => example.id === selectedExampleId) ?? examples[0]
  const SelectedExample = selectedExample.component
  const currentSidebarWidth = isSidebarCollapsed ? collapsedSidebarWidth : sidebarWidth

  function startSidebarResize(event: React.PointerEvent<HTMLButtonElement>) {
    if (isSidebarCollapsed) {
      return
    }

    const initialPointerX = event.clientX
    const initialSidebarWidth = sidebarWidth

    function handlePointerMove(moveEvent: PointerEvent) {
      const nextWidth = initialSidebarWidth + moveEvent.clientX - initialPointerX
      setSidebarWidth(Math.min(maxSidebarWidth, Math.max(minSidebarWidth, nextWidth)))
    }

    function handlePointerUp() {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }

  return (
    <main
      className={isSidebarCollapsed ? 'app-shell is-sidebar-collapsed' : 'app-shell'}
      style={{ '--app-sidebar-width': `${currentSidebarWidth}px` } as React.CSSProperties}
    >
      <aside className="app-sidebar" aria-label="Examples">
        <header className="app-sidebar-header">
          <h1>Examples</h1>
          <button
            className="app-sidebar-toggle"
            type="button"
            aria-label={isSidebarCollapsed ? 'Expand examples panel' : 'Collapse examples panel'}
            onClick={() => setIsSidebarCollapsed((current) => !current)}
          >
            {isSidebarCollapsed ? '>' : '<'}
          </button>
        </header>

        <nav className="example-list" aria-label="Data grid examples">
          {examples.map((example) => (
            <button
              className={example.id === selectedExample.id ? 'example-list-button is-selected' : 'example-list-button'}
              key={example.id}
              type="button"
              title={example.name}
              onClick={() => setSelectedExampleId(example.id)}
            >
              <span className="example-list-short-name">{example.name.replace('DataGridEx', 'Ex')}</span>
              <span className="example-list-full-name">{example.name}</span>
            </button>
          ))}
        </nav>

        <button
          className="app-sidebar-resize"
          type="button"
          aria-label="Resize examples panel"
          onPointerDown={startSidebarResize}
        />
      </aside>

      <section className="app-content" aria-label={selectedExample.name}>
        <SelectedExample />
      </section>
    </main>
  )
}

export default App
