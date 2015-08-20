/**
 * Module dependencies
 */

var translate = require('translate-component')
var scroll_parent = require('scrollparent')
var Engine = require('adjust-engine')
var now = require('right-now')
var body = document.body

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

function Adjust (attachment, target, options) {
  var adjustments = []
  var scrollables = []

  // tick-related
  var last_tick = null
  var elapsed = null
  var timeout = null

  // add the initial attachment
  add(attachment, target, options)

  // set up the event bindings
  window.addEventListener('touchmove', tick)
  window.addEventListener('scroll', tick)
  window.addEventListener('resize', tick)

  // styling
  attachment.style.position = 'relative'
  attachment.style.zIndex = 1000
  attachment.style.left = '0'
  attachment.style.top = '0'

  // tick
  tick()

  return function _Adjust (attachment, target, options) {
    if (!arguments.length) return unbind()
    add(attachment, target, options)
    position()
  }

  /**
   * Adjust an attachment relative to a target
   */

  function add (attachment, target, options) {
    adjustments.push([attachment, target, Engine(options)])
    var scrollable = scroll_parent(target)
    if (scrollable !== window) {
      scrollable.addEventListener('scroll', tick)
    }
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
    adjustments.map(position)
    elapsed = now() - last_tick
  }

  /**
   * Position the element
   *
   * @param {Array} adjustment
   */

  function position (adjustment) {
    var attachment = adjustment[0]
    var target = adjustment[1]
    var engine = adjustment[2]

    var attachment_position = attachment.getBoundingClientRect()
    var target_position = target.getBoundingClientRect()

    // calculate the updated position
    var position = engine(attachment_position, target_position, viewport())
    var rect = offset(attachment)

    // calculate the offsets
    var x = body.scrollLeft + position.left - rect.left
    var y = body.scrollTop + position.top - rect.top

    // translate the element
    translate(attachment, x, y)
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
    right: width,
    bottom: height
  }
}
