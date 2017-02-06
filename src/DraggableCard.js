import React, {Component} from 'react';
import Hammer from 'hammerjs';
import ReactDOM from 'react-dom';
import SimpleCard from './SimpleCard';
import {translate3d} from './utils';

let SIDE_THRESHOLD_PERCENT = 0.75;
let TOP_THRESHOLD_PERCENT = 0.65;
let MOVE_NONE = 'movenone';
let MOVE_UP = 'moveup';
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
            rightColor: this.initColorString(props.onRightColor),
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
            resetColor = resetColor + ',0';
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

    getMovePercentage(threshold, delta) {
        // get percentage, rounded to 2 decimals and made positive value (abs)
        return Math.round(Math.abs(delta/threshold) * 100) / 100;
    }

    resetPosition() {
        const {x, y} = this.props.containerSize;
        const card = ReactDOM.findDOMNode(this);

        const initialPosition = {
            x: Math.round((x - card.offsetWidth) / 2),
            y: Math.round((y - card.offsetHeight) / 2)
        };

        let sideThresh = Math.round(card.clientWidth * SIDE_THRESHOLD_PERCENT);
        let topThresh = Math.round(card.clientHeight * TOP_THRESHOLD_PERCENT);

        this.setState({
            x: initialPosition.x,
            y: initialPosition.y,
            initialPosition: initialPosition,
            startPosition: {x: 0, y: 0},
            moveColor: '0,0,0,0',
            sideExitThreshold: sideThresh,
            topExitThreshold: topThresh
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

    panend(ev) {
        const screen = this.props.containerSize;
        const card = ReactDOM.findDOMNode(this);
        if (this.state.x < -50) {
            if (this.props.onSwipeLeft) {
                this.props.onSwipeLeft();
            }
            this.props.onOutScreenLeft(this.props.index);

        } else if ((this.state.x + (card.offsetWidth - 50)) > screen.x) {
            if (this.props.onSwipeRight) {
                this.props.onSwipeRight();
            }
            this.props.onOutScreenRight(this.props.index);

        } else {
            this.resetPosition();
            this.setState({animation: true});
        }
    }

    panmove(ev) {
        this.setState(this.calculatePosition(ev.deltaX, ev.deltaY));

        if (this.state.moveDirection === MOVE_RIGHT) {
            let opacity = this.getMovePercentage(this.state.sideExitThreshold, ev.deltaX);
            this.state.moveColor = this.updateOpacityValue(this.state.rightColor, opacity);

        } else if (this.state.moveDirection === MOVE_LEFT) {
            let opacity = this.getMovePercentage(this.state.sideExitThreshold, ev.deltaX);
            this.state.moveColor = this.updateOpacityValue(this.state.leftColor, opacity);
        }
    }

    pancancel(ev) {
        console.log(ev.type);
    }

    handlePan(ev) {
        ev.preventDefault();
        this[ev.type](ev);
        return false;
    }

    handleSwipe(ev) {
        console.log(ev.type);
    }

    calculatePosition(deltaX, deltaY) {

        if (deltaX < 0) {
            this.state.moveDirection = MOVE_LEFT;
        } else if (deltaX > 0) {
            this.state.moveDirection = MOVE_RIGHT;
        }

        const {initialPosition : {x, y}} = this.state;
        return {
            x: (x + deltaX),
            y: (y + deltaY)
        }
    }

    componentDidMount() {
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

export default DraggableCard;
