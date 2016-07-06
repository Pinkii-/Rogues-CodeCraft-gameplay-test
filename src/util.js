module.exports.realToBoard = (board, pos) => {
  // console.log(pos, {x: pos.x, y: board.length - 1 - pos.y})
  return {x: pos.x, y: board.length - 1 - pos.y}
}

module.exports.boardToReal = (board, pos) => {
  return {x: pos.x, y: -(board.length - 1) + pos.y}
}
