const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);

sequelize.authenticate()
	.then( () => console.log('Connection has been established successfully.'))
	.catch( err => console.log('Unable to connect to the database:', err));

var User = sequelize.define('user', {
    userId: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
	username: { type: Sequelize.STRING, allowNull: false, unique: true },
	password: { type: Sequelize.STRING, allowNull: false },
});

if (process.argv[2] == '--sync') User.sync({force: true});

module.exports = User;
