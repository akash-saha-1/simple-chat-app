import React, { useCallback } from 'react';
import { View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { useDispatch, useSelector } from 'react-redux';

const ChatScreen = (props) => {
  const dispatch = useDispatch();
  const selfUser = useSelector((state) => state.selfUser);
  const toUserId = props.navigation.getParam('userId');
  const conversations = useSelector((state) => state.conversations);
  const messages = conversations[toUserId]
    ? conversations[toUserId].messages
    : null;

  // useEffect(() => {
  //   socket.current = io('http://192.168.43.195:500');
  //   socket.current.on('message', (message) => {
  //     //setRecievedMessages([...recievedMessages, message]);
  //     setRecievedMessages((prevState) => GiftedChat.append(prevState, message));
  //   });

  //   return () => {
  //     setRecievedMessages();
  //   };
  // }, []);

  // const sendMessage = useCallback((messages) => {
  //   //console.log(messages);
  //   socket.current.emit('message', messages[0].text);
  //   setRecievedMessages((prevState) => GiftedChat.append(prevState, messages));
  // }, []);

  // const joinChat = (userName) => {
  //   socket.current.emit('join', userName);
  // };

  const sendMessage = (messages) => {
    //locally update
    dispatch({
      type: 'private_message',
      data: { message: messages[0], conversationId: toUserId },
    });
    //sent to socket for the recipient to get message
    dispatch({
      type: 'server/private_message',
      data: { message: messages[0], conversationId: toUserId },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'lightgrey' }}>
      <GiftedChat
        renderUsernameOnMessage={true}
        messages={messages}
        onSend={(messages) => sendMessage(messages)}
        user={{
          _id: selfUser.userId,
        }}
      />
      {/* if keyboard overlapping with input box */}
      {/* {Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />} */}
    </View>
  );
};

// navigation options setting can only be done after ChatScreen component fully loaded
ChatScreen.navigationOptions = (props) => ({
  title: props.navigation.getParam('name'),
});

export default ChatScreen;
