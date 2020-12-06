'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var fips_range = {
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
};

var StatePicker = function (_React$Component) {
  _inherits(StatePicker, _React$Component);

  function StatePicker(props) {
    _classCallCheck(this, StatePicker);

    var _this = _possibleConstructorReturn(this, (StatePicker.__proto__ || Object.getPrototypeOf(StatePicker)).call(this, props));

    _this.handleStateChange = _this.handleStateChange.bind(_this);
    return _this;
  }

  _createClass(StatePicker, [{
    key: 'handleStateChange',
    value: function handleStateChange(newState) {
      this.props.setNewState(newState);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return React.createElement(
        'div',
        { 'class': 'buttons', id: 'states' },
        this.props.states.map(function (x) {
          return React.createElement(
            'button',
            { onClick: function onClick() {
                return _this2.handleStateChange(x);
              } },
            x
          );
        })
      );
    }
  }]);

  return StatePicker;
}(React.Component);

var CountyPicker = function (_React$Component2) {
  _inherits(CountyPicker, _React$Component2);

  function CountyPicker(props) {
    _classCallCheck(this, CountyPicker);

    var _this3 = _possibleConstructorReturn(this, (CountyPicker.__proto__ || Object.getPrototypeOf(CountyPicker)).call(this, props));

    _this3.handleCountySelection = _this3.handleCountySelection.bind(_this3);
    return _this3;
  }

  _createClass(CountyPicker, [{
    key: 'handleCountySelection',
    value: function handleCountySelection(fips, county) {
      this.props.setNewFips(fips, county);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      if (this.props.counties == 'None') {
        return React.createElement(
          'div',
          null,
          'Counties:'
        );
      }
      return React.createElement(
        'div',
        { 'class': 'buttons' },
        this.props.counties.column('County_name').values.map(function (county, i) {
          return React.createElement(
            'button',
            { onClick: function onClick() {
                return _this4.handleCountySelection(_this4.props.counties.index[i], county);
              } },
            county
          );
        })
      );
    }
  }]);

  return CountyPicker;
}(React.Component);

