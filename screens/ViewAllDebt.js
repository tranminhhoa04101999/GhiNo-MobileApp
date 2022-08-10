/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Card from '../components/Card';
import {useSelector} from 'react-redux';

import database from '@react-native-firebase/database';

const ViewAllDebt = ({navigation, route}) => {
  const {idLogin, trangthai} = route.params;
  const user = useSelector(state => state.user);
  const [dataDebt, setDataDebt] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const change = () => {
    database()
      .ref('/debt')
      .once('value')
      .then(snapshot => {
        let rs = [];
        rs = snapshot.val().sort((a, b) => {
          if (a.id - b.id) {
            return -1;
          }
        });
        let kq = [];
        for (let i = 0; i < rs.length; i++) {
          let element = rs[i];

          if (trangthai === 'thanhtoan') {
            if (element.userLoan === idLogin || element.userDebt === idLogin) {
              if (element.isPay === true) {
                if (element.userLoan === idLogin) {
                  for (let j = 0; j < user.length; j++) {
                    const element1 = user[j];
                    if (element.userDebt === element1.id) {
                      element = {...element, avt: element1.avt};
                    }
                  }
                } else {
                  for (let j = 0; j < user.length; j++) {
                    const element1 = user[j];
                    if (element.userLoan === element1.id) {
                      element = {...element, avt: element1.avt};
                    }
                  }
                }
                kq.push(element);
              }
            }
          } else if (trangthai === 'divay') {
            if (element.userDebt === idLogin && element.isPay === false) {
              for (let j = 0; j < user.length; j++) {
                const element1 = user[j];
                if (element.userLoan === element1.id) {
                  element = {...element, avt: element1.avt};
                }
              }

              kq.push(element);
            }
          } else if (trangthai === 'chovay') {
            if (element.userLoan === idLogin && element.isPay === false) {
              for (let j = 0; j < user.length; j++) {
                const element1 = user[j];
                if (element.userDebt === element1.id) {
                  element = {...element, avt: element1.avt};
                }
              }
              kq.push(element);
            }
          }
        }
        setDataDebt(kq);
      });
  };
  useEffect(() => {
    change();

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const divayhandler = props => {
    navigation.navigate('debtDetail', {idDebt: props.id});
  };
  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={dataDebt}
        onRefresh={change}
        refreshing={isLoading}
        keyExtractor={item => Math.random()}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        renderItem={data => (
          <View>
            <Card
              name={user.map(temp => {
                if (data.item.userLoan === idLogin) {
                  if (temp.id === data.item.userDebt) {
                    return temp.name;
                  }
                } else {
                  if (temp.id === data.item.userLoan) {
                    return temp.name;
                  }
                }
              })}
              imgUrl={data.item.avt}
              date={data.item.dateCreate}
              price={data.item.price}
              desc={data.item.descPay}
              isIconDi={data.item.userLoan === idLogin ? false : true}
              isIconVe={data.item.userLoan === idLogin ? true : false}
              onPress={() => divayhandler({id: data.item.id})}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default ViewAllDebt;
