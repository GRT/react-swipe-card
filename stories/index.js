import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import CardDeck, { Card } from '../src/index';
import './style.css';

const data = [
    {title: 'Alexandre', imageUrl: require('../static/desk-job_640.png')},
    {title: 'Thomas', imageUrl: require('../static/desk-job_640.png')},
    {title: 'Lucien', imageUrl: require('../static/desk-job_640.png')}
];

const CustomAlertLeft = () => <span>Nop</span>;
const CustomAlertRight = () => <span>Ok</span>;

storiesOf('Tinder card', module).add('simple', () => (
    <div>
        <h1>react swipe card</h1>
        <CardDeck onEnd={action('end')}
                  className='carddeck'>
            {data.map(item =>
                <Card title={item.title}
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
                  className='carddeck'>
            {data.map(item =>
                <Card title={item.title}
                      imageUrl={item.imageUrl}></Card>
            )}
        </CardDeck>
    </div>
));