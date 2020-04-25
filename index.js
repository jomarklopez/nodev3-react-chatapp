const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { addUser, updateUser,removeUser, getUser, getUsersInRoom } = require('./js/utils/users')
const { generateMessage } = require('./js/utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3001

io.on('connection', (socket) => {

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

		io.to(user.room).emit('message', generateMessage(`${user.username} has joined ${user.gameroom}`, 'Admin'))
		
		io.to(user.room).emit('gameRoomDetails', {
			room: user.room,
			users: getUsersInRoom(undefined, user.gameroom)
		})

		callback()
	})

})

server.listen(port, () => {
	console.log('Server is up on port ' + port)
})