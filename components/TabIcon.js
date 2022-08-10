import Icon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import Color from '../constants/Color';

const TabIcon = props => {
  return (
    <View style={styles.Icon}>
      <Icon
        name={props.name}
        size={props.size}
        color={props.focused ? Color.lightSeaGreen : 'black'}
      />
      {props.focused && <View style={styles.thanhke}></View>}
    </View>
  );
};

const styles = StyleSheet.create({
  Icon: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 55,
    width: 50,
  },
  thanhke: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: Color.lightSeaGreen,
  },
});

export default TabIcon;
