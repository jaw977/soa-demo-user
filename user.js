const User = require('./model.js');
const bcrypt = require('bcryptjs');
const authToken = require('soa-demo-token');
const Service = require('soa-demo-service');

async function add({username, password},{service}) {
	const oldUser = await User.findOne({where:{username}});
	if (oldUser) return {error:`User ${username} already exists!`};
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);
	const user = await User.create({username, password:hash});
	const userId = user.userId;
	service.publish('addUser', {userId, username});
	return {user:{userId, username}};
}

async function authn({username, password}) {
	const user = await User.findOne({where:{username}});
	const error = {error:"Invalid Username or Password."};
	if (! user) return error;
	const correct = await bcrypt.compare(password, user.password);
	if (! correct) return error;
	const token = authToken.create({userId:user.userId, username:user.username});
	return {userId:user.userId, token};
}

async function verify({token}) {
	return authToken.verify(token) || {};
}

const service = new Service('user');
service.add('role:user,cmd:add', add);
service.add('role:user,cmd:authn', authn);
service.add('role:user,cmd:verify', verify);

module.exports = service;
