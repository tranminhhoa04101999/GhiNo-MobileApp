/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Modal, View, Text, ActivityIndicator, Button} from 'react-native';
const CustomProgress = ({visible}) => {
  return (
    <Modal onRequestClose={() => null} visible={visible}>
      <View
        style={{
          flex: 1,
          backgroundColor: '#dcdcdc',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={{borderRadius: 10, backgroundColor: 'white', padding: 25}}>
          <Text style={{fontSize: 20, fontFamily: 'OpenSans-BoldText'}}>
            Đang thêm
          </Text>
          <ActivityIndicator size="large" />
        </View>
      </View>
    </Modal>
  );
};

export default CustomProgress;
