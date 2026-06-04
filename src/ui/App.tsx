import { useState, type CSSProperties } from 'react'
import DataGridEx1 from './data_grid/DataGridEx1'
import DataGridEx2 from './data_grid/DataGridEx2'
import DataGridEx3 from './data_grid/DataGridEx3'
import PlotlyEx1 from './plotly/PlotlyEx1'
import { type ExampleTreeNodeData } from './ExampleTreeNode'
import LeftPanelComponent, { collapsedLeftPanelWidth, defaultLeftPanelWidth } from './LeftPanelComponent'
import './App.css'

const dataGridExamples = [
  { id: 'example-1', name: 'DataGridEx1', component: DataGridEx1 },
  { id: 'example-2', name: 'DataGridEx2', component: DataGridEx2 },
  { id: 'example-3', name: 'DataGridEx3', component: DataGridEx3 }
] as const

const plotlyExamples = [{ id: 'plotly-example-1', name: 'PlotlyEx1', component: PlotlyEx1 }] as const
const examples = [...dataGridExamples, ...plotlyExamples] as const

type ExampleId = (typeof examples)[number]['id']

const exampleTreeData: ExampleTreeNodeData<ExampleId>[] = [
  {
    id: 'data-grid',
    name: 'Data Grid',
    children: dataGridExamples.map((example) => ({
      id: example.id,
      name: example.name,
      exampleId: example.id
    }))
  },
  {
    id: 'plotly',
    name: 'Plotly',
    children: plotlyExamples.map((example) => ({
      id: example.id,
      name: example.name,
      exampleId: example.id
    }))
  }
]

function App() {
  const [selectedExampleId, setSelectedExampleId] = useState<ExampleId>('example-1')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(defaultLeftPanelWidth)
  const selectedExample = examples.find((example) => example.id === selectedExampleId) ?? examples[0]
  const SelectedExample = selectedExample.component
  const currentSidebarWidth = isSidebarCollapsed ? collapsedLeftPanelWidth : sidebarWidth

  return (
    <main
      className={isSidebarCollapsed ? 'app-shell is-sidebar-collapsed' : 'app-shell'}
      style={{ '--app-sidebar-width': `${currentSidebarWidth}px` } as CSSProperties}
    >
      <LeftPanelComponent
        isCollapsed={isSidebarCollapsed}
        selectedExampleId={selectedExampleId}
        treeData={exampleTreeData}
        width={currentSidebarWidth}
        onCollapseChange={setIsSidebarCollapsed}
        onExampleSelect={setSelectedExampleId}
        onWidthChange={setSidebarWidth}
      />

      <section className="app-content" aria-label={selectedExample.name}>
        <SelectedExample />
      </section>
    </main>
  )
}

export default App
