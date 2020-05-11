const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, { wsEngine: 'ws' })
const Filter = require('bad-words')

const { addUser, updateUser,removeUser, getUser, getUsersInRoom } = require('./js/utils/users')
const { generateMessage } = require('./js/utils/messages')
const { addPlayer, updatePlayer, removePlayer, getPlayer, getPlayersInRoom } = require('./js/utils/players')
const { 
	incrementMatchTurn,
	updateMoveset,
	getMoveset,
	resetMoveset,
	checkWin
} = require('./js/utils/tictactoe')

const port = process.env.PORT || 3001

io.on('connection', (socket) => {
	console.log('New WebSocket connection')

	socket.on('joinRoom', ({ username, room }, callback) => {
		// Create a user, return an error if failed
		const { user, error } = addUser({ id: socket.id, username, room })

		if (error) {
			return callback(error)
		}

		// Join a room
		socket.join(user.room)
		
		// Send room details to users in room
		io.to(user.room).emit('roomDetails', {
			roomname: user.room,
			users: getUsersInRoom(user.room, undefined)
		})
		// Send two messages to client, one welcoming the user and another notifying the users in the room

		socket.emit('message', generateMessage(`Welcome to ${user.room} Chatroom`, 'Admin'))

		socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`, 'Admin'))
		callback()
	})

	socket.on('disconnect', () => {
		// Remove user from room and leave gameroom if user is in one
		console.log('Disconnected!')
		const user = removeUser(socket.id)

		// Determine if user is currently in a gameroom
		
		if (user) {
			if (user.gameroom) {
				// Broadcast to players in the gameroom that user has left the game
				io.to(user.room).emit('message', generateMessage(`${user.username} has left ${user.gameroom}`, 'Game Master'))

				// Send data to other users in gameroom
				io.to(user.gameroom).emit('playersUpdate', getPlayersInRoom(user.gameroom))

				// Update gameroom details
				io.to(user.gameroom).emit('gameRoomDetails', {
					gameroom: user.gameroom,
					users: getPlayersInRoom(user.gameroom)
				})
			}
			io.to(user.room).emit('message', generateMessage(`${user.username} has left the room!`, 'Admin'))
			io.to(user.room).emit('roomDetails', {
				roomname: user.room,
				users: getUsersInRoom(user.room, undefined)
			})
		}
	})

	socket.on('newMessage', (newMessage, callback) => {
		// Get the user
		const user = getUser(socket.id)
		
		// Filter profanity from the user's message if there are any
		const filter = new Filter()
		if (filter.isProfane(newMessage)) {
			return callback('No bad words please')
		}

		// Send user's message to room of client
		io.to(user.room).emit('message', generateMessage(newMessage, user.username))
		callback()
	})

	socket.on('joinGameRoom', ({ gameroom }, callback) => {
		// TODO: Check if user has data in the database

		// Update user data to include gameroom name let other sockets know that player has joined a game
		const { user, updateError } = updateUser({ id: socket.id, gameroom })

		if (updateError) {
			return callback(updateError)
		}

		// Create a player, return an error if failed
		const { player, addError } = addPlayer({ id: socket.id, username: user.username, gameroom })

		if (addError) {
			return callback(addError)
		}
		
		// Join the selected game room
		socket.join(player.gameroom)
		// Broadcast to chatroom that user has joined a gameroom
		io.to(user.room).emit('message', generateMessage(`${user.username} has joined ${user.gameroom}`, 'Game Master'))
		// Send any data that has been created before joining room
		socket.emit('playersUpdate', getPlayersInRoom(player.gameroom))
		/* io.to(player.gameroom).emit('roomDetails', {
			gameroom: {
				gameTitle: player.gameroom,
				players: getUsersInRoom(undefined, user.gameroom)
			}
		}) */

		callback()
	})

	socket.on('leaveGameRoom', (callback) => {
		// Remove gameroom from user data
		const { user, error } = updateUser({ id: socket.id, gameroom: undefined })

		// Remove player from player data
		const player = removePlayer(socket.id)

		if (error) {
			return callback(error)
		}

		if (player) {
			// Reset game data of tictactoe
			resetMoveset(player.gameroom)

			// Broadcast to players in the gameroom that user has left the game
			io.to(user.room).emit('message', generateMessage(`${user.username} has left ${player.gameroom}`, 'Game Master'))

			// Send data to other users in gameroom
			io.to(player.gameroom).emit('playersUpdate', getPlayersInRoom(player.gameroom))

			// Update gameroom details
			io.to(player.gameroom).emit('gameRoomDetails', {
				gameroom: player.gameroom,
				users: getPlayersInRoom(player.gameroom)
			})
		}
		callback()
	})

	socket.on('newGame', (callback) => {
		// Reset player data
		const { player, error } = updatePlayer({ id: socket.id, symbol: null, moves: [] })

		if (error) {
			return callback(error)
		}

		// Reset gameboard data
		resetMoveset(player.gameroom)

		socket.emit('playersUpdate', getPlayersInRoom(player.gameroom))
		socket.emit('gameMovesetUpdate', getMoveset(player.gameroom)[player.gameroom])
		callback()
	})

	socket.on('initGameMoveset', (gameroom, callback) => {
		socket.emit('gameMovesetUpdate', getMoveset(gameroom)[gameroom])
		callback()
	})

	socket.on('setPlayerSymbol', (symbol, callback) => {
		// Add symbol and moveset to player exclusive to tictactoegame
		const { player, error } = updatePlayer({ id: socket.id, symbol: symbol, moves: [] })

		if (error) {
			return callback(error)
		}

		if (player) {
			io.to(player.gameroom).emit('playersUpdate', getPlayersInRoom(player.gameroom))
		}

		callback()
	})

	socket.on('newMove', (move, callback) => {
		// Get the user
		const currentPlayer = getPlayer(socket.id)
		const matchTurn = getMoveset(currentPlayer.gameroom)['matchTurn']

		if ((matchTurn % 2 === 0) && currentPlayer.symbol === 'x') {
			// update player moves
			const { player, error } = updatePlayer({ id: socket.id, moves: [...currentPlayer.moves, move] })
			
			if (error) {
				return callback(error)
			}

		} else if ((matchTurn % 2 !== 0) && currentPlayer.symbol === 'o') {

			const { player, error } = updatePlayer({ id: socket.id, moves: [...currentPlayer.moves, move] })

			if (error) {
				return callback(error)
			}

		} else {
			return callback('Not yet your turn!')
		}

		// update game moves
		const moveset = updateMoveset(currentPlayer.gameroom, move, currentPlayer.symbol)
		// send player moves to client
		io.to(currentPlayer.gameroom).emit('playersUpdate', getPlayersInRoom(currentPlayer.gameroom))
		// send game moves to client
		io.to(currentPlayer.gameroom).emit('gameMovesetUpdate', moveset[currentPlayer.gameroom])

		// Check if there is a winner, then after a small delay, send the winner to clients in gameroom
		setTimeout(() => {
			if (checkWin(currentPlayer.moves)) {
				return io.to(currentPlayer.gameroom).emit('gameOver', currentPlayer.username)
			}
		},500)

		incrementMatchTurn(currentPlayer.gameroom)
		callback()
	})

	socket.on('checkWin', (data, callback) => {
		// Get the user
		const user = getUser(socket.id)

		if (checkWin(data)) {
			io.to(user.gameroom).emit('gameOver',  user.username )
		}

		callback()
	})


})

server.listen(port, () => {
	console.log('Server is up on port ' + port)
})