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

function App() {
  const [selectedExampleId, setSelectedExampleId] = useState<(typeof examples)[number]['id']>('example-1')
  const selectedExample = examples.find((example) => example.id === selectedExampleId) ?? examples[0]
  const SelectedExample = selectedExample.component

  return (
    <main className="app-shell">
      <aside className="app-sidebar" aria-label="Examples">
        <h1>Examples</h1>
        <nav className="example-list">
          {examples.map((example) => (
            <button
              className={example.id === selectedExample.id ? 'example-list-button is-selected' : 'example-list-button'}
              key={example.id}
              type="button"
              onClick={() => setSelectedExampleId(example.id)}
            >
              {example.name}
            </button>
          ))}
        </nav>
      </aside>

      <section className="app-content" aria-label={selectedExample.name}>
        <SelectedExample />
      </section>
    </main>
  )
}

export default App
