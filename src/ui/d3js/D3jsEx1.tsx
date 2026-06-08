import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import './D3jsEx1.css'

const featureUsage = [
  { feature: 'Dashboards', usage: 91 },
  { feature: 'Reports', usage: 78 },
  { feature: 'Alerts', usage: 64 },
  { feature: 'Exports', usage: 52 },
  { feature: 'API Access', usage: 38 }
]

function D3jsEx1() {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const containerElement = containerRef.current
    const svgElement = svgRef.current

    if (!containerElement || !svgElement) {
      return
    }

    function drawChart() {
      if (!containerElement || !svgElement) {
        return
      }

      const width = Math.max(containerElement.clientWidth, 320)
      const height = Math.max(containerElement.clientHeight, 360)
      const margin = { top: 34, right: 56, bottom: 48, left: 116 }
      const innerWidth = width - margin.left - margin.right
      const innerHeight = height - margin.top - margin.bottom

      const svg = d3.select(svgElement)
      svg.selectAll('*').remove()
      svg.attr('viewBox', `0 0 ${width} ${height}`)

      const xScale = d3
        .scaleLinear()
        .domain([0, 100])
        .range([0, innerWidth])
        .nice()

      const yScale = d3
        .scaleBand()
        .domain(featureUsage.map((item) => item.feature))
        .range([0, innerHeight])
        .padding(0.22)

      const chart = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

      chart
        .append('g')
        .attr('class', 'd3js-ex1-grid')
        .call(
          d3
            .axisBottom(xScale)
            .ticks(5)
            .tickSize(innerHeight)
            .tickFormat(() => '')
        )

      chart
        .append('g')
        .attr('class', 'd3js-ex1-x-axis')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale).ticks(5).tickFormat((value) => `${value}%`))

      chart.append('g').attr('class', 'd3js-ex1-y-axis').call(d3.axisLeft(yScale).tickSize(0))

      chart
        .selectAll('.d3js-ex1-bar')
        .data(featureUsage)
        .join('rect')
        .attr('class', 'd3js-ex1-bar')
        .attr('x', 0)
        .attr('y', (item) => yScale(item.feature) ?? 0)
        .attr('width', (item) => xScale(item.usage))
        .attr('height', yScale.bandwidth())
        .attr('rx', 5)

      chart
        .selectAll('.d3js-ex1-value')
        .data(featureUsage)
        .join('text')
        .attr('class', 'd3js-ex1-value')
        .attr('x', (item) => xScale(item.usage) + 10)
        .attr('y', (item) => (yScale(item.feature) ?? 0) + yScale.bandwidth() / 2)
        .attr('dy', '0.35em')
        .text((item) => `${item.usage}%`)
    }

    const resizeObserver = new ResizeObserver(drawChart)
    resizeObserver.observe(containerElement)
    drawChart()

    return () => {
      resizeObserver.disconnect()
      d3.select(svgElement).selectAll('*').remove()
    }
  }, [])

  return (
    <section className="d3js-ex1">
      <header className="d3js-ex1-header">
        <p>D3.js</p>
        <h1>Horizontal Bar Chart</h1>
      </header>

      <div className="d3js-ex1-chart" ref={containerRef}>
        <svg ref={svgRef} role="img" aria-label="Horizontal bar chart showing feature usage percentages" />
      </div>
    </section>
  )
}

export default D3jsEx1
