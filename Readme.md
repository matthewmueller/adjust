
# adjust

  Light-weight version of [HubSpot/tether](https://github.com/HubSpot/tether).

## Features

Supports all the [main features of tether](http://github.hubspot.com/tether/overview/why_you_should_use_tether/):

- Optimized GPU-accelerated repositioning for 60fps scrolling
- Reliable positioning on any possible corner, edge or point in between.
- Support for repositioning or pinning the element when it would be offscreen
- Designed to be embeddable in other libraries

It does differ from tether in a few key ways:

- File size: Adjust is 16kb unminified, tether is 50kb unminified. The Adjust codebase is also modularized allowing you to reuse modules throughout the codebase and reduce the footprint added even further.

- Uses relative positioning: Unlike Tether, Adjust does not move any DOM nodes. Moving DOM nodes often leads to unintended consequences. I find that it's much easier to modify the DOM structure manually than have a library try and pick a structure for you.

- Less Features: Tether has some additional options around constraints and pinning.
It also does more to try and optimize location placement. Some of these things may get added as needed, but the goal is to build higher-level tooltips and dropdowns, without being concerned with the added filesize.

## Usage

```js
var tooltip = document.querySelector('.tooltip')
var target = document.querySelector('.target')
var adjust = require('adjust')()

adjust(tooltip, target, {
  attachment: 'bottom middle'
  target: 'top middle',
  offset: {
    top: 10
  }
})
```

## Installation

```
npm install adjust
```

## License

MIT
