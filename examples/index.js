/**
 * Module Dependencies
 */

var domify = require('domify')
var adjust = require('..')()
var page = require('page')

page('/', function () {
  var wrapper = domify('<div class="wrapper"><div class="parent"><div class="child"></div></div></div>')
  var parent = wrapper.querySelector('.parent')
  var child = parent.firstChild
  document.body.appendChild(wrapper)
  document.body.className = 'index'

  adjust(child, parent)
})

page('/scrolling', function () {
  var wrapper = domify('<div class="wrapper"><div class="parent"><div class="child"></div></div></div>')
  var parent = wrapper.querySelector('.parent')
  var child = parent.firstChild
  document.body.appendChild(wrapper)
  document.body.className = 'scrolling'

  adjust(child, parent)
})

page('/flip', function () {
  var wrapper = domify('<div class="wrapper"><div class="parent"><div class="child"></div></div></div>')
  var parent = wrapper.querySelector('.parent')
  var child = wrapper.querySelector('.child')
  document.body.appendChild(wrapper)
  document.body.className = 'flip'

  adjust(child, parent, {
    attachment: 'left top',
    target: 'right bottom'
  })
})

page('/tooltip', function () {
  var wrapper = domify('<div class="wrapper"><ul class="parent"><li>a</li><li>b</li><li>c</li><li>d</li><li>e</li><li class="target one">f</li><li>g</li><li>h</li><li>i</li><li class="target two">j</li><li>k</li></ul></div><div class="child">hi!</div><div class="child-two">hello!</div>')
  var one = wrapper.querySelector('.one')
  var two = wrapper.querySelector('.two')
  var child = wrapper.querySelector('.child')
  var child_two = wrapper.querySelector('.child-two')
  document.body.appendChild(wrapper)
  document.body.className = 'tooltip'

  adjust(child, one, {
    attachment: 'left middle',
    target: 'right middle',
    offset: {
      left: 20
    }
  })

  adjust(child_two, two, {
    attachment: 'right',
    offset: {
      right: 20
    }
  })
})

page('/relative', function() {
  var wrapper = domify('<div class="wrapper"><div class="inner-wrapper"><div class="parent"><div class="child"></div></div></div></div>')
  var parent = wrapper.querySelector('.parent')
  var child = parent.firstChild
  document.body.appendChild(wrapper)
  document.body.className = 'relative'

  adjust(child, parent, {
    attachment: 'bottom'
  })
})

page.start()

