/**
 * Module Dependencies
 */

var domify = require('domify')
var Adjust = require('..')
var page = require('page')

page('/', function () {
  var wrapper = domify('<div class="wrapper"><div class="parent"><div class="child"></div></div></div>')
  var parent = wrapper.querySelector('.parent')
  var child = parent.firstChild
  document.body.appendChild(wrapper)
  document.body.className = 'index'

  Adjust(child, parent)
})

page('/scrolling', function () {
  var wrapper = domify('<div class="wrapper"><div class="parent"><div class="child"></div></div></div>')
  var parent = wrapper.querySelector('.parent')
  var child = parent.firstChild
  document.body.appendChild(wrapper)
  document.body.className = 'scrolling'

  Adjust(child, parent)
})

page('/flip', function () {
  var wrapper = domify('<div class="wrapper"><div class="parent"><div class="child"></div></div></div>')
  var parent = wrapper.querySelector('.parent')
  var child = wrapper.querySelector('.child')
  document.body.appendChild(wrapper)
  document.body.className = 'flip'

  Adjust(child, parent, {
    attachment: 'left top',
    target: 'right bottom'
  })
})

page('/tooltip', function () {
  var wrapper = domify('<div class="wrapper"><ul class="parent"><li>a</li><li>b</li><li>c</li><li>d</li><li>e</li><li class="target">f</li><li>g</li><li>h</li><li>i</li><li>j</li><li>k</li></ul></div><div class="child">hi!</div>')
  var target = wrapper.querySelector('.target')
  var child = wrapper.querySelector('.child')
  document.body.appendChild(wrapper)
  document.body.className = 'tooltip'

  Adjust(child, target, {
    attachment: 'left middle',
    target: 'right middle',
    offset: {
      left: 20
    }
  })
})

page.start()

