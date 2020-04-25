const users = []

const addUser = ({ id, username, room }) => {
	// Clean the data
	username = username.trim().toLowerCase()
	room = room.trim().toLowerCase()
	// Validate the data
	if (!username || !room) {
		return {
			error: 'Username and room are required!'
		}
	}
	// Check for existing user
	const existingUser = users.find((user) => user.room === room && user.username === username)

	// Validate username
	if (existingUser) {
		return {
			error: 'Username is taken!'
		}
	}
	// Store the user in the users array
	const user = { id, username, room }
	users.push(user)
	// Return the user as an object
	return { user }
}

const updateUser = (data) => {
	const updates = Object.keys(data)

	// Get user with id
	const user = users.find(user => user.id === data.id)
	// Allowed updates on user
	const allowedUpdates = ['id', 'username', 'room', 'gameroom']
	const isValidOperation = updates.every(update => allowedUpdates.includes(update))
	
	if (!isValidOperation) {
		return {
			error: 'id, username, room and gameroom are the allowed updates'
		}
	}

	updates.forEach(update => user[update] = data[update])
	return { user }
}

const removeUser = (id) => {
	// Look at each users id and return the id of the user that matches
	const index = users.findIndex((user) => user.id === id)
	// Check if user exists then remove the user from the users array
	if (index !== -1) {
		return users.splice(index, 1)[0]
	}
}

const getUser = (id) => {
	
	return users.find(user => user.id === id)
	
}

const getUsersInRoom = (room, gameroom) => {

	if (room) {
		return users.filter((user) => user.room === room.trim().toLowerCase())
	}
	if (gameroom) {
		return users.filter((user) => user.gameroom === gameroom.trim().toLowerCase())
	}
	
}

module.exports = {
	addUser,
	updateUser,
	removeUser,
	getUser,
	getUsersInRoom
}