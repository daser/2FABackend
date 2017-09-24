# 2FABackend

WHAT: This project is a microservice that manages TOTP for two factor authentication.

WHY: A standalone microservice which can be independently scaled to support two factor authentication (2FA) access control on any user management needs for a larger application.

HOW: The microservice exposes 4 endpoints which provide access to the data it manages. These
endpoints are RESTful and allow CRUD operations to be performed against the underlying data
resources.
The microservice has an entry point vis server.js which is a node.js http server which delegates
request handling to an underlying expressjs app (app.js). This pattern is a common one in the Node
world.
The express app is built as a RESTful service and uses middleware like helmet, hpp and nocache to
implement security best practices. It also supports a custom CORS implementation (lines 92-97 of
app.js).
The microservice is designed to use environmental variables (via dotenv, see line 4 of app.js), this
practice ensures the security of sensitive information e.g. API Keys etc.
The database connection and lifecycle management is implemented in app.js (lines 56-89), this is
also another common pattern in the Node world.
Route handlers are defined in a separate expressjs sub module (routes/routes.js) and bound to the
‘/otpapi/’ path (line 126 in app.js), the pattern employed is to use ‘thin’ route handlers which delegate
the actual CRUD operation to helper functions (defined in models/tfauserUtils directory). When these
helper functions complete their operation, the response object passed to them by the route handler is
used to send a response to the request originally intercepted by the handler.
The mongoose data models are defined in models/userotp.js.


## Requirements
* NodeJS
* MongoDB

Please note the following:

As is a best practice, i've used environment variables for sensitive information e.g. the database URL. In the app, this is exposed as process.env.DBURL, i've attached a sample for you to work with. Please endure that on your local machine and the production server, the actual file you use is called .env

Example .env file:

PORT=3000 DBURL=mongodb://localhost/mydatabaselink



## Setup
* clone Repository containing the project using `git clone git@github.com:daser/2FABackend.git`
* cd into the newly created 2FABackend directory
* set up a sendgrid account and update your .env file
* set up mongo database locally or on mlab
* create the .env file with the PORT and mongodb 
* Run `npm install` to install the needed node js packages.

## How to run
Run this command to run the application `NODE_ENV=development node server.js`

## Docomentation

<b>ENABLE A USER</b>


```
{
	"uid":"59c379a983a1f1f360cae822"
}
```


Endpoint: otpapi/enableOtp<br />
Method: POST




<b>DISABLE A USER</b>


```
{
	"uid":"59c379a983a1f1f360cae822"
}
```


Endpoint: otpapi/disableTotp<br />
Method: DELETE


<b>GET A USER TOTP</b>


```
{
	"uid":"59c379a983a1f1f360cae822"
}
```


Endpoint: otpapi/getTotp<br />
Method: POST


<b>VERIFY A USER TOTP</b>


```
{
	"uid":"59c34180dd7ef2ec11587a1f",
	"token":"154308"
}
```


Endpoint: otpapi/verifyOtp <br />
Method: POST


## Contributors
[Daser David](https://github.com/daser)
