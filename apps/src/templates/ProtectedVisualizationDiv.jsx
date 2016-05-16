'use strict';

import {connect} from 'react-redux';
import ProtectedStatefulDiv from './ProtectedStatefulDiv';

export const VISUALIZATION_DIV_ID = 'visualization';

export function isResponsiveFromState(state) {
  return !state.pageConstants.isEmbedView && !state.pageConstants.hideSource;
}

/**
 * Protected div with ID "visualization" that depends on Redux state to render
 * with the "responsive" class or not.
 */
const ProtectedVisualizationDiv = React.createClass({
  propTypes: {
    isResponsive: React.PropTypes.bool.isRequired
  },

  render() {
    return (
      <ProtectedStatefulDiv
          id={VISUALIZATION_DIV_ID}
          className={this.props.isResponsive ? 'responsive' : ''}
      >
        {this.props.children}
      </ProtectedStatefulDiv>
    );
  }
});
export default connect(state => ({
  isResponsive: isResponsiveFromState(state)
}))(ProtectedVisualizationDiv);
