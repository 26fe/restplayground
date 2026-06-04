import type { NodeRendererProps } from 'react-arborist'
import './ExampleTreeNode.css'

export type ExampleTreeNodeData<TExampleId extends string = string> = {
  id: string
  name: string
  exampleId?: TExampleId
  children?: ExampleTreeNodeData<TExampleId>[]
}

function ExampleTreeNode<TExampleId extends string = string>({
  node,
  style
}: NodeRendererProps<ExampleTreeNodeData<TExampleId>>) {
  const hasChildren = !node.isLeaf
  const shortName = node.data.exampleId
    ? node.data.name.replace('DataGridEx', 'Ex').replace('PlotlyEx', 'Px')
    : node.data.name
        .split(' ')
        .map((word) => word[0])
        .join('')

  return (
    <div
      className={[
        'example-tree-node',
        hasChildren ? 'is-group' : 'is-example',
        node.isSelected ? 'is-selected' : ''
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      <button
        className="example-tree-node-button"
        type="button"
        title={node.data.name}
        onClick={() => {
          if (hasChildren) {
            node.toggle()
            return
          }

          node.select()
        }}
      >
        <span className="example-tree-node-toggle" aria-hidden="true">
          {hasChildren ? (node.isOpen ? 'v' : '>') : ''}
        </span>
        <span className="example-tree-node-short-name">{shortName}</span>
        <span className="example-tree-node-full-name">{node.data.name}</span>
      </button>
    </div>
  )
}

export default ExampleTreeNode
