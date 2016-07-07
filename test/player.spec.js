const test = require('tape')
const clone = require('clone')
const { Player } = require('../src/Player.js')
const C = require('../src/constants.js')

test('Player :: Constructor', (t) => {
  var player = new Player(1, 1)
  t.deepEqual(player.position, {x: 1, y: 1}, 'Player should have the same position that is gived at the constructor')
  t.deepEqual(player.velocity, {x: 0, y: 0}, 'Player shouldnt have velocity at this time')
  t.deepEqual(player.alive, true, 'Player should be alive')
  t.deepEqual(player.landed, true, 'Player should be landed')
  t.end()
})

test('Player :: Apply Input', (t) => {
  var player = new Player(2, 1)
  let lastVelocity = clone(player.velocity)
  player.applyInput(C.JUMP)
  t.deepEqual(player.velocity.y < lastVelocity.y, true, 'Player should change his velocity when jumping')

  player = new Player(2, 1)
  player.applyInput(C.JUMP | C.LEFT)
  t.deepEqual(player.velocity.y < lastVelocity.y, true, 'Player should change his velocity when jumping and moving')
  t.deepEqual(player.velocity.x < lastVelocity.x, true, 'Player should change his velocity when jumping and moving')

  t.end()
})

test('Player :: Update', (t) => {
  var player = new Player(10, 18)
  var position = clone(player.position)
  player.update(0.016)
  t.deepEqual(player.position.y > position.y, true, 'Player should fall')
  position = clone(player.position)
  player.applyInput(C.JUMP | C.RIGHT)
  player.update(0.016)
  t.deepEqual(player.position.y < position.y, true, 'Player should jump')
  t.deepEqual(player.position.x > position.x, true, 'Player should move right')
  player = new Player(10, 18)
  player.applyInput(C.JUMP | C.RIGHT | C.LEFT)
  player.update(0.016)
  t.deepEqual(player.position.x, position.x, 'Player shouldnt move horizontally')
  t.end()
})

test('Player :: Jumping', (t) => {
  var player = new Player(10, 18)
  player.applyInput(C.JUMP)
  var velocity = clone(player.velocity)
  player.update(0.016)
  player.applyInput(C.JUMP)
  t.notDeepEqual(velocity, player.velocity, 'Player cant jump when he have already jump')
  t.end()
})

test('Player :: Jumping', (t) => {
  var player = new Player(10, 18)
  player.size = {x: 1, y: 1}
  player.origin = {x: 0.5, y: 0.5}
  var position = clone(player.position)
  player.correctOutsideMap(0, 20)
  t.deepEqual(player.position.x, position.x, 'Player shouldnt correct anything there')
  player.correctOutsideMap(20, 40)
  t.deepEqual(player.position.x, 20 + player.size.x / 2, 'Player should correct when is outside the map')
  player.correctOutsideMap(0, 10)
  t.deepEqual(player.position.x, 10 - player.size.x / 2, 'Player should correct when is outside the map')
  t.end()
})
