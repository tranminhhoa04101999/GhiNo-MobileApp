/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ToastAndroid,
} from 'react-native';
import Color from '../constants/Color';
import {useSelector, useDispatch} from 'react-redux';
import * as debtActions from '../store/action/Debt';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SelectDropdown from 'react-native-select-dropdown';
import CustomProgress from '../components/CustomProgress';

const INITIAL = {
  id: 0,
  userLoan: 0,
  userDebt: 0,
  dateCreate: '31/07/2022 14:42:25',
  dateModified: '',
  dateEnd: '',
  desc: '',
  price: '',
  isPay: false,
  descPay: '',
};

const AddDebt = () => {
  const [dataSelect, setDataSelect] = useState([]);
  const [dataAdd, setDataAdd] = useState(INITIAL);
  const [userLogin, setUserLogin] = useState({
    id: 0,
    taikhoan: '',
    name: '',
    pass: 123,
    avt: 'https://scontent.fsgn5-3.fna.fbcdn.net/v/t39.30808-6/255411715_1934936103353687_605317877554095147_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=ehJBqYmvw14AX-e1fFu&_nc_ht=scontent.fsgn5-3.fna&oh=00_AT9D9DlngDWTYoBs3VSCSIBbQd22cl6_yrlu3pD9XLFRWQ&oe=62EAB071',
  });
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector(state => state.user);

  useEffect(() => {
    // lấy account đang đăng nhập
    const getData = async () => {
      let data = await AsyncStorage.getItem('account');
      if (data != null) {
        let dataParse = JSON.parse(data);
        setUserLogin(dataParse);
        //
        setDataAdd(prev => ({...prev, userLoan: dataParse.id}));
      }
    };
    getData();
    //

    return () => {};
  }, []);
  useEffect(() => {
    if (user.length > 0) {
      let data = [];
      user.map(item => {
        if (item.id !== userLogin.id) {
          data.push(item.name);
        }
      });
      setDataSelect(data);
    }
    return () => {};
  }, [userLogin, user]);

  const btnLuuHandler = async () => {
    if (dataAdd.userDebt === 0) {
      ToastAndroid.show(
        'Chưa chọn người mượn !',
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
      );
      return;
    } else if (dataAdd.price === '' || dataAdd.price === '0') {
      ToastAndroid.show(
        'Chưa nhập số tiền !',
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
      );
      return;
    } else if (dataAdd.desc === '') {
      ToastAndroid.show(
        'Vì sao mượn tiền !',
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
      );
      return;
    }
    ///
    setIsLoading(true);
    let dataAddNew = dataAdd;
    dataAddNew.dateCreate = new Date().toLocaleString();
    try {
      await dispatch(debtActions.fetchData());
      setTimeout(async () => {
        await dispatch(debtActions.addDebt(dataAddNew));

        ToastAndroid.show(
          'Thêm thành công !',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );
        setDataAdd(INITIAL);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      ToastAndroid.show(
        'Thêm thất bại !',
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
      );
      setIsLoading(false);
    }
  };
  return (
    <View style={styles.screen}>
      {isLoading ? (
        <CustomProgress />
      ) : (
        <View style={styles.screenHeader}>
          <Text style={styles.headerText}>Tạo phiếu cho mượn</Text>
          <SelectDropdown
            buttonStyle={styles.btn}
            data={dataSelect}
            search={true}
            buttonTextStyle={styles.text}
            rowTextStyle={styles.text}
            defaultButtonText="Chọn người cho mượn"
            searchPlaceHolder="Nhập tên"
            renderSearchInputLeftIcon={() => {
              return <Icon name="search" size={23} />;
            }}
            dropdownStyle={styles.dropdownStyle}
            renderDropdownIcon={() => {
              return <Icon name="arrow-drop-down" size={35} />;
            }}
            onSelect={(selectedItem, index) => {
              for (let i = 0; i < user.length; i++) {
                const element = user[i];
                if (selectedItem === element.name) {
                  setDataAdd(prev => ({...prev, userDebt: element.id}));
                }
              }
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
          />
          <View style={{marginBottom: 10}}></View>
          <TextInput
            style={styles.input}
            onChangeText={text => {
              setDataAdd(prev => ({...prev, price: text}));
            }}
            value={dataAdd.price}
            keyboardType="numeric"
            placeholder="Nhập tiền mượn"
          />
          <TextInput
            style={styles.input}
            onChangeText={text => {
              setDataAdd(prev => ({...prev, desc: text}));
            }}
            value={dataAdd.desc}
            placeholder="Vì sao cho mượn dãy"
          />
          <View style={styles.btnWrapper}>
            <TouchableOpacity
              style={styles.btnLuu}
              onPress={() => btnLuuHandler()}>
              <Text style={styles.btnLuuText}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
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
    width: '70%',
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
    marginTop: 40,
  },
  btnLuuText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AddDebt;
