/* Notice how we have used this file to store all the sensitive information that our app uses.
This is to improve the security of our application. In practice, we would add this file to our .gitignore file. */
module.exports ={
	google: {
		clientID: '117851164288-orlqsih43vo3fs7fonplhtjke7kjoum3.apps.googleusercontent.com',
		clientSecret: '0NoTJFFxyfkHhuxEq-O4_uGK'
	},
	mongoDB: {
		dbURI: 'mongodb+srv://dbUser:RedCatGuitar@bootcamp-fullstackwebdev-task4-9biqu.mongodb.net/test?retryWrites=true&w=majority'
	},
	session: {
		cookieKey: 'dh4u!RedCatGuitar'
	}
}