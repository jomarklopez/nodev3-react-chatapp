const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, { wsEngine: 'ws' })
const Filter = require('bad-words')
const { addUser, updateUser,removeUser, getUser, getUsersInRoom } = require('./js/utils/users')
const { generateMessage } = require('./js/utils/messages')
const { addPlayer, updatePlayer,removePlayer,getPlayer,getPlayersInRoom,checkWin } = require('./js/utils/tictactoe')

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

		socket.emit('message', generateMessage('Welcome to Chat', 'Admin'))

		socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`, 'Admin'))
		callback()
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

	socket.on('disconnect', () => {
		console.log('Disconnected!')
		const user = removeUser(socket.id)
		if (user) {
			io.to(user.room).emit('message', generateMessage(`${user.username} has left the room!`, 'Admin'))
			io.to(user.room).emit('roomDetails', {
				roomname: user.room,
				users: getUsersInRoom(user.room, undefined)
			})
		}
	})

	socket.on('joinGameRoom', ({ gameroom }, callback) => {
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
		// Get the current user data
		const currentUser = getUser(socket.id)
		
		const gameroom = currentUser.gameroom
		// Remove gameroom from user data
		const { user, error } = updateUser({ id: socket.id, gameroom: undefined })

		// Remove player from player data
		const player = removePlayer(socket.id)
		
		if (error) {
			return callback(error)
		}

		if (player) {

			// Broadcast to players in the gameroom that user has left the game
			io.to(user.room).emit('message', generateMessage(`${user.username} has left ${gameroom}`, 'Game Master'))

			// Send data to other users in gameroom
			io.to(gameroom).emit('playersUpdate', getPlayersInRoom(gameroom))

			// Update gameroom details
			io.to(gameroom).emit('gameRoomDetails', {
				gameroom,
				users: getPlayersInRoom(gameroom)
			})
		}
		callback()
	})

	/* TIC TAC TOE EVENTS */
	socket.on('setPlayerSymbol', (symbol, callback) => {
		const { player, error } = updatePlayer({ id: socket.id, symbol: symbol })

		if (error) {
			return callback(error)
		}

		if (player) {
			io.to(player.gameroom).emit('playersUpdate', getPlayersInRoom(player.gameroom))
		}

		callback()
	})

	socket.on('newMove', (data, callback) => {
		// Get the user
		const user = getUser(socket.id)

		if ((data.matchMoves % 2 != 0) && data.move.chosenSymbol === 'X') {
			io.to(user.gameroom).emit('gameMoves', { matchMoves: data.matchMoves+1, move: data.move})

		} else if ((data.matchMoves % 2 == 0) && data.move.chosenSymbol === 'O') {
			io.to(user.gameroom).emit('gameMoves', { matchMoves: data.matchMoves+1, move: data.move })
		} else {
			return callback('It\'s the other player\'s turn!')
		}
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