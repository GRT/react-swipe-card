import React, {Component} from 'react';
import Hammer from 'hammerjs';
import ReactDOM from 'react-dom';
import SimpleCard from './SimpleCard';
import {translate3d} from './utils';

const MOVE_NONE = 'movenone';
const MOVE_UP = 'moveup';
const MOVE_DOWN = 'movedown';
const MOVE_LEFT = 'moveleft';
const MOVE_RIGHT = 'moveright';

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
      upColor: this.initColorString(props.onUpColor),
      rightColor: this.initColorString(props.onRightColor),
      downColor: this.initColorString(props.onDownColor),
      leftColor: this.initColorString(props.onLeftColor),
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

  getMoveOpacity(threshold, delta, maxOpacity) {
    // get percentage made positive value (abs)
    let percent = Math.abs(delta / threshold);
    let opacity = (percent).toFixed(2);
    opacity = (opacity > maxOpacity) ? maxOpacity : opacity;
    // console.log('OPACITY: ' + opacity);
    return opacity.toString();
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

    let horizThresh = Math.round(card.clientWidth * this.props.horizontalThreshold);
    let vertThresh = Math.round(card.clientHeight * this.props.verticalThreshold);

    this.setState({
      x: initialPosition.x,
      y: initialPosition.y,
      initialPosition: initialPosition,
      startPosition: {x: 0, y: 0},
      moveColor: '0,0,0,0',
      horizontalExitThreshold: horizThresh,
      verticalExitThreshold: vertThresh,
      overlayImageUrl: '',
      overlayOpacity: '0',
      overlayText: ''
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
    if (this.state.moveDirection === MOVE_UP &&
      this.props.upEnabled &&
      Math.abs(this.state.y) > this.state.verticalExitThreshold) {
      this.props.onOutScreenUp();

    } else if (this.state.moveDirection === MOVE_RIGHT &&
      this.props.rightEnabled &&
      Math.abs(this.state.x) > this.state.horizontalExitThreshold) {
      this.props.onOutScreenRight();

    } else if (this.state.moveDirection === MOVE_DOWN &&
      this.props.downEnabled &&
      Math.abs(this.state.y) > this.state.verticalExitThreshold) {
      this.props.onOutScreenDown();

    } else if (this.state.moveDirection === MOVE_LEFT &&
      this.props.leftEnabled &&
      Math.abs(this.state.x) > this.state.horizontalExitThreshold) {
      this.props.onOutScreenLeft();

    } else {
      this.resetPosition();
      this.setState({animation: true});
    }
  }

  panmove(ev) {
    this.setState(this.calculatePosition(ev.deltaX, ev.deltaY));

    if (this.state.moveDirection === MOVE_RIGHT) {
      let opacity = this.getMoveOpacity(this.state.horizontalExitThreshold, ev.deltaX,
        this.state.maxMoveOpacity);
      let overlayOpacity = this.getMoveOpacity(this.state.horizontalExitThreshold, ev.deltaX, 1.0);
      this.setState({
        moveColor: this.updateOpacityValue(this.state.rightColor, opacity),
        overlayImageUrl: this.props.rightOverlayImage,
        overlayText: this.props.rightOverlayText,
        overlayOpacity: overlayOpacity
      });

    } else if (this.state.moveDirection === MOVE_LEFT) {
      let opacity = this.getMoveOpacity(this.state.horizontalExitThreshold, ev.deltaX,
        this.state.maxMoveOpacity);
      let overlayOpacity = this.getMoveOpacity(this.state.horizontalExitThreshold, ev.deltaX, 1.0);
      this.setState({
        moveColor: this.updateOpacityValue(this.state.leftColor, opacity),
        overlayImageUrl: this.props.leftOverlayImage,
        overlayText: this.props.leftOverlayText,
        overlayOpacity: overlayOpacity
      });

    } else if (this.state.moveDirection === MOVE_UP) {
      let opacity = this.getMoveOpacity(this.state.verticalExitThreshold, ev.deltaY,
        this.state.maxMoveOpacity);
      let overlayOpacity = this.getMoveOpacity(this.state.verticalExitThreshold, ev.deltaY, 1.0);
      this.setState({moveColor: this.updateOpacityValue(this.state.upColor, opacity),
        overlayImageUrl: this.props.upOverlayImage,
        overlayText: this.props.upOverlayText,
        overlayOpacity: overlayOpacity,

      });

    } else if (this.state.moveDirection === MOVE_DOWN) {
      let opacity = this.getMoveOpacity(this.state.verticalExitThreshold, ev.deltaY,
        this.state.maxMoveOpacity);
      let overlayOpacity = this.getMoveOpacity(this.state.verticalExitThreshold, ev.deltaY, 1.0);
      this.setState({moveColor: this.updateOpacityValue(this.state.downColor, opacity),
        overlayImageUrl: this.props.downOverlayImage,
        overlayText: this.props.downOverlayText,
        overlayOpacity: overlayOpacity
      });
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
                       overlayImageUrl={this.state.overlayImageUrl}
                       overlayText={this.state.overlayText}
                       overlayOpacity={this.state.overlayOpacity}
                       className={animation ? 'animate' : pristine ? 'inactive' : '' }/>;
  }
}

DraggableCard.propTypes = {
  containerSize: React.PropTypes.object,
  maxOnMoveOpacity: React.PropTypes.string,

  upEnabled: React.PropTypes.bool,
  rightEnabled: React.PropTypes.bool,
  downEnabled: React.PropTypes.bool,
  leftEnabled: React.PropTypes.bool,

  onDownColor: React.PropTypes.string,
  onLeftColor: React.PropTypes.string,
  onRightColor: React.PropTypes.string,
  onUpColor: React.PropTypes.string,

  onOutScreenDown: React.PropTypes.func,
  onOutScreenLeft: React.PropTypes.func,
  onOutScreenRight: React.PropTypes.func,
  onOutScreenUp: React.PropTypes.func,

  horizontalThreshold: React.PropTypes.string,
  verticalThreshold: React.PropTypes.string,

  upOverlayImage: React.PropTypes.string,
  upOverlayText: React.PropTypes.string,
  rightOverlayImage: React.PropTypes.string,
  rightOverlayText: React.PropTypes.string,
  downOverlayImage: React.PropTypes.string,
  downOverlayText: React.PropTypes.string,
  leftOverlayImage: React.PropTypes.string,
  leftOverlayText: React.PropTypes.string
};

export default DraggableCard;
