import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {translate3d} from './utils';

class SimpleCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialPosition: {x: 0, y: 0}
    };
    this.setInitialPosition = this.setInitialPosition.bind(this);
  }

  setInitialPosition() {
    // TODO: Refactor to not use ReactDOM
    // eslint-disable-next-line
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
      zIndex: this.props.zindex,
      ...this.props.style
    };

    return (
      <div style={style} className={`card ${className}`}>
        <div className="card-image" style={{backgroundImage: 'url(' + this.props.cardImageUrl + ')'}}></div>
        <div className="card-title">{this.props.title}</div>
        <div className="card-overlay-image" style={{backgroundImage: 'url(' + this.props.overlayImageUrl + ')',
          opacity: this.props.overlayImageOpacity}}></div>
        <div className="card-move-color" style={{backgroundColor: 'rgba(' + this.props.moveColor + ')'}}></div>
        <div className="card-text">{this.props.text}</div>
        <div className="card-children">{this.props.children}</div>
      </div>
    );
  }
}

SimpleCard.propTypes = {
  className: React.PropTypes.string,
  containerSize: React.PropTypes.object,
  cardImageUrl: React.PropTypes.string,
  overlayImageUrl: React.PropTypes.string,
  overlayImageOpacity: React.PropTypes.string,
  moveColor: React.PropTypes.string,
  style: React.PropTypes.object,
  text: React.PropTypes.string,
  title: React.PropTypes.string,
  zindex: React.PropTypes.number,
  children: React.PropTypes.array
};

export default SimpleCard;
