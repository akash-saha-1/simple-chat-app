import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';

const FriendListScreen = ({ navigation }) => {
  const usersOnline = useSelector((state) => state.usersOnline);

  return (
    <View style={styles.view}>
      <FlatList
        data={usersOnline}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Chat', {
                name: item.userName,
                userId: item.userId,
              })
            }
          >
            <View style={styles.listContainer}>
              <Image style={styles.image} source={{ uri: item.avatar }} />
              <View style={styles.textView}>
                <Text style={styles.text}>{item.userName}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.userId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  textView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});

export default FriendListScreen;
