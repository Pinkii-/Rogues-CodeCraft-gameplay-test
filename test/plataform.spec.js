const test = require('tape')
// const clone = require('clone')
const { Player } = require('../src/Player.js')
// const C = require('../src/constants.js')
const {Plataform} = require('../src/Plataform.js')

test('Plataform :: intersections', (t) => {
  var p1 = new Plataform(10, 10, 10, 10)
  var p2 = new Plataform(15, 15, 5, 5)
  var p3 = new Plataform(19, 19, 1, 1)
  t.ok(p1.intersects(p2))
  t.ok(p2.intersects(p1))
  p1.setOrigin(0, 0)
  t.ok(p1.intersects(p3))
  t.ok(p3.intersects(p1))
  t.notOk(p2.intersects(p3))
  t.notOk(p3.intersects(p2))

  var player = new Player(10, 10)
  player.size = {x: 1, y: 1}
  player.origin = {x: 0.5, y: 0.5}
  t.ok(p1.intersects(player))
  t.notOk(p3.intersects(player))
  t.end()
})
