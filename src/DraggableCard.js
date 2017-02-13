import React, {Component} from 'react';
import Hammer from 'hammerjs';
import ReactDOM from 'react-dom';
import SimpleCard from './SimpleCard';
import {translate3d} from './utils';

let HORIZONTAL_THRESHOLD_PERCENT = 0.75;
let VERTICAL_THRESHOLD_PERCENT = 0.75;
let MOVE_NONE = 'movenone';
let MOVE_UP = 'moveup';
let MOVE_DOWN = 'movedown';
let MOVE_LEFT = 'moveleft';
let MOVE_RIGHT = 'moveright';

class DraggableCard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      x: 0,
      y: 0,
      initialPosition: {x: 0, y: 0},
      startPosition: {x: 0, y: 0},
      animation: null,
      pristine: true,
      moveDirection: MOVE_NONE,
      maxMoveOpacity: (props.maxOnMoveOpacity <= 1.0) ? props.maxOnMoveOpacity : 1.0,
      rightColor: this.initColorString(props.onRightColor),
      leftColor: this.initColorString(props.onLeftColor),
      upColor: this.initColorString(props.onUpColor),
      downColor: this.initColorString(props.onDownColor),
      moveColor: '0,0,0,0'
    };
    this.resetPosition = this.resetPosition.bind(this);
    this.handlePan = this.handlePan.bind(this);
  }

  initColorString(colorString) {

    let resetColor = null;

    if (colorString) {
      // Remove extra spaces
      resetColor = colorString.replace(' ');
      resetColor += ',0';
    }

    return resetColor;
  }

  updateOpacityValue(colorString, opacity) {
    let newColor = null;

    if (colorString) {
      let colorPieces = (colorString).split(',');
      colorPieces[3] = opacity;
      newColor = colorPieces.join(',');
    }

    return newColor;
  }

  getMoveOpacity(threshold, delta) {
    // get percentage made positive value (abs)
    let percent = Math.abs(delta / threshold);
    let opacity = (percent).toFixed(2);
    opacity = (opacity > this.state.maxMoveOpacity) ? this.state.maxMoveOpacity : opacity;
    // console.log('OPACITY: ' + opacity);
    return opacity;
  }

  resetPosition() {
    const {x, y} = this.props.containerSize;

    // TODO: Refactor to not use ReactDOM
    // eslint-disable-next-line
    const card = ReactDOM.findDOMNode(this);

    const initialPosition = {
      x: Math.round((x - card.offsetWidth) / 2),
      y: Math.round((y - card.offsetHeight) / 2)
    };

    let horizThresh = Math.round(card.clientWidth * HORIZONTAL_THRESHOLD_PERCENT);
    let vertThresh = Math.round(card.clientHeight * VERTICAL_THRESHOLD_PERCENT);

    this.setState({
      x: initialPosition.x,
      y: initialPosition.y,
      initialPosition: initialPosition,
      startPosition: {x: 0, y: 0},
      moveColor: '0,0,0,0',
      horizontalExitThreshold: horizThresh,
      verticalExitThreshold: vertThresh
    });
  }

  panstart() {
    const {x, y} = this.state;
    this.setState({
      animation: false,
      startPosition: {x, y},
      pristine: false
    });
  }

  panend() {
    if (this.state.moveDirection === MOVE_LEFT &&
      Math.abs(this.state.x) > this.state.horizontalExitThreshold) {
      if (this.props.onSwipeLeft) {
        this.props.onSwipeLeft();
      }
      this.props.onOutScreenLeft();

    } else if (this.state.moveDirection === MOVE_RIGHT &&
      Math.abs(this.state.x) > this.state.horizontalExitThreshold) {
      if (this.props.onSwipeRight) {
        this.props.onSwipeRight();
      }
      this.props.onOutScreenRight();

    } else if (this.state.moveDirection === MOVE_UP &&
      Math.abs(this.state.y) > this.state.verticalExitThreshold) {
      if (this.props.onSwipeUp) {
        this.props.onSwipeUp();
      }
      this.props.onOutScreenUp();

    } else if (this.state.moveDirection === MOVE_DOWN &&
      Math.abs(this.state.y) > this.state.verticalExitThreshold) {
      if (this.props.onSwipeDown) {
        this.props.onSwipeDown();
      }
      this.props.onOutScreenDown();

    } else {
      this.resetPosition();
      this.setState({animation: true});
    }
  }

  panmove(ev) {
    this.setState(this.calculatePosition(ev.deltaX, ev.deltaY));

    if (this.state.moveDirection === MOVE_RIGHT) {
      let opacity = this.getMoveOpacity(this.state.horizontalExitThreshold, ev.deltaX);
      this.setState({moveColor: this.updateOpacityValue(this.state.rightColor, opacity)});

    } else if (this.state.moveDirection === MOVE_LEFT) {
      let opacity = this.getMoveOpacity(this.state.horizontalExitThreshold, ev.deltaX);
      this.setState({moveColor: this.updateOpacityValue(this.state.leftColor, opacity)});

    } else if (this.state.moveDirection === MOVE_UP) {
      let opacity = this.getMoveOpacity(this.state.verticalExitThreshold, ev.deltaY);
      this.setState({moveColor: this.updateOpacityValue(this.state.upColor, opacity)});

    } else if (this.state.moveDirection === MOVE_DOWN) {
      let opacity = this.getMoveOpacity(this.state.verticalExitThreshold, ev.deltaY);
      this.setState({moveColor: this.updateOpacityValue(this.state.downColor, opacity)});
    }
  }

  pancancel(ev) {
    // TODO: Add logging
    // eslint-disable-next-line
    console.log(ev.type);
  }

  handlePan(ev) {
    ev.preventDefault();
    this[ev.type](ev);
    return false;
  }

  handleSwipe(ev) {
    // TODO: Add logging
    // eslint-disable-next-line
    console.log(ev.type);
  }

  calculatePosition(deltaX, deltaY) {

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // We're moving more left or right than up or down
      if (deltaX < 0) {
        this.setState({moveDirection: MOVE_LEFT});
      } else if (deltaX > 0) {
        this.setState({moveDirection: MOVE_RIGHT});
      }

    } else {
      // We're moving more up or down than left or right
      if (deltaY < 0) {
        this.setState({moveDirection: MOVE_UP});
      } else if (deltaY > 0) {
        this.setState({moveDirection: MOVE_DOWN});
      }
    }

    // console.log('MOVING: ' + this.state.moveDirection);

    const {initialPosition : {x, y}} = this.state;
    return {
      x: (x + deltaX),
      y: (y + deltaY)
    };
  }

  componentDidMount() {
    // eslint-disable-next-line
    this.hammer = new Hammer.Manager(ReactDOM.findDOMNode(this));
    this.hammer.add(new Hammer.Pan({threshold: 2}));

    this.hammer.on('panstart panend pancancel panmove', this.handlePan);
    this.hammer.on('swipestart swipeend swipecancel swipemove', this.handleSwipe);

    this.resetPosition();
    window.addEventListener('resize', this.resetPosition);
  }

  componentWillUnmount() {
    if (this.hammer) {
      this.hammer.stop();
      this.hammer.destroy();
      this.hammer = null;
    }

    window.removeEventListener('resize', this.resetPosition);
  }

  render() {
    const {x, y, animation, pristine} = this.state;
    const style = translate3d(x, y);
    return <SimpleCard {...this.props}
                       style={style}
                       moveColor={this.state.moveColor}
                       className={animation ? 'animate' : pristine ? 'inactive' : '' }/>;
  }
}

DraggableCard.propTypes = {
  containerSize: React.PropTypes.object,
  maxOnMoveOpacity: React.PropTypes.string,
  onDownColor: React.PropTypes.string,
  onLeftColor: React.PropTypes.string,
  onRightColor: React.PropTypes.string,
  onUpColor: React.PropTypes.string,

  onSwipeDown: React.PropTypes.func,
  onSwipeLeft: React.PropTypes.func,
  onSwipeRight: React.PropTypes.func,
  onSwipeUp: React.PropTypes.func,

  onOutScreenDown: React.PropTypes.func,
  onOutScreenLeft: React.PropTypes.func,
  onOutScreenRight: React.PropTypes.func,
  onOutScreenUp: React.PropTypes.func,
};

export default DraggableCard;
