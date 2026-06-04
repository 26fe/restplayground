import Plotly from 'plotly.js-dist-min'
import createPlotlyComponentModule from 'react-plotly.js/factory.js'
import './PlotlyEx1.css'

type PlotlyFactory = typeof createPlotlyComponentModule
type PlotlyFactoryWrapper = {
  default?: PlotlyFactory | PlotlyFactoryWrapper
  'module.exports'?: PlotlyFactory | PlotlyFactoryWrapper
}

function resolvePlotlyFactory(factoryModule: PlotlyFactory | PlotlyFactoryWrapper): PlotlyFactory {
  if (typeof factoryModule === 'function') {
    return factoryModule
  }

  if (factoryModule.default) {
    return resolvePlotlyFactory(factoryModule.default)
  }

  if (factoryModule['module.exports']) {
    return resolvePlotlyFactory(factoryModule['module.exports'])
  }

  throw new TypeError('Unable to resolve react-plotly.js factory')
}

const createPlotlyComponent = resolvePlotlyFactory(createPlotlyComponentModule)
const Plot = createPlotlyComponent(Plotly)

const monthlyRevenue = [
  { month: 'Jan', revenue: 42, forecast: 40 },
  { month: 'Feb', revenue: 48, forecast: 45 },
  { month: 'Mar', revenue: 45, forecast: 47 },
  { month: 'Apr', revenue: 57, forecast: 52 },
  { month: 'May', revenue: 63, forecast: 59 },
  { month: 'Jun', revenue: 69, forecast: 64 }
]

function PlotlyEx1() {
  const months = monthlyRevenue.map((item) => item.month)

  return (
    <section className="plotly-ex1">
      <header className="plotly-ex1-header">
        <p>Plotly</p>
        <h1>Revenue Trend</h1>
      </header>

      <div className="plotly-ex1-chart">
        <Plot
          data={[
            {
              x: months,
              y: monthlyRevenue.map((item) => item.revenue),
              type: 'scatter',
              mode: 'lines+markers',
              name: 'Actual',
              line: { color: '#2563eb', width: 3 },
              marker: { color: '#2563eb', size: 8 }
            },
            {
              x: months,
              y: monthlyRevenue.map((item) => item.forecast),
              type: 'bar',
              name: 'Forecast',
              marker: { color: '#94a3b8' }
            }
          ]}
          layout={{
            autosize: true,
            bargap: 0.36,
            font: { color: '#1f2937', family: 'Inter, system-ui, sans-serif' },
            height: 460,
            legend: { orientation: 'h', x: 0, y: 1.12 },
            margin: { b: 48, l: 54, r: 24, t: 40 },
            paper_bgcolor: '#ffffff',
            plot_bgcolor: '#ffffff',
            title: { text: 'Monthly revenue and forecast' },
            xaxis: { gridcolor: '#e5e7eb', zeroline: false },
            yaxis: { gridcolor: '#e5e7eb', ticksuffix: 'k', zeroline: false }
          }}
          config={{
            displaylogo: false,
            responsive: true
          }}
          useResizeHandler
          style={{ height: '100%', width: '100%' }}
        />
      </div>
    </section>
  )
}

export default PlotlyEx1
