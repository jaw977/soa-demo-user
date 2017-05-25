## SOA Demo: User Service

Listens for JSON messages on an HTTP port, allowing users to be created, or authenticated.  Passwords are hashed using bcrypt and a salt.

Users are stored in a PostgreSQL database and consist of a username and hashed password.  They also have a auto-increment userId.  The app has its own DB instance and does not share data with the apps that control listings and bids.  `node model.js --sync` can be used to create the database table.

Use `npm start` to start the service.  The app can be directly deployed to Heroku, however it is not tied to Heroku in any way.

http://senecajs.org and https://github.com/jaw977/soa-demo-service are used to route incoming messages to handler functions, and send messages to other services.

### Messages

* Creating a new user:
  * Request:  `{"role":"user", "cmd":"add", "username":"jaw", "password":"12345"}` 
  * Response: `{"user":{"userId":1,"username":"jaw"}}`
  * Response: `{"error":"User jaw already exists!"}`
  * Successfully creating a new user publishes an "addUser" event which includes the userId and username.
* Authentication:
  * Request:  `{"role":"user", "cmd":"authn", "username":"jaw", "password":"12345"}`
  * Response: `{"token":"eyJhbG...VLrMugIA"}`
  * Response: `{"error":"Invalid Username or Password."}`

### Configuration

All configuration happens in environment variables.  

* `PORT`: The port that the app listens on.
* `DATABASE_URL`: The URL of the PostgreSQL database instance.
* `CLIENTS`: Other services the app may connect to.  `[listing,bid]`
* `listing.ADDR`: Port or hostname of the listing service.
* `bid.ADDR`: Port or hostname of the bid service.
* `SUBSCRIPTIONS`: Other services to contact when events are published.  `addUser:[listing,bid]`
* `TOKEN_SECRET`: Shared secret for token verification.

The config variables to manage connections with other services would become unmanageable as the number of services grows.  Using an automatic service discovery mechanism such as https://github.com/senecajs/seneca-mesh would help greatly.
