import { type PointerEvent as ReactPointerEvent } from 'react'
import { Tree } from 'react-arborist'
import ExampleTreeNode, { type ExampleTreeNodeData } from './ExampleTreeNode'
import './LeftPanelComponent.css'

export const collapsedLeftPanelWidth = 56
export const defaultLeftPanelWidth = 260
const maxLeftPanelWidth = 420
const minLeftPanelWidth = 180
const treeRowHeight = 38

type LeftPanelComponentProps<TExampleId extends string> = {
  isCollapsed: boolean
  selectedExampleId: TExampleId
  treeData: ExampleTreeNodeData<TExampleId>[]
  width: number
  onCollapseChange: (isCollapsed: boolean) => void
  onExampleSelect: (exampleId: TExampleId) => void
  onWidthChange: (width: number) => void
}

function countVisibleTreeRows<TExampleId extends string>(nodes: ExampleTreeNodeData<TExampleId>[]) {
  return nodes.reduce((count, node) => count + 1 + (node.children?.length ?? 0), 0)
}

function LeftPanelComponent<TExampleId extends string>({
  isCollapsed,
  selectedExampleId,
  treeData,
  width,
  onCollapseChange,
  onExampleSelect,
  onWidthChange
}: LeftPanelComponentProps<TExampleId>) {
  const treeWidth = Math.max(40, width - (isCollapsed ? 16 : 36))
  const treeHeight = treeRowHeight * countVisibleTreeRows(treeData)

  function startSidebarResize(event: ReactPointerEvent<HTMLButtonElement>) {
    if (isCollapsed) {
      return
    }

    const initialPointerX = event.clientX
    const initialSidebarWidth = width

    function handlePointerMove(moveEvent: globalThis.PointerEvent) {
      const nextWidth = initialSidebarWidth + moveEvent.clientX - initialPointerX
      onWidthChange(Math.min(maxLeftPanelWidth, Math.max(minLeftPanelWidth, nextWidth)))
    }

    function handlePointerUp() {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }

  return (
    <aside className="app-sidebar" aria-label="Examples">
      <header className="app-sidebar-header">
        <h1>Examples</h1>
        <button
          className="app-sidebar-toggle"
          type="button"
          aria-label={isCollapsed ? 'Expand examples panel' : 'Collapse examples panel'}
          onClick={() => onCollapseChange(!isCollapsed)}
        >
          {isCollapsed ? '>' : '<'}
        </button>
      </header>

      <div className="example-tree" aria-label="Examples tree">
        <Tree<ExampleTreeNodeData<TExampleId>>
          data={treeData}
          disableDrag
          disableDrop
          height={treeHeight}
          indent={16}
          openByDefault
          rowHeight={treeRowHeight}
          selection={selectedExampleId}
          width={treeWidth}
          onSelect={(nodes) => {
            const selectedNode = nodes.find((node) => node.data.exampleId)

            if (selectedNode?.data.exampleId) {
              onExampleSelect(selectedNode.data.exampleId)
            }
          }}
        >
          {(props) => <ExampleTreeNode {...props} />}
        </Tree>
      </div>

      <button
        className="app-sidebar-resize"
        type="button"
        aria-label="Resize examples panel"
        onPointerDown={startSidebarResize}
      />
    </aside>
  )
}

export default LeftPanelComponent
