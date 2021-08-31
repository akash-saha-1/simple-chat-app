import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, Button, TextInput, Image, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';

const JoinScreen = (props) => {
  const [error, setError] = useState(false);
  const userName = useRef('');
  const dispatch = useDispatch();

  useEffect(() => {
    // we are setting initial blank value here beacuse useRef is pointing to ref of TextInput
    // which is not default input like browser where auto data  binding happens
    //here TextInput ref returns the full object with stylesheet
    // thats why we created a value parameter on current object ans assigning value
    userName.current.value = '';
  }, []);

  const validateAndJoin = useCallback(() => {
    setError(false);
    if (
      !userName.current.value ||
      userName.current.value == '' ||
      userName.current.value.length < 2
    ) {
      setError(true);
    } else {
      //props.joinChat(userName);
      dispatch({ type: 'server/join', data: userName.current.value });
      props.navigation.navigate('App');
    }
  }, [userName.current.value]);

  return (
    <View style={styles.view}>
      <Image
        resizeMode="contain"
        source={require('./../assets/chat-icon.png')}
      />
      <View>
        <TextInput
          ref={userName}
          style={styles.input}
          name="username"
          placeholder="Enter UserName"
          onChangeText={(text) => {
            userName.current.value = text;
          }}
        />
        <Button title="Join Chat" onPress={validateAndJoin} />
      </View>
      {error && (
        <View>
          <Text style={styles.errorText}>
            Please give valid Username to Proceed!
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '70%',
    marginVertical: 20,
    fontSize: 20,
    textAlign: 'center',
  },
  errorText: {
    marginVertical: 20,
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default JoinScreen;
