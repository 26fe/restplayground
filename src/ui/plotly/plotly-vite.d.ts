declare module 'plotly.js-dist-min' {
  import * as Plotly from 'plotly.js'

  export = Plotly
}

declare module 'react-plotly.js/factory.js' {
  import type * as Plotly from 'plotly.js'
  import type Plot from 'react-plotly.js'

  type PlotlyFactory = (plotly: typeof Plotly) => typeof Plot
  const createPlotlyComponentModule: PlotlyFactory

  export default createPlotlyComponentModule
}
