module.exports.realToBoard = (board, origin, pos) => {
  // console.log(pos, {x: pos.x, y: board.length - 1 - pos.y})
  return {x: pos.x, y: board.length - 1 - pos.y - origin}
}

module.exports.boardToReal = (board, origin, pos) => {
  return {x: pos.x, y: -(board.length - 1) + pos.y - origin}
}
