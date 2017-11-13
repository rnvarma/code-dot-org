/** @file Pop-over menu component.  Combine with react-portal to use. */
import React, {Component, PropTypes, Children} from 'react';
import Radium from 'radium';
import Portal from 'react-portal';
import msg from '@cdo/locale';
import color from '../../util/color';

const TAIL_WIDTH = 14;
const TAIL_HEIGHT = 12;
const BACKGROUND_COLOR = color.white;
const BORDER_COLOR = color.light_gray;
const STANDARD_PADDING = 20;

const menuStyle = {
  position: 'absolute',
  zIndex: 20,
  border: `1px solid ${BORDER_COLOR}`,
  backgroundColor: BACKGROUND_COLOR,
  borderRadius: 2,
  boxShadow: "3px 3px 3px gray",
  marginTop: TAIL_HEIGHT,
  textAlign: 'left',
};
const tailBorderStyle = {
  position: 'absolute',
  bottom: '100%',
  left: STANDARD_PADDING,
  marginLeft: -TAIL_WIDTH / 2,
  borderTopWidth: 0,
  borderBottomWidth: TAIL_HEIGHT,
  borderLeftWidth: TAIL_WIDTH / 2,
  borderRightWidth: TAIL_WIDTH / 2,
  borderStyle: 'solid',
  borderColor: `transparent transparent ${BORDER_COLOR} transparent`,
};
const tailFillStyle = {
  ...tailBorderStyle,
  bottom: 'calc(100% - 2px)',
  borderColor: `transparent transparent ${BACKGROUND_COLOR} transparent`,
};

export default class PopUpMenu extends Component {
  static propTypes = {
    targetPoint: PropTypes.shape({
      top: PropTypes.number.isRequired,
      left: PropTypes.number.isRequired,
    }).isRequired,
    children: PropTypes.any,
    className: PropTypes.string,
    isOpen: PropTypes.bool,
    beforeClose: PropTypes.func,
  };

  render() {
    return (
      <Portal
        closeOnEsc
        closeOnOutsideClick
        isOpened={this.props.isOpen}
        beforeClose={this.props.beforeClose}
      >
        <MenuBubble
          targetPoint={this.props.targetPoint}
          className={this.props.className}
          children={this.props.children}
        />
      </Portal>
    );
  }
}

class MenuBubbleUnwrapped extends Component {
  static propTypes = {
    targetPoint: PropTypes.shape({
      top: PropTypes.number.isRequired,
      left: PropTypes.number.isRequired,
    }).isRequired,
    children: PropTypes.any,
    className: PropTypes.string,
  };

  renderMenuItems() {
    let {children} = this.props;
    if (Array.isArray(children)) {
      children = children.filter(x => x);
    }
    const childCount = Children.count(children);
    if (childCount === 0) {
      return <div><em>{msg.noMenuItemsAvailable()}</em></div>;
    }
    return (
      <div>
        {Children.map(children, (child, index) => {
          if (!child) {
            return child;
          }

          return React.cloneElement(child, {
            first: index === 0,
            last: index === childCount - 1,
          });
        })}
      </div>
    );
  }

  render() {
    const {targetPoint, className} = this.props;
    const style = {
      ...menuStyle,
      ...targetPoint,
      marginLeft: -STANDARD_PADDING,
    };

    return (
      <div style={style} className={className}>
        {this.renderMenuItems()}
        {/* These elements are used to draw the 'tail' with CSS */}
        <span style={tailBorderStyle}/>
        <span style={tailFillStyle}/>
      </div>
    );
  }
}
export const MenuBubble = Radium(MenuBubbleUnwrapped);

class Item extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array]).isRequired,
    onClick: PropTypes.func,
    href: PropTypes.string,
    first: PropTypes.bool,
    last: PropTypes.bool,
    color: PropTypes.string,
  };

  render() {
    const {first, last, onClick, children, href} = this.props;
    if (!href && !onClick) {
      throw new Error('Expect at least one of href/onClick');
    }

    const paddingStyle = {
      paddingTop: first ? STANDARD_PADDING : STANDARD_PADDING / 2,
      paddingBottom: last ? STANDARD_PADDING : STANDARD_PADDING / 2,
      paddingLeft: STANDARD_PADDING,
      paddingRight: STANDARD_PADDING,
      cursor: 'pointer',
      ':hover': {
        backgroundColor: color.lightest_gray,
      }
    };

    const textStyle = {
      color: this.props.color? this.props.color : color.dark_charcoal,
      textDecoration: 'none', // Remove underline from anchor tags
    };

    const Tag = href ? 'a' : 'div';
    return (
      <div
        style={paddingStyle}
      >
        <Tag
          className="pop-up-menu-item"
          href={href}
          style={textStyle}
          onClick={onClick}
        >
          {children}
        </Tag>
      </div>
    );
  }
}

PopUpMenu.Item = Radium(Item);
