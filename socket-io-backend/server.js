// initalizing socket io and invoking the method to run
const io = require('socket.io')();
const { v4: uuidv4 } = require('uuid');
const messageHandler = require('./handlers/message-handler');

// current user id initalized with 2 beacuse 1 means people will see the blue bubble in chat screen
let currentUserId = 2;
const users = {};

// unique avatar url for different users
const createAvatarUrl = () => {
  const randOne = Math.round(Math.random() * 200 + 100);
  const randTwo = Math.round(Math.random() * 200 + 100);
  return `https://placeimg.com/${randOne}/${randTwo}/any`;
};

const createUsersOnline = () => {
  //this will only give multiple user objects from users without key
  const values = Object.values(users);

  // filter only users with username(real users)
  const userWithUserNames = values.filter((val) => val.userName != undefined);
  return userWithUserNames;
};

//on socket ready with connection from client
io.on('connection', (socket) => {
  console.log(`A user connected to this on Socket Id : ${socket.id}`);
  users[socket.id] = { userId: uuidv4() };

  //triggers on new user joins
  socket.on('join', (userName) => {
    users[socket.id].userName = userName;
    users[socket.id].avatar = createAvatarUrl();

    //triggers on sending message from a user/socket
    //only active or subscribe the below function/event after joining the chat
    messageHandler.handleMessage(socket, users);
  });

  //disconnection and remove from the active list
  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('action', {
      type: 'users_online',
      data: createUsersOnline(),
    });
  });

  // emit on new action from redux from UI
  socket.on('action', (action) => {
    switch (action.type) {
      case 'server/join':
        //console.log('Got join event', action.data);
        users[socket.id].userName = action.data;
        users[socket.id].avatar = createAvatarUrl();

        //socket.emit() will only emit update for the connected socket not for all but io.emit() will do for all
        io.emit('action', {
          type: 'users_online',
          data: createUsersOnline(),
        });
        // to send only the user id of that instance connected user
        socket.emit('action', {
          type: 'self_user',
          data: users[socket.id],
        });
        break;
      case 'server/private_message':
        const conversationId = action.data.conversationId;
        const fromUserId = users[socket.id].userId;
        const userValues = Object.values(users);
        const socketIds = Object.keys(users);

        userValues.forEach((user, index) => {
          if (user.userId === conversationId) {
            const socketId = socketIds[index];
            // getting socket with id and emitting message to the same socket only
            //io.sockets.sockets is a map
            io.sockets.sockets.get(socketId).emit('action', {
              type: 'private_message',
              data: { ...action.data, conversationId: fromUserId },
            });
          }
        });
    }
  });
});

io.listen(process.env.PORT || 500, {
  /*
   * very important and remember
   * pingTimeout (Number): How many ms without a ping packet or active socket connection to consider
   *   the connection closed between socket and internet including pingInterval timing.
   *
   * pingInterval (Number): how many ms before sending a new ping packet or query connection to socket
   *   to determine active sockets connected.
   */
  pingInterval: 3000,
  pingTimeout: 3000,
});
