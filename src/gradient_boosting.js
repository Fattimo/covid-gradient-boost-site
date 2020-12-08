'use strict';

const fips_range = {
  'AL': [1000, 2000],
  'AK': [2000, 3000],
  'AZ': [4000, 5000],
  'AR': [5000, 6000],
  'CA': [6000, 7000],
  'CO': [8000, 9000],
  'CT': [9000, 10000],
  'DE': [10000, 11000],
  'DC': [11000, 12000],
  'FL': [12000, 13000],
  'GA': [13000, 14000],
  'HI': [15000, 16000],
  'ID': [16000, 17000],
  'IL': [17000, 18000],
  'IN': [18000, 19000],
  'IA': [19000, 20000],
  'KS': [20000, 21000],
  'KY': [21000, 22000],
  'LA': [22000, 23000],
  'ME': [23000, 24000],
  'MD': [24000, 25000],
  'MA': [25000, 26000],
  'MI': [26000, 27000],
  'MN': [27000, 28000],
  'MS': [28000, 29000],
  'MO': [29000, 30000],
  'MT': [30000, 31000],
  'NE': [31000, 32000],
  'NV': [32000, 33000],
  'NH': [33000, 34000],
  'NJ': [34000, 35000],
  'NM': [35000, 36000],
  'NY': [36000, 37000],
  'NC': [37000, 38000],
  'ND': [38000, 39000],
  'OH': [39000, 40000],
  'OK': [40000, 41000],
  'OR': [41000, 42000],
  'PA': [42000, 43000],
  'RI': [44000, 45000],
  'SC': [45000, 46000],
  'SD': [46000, 47000],
  'TN': [47000, 48000],
  'TX': [48000, 49000],
  'UT': [49000, 50000],
  'VT': [50000, 51000],
  'VA': [51000, 52000],
  'WA': [53000, 54000],
  'WV': [54000, 55000],
  'WI': [55000, 56000],
  'WY': [56000, 57000]
}

class StatePicker extends React.Component {
  constructor(props) {
    super(props)
    this.handleStateChange = this.handleStateChange.bind(this)
  }

  handleStateChange(newState) {
    this.props.setNewState(newState)
  }

  render() {
    return (
      <div class = 'buttons' id = 'states'>
        {this.props.states.map(x => (
          <button onClick={() => this.handleStateChange(x)}>
            {x}
          </button>
        ))}
      </div>
    )
  }
}

class CountyPicker extends React.Component {
  constructor(props) {
    super(props)
    this.handleCountySelection = this.handleCountySelection.bind(this)
  }

  handleCountySelection(fips, county) {
    this.props.setNewFips(fips, county)
  }

  render() {
    if (this.props.counties == 'None') {
      return (
        <div>
          Counties:
        </div>
      )
    }
    return (
      <div class = 'buttons'>
        {this.props.counties.column('County_name').values.map((county, i) => (
          <button onClick={() => this.handleCountySelection(this.props.counties.index[i], county)}>
            {county}
          </button>
        ))}
      </div>
    )
  }
}

class Graphs extends React.Component {
  constructor(props) {
    super(props)

    this.standard = props.data[0].set_index({key: 'FIPS'})
    this.urbanRural = props.data[1].set_index({key: 'FIPS'})
    this.clusters = props.data[2].set_index({key: 'FIPS'})

    this.state = {
      active: 'standard'
    }
  }

  getRowOfData(bigData, fips) {
    if (fips == 0) {
      return 0;
    }
    if (!bigData.index.includes(fips.toString())) {
      return 0;
    }
    return bigData.loc({
      rows: [this.props.fips.toString()]
    })
  }

