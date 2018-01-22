import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class Trans extends Component {
  componentDidMount() {
    this.update = () => this.forceUpdate();
    this.context.subscribe(this.update);
  }

  componentWillUnmount() {
    this.context.unsubscribe(this.update);
  }

  render() {
    const { i18nKey, data, number } = this.props;
    const t = this.context.getTranslateFunction();

    return t(i18nKey, data, number);
  }
}

Trans.propTypes = {
  i18nKey: PropTypes.string.isRequired,
  data: PropTypes.object,
  number: PropTypes.number,
};

Trans.contextTypes = {
  getTranslateFunction: PropTypes.func.isRequired,
  subscribe: PropTypes.func.isRequired,
  unsubscribe: PropTypes.func.isRequired,
};