var Graphs = function (_React$Component3) {
  _inherits(Graphs, _React$Component3);

  function Graphs(props) {
    _classCallCheck(this, Graphs);

    var _this5 = _possibleConstructorReturn(this, (Graphs.__proto__ || Object.getPrototypeOf(Graphs)).call(this, props));

    _this5.standard = props.data[0].set_index({ key: 'FIPS' });
    _this5.urbanRural = props.data[1].set_index({ key: 'FIPS' });
    _this5.clusters = props.data[2].set_index({ key: 'FIPS' });

    _this5.state = {
      active: 'standard'
    };
    return _this5;
  }

  _createClass(Graphs, [{
    key: 'getRowOfData',
    value: function getRowOfData(bigData, fips) {
      if (fips == 0) {
        return 0;
      }
      if (!bigData.index.includes(fips.toString())) {
        return 0;
      }
      return bigData.loc({
        rows: [this.props.fips.toString()]
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this6 = this;

      if (this.props.fips != 0 && !this.standard.index.includes(this.props.fips.toString())) {
        return React.createElement(
          'div',
          { style: this.props.style, 'class': 'graphs' },
          'That county was cleaned from our data. Sorry!',
          React.createElement('div', { id: 'standard' }),
          React.createElement('div', { id: 'urbanRural' }),
          React.createElement('div', { id: 'clusters' })
        );
      }

      return React.createElement(
        'div',
        { style: this.props.style, 'class': 'graphs' },
        React.createElement(
          'div',
          null,
          React.createElement(
            'button',
            { onClick: function onClick() {
                return _this6.setState({ active: 'standard' });
              } },
            'Standard'
          ),
          React.createElement(
            'button',
            { onClick: function onClick() {
                return _this6.setState({ active: 'ur' });
              } },
            'Urban Rural'
          ),
          React.createElement(
            'button',
            { onClick: function onClick() {
                return _this6.setState({ active: 'cluster' });
              } },
            'Clusters'
          )
        ),
        React.createElement(IndividualGraph, {
          toPlot: this.getRowOfData(this.standard, this.props.fips),
          name: 'Standard Model',
          id: 'standard' }),
        React.createElement('div', { id: 'standard', style: { display: this.state.active == 'standard' ? "" : 'none' } }),
        React.createElement(IndividualGraph, {
          toPlot: this.getRowOfData(this.urbanRural, this.props.fips),
          name: 'NCHS Urban Rural Code Models',
          id: 'urbanRural' }),
        React.createElement('div', { id: 'urbanRural', style: { display: this.state.active == 'ur' ? "" : 'none' } }),
        React.createElement(IndividualGraph, {
          toPlot: this.getRowOfData(this.clusters, this.props.fips),
          name: 'K Means Clusters Models',
          id: 'clusters' }),
        React.createElement('div', { id: 'clusters', style: { display: this.state.active == 'cluster' ? "" : 'none' } })
      );
    }
  }]);

  return Graphs;
}(React.Component);

var IndividualGraph = function (_React$Component4) {
  _inherits(IndividualGraph, _React$Component4);

  function IndividualGraph(props) {
    _classCallCheck(this, IndividualGraph);

    return _possibleConstructorReturn(this, (IndividualGraph.__proto__ || Object.getPrototypeOf(IndividualGraph)).call(this, props));
  }

  _createClass(IndividualGraph, [{
    key: 'render',
    value: function render() {
      if (this.props.toPlot == 0) {
        return React.createElement('div', null);
      }
      Plotly.newPlot(document.getElementById(this.props.id), [{
        x: this.props.toPlot.columns,
        y: this.props.toPlot.values[0].map(function (x) {
          return Math.floor(x);
        })
      }]);
      // this.props.toPlot.plot(this.props.id).line({x: this.props.toPlot.columns, y: this.props.toPlot.values})
      return React.createElement('div', null);
    }
  }]);

  return IndividualGraph;
}(React.Component);

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index && value != 'DC';
}

var Content = function (_React$Component5) {
  _inherits(Content, _React$Component5);

  function Content(props) {
    _classCallCheck(this, Content);

    var _this8 = _possibleConstructorReturn(this, (Content.__proto__ || Object.getPrototypeOf(Content)).call(this, props));

    _this8.df = props.df[0].set_index({ key: 'FIPS' });

    _this8.setNewState = _this8.setNewState.bind(_this8);
    _this8.setNewFips = _this8.setNewFips.bind(_this8);
    _this8.state = {
      picked: 'None',
      fips: 0,
      county: ''
    };
    return _this8;
  }

  _createClass(Content, [{
    key: 'setNewState',
    value: function setNewState(newState) {
      this.setState({
        picked: newState
      });
    }
  }, {
    key: 'setNewFips',
    value: function setNewFips(newFips, county) {
      this.setState({
        fips: newFips,
        county: county
      });
    }
  }, {
    key: 'getCounties',
    value: function getCounties(state) {
      if (!(state in fips_range)) {
        return [];
      }
      var low = fips_range[state][0];
      var high = fips_range[state][1];
      var fips_list = this.df.index.filter(function (fips) {
        return parseInt(fips) >= low && parseInt(fips) <= high;
      });
      var counties_df = this.df.loc({
        rows: fips_list,
        columns: ['County_name']
      });
      return counties_df;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this9 = this;

      return React.createElement(
        'div',
        { 'class': 'gb' },
        React.createElement(
          'div',
          null,
          this.state.picked == 'None' ? 'Pick a State: ' : 'State: ' + this.state.picked
        ),
        this.state.picked == 'None' && React.createElement(StatePicker, {
          states: this.df.column('State_Abr.').values.filter(onlyUnique),
          state: this.state.picked,
          setNewState: this.setNewState }),
        this.state.picked != 'None' && React.createElement(
          'div',
          null,
          this.state.county == '' ? 'Pick a County: ' : 'County: ' + this.state.county
        ),
        this.state.county == '' && React.createElement(CountyPicker, {
          counties: this.state.picked == 'None' ? 'None' : this.getCounties(this.state.picked),
          setNewFips: this.setNewFips }),
        this.state.picked != 'None' && React.createElement(
          'button',
          { onClick: function onClick() {
              return _this9.setState({
                picked: 'None',
                fips: 0,
                county: ''
              });
            }, id: 'reset' },
          'Reset'
        ),
        React.createElement(Graphs, {
          data: this.props.df.slice(1),
          fips: this.state.fips,
          style: {
            display: this.state.fips == 0 ? "none" : ""
          } })
      );
    }
  }]);

  return Content;
}(React.Component);

var domContainer = document.querySelector('#gb_container');
var ext_url = 'https://gt-machine-learning-covid-19.github.io/COVID-Prediction/data.xls';
Promise.all([dfd.read_excel({ source: ext_url }), dfd.read_excel({ source: ext_url, sheet_name: 'standard_gb' }), dfd.read_excel({ source: ext_url, sheet_name: 'ur_gb' }), dfd.read_excel({ source: ext_url, sheet_name: 'cluster' })]).then(function (df) {
  ReactDOM.render(React.createElement(Content, { df: df }), domContainer);
});