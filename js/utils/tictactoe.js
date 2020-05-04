const players = []
// Players should have an id, username, gameroom, symbol, moves
// Add a function to return all the moves made by combining the two player's moves

const addPlayer = ({ id, username, gameroom }) => {
	// Clean the data
	username = username.trim().toLowerCase()
	gameroom = gameroom.trim().toLowerCase()

	// Check if room is full
	if (players.length == 2) {
		return {
			addError: 'Two players are currently playing!'
		}
	}

	// Store the user in the users array
	const player = { id, username, gameroom }
	players.push(player)

	// Return the user as an object
	return { player }
}

const updatePlayer = (data) => {
	let allowedUpdates
	const updates = Object.keys(data)
	// Get user with id
	const player = players.find(player => player.id === data.id)
	// Allowed updates on user based on what game they are playing
	if (player.gameroom.split('-')[1]==='tictactoe') {
		allowedUpdates = ['id', 'username', 'gameroom', 'symbol', 'moves']
	}
	
	const isValidOperation = updates.every(update => allowedUpdates.includes(update))

	if (!isValidOperation) {
		return {
			error: 'id, username, symbol and gameroom are the allowed updates to the player data'
		}
	}

	updates.forEach(update => player[update] = data[update])
	return { player }
}

const removePlayer = (id) => {
	// Look at each users id and return the id of the user that matches
	const index = players.findIndex((player) => player.id === id)
	// Check if user exists then remove the user from the users array
	if (index !== -1) {
		return players.splice(index, 1)[0]
	}
}

const getPlayer = (id) => {

	return players.find(player => player.id === id)

}

const getPlayersInRoom = (room, gameroom) => {

	if (gameroom) {
		return players.filter((player) => player.gameroom === gameroom.trim().toLowerCase())
	}

}

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
	addPlayer,
	updatePlayer,
	removePlayer,
	getPlayer,
	getPlayersInRoom,
	checkWin
}