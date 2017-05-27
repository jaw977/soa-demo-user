const User = require('./model.js');
const bcrypt = require('bcryptjs');
const authToken = require('soa-demo-token');
const Service = require('soa-demo-service-amqp');

const service = new Service('user');

service.add('cmd:add', async ({username, password}) => {
	const oldUser = await User.findOne({where:{username}});
	if (oldUser) return {error:`User ${username} already exists!`};
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);
	const user = await User.create({username, password:hash});
	const userId = user.userId;
	service.publish('addUser', {userId, username});
	return {user:{userId, username}};
});

service.add('cmd:authn', async ({username, password}) => {
	const user = await User.findOne({where:{username}});
	const error = {error:"Invalid Username or Password."};
	if (! user) return error;
	const correct = await bcrypt.compare(password, user.password);
	if (! correct) return error;
	const token = authToken.create({userId:user.userId, username:user.username});
	return {userId:user.userId, token};
});

service.add('cmd:verify', async ({token}) => {
	return authToken.verify(token) || {};
});

module.exports = service;
