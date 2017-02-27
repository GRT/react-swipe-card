import React, {Component, cloneElement} from 'react';
import ReactDOM from 'react-dom';

const UP = 'up';
const RIGHT = 'right';
const DOWN = 'down';
const LEFT = 'left';

const HORIZONTAL_THRESHOLD_PERCENT = 0.55;
const VERTICAL_THRESHOLD_PERCENT = 0.45;

class CardDeck extends Component {

  constructor(props) {
    super(props);


    let directions = (props.enabledDirections.replace(' ')).split(',');

    this.state = {
      index: 0,
      alertUpVisible: false,
      alertRightVisible: false,
      alertDownVisible: false,
      alertLeftVisible: false,
      containerSize: {x: 0, y: 0},
      upEnabled: directions.includes(UP),
      rightEnabled: directions.includes(RIGHT),
      downEnabled: directions.includes(DOWN),
      leftEnabled: directions.includes(LEFT)
    };
    this.removeCard = this.removeCard.bind(this);
    this.setSize = this.setSize.bind(this);
  }

  undoRemoveCard() {
    if(this.state.index > 0) {
      this.setState({
        index: this.state.index - 1
      });
      this.props.onUndo(true);
    }
  }

  removeCard(side, cardIndex) {
    const {children} = this.props;

    setTimeout(() => {
      if (side === UP) {
        this.setState({alertUpVisible: false});
      } else if (side === RIGHT) {
        this.setState({alertRightVisible: false});
      } else if (side === DOWN) {
        this.setState({alertDownVisible: false});
      } else if (side === LEFT) {
        this.setState({alertLeftVisible: false});
      }
    }, 750);

    if (children.length === (this.state.index + 1) && this.props.onEnd) {
      this.props.onEnd();
    }

    this.setState({
      index: this.state.index + 1,
      alertUpVisible: side === UP,
      alertRightVisible: side === RIGHT,
      alertDownVisible: side === DOWN,
      alertLeftVisible: side === LEFT
    });

    this.props.onSwipe(side, cardIndex);
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
    const {alertUpVisible, alertRightVisible, alertDownVisible, alertLeftVisible, index, containerSize} = this.state;
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
        maxOnMoveOpacity: this.props.maxOnMoveOpacity,
        horizontalThreshold: (this.props.horizontalThreshold) ?
          this.props.horizontalThreshold : HORIZONTAL_THRESHOLD_PERCENT,
        verticalThreshold: (this.props.verticalThreshold) ?
          this.props.verticalThreshold : VERTICAL_THRESHOLD_PERCENT,
        onUpColor: this.props.onUpColor,
        onRightColor: this.props.onRightColor,
        onDownColor: this.props.onDownColor,
        onLeftColor: this.props.onLeftColor,
        upEnabled: this.state.upEnabled,
        rightEnabled: this.state.rightEnabled,
        downEnabled: this.state.downEnabled,
        leftEnabled: this.state.leftEnabled,
        upOverlayImage: (this.props.upOverlayImage) ? this.props.upOverlayImage : '',
        upOverlayText: (this.props.upOverlayText) ? this.props.upOverlayText : '',
        rightOverlayImage: (this.props.rightOverlayImage) ? this.props.rightOverlayImage : '',
        rightOverlayText: (this.props.rightOverlayText) ? this.props.rightOverlayText : '',
        downOverlayImage: (this.props.downOverlayImage) ? this.props.downOverlayImage : '',
        downOverlayText: (this.props.downOverlayText) ? this.props.downOverlayText : '',
        leftOverlayImage: (this.props.leftOverlayImage) ? this.props.leftOverlayImage : '',
        leftOverlayText: (this.props.leftOverlayText) ? this.props.leftOverlayText : '',
        onOutScreenUp: (this.state.upEnabled) ? () => this.removeCard(UP, i) : null,
        onOutScreenRight: (this.state.rightEnabled) ? () => this.removeCard(RIGHT, i) : null,
        onOutScreenDown: (this.state.downEnabled) ? () => this.removeCard(DOWN, i) : null,
        onOutScreenLeft: (this.state.leftEnabled) ? () => this.removeCard(LEFT, i): null,
        active: index === i
      };

      return [cloneElement(c, props), ...memo];
    }, []);

    return (
      <div className={className}>
        <div className={`${alertUpVisible ? 'alert-visible' : ''} alert-up alert`}>
          {this.props.alertUp}
        </div>
        <div className={`${alertRightVisible ? 'alert-visible' : ''} alert-right alert`}>
          {this.props.alertRight}
        </div>
        <div className={`${alertDownVisible ? 'alert-visible' : ''} alert-down alert`}>
          {this.props.alertDown}
        </div>
        <div className={`${alertLeftVisible ? 'alert-visible' : ''} alert-left alert`}>
          {this.props.alertLeft}
        </div>
        <div id='cards'>
          {_cards}
        </div>
      </div>
    );
  }
}

CardDeck.propTypes = {
  alertUp: React.PropTypes.node,
  alertRight: React.PropTypes.node,
  alertDown: React.PropTypes.node,
  alertLeft: React.PropTypes.node,

  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ]).isRequired,

  className: React.PropTypes.string,
  enabledDirections: React.PropTypes.string,
  maxOnMoveOpacity: React.PropTypes.string,
  onDownColor: React.PropTypes.string,
  onLeftColor: React.PropTypes.string,
  onRightColor: React.PropTypes.string,
  onUpColor: React.PropTypes.string,

  horizontalThreshold: React.PropTypes.string,
  verticalThreshold: React.PropTypes.string,

  upOverlayImage: React.PropTypes.string,
  rightOverlayImage: React.PropTypes.string,
  downOverlayImage: React.PropTypes.string,
  leftOverlayImage: React.PropTypes.string,
  upOverlayText: React.PropTypes.string,
  rightOverlayText: React.PropTypes.string,
  downOverlayText: React.PropTypes.string,
  leftOverlayText: React.PropTypes.string,

  onEnd: React.PropTypes.func,
  onSwipe: React.PropTypes.func,
  onUndo: React.PropTypes.func,
};

export default CardDeck;
