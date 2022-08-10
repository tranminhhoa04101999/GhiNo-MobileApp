export const LOGIN = 'LOGIN';
import {LINKBASE} from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';

export const Login = (tk, password) => {
  return async dispatch => {
    try {
      const response = await fetch(`${LINKBASE}/user.json`);

      if (!response.ok) {
        throw new Error('lấy dữ liệu thất bại !!');
      }

      const resData = await response.json();
      await messaging().registerDeviceForRemoteMessages();

      // Get the token
      const token = await messaging().getToken();
      var check = 0;
      for (let i = 0; i < resData.length; i++) {
        const element = resData[i];
        if (element.taikhoan === tk && element.pass == password) {
          AsyncStorage.setItem(
            'account',
            JSON.stringify({
              id: resData[i].id,
              taikhoan: resData[i].taikhoan,
              pass: resData[i].pass,
              avt: resData[i].avt,
              name: resData[i].name,
            }),
          );
          await database()
            .ref(`/user/${Number(element.id) - 1}`)
            .update({
              token: token,
            })
            .then();
          var check = 1;
        }
      }

      if (check === 1) {
        dispatch({type: LOGIN, data: {taikhoan: tk, matkhau: password}});
      } else {
        throw new Error('Sai thông tin đăng nhập ');
      }
    } catch (error) {
      throw error;
    }
  };
};
