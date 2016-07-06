const test = require('tape')
const clone = require('clone')
const { Player } = require('../src/Player.js')
const C = require('../src/constants.js')

test('Player :: Constructor', (t) => {
  let board = [
    [C.AIR, C.AIR, C.AIR],
    [C.AIR, C.AIR, C.AIR],
    [C.WAL, C.WAL, C.WAL]
  ]
  var player = new Player(board, 1, 1)
  t.equal(player.board, board, 'Player should save the reference to the board')
  board[1][1] = C.WAL
  t.deepEqual(player.board, board, 'Player should save the reference to the board')
  t.end()
})

test('Player :: isInsideWall', (t) => {
  let board = [
    [C.AIR, C.AIR, C.AIR],
    [C.AIR, C.AIR, C.AIR],
    [C.WAL, C.WAL, C.WAL]
  ]
  var player = new Player(board, 2, 1)
  t.deepEqual(player.isInsideWall({x: 1, y: 0}), true, 'Player should know when is inside a wall')
  t.deepEqual(player.isInsideWall({x: 0, y: 2}), false, 'Player should know when is inside a wall')
  t.end()
})

test('Player :: Apply Input', (t) => {
  let board = Array(20).fill().map(() => Array(20).fill(C.AIR))
  board[19].fill(C.WAL)
  var player = new Player(board, 2, 1)
  let lastVelocity = clone(player.velocity)
  player.applyInput(C.JUMP)
  t.deepEqual(player.velocity.y > lastVelocity.y, true, 'Player should change his velocity when jumping')

  player = new Player(board, 2, 1)
  player.applyInput(C.JUMP | C.LEFT)
  t.deepEqual(player.velocity.y > lastVelocity.y, true, 'Player should change his velocity when jumping and moving')
  t.deepEqual(player.velocity.x < lastVelocity.x, true, 'Player should change his velocity when jumping and moving')

  t.end()
})

test('Player :: Update', (t) => {
  let board = Array(20).fill().map(() => Array(20).fill(C.AIR))
  var player = new Player(board, 10, 18)
  var position = clone(player.position)
  player.update(0.016)
  t.deepEqual(player.position.y < position.y, true, 'Player should fall')
  position = clone(player.position)
  player.applyInput(C.JUMP | C.RIGHT)
  player.update(0.016)
  t.deepEqual(player.position.y > position.y, true, 'Player should jump')
  t.deepEqual(player.position.x > position.x, true, 'Player should move right')
  player = new Player(board, 10, 18)
  player.applyInput(C.JUMP | C.RIGHT | C.LEFT)
  player.update(0.016)
  t.deepEqual(player.position.x, position.x, 'Player shouldnt move horizontally')
  t.end()
})

test('Player :: Jumping', (t) => {
  let board = Array(20).fill().map(() => Array(20).fill(C.AIR))
  var player = new Player(board, 10, 18)
  player.applyInput(C.JUMP)
  var velocity = clone(player.velocity)
  player.update(0.016)
  player.applyInput(C.JUMP)
  t.notDeepEqual(velocity, player.velocity, 'Player cant jump when he have already jump')
  t.end()
})
