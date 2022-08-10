/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
} from 'react-native';
import Color from '../constants/Color';
import Card from '../components/Card';
import {useSelector, useDispatch} from 'react-redux';
import * as debtActions from '../store/action/Debt';
import AsyncStorage from '@react-native-async-storage/async-storage';

const format = amount => {
  return (
    Number(amount)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, '$&,') + 'Đ'
  );
};
const DebtDetail = ({props, navigation, route}) => {
  const dispatch = useDispatch();
  const {idDebt} = route.params;
  const user = useSelector(state => state.user);
  const debtUser = useSelector(state => {
    let rs;
    state.debt.all.map(item => {
      if (item.id === idDebt) {
        rs = item;
      }
    });
    return rs;
  });
  const [userLogin, setUserLogin] = useState({
    id: 0,
    taikhoan: '',
    name: '',
    pass: 123,
    avt: 'https://scontent.fsgn5-3.fna.fbcdn.net/v/t39.30808-6/255411715_1934936103353687_605317877554095147_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=ehJBqYmvw14AX-e1fFu&_nc_ht=scontent.fsgn5-3.fna&oh=00_AT9D9DlngDWTYoBs3VSCSIBbQd22cl6_yrlu3pD9XLFRWQ&oe=62EAB071',
    token: '',
  });
  const [desc, setDesc] = useState('');
  const btnHandler = () => {
    dispatch(debtActions.thanhtoan({id: idDebt, desc: desc}));

    setTimeout(() => {
      navigation.navigate('main', {reload: true});
    }, 500);
  };
  useEffect(() => {
    const getData = async () => {
      let data = await AsyncStorage.getItem('account');
      if (data != null) {
        setUserLogin(JSON.parse(data));
      }
    };
    getData();
    return () => {};
  }, []);

  const showConfirmDialog = () => {
    return Alert.alert('Are your sure?', 'Xác nhận trả?', [
      {
        text: 'Yes',
        onPress: () => {
          btnHandler();
        },
      },
      {
        text: 'No',
      },
    ]);
  };
  const nhacTraNo = () => {
    let token = '';
    user.map(item => {
      if (item.id === debtUser.userDebt) {
        token = item.token;
      }
    });
    let price = '';
    price = format(debtUser.price);
    fetch(
      `https://ghinothongbao.herokuapp.com/doino?tokens=${token}&nameLoan=${userLogin.name}&price=${price}&desc=${debtUser.desc}`,
    );
  };
  return (
    <View style={styles.screen}>
      <View style={styles.screenHeader}>
        <Text style={styles.headerText}>Thông tin phiếu vay</Text>

        <View style={{marginBottom: 10}} />
        <Text style={styles.input}>
          <Text style={styles.text}>ngày mượn: </Text> {debtUser.dateCreate}
        </Text>
        {debtUser.isPay && (
          <Text style={styles.input}>
            <Text style={styles.text}>ngày trả: </Text> {debtUser.dateEnd}
          </Text>
        )}

        <Text style={styles.input}>
          <Text style={styles.text}>
            {user.map(item => {
              if (userLogin.id === debtUser.userLoan) {
                return item.id === debtUser.userDebt && item.name;
              } else {
                return item.id === debtUser.userLoan && item.name;
              }
            })}
          </Text>{' '}
          {debtUser.userLoan === userLogin.id
            ? '(người mượn)'
            : '(người cho mượn)'}
        </Text>
        <Text style={styles.input}>
          <Text style={styles.text}>Số tiền: </Text> {format(debtUser.price)}
        </Text>
        <Text style={styles.input}>
          <Text style={styles.text}>Lý do: </Text> {debtUser.desc}
        </Text>
        {debtUser.isPay === false ? (
          <TextInput
            style={styles.input}
            onChangeText={text => {
              setDesc(text);
            }}
            value={desc}
            placeholder="Lời nhắn (Không cần thời gian)"
          />
        ) : (
          <Text style={styles.input}>
            <Text style={styles.text}>Lời nhắn: </Text> {debtUser.descPay}
          </Text>
        )}
        <View style={styles.btnWrapper}>
          {!debtUser.isPay && (
            <View>
              {userLogin.id === debtUser.userLoan && (
                <TouchableOpacity
                  style={{...styles.btnLuu, backgroundColor: '#F7DC6F'}}
                  onPress={() => nhacTraNo()}
                  disabled={debtUser.isPay}>
                  <Text style={styles.btnLuuText}>Nhắc trả nợ</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <TouchableOpacity
            style={styles.btnLuu}
            onPress={() => showConfirmDialog()}
            disabled={debtUser.isPay}>
            <Text style={styles.btnLuuText}>
              {debtUser.isPay ? 'Đã Trả' : 'Trả'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  headerinput: {alignItems: 'flex-start'},
  btnWrapper: {},
  screen: {
    flex: 1,
  },
  screenHeader: {
    alignItems: 'center',
    marginTop: 10,
  },
  headerText: {fontSize: 20, fontFamily: 'OpenSans-BoldText', marginBottom: 10},
  btn: {
    backgroundColor: Color.darkSeaGreen,
    width: '70%',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 10},
    shadowRadius: 10,
    shadowOpacity: 0.3,
    elevation: 10,
    alignItems: 'center',
  },
  dropdownStyle: {
    backgroundColor: Color.darkSeaGreen,
    width: '70%',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 10},
    shadowRadius: 10,
    shadowOpacity: 0.3,
    elevation: 10,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontFamily: 'OpenSans-BoldText',
  },
  input: {
    width: '80%',
    borderBottomColor: Color.darkSeaGreen,
    borderBottomWidth: 1,
    fontSize: 16,
    lineHeight: 16,
    padding: 1,
    marginTop: 20,
    marginBottom: 20,
  },
  btnLuu: {
    backgroundColor: Color.darkSeaGreen,
    width: 100,
    height: 35,
    justifyContent: 'center',
    borderRadius: 4,
    elevation: 5,
    marginTop: 30,
  },
  btnLuuText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default DebtDetail;
