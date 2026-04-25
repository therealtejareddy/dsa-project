function buildTreeLayout(treeNodes) {
  if (!treeNodes || treeNodes.length === 0) {
    return { positions: {}, childrenMap: {}, nodeMap: {} }
  }

  const nodeMap = {}
  const childrenMap = {}
  treeNodes.forEach((n) => {
    nodeMap[n.id] = n
    childrenMap[n.id] = []
  })
  treeNodes.forEach((n) => {
    if (n.parentId !== null && n.parentId !== undefined) {
      childrenMap[n.parentId].push(n.id)
    }
  })

  const widths = {}
  function computeWidth(id) {
    const children = childrenMap[id] ?? []
    if (children.length === 0) {
      widths[id] = 1
      return 1
    }
    const total = children.reduce((s, c) => s + computeWidth(c), 0)
    widths[id] = total
    return total
  }
  const rootId = treeNodes[0].id
  computeWidth(rootId)

  const NODE_W = 52
  const NODE_H = 62
  const positions = {}
  function assign(id, left, depth) {
    const w = widths[id]
    positions[id] = { x: (left + w / 2) * NODE_W, y: depth * NODE_H }
    let cursor = left
    for (const cid of childrenMap[id] ?? []) {
      assign(cid, cursor, depth + 1)
      cursor += widths[cid]
    }
  }
  assign(rootId, 0, 0)

  return { positions, childrenMap, nodeMap }
}

export default function RecursionTree({
  treeNodes,
  activeNodeId,
  activeNodeColor = '#6366f1',
  activeNodeDarkColor = '#4f46e5',
}) {
  const { positions, childrenMap } = buildTreeLayout(treeNodes)
  if (!treeNodes || treeNodes.length === 0) return null

  const allX = Object.values(positions).map((p) => p.x)
  const allY = Object.values(positions).map((p) => p.y)
  const minX = Math.min(...allX)
  const maxX = Math.max(...allX)
  const maxY = Math.max(...allY)
  const PAD = 30
  const svgW = maxX - minX + PAD * 2 + 44
  const svgH = maxY + PAD * 2 + 44
  const ox = PAD + 22 - minX

  return (
    <div className="tree-scroll-wrap">
      <svg width={svgW} height={svgH} className="tree-svg">
        {/* Edges */}
        {treeNodes.map((n) => {
          const children = childrenMap[n.id] ?? []
          return children.map((cid) => {
            const p = positions[n.id]
            const c = positions[cid]
            if (!p || !c) return null
            return (
              <line
                key={`edge-${n.id}-${cid}`}
                x1={p.x + ox}
                y1={p.y + 22}
                x2={c.x + ox}
                y2={c.y + 9}
                stroke="#94a3b8"
                strokeWidth="1.5"
              />
            )
          })
        })}
        {/* Nodes */}
        {treeNodes.map((n) => {
          const pos = positions[n.id]
          if (!pos) return null
          const isActive = n.id === activeNodeId
          const isBase = n.isBase
          const hasReturnValue = n.returnValue !== undefined && n.returnValue !== null
          const cx = pos.x + ox
          const cy = pos.y + 18
          
          let fill = '#e2e8f0'
          let stroke = '#94a3b8'
          let textColor = '#1e293b'
          
          if (isActive) {
            fill = activeNodeColor
            stroke = activeNodeDarkColor
            textColor = 'white'
          } else if (isBase) {
            fill = '#fef3c7'
            stroke = '#f59e0b'
            textColor = '#78350f'
          } else if (n.match) {
            fill = '#d1fae5'
            stroke = '#10b981'
            textColor = '#065f46'
          } else if (hasReturnValue) {
            fill = '#c7d2fe'
            stroke = '#818cf8'
            textColor = '#1e1b4b'
          }

          return (
            <g key={`node-${n.id}`}>
              {/* Main node circle */}
              <circle
                cx={cx}
                cy={cy}
                r={18}
                fill={fill}
                stroke={stroke}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              
              {/* Main label (input parameter) */}
              <text
                x={cx}
                y={hasReturnValue ? cy - 2 : cy + 4}
                textAnchor="middle"
                fontSize="11"
                fontWeight="600"
                fill={textColor}
              >
                {n.label}
              </text>
              
              {/* Return value (if available) */}
              {hasReturnValue && (
                <text
                  x={cx}
                  y={cy + 10}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="700"
                  fill={textColor}
                  opacity="0.8"
                >
                  → {n.returnValue}
                </text>
              )}
              
              {/* Return value indicator (small dot below) */}
              {hasReturnValue && (
                <circle
                  cx={cx}
                  cy={cy + 24}
                  r={3}
                  fill="#22c55e"
                  opacity="0.7"
                />
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
