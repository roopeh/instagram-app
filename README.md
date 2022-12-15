## Instagram replication by roopeh
#### Powered by TypeScript, React, NodeJS, Apollo GraphQL, MongoDB
#### Supports at least Chrome and Firefox

A fully functioning Instagram replication with features such as uploading profile and cover picture, creating posts,
liking and commenting photos, following other users to stay updated with them and chatting with them in real-time.

For layout I chose to go with 2012-2014 version of Instagram.

[**Live demo**](https://instagram-app-2022.fly.dev/)<br/>
You can check out i.e. Bill Gates' profile [here](https://instagram-app-2022.fly.dev/billgates).<br/>
(Please be patient, site may start slowly)

**Real-time private messages demo**


### How to install your own copy
**Database**<br/>
You need a MongoDB database.

**Backend**<br/>
Go to backend folder and do `npm install`

Next create a new file called .env in backend root folder with following content
```
MONGODB_URI=<your mongo url here>
ACCESS_TOKEN_SECRET=<create your secret access token salt here>
REFRESH_TOKEN_SECRET=<create your secret refresh token salt here>
```
Example
```
MONGODB_URI=mongodb+srv://foo:bar@cluster1.g8cgg.mongodb.net/instagram?retryWrites=true&w=majority
ACCESS_TOKEN_SECRET=QwErTy123456
REFRESH_TOKEN_SECRET=HeLL0W0rLD!
```

Next start backend in development mode with `npm run dev`

**Frontend**<br/>
Go to frontend folder and do `npm install`<br/>
Next start frontend in development mode with `npm start`

Now you may browse Instagram at http://localhost:3000/

**Production mode**<br/>
For running fullstack Instagram in production mode, you need to change couple lines in both frontend and backend.

For backend go to backend/config.ts and replace PUBLIC_URL with your url. If you are running locally use `http://localhost:8080/`<br/>
For frontend go to frontend/src/ApolloClient.ts and replace publicWebsocketUrl with your url. If you are running locally use `ws://localhost:8080/graphql`

Next run 3_full_build.sh, go to backend folder and do `npm start` to run fullstack Instagram in production mode.

You may browse Instagram at http://localhost:8080/

### References for layout etc
https://techcrunch.com/2012/11/05/mobile-first-web-second-instagram-finally-lets-users-have-functional-web-profiles/ <br/>
https://www.hoedoen.be/hoe-werkt-instagram-op-je-computer/
