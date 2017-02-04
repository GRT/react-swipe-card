import React, {Component} from 'react';
import Hammer from 'hammerjs';
import ReactDOM from 'react-dom';
import SimpleCard from './SimpleCard';
import {translate3d} from './utils';

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
            onRightColor: this.props.onRightColor + ',0',
            onLeftColor: this.props.onLeftColor + ',0'
        };
        this.resetPosition = this.resetPosition.bind(this);
        this.handlePan = this.handlePan.bind(this);
    }

    resetPosition() {
        const {x, y} = this.props.containerSize;
        const card = ReactDOM.findDOMNode(this);

        const initialPosition = {
            x: Math.round((x - card.offsetWidth) / 2),
            y: Math.round((y - card.offsetHeight) / 2)
        };

        this.setState({
            x: initialPosition.x,
            y: initialPosition.y,
            initialPosition: initialPosition,
            startPosition: {x: 0, y: 0},
            onRightColor: this.props.onRightColor + ',0',
            onLeftColor: this.props.onLeftColor + ',0'
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

        if (this.state.x >= -50) {
            let colorPieces = (this.state.onRightColor).split(',');
            colorPieces[3] = '1';
            let newColor = colorPieces.join(',');
            this.state.onRightColor = newColor;
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
                           onRightColor={this.state.onRightColor}
                           className={animation ? 'animate' : pristine ? 'inactive' : '' }/>;
    }
}

export default DraggableCard;
