/**
 * Module dependencies
 */

var translate = require('translate-component')
var scroll_parent = require('scrollparent')
var Engine = require('adjust-engine')
var now = require('right-now')
var body = document.body

/**
 * Get the scrollbar size
 */

var scrollbars = get_scrollbar_size()

/**
 * Export `Adjust`
 */

module.exports = Adjust

/**
 * Initialize `Adjust`
 *
 * @param {Element} attachment
 * @param {Element} target
 * @param {Object} options
 */

function Adjust () {
  var adjustments = []
  var scrollables = []
  var cache = []

  // tick-related
  var last_tick = null
  var elapsed = null
  var timeout = null

  // set up the event bindings
  window.addEventListener('touchmove', tick)
  window.addEventListener('scroll', tick)
  window.addEventListener('resize', tick)

  // optimize the remaining adjustments
  return function adjust (attachment, target, options) {
    switch (arguments.length) {
      case 0: return position()
      case 1: return attachment !== null ? position(attachment) : unbind()
      default: return add(attachment, target, options) && position(attachment)
    }
  }

  /**
   * Adjust an attachment relative to a target
   */

  function add (attachment, target, options) {
    var adjustment = [attachment, target, Engine(options)];
    adjustments.push(adjustment)

    // styling
    attachment.style.position = 'absolute'
    attachment.style.zIndex = 1000
    attachment.style.left = '0'
    attachment.style.top = '0'

    // initialize the cache
    cache.push([0, 0]);

    // listen for scroll events on a scrollable
    // parent, if it's not the window
    var scrollable = scroll_parent(target)
    if (scrollable !== window) {
      scrollable.addEventListener('scroll', tick)
    }

    return adjustment;
  }

  /**
   * Manage the repositions
   *
   * Based off of: https://github.com/HubSpot/tether/blob/99173e/src/js/tether.js#L52-L85
   */

  function tick () {
    // We voluntarily throttle ourselves if we can't manage 60fps
    if (elapsed > 16) {
      elapsed = Math.min(elapsed - 16, 250)

      // Just in case this is the last event, remember to position just once more
      timeout = setTimeout(tick, 250)
      return
    }

    // Some browsers call events a little too frequently, refuse to run more than is reasonable
    if (last_tick && (now() - last_tick) < 10) {
      return
    }

    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }

    last_tick = now()
    position()
    elapsed = now() - last_tick
  }

  /**
   * Position the element
   *
   * @param {Element} attachment
   */

  function position (attachment) {
    adjustments.forEach(function(adjustment, i) {
      // calculate one or all
      if (attachment && attachment != adjustment[0]) return;

      // calculate the offsets
      var offset = calculate(adjustment, i)

      // only translate if the offset changed
      if (offset) {
        translate(adjustment[0], Math.round(offset[0]), Math.round(offset[1]))
        adjustment[0].setAttribute('orientation', offset[2])
      }
    });
  }

  /**
   * Run the calculations
   *
   * @param {Array} adjustment
   * @param {Number} i
   * @return {Object}
   */

  function calculate (adjustment, i) {
    var attachment = adjustment[0]
    var target = adjustment[1]
    var engine = adjustment[2]

    var attachment_position = rect(attachment)
    var target_position = rect(target)

    // calculate the updated position
    var position = engine(attachment_position, target_position, viewport())
    var parent = scroll_parent(attachment)
    var off = offset(attachment)

    var scroll_left = parent.scrollLeft || 0
    var scroll_top = parent.scrollTop || 0

    // calculate the offsets
    var x = scroll_left + position.left - off.left
    var y = scroll_top + position.top - off.top

    // check to see if the position has even changed
    if (cache[i][0] == x && cache[i][1] == y) {
      return false;
    } else {
      cache[i][0] = x
      cache[i][1] = y
      return [x, y, position.orientation]
    }
  }

  /**
   * Unbind all event listeners
   */

  function unbind () {
    window.removeEventListener('touchmove', tick)
    window.removeEventListener('scroll', tick)
    window.removeEventListener('resize', tick)

    // unbind from scrollables
    scrollables.map(function (scrollable) {
      scrollable.removeEventListener('resize', tick)
    })
  }
}

/**
 * Properly get the bounding box
 *
 * @param {Element} el
 * @return {Object}
 */

function rect (el) {
  var box = el.getBoundingClientRect()
  var scrollTop = window.scrollY
  var scrollLeft = window.scrollX

  return {
    top: box.top + scrollTop,
    right: box.right + scrollLeft,
    left: box.left + scrollLeft,
    bottom: box.bottom + scrollTop,
    width: box.width,
    height: box.height
  }
}

/**
 * Get the offset relative to a position
 * setting parent.
 *
 * @param {Element} el
 * @return {Object} offset
 */

function offset (el) {
  var x = el.offsetLeft
  var y = el.offsetTop

  el = el.offsetParent
  while (el) {
    x += el.offsetLeft + el.clientLeft
    y += el.offsetTop + el.clientTop
    el = el.offsetParent
  }

  return {
    left: x,
    top: y
  }
}

/**
 * Get the viewport positions
 *
 * @return {Object}
 */

function viewport () {
  var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)

  return {
    top: 0,
    left: 0,
    right: width - scrollbars[0],
    bottom: height - scrollbars[1]
  }
}

/**
 * Get the scroll bar size
 *
 * @return {Array}
 */

function get_scrollbar_size () {
   var inner = document.createElement('p')
   inner.style.width = '100%'
   inner.style.height = '100%'

   var outer = document.createElement('div')
   outer.style.position = 'absolute'
   outer.style.top = '0px'
   outer.style.left = '0px'
   outer.style.visibility = 'hidden'
   outer.style.width = '100px'
   outer.style.height = '100px'
   outer.style.overflow = 'hidden'
   outer.appendChild(inner)
   document.body.appendChild(outer)

   var w1 = inner.offsetWidth
   var h1 = inner.offsetHeight
   outer.style.overflow = 'scroll'
   var w2 = inner.offsetWidth
   var h2 = inner.offsetHeight
   if (w1 == w2) w2 = outer.clientWidth
   if (h1 == h2) h2 = outer.clientHeight
   document.body.removeChild(outer)

   return [(w1 - w2), (h1 - h2)]
};
