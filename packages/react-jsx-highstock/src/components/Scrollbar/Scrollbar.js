import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { attempt } from 'lodash-es';
import { Hidden, getModifiedProps, HighchartsChartContext } from 'react-jsx-highcharts';

class Scrollbar extends Component {

  static propTypes = {
    getChart: PropTypes.func, // Provided by ChartProvider
    enabled: PropTypes.bool.isRequired
  };

  static defaultProps = {
    enabled: true
  };

  static contextType = HighchartsChartContext;

  componentDidMount () {
    const { children, ...rest } = this.props;
    this.updateScrollbar(rest);
  }

  componentDidUpdate (prevProps) {
    const modifiedProps = getModifiedProps(prevProps, this.props);
    if (modifiedProps !== false) {
      this.updateScrollbar(modifiedProps);
    }
  }

  componentWillUnmount () {
    attempt(this.updateScrollbar, { enabled: false });
  }

  updateScrollbar = config => {
    const chart = this.context;
    chart.update({
      scrollbar: config
    }, true);
  }

  render () {
    const { children } = this.props;
    if (!children) return null;

    return (
      <Hidden>{children}</Hidden>
    );
  }
}

export default Scrollbar;
