import { useEffect, useRef } from 'react'
import Plotly from 'plotly.js-dist-min'
import './PlotlyEx2.css'

const featureAdoption = [
  { feature: 'Dashboards', users: 84 },
  { feature: 'Exports', users: 68 },
  { feature: 'Alerts', users: 57 },
  { feature: 'Automations', users: 43 },
  { feature: 'API Access', users: 31 }
]

function PlotlyEx2() {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const chartElement = chartRef.current

    if (!chartElement) {
      return
    }

    Plotly.newPlot(
      chartElement,
      [
        {
          x: featureAdoption.map((item) => item.users),
          y: featureAdoption.map((item) => item.feature),
          type: 'bar',
          orientation: 'h',
          marker: {
            color: ['#0f766e', '#2563eb', '#7c3aed', '#d97706', '#be123c'],
            line: { color: '#ffffff', width: 1 }
          },
          hovertemplate: '%{y}<br>%{x}% adoption<extra></extra>'
        }
      ],
      {
        autosize: true,
        font: { color: '#1f2937', family: 'Inter, system-ui, sans-serif' },
        margin: { b: 44, l: 112, r: 28, t: 42 },
        paper_bgcolor: '#ffffff',
        plot_bgcolor: '#ffffff',
        title: { text: 'Feature adoption by active users' },
        xaxis: {
          gridcolor: '#e5e7eb',
          range: [0, 100],
          ticksuffix: '%',
          zeroline: false
        },
        yaxis: {
          automargin: true,
          categoryorder: 'total ascending',
          gridcolor: '#f1f5f9'
        }
      },
      {
        displaylogo: false,
        responsive: true
      }
    )

    const resizeObserver = new ResizeObserver(() => {
      Plotly.Plots.resize(chartElement)
    })

    resizeObserver.observe(chartElement)

    return () => {
      resizeObserver.disconnect()
      Plotly.purge(chartElement)
    }
  }, [])

  return (
    <section className="plotly-ex2">
      <header className="plotly-ex2-header">
        <p>Plotly DOM API</p>
        <h1>Horizontal Bar Chart</h1>
      </header>

      <div className="plotly-ex2-chart" ref={chartRef} aria-label="Horizontal bar chart showing feature adoption" />
    </section>
  )
}

export default PlotlyEx2
