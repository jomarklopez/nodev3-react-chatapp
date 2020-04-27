const checkWin = (playerMoves) => {
	const horizontalCheckPatterns = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8]
	]
	const verticalCheckPatterns = [
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8]
	]
	const diagonalCheckPatterns = [
		[0, 4, 8],
		[2, 4, 6]
	]

	// Iterate through possible horizontal patterns
	for (let pattern of horizontalCheckPatterns) {
		// Checks if a pattern matches with the player's moveset
		for (let n of pattern) {
			if (!playerMoves.includes(n)) {
				break
			}
			if (n === pattern[pattern.length - 1]) {
				return true
			}
		}
	}

	// Iterate through possible vertical patterns
	for (let pattern of verticalCheckPatterns) {
		// Checks if a pattern matches with the player's moveset
		for (let n of pattern) {
			if (!playerMoves.includes(n)) {
				break
			}
			if (n === pattern[pattern.length - 1]) {
				return true
			}
		}
	}

	// Iterate through possible diagonal patterns
	for (let pattern of diagonalCheckPatterns) {
		// Checks if a pattern matches with the player's moveset
		for (let n of pattern) {
			if (!playerMoves.includes(n)) {
				break
			}
			if (n === pattern[pattern.length - 1]) {
				return true
			}
		}
	}
	return false
}

module.exports = {
	checkWin
}