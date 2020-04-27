const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, { wsEngine: 'ws' })
const Filter = require('bad-words')
const { addUser, updateUser,removeUser, getUser, getUsersInRoom } = require('./js/utils/users')
const { generateMessage } = require('./js/utils/messages')
const { checkWin } = require('./js/utils/tictactoe')

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
			io.to(user.room).emit('message', generateMessage(`${user.username} has left the room!`, 'ADMIN'))
		}
	})

	socket.on('joinGameRoom', ({gameroom}, callback) => {
		// Get the current user data
		const currentUser = getUser(socket.id)

		const { user, error } = updateUser({ id: socket.id, username: currentUser.username, room: currentUser.room, gameroom })

		if (error) {
			return callback(error)
		}

		// Join the selected game room
		socket.join(user.gameroom)

		// Broadcast to chatroom that user has joined a gameroom

		io.to(user.room).emit('message', generateMessage(`${user.username} has joined ${user.gameroom}`, 'Game Master'))
		
		io.to(user.room).emit('gameRoomDetails', {
			gameroom: user.gameroom,
			users: getUsersInRoom(undefined, user.gameroom)
		})

		callback()
	})

	socket.on('leaveGameRoom', (callback) => {
		// Get the current user data
		const currentUser = getUser(socket.id)
		const gameroom = currentUser.gameroom
		// Remove gameroom from user data
		const { user, error } = updateUser({ id: socket.id, username: currentUser.username, room: currentUser.room, gameroom: undefined })
		
		if (error) {
			return callback(error)
		}

		if (user) {
			io.to(user.room).emit('message', generateMessage(`${user.username} has left ${gameroom}`, 'Game Master'))
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