import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import CardDeck, { Card } from '../src/index';
import './style.css';

const data = [
    {
        id: '101',
        title: 'Alexandre',
        text: 'It was the best of times, it was the worst of times.',
        imageUrl: require('../static/desk-job_640.png')},
    {
        id: '102',
        title: 'Thomas',
        text: 'Two times nothing is still nothing.',
        imageUrl: require('../static/desk-job_640.png')},
    {
        id: '103',
        title: 'Lucien',
        text: 'It was Montgomery Burns who said it best: "Since the beginning of time man has yearned to destroy the sun." Bravo Mr. Burns for your courage.',
        imageUrl: require('../static/desk-job_640.png')}
];

const CustomAlertLeft = () => <span>Nop</span>;
const CustomAlertRight = () => <span>Ok</span>;

storiesOf('Tinder card', module).add('simple', () => (
    <div>
        <h1>react swipe card</h1>
        <CardDeck onEnd={action('end')}
                  className="carddeck"
                  maxOnMoveOpacity="0.5"
                  onRightColor="0,255,0"
                  onLeftColor="255,0,0"
                  onUpColor="100,100,100">
            {data.map(item =>
                <Card id={item.id}
                      title={item.title}
                      text={item.text}
                      imageUrl={item.imageUrl}
                      onSwipeLeft={action('swipe left')}
                      onSwipeRight={action('swipe right')}>
                </Card>
            )}
        </CardDeck>
    </div>
)).add('custom alert', () => (
    <div>
        <h1>react swipe card</h1>
        <CardDeck alertRight={<CustomAlertRight />}
                  alertLeft={<CustomAlertLeft />}
                  onEnd={action('end')}
                  className="carddeck"
                  maxOnMoveOpacity="0.5"
                  onRightColor="0,255,0"
                  onLeftColor="255,0,0"
                  onUpColor="100,100,100">
            {data.map(item =>
                <Card id={item.id}
                      title={item.title}
                      text={item.text}
                      imageUrl={item.imageUrl}>
                </Card>
            )}
        </CardDeck>
    </div>
));