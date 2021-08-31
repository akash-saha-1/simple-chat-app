let currentMessageId = 1;

//this method create message object from message text and user id
const createMessageObject = (user, messageText) => {
  return {
    _id: currentMessageId++,
    text: messageText,
    createdAt: new Date(),
    user: {
      _id: user.userId,
      name: user.userName,
      avatar: user.avatar,
    },
  };
};

const handleMessage = (socket, users) => {
  socket.on('message', (messageText) => {
    //io.emit('message', message);
    const user = users[socket.id];
    const message = createMessageObject(user, messageText);

    socket.broadcast.emit('message', message);
  });
};

module.exports = { handleMessage };
