import {LINKBASE} from '../../App';
import database from '@react-native-firebase/database';
export const GETDATA = 'GETDATA';

export const fetchData = userId => {
  return async (dispatch, getState) => {
    const user = getState().user;
    try {
      const response = await fetch(`${LINKBASE}/debt.json`);

      if (!response.ok) {
        throw new Error('lấy dữ liệu thất bại !!');
      }

      const resData = await response.json();
      resData.sort((a, b) => {
        if (a.id - b.id) {
          return -1;
        }
      });
      let avt = '';
      // lấy danh sách mình nợ
      let dataDebt = [];
      for (let i = 0; i < resData.length; i++) {
        const element = resData[i];
        if (element.userDebt === userId) {
          user.map(temp => {
            if (temp.id === element.userLoan) {
              avt = temp.avt;
            }
          });
          dataDebt.push({
            ...element,
            avt: avt,
          });
        }
      }
      // lấy danh sách mình cho mượn
      let dataLoan = [];
      for (let i = 0; i < resData.length; i++) {
        const element = resData[i];
        if (element.userLoan === userId) {
          user.map(temp => {
            if (temp.id === element.userDebt) {
              avt = temp.avt;
            }
          });
          dataLoan.push({
            ...element,
            avt: avt,
          });
        }
      }
      /// danh sách thanh toán
      let thanhtoan = [];
      for (let i = 0; i < resData.length; i++) {
        const element = resData[i];
        if (element.isPay) {
          if (element.userLoan === userId) {
            user.map(temp => {
              if (temp.id === element.userDebt) {
                avt = temp.avt;
              }
            });
            thanhtoan.push({
              ...element,
              avt: avt,
            });
          } else if (element.userDebt === userId) {
            user.map(temp => {
              if (temp.id === element.userLoan) {
                avt = temp.avt;
              }
            });
            thanhtoan.push({
              ...element,
              avt: avt,
            });
          }
        }
      }
      // console.log('thanhtoan', thanhtoan);
      dispatch({
        type: GETDATA,
        data: {
          dataAll: resData,
          dataDebt: dataDebt,
          dataLoan: dataLoan,
          thanhtoan: thanhtoan,
        },
      });
    } catch (error) {
      throw error;
    }
  };
};

export const addDebt = data => {
  return async (dispatch, getState) => {
    const length = getState().debt.all.length;
    data.id = length;
    const user = getState().user;
    let token = '';
    let nameLoan = '';
    let price = '';
    const format = amount => {
      return (
        Number(amount)
          .toFixed(2)
          .replace(/\d(?=(\d{3})+\.)/g, '$&,') + 'Đ'
      );
    };
    user.map(item => {
      if (item.id === data.userDebt) {
        token = item.token;
        nameLoan = item.name;
      }
    });
    try {
      await database()
        .ref(`/debt/${length}`)
        .set(data)
        .then(
          addTimeline({
            debtId: length,
            userDebt: data.userDebt,
            userLoan: data.userLoan,
            price: data.price,
            desc: data.desc,
            trangthai: 'muon',
            dateCreate: data.dateCreate,
          }),
        );
      if (token === '') {
        console.log('token trong');
      } else {
        price = format(data.price);
        await fetch(
          `https://ghinothongbao.herokuapp.com/home?tokens=${token}&nameLoan=${nameLoan}&price=${price}&desc=${data.desc}`,
        )
          .then(response => response)
          .then(data => {});
      }
    } catch (error) {
      throw error;
    }
  };
};

export const addTimeline = data => {
  return async (dispatch, getState) => {
    try {
      let rs = [];
      await database()
        .ref('/timeline')
        .once('value')
        .then(snapshot => {
          console.log('User data: ', snapshot.val());
          rs = snapshot.val();
        });

      await database()
        .ref(`/timeline/${rs.length}`)
        .set({
          id: rs.length,
          debtId: data.debtId,
          userDebt: data.userDebt,
          userLoan: data.userLoan,
          price: data.price,
          desc: data.desc,
          trangthai: data.trangthai,
          dateCreate: data.dateCreate,
          avt: data.avt,
        })
        .then(() => console.log('ecec'));
    } catch (error) {
      throw error;
    }
  };
};
export const thanhtoan = ({id, desc}) => {
  return async (dispatch, getState) => {
    try {
      let rs = {};
      await database()
        .ref(`/debt/${id}`)
        .once('value')
        .then(snapshot => {
          console.log('User data: ', snapshot.val());
          rs = snapshot.val();
        });
      await database()
        .ref(`/debt/${id}`)
        .update({
          descPay: desc,
          isPay: true,
          dateEnd: new Date().toUTCString(),
        })
        .then(
          addTimeline({
            debtId: id,
            userDebt: rs.userDebt,
            userLoan: rs.userLoan,
            price: rs.price,
            desc: rs.desc,
            trangthai: 'thanhtoan',
            dateCreate: rs.dateCreate,
          }),
        );
    } catch (error) {
      throw error;
    }
  };
};
