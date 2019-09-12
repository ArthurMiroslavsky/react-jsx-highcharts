import { Component } from 'react';
import PropTypes from 'prop-types';
import { attempt } from 'lodash-es';
import { findIndex } from 'lodash-es';
import { getEventsConfig, HighchartsChartContext } from 'react-jsx-highcharts';

class RangeSelectorButton extends Component {

  static propTypes = {
    count: PropTypes.number,
    type: PropTypes.oneOf(['millisecond', 'second', 'minute', 'hour', 'day', 'week', 'month', 'ytd', 'all']),
    offsetMin: PropTypes.number.isRequired,
    offsetMax: PropTypes.number.isRequired,
    dataGrouping: PropTypes.object
  };

  static defaultProps = {
    count: 1,
    offsetMin: 0,
    offsetMax: 0
  };

  static contextType = HighchartsChartContext;

  componentDidMount () {
    const button = this.getButtonIndex();
    if (button > -1) return; // Button already present

    const { count, type, offsetMin, offsetMax, dataGrouping, children: text, ...rest } = this.props;
    const opts = {
      count,
      type,
      offsetMin,
      offsetMax,
      dataGrouping,
      text,
      events: getEventsConfig(rest)
    }
    this.addButton(opts)
  }

  componentWillUnmount () {
    attempt(this.removeButton);
  }

  getButtons = () => {
    const chart = this.context;
    const chartObj = chart.object;
    if (chartObj && chartObj.options) {
      const { buttons = [] } = chartObj.options.rangeSelector;
      return buttons;
    }

    return [];
  }

  getButtonIndex = () => {
    const { count, type } = this.props;
    return findIndex(this.getButtons(), b => {
      return (b.count === count && b.type === type);
    });
  }

  addButton = config => {
    // Add button to array
    const buttons = [
      ...this.getButtons(),
      config
    ];
    this.updateRangeSelectorButtons(buttons);
  }

  removeButton = () => {
    const button = this.getButtonIndex();
    if (button === -1) return;

    // Remove button from array
    const buttons = [...this.getButtons()];
    buttons.splice(button, 1);
    this.updateRangeSelectorButtons(buttons);
  }

  updateRangeSelectorButtons = config => {
    const chart = this.context;
    chart.update({
      rangeSelector: {
        buttons: config
      }
    });
  }

  render () {
    return null;
  }
}

export default RangeSelectorButton;
