import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {translate3d} from './utils';

class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialPosition: {x: 0, y: 0}
        };
        this.setInitialPosition = this.setInitialPosition.bind(this);
    }

    setInitialPosition() {
        const card = ReactDOM.findDOMNode(this);
        const initialPosition = {
            x: Math.round((this.props.containerSize.x - card.offsetWidth) / 2),
            y: Math.round((this.props.containerSize.y - card.offsetHeight) / 2)
        };
        this.setState({initialPosition});
    }

    componentDidMount() {
        this.setInitialPosition();
        window.addEventListener('resize', this.setInitialPosition);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.setInitialPosition);
    }

    render() {
        const {initialPosition: {x, y}} = this.state;
        const {className = 'inactive'} = this.props;
        let style = {
            ...translate3d(x, y),
            zIndex: this.props.index,
            ...this.props.style
        };

        return (
            <div style={style} className={`card ${className}`}>
                <div style={{position: 'absolute', backgroundImage:
                    'url(' + this.props.imageUrl + ')', height: 250, width: 250}}></div>
                <div style={{position: 'absolute'}}><h1>{this.props.title}</h1></div>
                <div style={{backgroundColor: 'rgba(255,0,0,0.1)', height: '100%', width: '100%',
                    position: 'absolute'}}></div>
            </div>
        )
    }
}

export default Card
