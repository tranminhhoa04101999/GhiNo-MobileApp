import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import Color from '../constants/Color';

const UserCard = props => {
  return (
    <TouchableOpacity style={styles.card} onPress={props.onPress}>
      <Image
        source={{uri: props.imgUrl}}
        style={styles.img}
        resizeMode="cover"
      />
      <View style={styles.category}>
        <Text>{props.categoryId}</Text>
      </View>

      <View style={styles.blur}>
        <View style={styles.view}>
          <Text style={styles.textInBlur}>{props.name}</Text>
          <Text style={{color: 'white'}}>Mượn bạn: {props.total}</Text>
          <Text style={{color: 'white'}}>Bạn mượn: {props.totalMuon}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  view: {
    marginHorizontal: 5,
    marginVertical: 5,
    width: '80%',
    justifyContent: 'space-around',
  },
  card: {
    flex: 1,
    height: 200,
    width: 200,
    marginTop: 10,
    borderRadius: 10,
    marginRight: 20,
  },
  img: {
    height: 200,
    width: 200,
    borderRadius: 10,
  },
  category: {
    position: 'absolute',
    left: 15,
    top: 20,
    backgroundColor: Color.rgbGray,
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 5,
  },
  blur: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    height: 100,
    backgroundColor: Color.rgbBlack,
    borderRadius: 10,
  },
  bl: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  textInBlur: {
    fontFamily: 'OpenSans-BoldText',
    fontSize: 16,
    color: 'white',
  },
});

export default UserCard;
