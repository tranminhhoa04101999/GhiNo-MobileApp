import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../constants/Color';
const format = amount => {
  return (
    Number(amount)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, '$&,') + 'Đ'
  );
};

const Card = props => {
  return (
    <TouchableOpacity style={styles.card} onPress={props.onPress}>
      <View>
        <Image
          source={{
            uri:
              props.imgUrl === null
                ? 'http://pm1.narvii.com/7759/e07ce16e5eb1f70b2840c907fc7a8335e1729395r1-716-716v2_uhq.jpg'
                : props.imgUrl,
          }}
          style={styles.img}
          resizeMode="cover"
        />
      </View>
      <View style={styles.details}>
        <Text style={styles.name}>
          {props.name} | {props.date}
        </Text>
        {props.timeline && (
          <View style={styles.bottom}>
            {props.timelineStatus === 'thanhtoan' && (
              <Text style={styles.price}>Trả nợ: </Text>
            )}
            {props.timelineStatus === 'muon' && (
              <Text style={styles.price}>Mượn: </Text>
            )}
            <Text style={{fontFamily: 'OpenSans-BoldText'}}>
              {props.timelineDesc}
            </Text>
          </View>
        )}
        <View style={styles.bottom}>
          <Text style={styles.detail}>
            {props.isIconDi === true && (
              <Icon name={'arrow-top-right-thin'} size={24} color={'#FE5936'} />
            )}
            {props.isIconVe === true && (
              <Icon
                name={'arrow-bottom-left-thin'}
                size={20}
                color={Color.lightSeaGreen}
              />
            )}
            {props.desc}
          </Text>
          <Text style={styles.price}>{format(props.price)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 10,
  },
  details: {
    flexDirection: 'column',
    marginLeft: 10,
    justifyContent: 'space-around',
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  name: {
    fontFamily: 'OpenSans-BoldText',
    fontSize: 13,
  },
  detail: {
    fontSize: 14,
    width: '60%',
    fontFamily: 'OpenSans-RegularText',
    color: 'grey',
  },
  bottom: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-between',
  },
});

export default Card;