  render() {
    if (this.props.fips != 0 && !this.standard.index.includes(this.props.fips.toString())) {
      return (
        <div style = {this.props.style} class = 'graphs'>
          That county was cleaned from our data. Sorry! The graph displayed below is incorrect.
          <div id = 'standard'></div>
          <div id = 'urbanRural'></div>
          <div id = 'clusters'></div>
        </div>
      );
    }

    return (
      <div style = {this.props.style} class = 'graphs'>
        <div>
          <button onClick={() => this.setState({active: 'standard'})} style = {{backgroundColor: this.state.active == 'standard' ? "coral" : ''}}>Standard</button>
          <button onClick={() => this.setState({active: 'ur'})} style = {{backgroundColor: this.state.active == 'ur' ? "coral" : ''}}>Urban Rural</button>
          <button onClick={() => this.setState({active: 'cluster'})} style = {{backgroundColor: this.state.active == 'cluster' ? "coral" : ''}}>Clusters</button>
        </div>
        <IndividualGraph 
          toPlot = {this.getRowOfData(this.standard, this.props.fips)}
          name = 'Standard Model'
          id = 'standard'>
        </IndividualGraph>
        <div id = 'standard' style = {{display: this.state.active == 'standard' ? "" : 'none'}}></div>
        <IndividualGraph 
          toPlot = {this.getRowOfData(this.urbanRural, this.props.fips)}
          name = 'NCHS Urban Rural Code Models'
          id = 'urbanRural'>
        </IndividualGraph>
        <div id = 'urbanRural' style = {{display: this.state.active == 'ur' ? "" : 'none'}}></div>
        <IndividualGraph 
          toPlot = {this.getRowOfData(this.clusters, this.props.fips)}
          name = 'K Means Clusters Models'
          id = 'clusters'>
        </IndividualGraph>
        <div id = 'clusters' style = {{display: this.state.active == 'cluster' ? "" : 'none'}}></div>
      </div>
    )
  }
}

class IndividualGraph extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    if (this.props.toPlot == 0) {
      return (
        <div>
        </div>
      )
    }
    Plotly.newPlot(document.getElementById(this.props.id), [{
      x: this.props.toPlot.columns,
      y: this.props.toPlot.values[0].map(x => Math.floor(x))
    }])
    // this.props.toPlot.plot(this.props.id).line({x: this.props.toPlot.columns, y: this.props.toPlot.values})
    return (
      <div></div>
    )
  }
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index && value != 'DC';
}

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.df = props.df[0].set_index({key: 'FIPS'})

    this.setNewState = this.setNewState.bind(this)
    this.setNewFips = this.setNewFips.bind(this)
    this.state = { 
      picked: 'None',
      fips: 0,
      county: ''
    };
  }

  setNewState(newState) {
    this.setState({
      picked: newState
    })
  }

  setNewFips(newFips, county) {
    this.setState({
      fips: newFips,
      county: county
    })
  }

  getCounties(state) {
    if (!(state in fips_range)) {
      return []
    }
    const low = fips_range[state][0]
    const high = fips_range[state][1]
    const fips_list = this.df.index.filter(fips => parseInt(fips) >= low && parseInt(fips) <= high)
    const counties_df = this.df.loc({
      rows: fips_list,
      columns: ['County_name']
    })
    return counties_df
  }

  render() {
    return (
      <div class = 'gb'>
        <div>{this.state.picked == 'None' ? 'Pick a State: ' : 'State: ' + this.state.picked}</div>
        {this.state.picked == 'None' && (<StatePicker 
          states = {this.df.column('State_Abr.').values.filter(onlyUnique)} 
          state = {this.state.picked} 
          setNewState = {this.setNewState}>
        </StatePicker>)}
        {this.state.picked != 'None' && (<div>{this.state.county == '' ? 'Pick a County: ' : 'County: ' + this.state.county}</div>)}
        {this.state.county == '' && (<CountyPicker
          counties = {this.state.picked == 'None' ? 'None' : this.getCounties(this.state.picked)}
          setNewFips = {this.setNewFips}>
        </CountyPicker>)}
        {this.state.picked != 'None' && (<button onClick={() => this.setState({ 
          picked: 'None',
          fips: 0,
          county: ''
        })} id = 'reset'>
          Reset
        </button>)}
        <Graphs
          data = {this.props.df.slice(1)}
          fips = {this.state.fips}
          style={{
            display: this.state.fips == 0 ? "none": "",
          }}>
        </Graphs>
      </div>
    );
  }
}

let domContainer = document.querySelector('#gb_container');
const ext_url = 'https://gt-machine-learning-covid-19.github.io/COVID-Prediction/data.xls'
Promise.all([
  dfd.read_excel({source: ext_url}),
  dfd.read_excel({source: ext_url, sheet_name: 'standard_gb'}),
  dfd.read_excel({source: ext_url, sheet_name: 'ur_gb'}),
  dfd.read_excel({source: ext_url, sheet_name: 'cluster'})
]).then(df => {
  ReactDOM.render(<Content df = {df}/>, domContainer);
})