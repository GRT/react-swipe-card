import React, {Component, cloneElement} from 'react';
import ReactDOM from 'react-dom';

class CardDeck extends Component {

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      alertLeft: false,
      alertRight: false,
      containerSize: {x: 0, y: 0}
    };
    this.removeCard = this.removeCard.bind(this);
    this.setSize = this.setSize.bind(this);
  }

  removeCard(side) {
    const {children} = this.props;

    setTimeout(() => {
      if (side === 'left') {
        this.setState({alertLeft: false});
      } else if (side === 'right') {
        this.setState({alertRight: false});
      }
    }, 300);

    if (children.length === (this.state.index + 1) && this.props.onEnd) {
      this.props.onEnd();
    }

    this.setState({
      index: this.state.index + 1,
      alertLeft: side === 'left',
      alertRight: side === 'right',
      alertUp: side === 'up',
      alertDown: side === 'down'
    });
  }

  componentDidMount() {
    this.setSize();
    window.addEventListener('resize', this.setSize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setSize);
  }

  setSize() {
    // TODO: Refactor to not use ReactDOM
    // eslint-disable-next-line
    const container = ReactDOM.findDOMNode(this);
    const containerSize = {
      x: container.offsetWidth,
      y: container.offsetHeight
    };
    this.setState({containerSize});
  }

  render() {
    const {alertLeft, alertRight, index, containerSize} = this.state;
    const {children, className} = this.props;

    if (!containerSize.x || !containerSize.y) {
      return <div className={className}/>;
    }

    const _cards = children.reduce((memo, c, i) => {
      if (index > i) {
        return memo;
      }

      const props = {
        containerSize,
        zindex: children.length - index,
        id: this.props.id,
        maxOnMoveOpacity: this.props.maxOnMoveOpacity,
        onRightColor: this.props.onRightColor,
        onLeftColor: this.props.onLeftColor,
        onUpColor: this.props.onUpColor,
        onDownColor: this.props.onDownColor,
        onOutScreenLeft: () => this.removeCard('left', i),
        onOutScreenRight: () => this.removeCard('right', i),
        onOutScreenUp: () => this.removeCard('up', i),
        onOutScreenDown: () => this.removeCard('down', i),
        active: index === i
      };

      return [cloneElement(c, props), ...memo];
    }, []);

    return (
      <div className={className}>
        <div className={`${alertLeft ? 'alert-visible' : ''} alert-left alert`}>
          {this.props.alertLeft}
        </div>
        <div className={`${alertRight ? 'alert-visible' : ''} alert-right alert`}>
          {this.props.alertRight}
        </div>
        <div id='cards'>
          {_cards}
        </div>
      </div>
    );
  }
}

CardDeck.propTypes = {
  alertLeft: React.PropTypes.node,
  alertRight: React.PropTypes.node,
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ]).isRequired,
  className: React.PropTypes.string,
  id: React.PropTypes.string,
  maxOnMoveOpacity: React.PropTypes.string,
  onDownColor: React.PropTypes.string,
  onEnd: React.PropTypes.func,
  onLeftColor: React.PropTypes.string,
  onRightColor: React.PropTypes.string,
  onUpColor: React.PropTypes.string
};

export default CardDeck;