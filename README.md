# react-swipe-card
Tinder style swipe cards

[![npm](https://img.shields.io/npm/v/react-swipe-card.svg?style=flat-square)](https://www.npmjs.com/package/react-swipe-card)

 - [Usage](#usage)
 - [Demo](#demo)
 - [Code](#code)
 - [Components](#components)
 - [License](#License)

## Usage

Install

```bash
 $ npm install react-swipe-card -save
```


## Demo

[Demo](https://alexandre-garrec.github.io/react-swipe-card/)

## Code

```javascript
import Cards, { Card } from 'react-swipe-card'


const data = ['Alexandre', 'Thomas', 'Lucien']

const Wrapper = () => {
  return (
	  <Cards onEnd={action('end')} className='master-root'>
        {data.map(item => 
          <Card 
            onSwipeLeft={action('swipe left')} 
            onSwipeRight={action('swipe right')}>
            <h2>{item}</h2>
          </Card>
        )}
      </Cards>
  )
}
```

## Components

Cards
---
Props:

 - className: string
 - onEnd: function
 - alertRight: component
 - alertLeft: component

Card
---
Props:

 - onSwipeLeft: function
 - onSwipeRight: function


## Artwork credits
Checkmark, Plus and Questionmark icons by 
Anton Saputro (http://www.antonps.com) from http://flaticon.com

## License

[MIT License](https://opensource.org/licenses/MIT)
