/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useCallback} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Color from '../constants/Color';
import Card from '../components/Card';
import UserCard from '../components/UserCard';
import {useSelector, useDispatch} from 'react-redux';
import * as userActions from '../store/action/user';
import * as debtActions from '../store/action/Debt';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Main = ({props, navigation, route}) => {
  const user = useSelector(state => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const debtAll = useSelector(state => state.debt.all);
  const debt = useSelector(state => {
    let rs = [];
    for (let i = 0; i < state.debt.debt.length; i++) {
      const element = state.debt.debt[i];
      if (element.isPay === false) {
        rs.push(element);
      }
    }
    let kq = [];
    if (rs.length > 5) {
      kq = rs.splice(0, 5);
    } else {
      kq = rs;
    }

    return kq;
  });
  const loan = useSelector(state => {
    let rs = [];
    if (state.debt.loan.length > 5) {
      rs = state.debt.loan.splice(0, 5);
    } else {
      rs = state.debt.loan;
    }

    return rs;
  });

  const thanhtoan = useSelector(state => {
    let rs = state.debt.thanhtoan;
    return rs;
  });
  const [userLogin, setUserLogin] = useState({
    id: 0,
    taikhoan: '',
    name: '',
    pass: 123,
    avt: 'https://scontent.fsgn5-3.fna.fbcdn.net/v/t39.30808-6/255411715_1934936103353687_605317877554095147_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=ehJBqYmvw14AX-e1fFu&_nc_ht=scontent.fsgn5-3.fna&oh=00_AT9D9DlngDWTYoBs3VSCSIBbQd22cl6_yrlu3pD9XLFRWQ&oe=62EAB071',
  });
  const format = amount => {
    return (
      Number(amount)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,') + 'Đ'
    );
  };
  const dispatch = useDispatch();
  const loadData = useCallback(async () => {
    try {
      await dispatch(userActions.fetchAll());
      if (userLogin.id !== 0) {
        await dispatch(debtActions.fetchData(userLogin.id));
      }
    } catch (err) {}
  }, [dispatch, userLogin.id]);

  useEffect(() => {
    loadData();
  }, [dispatch, loadData, route]);

  const isload = useCallback(async () => {
    try {
      await dispatch(userActions.fetchAll());
      if (userLogin.id !== 0) {
        await dispatch(debtActions.fetchData(userLogin.id));
      }
      setIsLoading(false);
    } catch (err) {}
  }, [dispatch, setIsLoading, userLogin.id]);

  useEffect(() => {
    setIsLoading(true);
    isload().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, isload]);

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

  const divayhandler = props => {
    navigation.navigate('debtDetail', {idDebt: props.id});
  };

  const profileHandler = () => {
    console.log('first');
    AsyncStorage.clear();
    navigation.replace('auth');
  };

  const viewAllDebt = props => {
    navigation.navigate('viewalldebt', {
      idLogin: userLogin.id,
      trangthai: props.trangthai,
    });
  };
  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={debt}
        onRefresh={isload}
        refreshing={isLoading}
        keyExtractor={item => Math.random()}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        ListHeaderComponent={
          <View>
            {/* HEADER */}
            <View style={styles.headerContainerTitle}>
              <View style={{}}>
                <Text style={styles.headerText}>Hello {userLogin.name}</Text>
                <Text style={styles.headerText1}>
                  Hãy thanh toán nợ nần đi nào !!!
                </Text>
              </View>
              <TouchableOpacity
                style={styles.profileContainer}
                onPress={() => profileHandler()}>
                <Image
                  style={styles.imgProfile}
                  source={{uri: userLogin.avt}}
                />
              </TouchableOpacity>
            </View>
            {/* <View style={styles.seeViewRecipe}>
              <Image
                style={styles.imgSee}
                source={{
                  uri: 'https://cafefcdn.com/thumb_w/650/203337114487263232/2021/8/11/photo1628641528786-16286415294652056925705.jpg',
                }}
              />
              <View style={styles.textSee}>
                <Text style={{}}>Bạn có 12 khoản nợ mới trong hôm nay !!</Text>
                <TouchableOpacity style={{marginTop: 10}}>
                  <Text style={styles.seeViewRecipexem}>Xem ngay.</Text>
                </TouchableOpacity>
              </View>
            </View> */}
            {/* trending recipe */}
            <View style={styles.trendingRecipe}>
              <Text style={{fontFamily: 'OpenSans-BoldText', fontSize: 18}}>
                Thành viên khác
              </Text>
              <FlatList
                data={user}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={data => {
                  if (data.item.id !== userLogin.id) {
                    return (
                      <UserCard
                        imgUrl={data.item.avt}
                        categoryId={''}
                        name={data.item.name}
                        total={format(
                          debtAll.reduce((prev, curr) => {
                            if (
                              curr.userDebt === data.item.id &&
                              !curr.isPay &&
                              curr.userLoan === userLogin.id
                            ) {
                              return prev + Number(curr.price);
                            } else {
                              return prev;
                            }
                          }, 0),
                        )}
                        totalMuon={format(
                          debtAll.reduce((prev, curr) => {
                            if (
                              curr.userLoan === data.item.id &&
                              !curr.isPay &&
                              curr.userDebt === userLogin.id
                            ) {
                              return prev + Number(curr.price);
                            } else {
                              return prev;
                            }
                          }, 0),
                        )}
                        onPress={() => {}}
                      />
                    );
                  }
                }}
              />
            </View>
            {/* thanhtoan */}
            <View style={styles.categoryHeader}>
              <Text
                style={{
                  fontFamily: 'OpenSans-BoldText',
                  color: Color.gray21,
                  fontSize: 20,
                }}>
                Lịch sử thanh toán
              </Text>
              <TouchableOpacity
                onPress={() => viewAllDebt({trangthai: 'thanhtoan'})}>
                <Text style={{color: 'gray', marginRight: 10}}>Tất cả</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.thanhtoan}>
              <FlatList
                data={thanhtoan}
                keyExtractor={item => Math.random()}
                showsHorizontalScrollIndicator={false}
                renderItem={data => (
                  <View>
                    {user.length > 0 && (
                      <Card
                        name={user.map(temp => {
                          if (data.item.userLoan === userLogin.id) {
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
                        onPress={() => divayhandler({id: data.item.id})}
                        isIconDi={
                          data.item.userLoan === userLogin.id ? false : true
                        }
                        isIconVe={
                          data.item.userLoan === userLogin.id ? true : false
                        }
                      />
                    )}
                  </View>
                )}
              />
            </View>
            {/* Category header */}
            <View style={styles.categoryHeader}>
              <Text
                style={{
                  fontFamily: 'OpenSans-BoldText',
                  color: Color.gray21,
                  fontSize: 20,
                }}>
                Lịch sử đi vay
              </Text>
              <TouchableOpacity
                onPress={() => viewAllDebt({trangthai: 'divay'})}>
                <Text style={{color: 'gray', marginRight: 10}}>Tất cả</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={data => (
          <View>
            {user.length > 0 && (
              <Card
                name={user.map(temp => {
                  if (temp.id === data.item.userLoan) {
                    return temp.name;
                  }
                })}
                imgUrl={data.item.avt}
                date={data.item.dateCreate}
                price={data.item.price}
                desc={data.item.desc}
                onPress={() => divayhandler({id: data.item.id})}
              />
            )}
          </View>
        )}
        ListFooterComponent={
          <View style={styles.footer}>
            <View style={styles.categoryHeader}>
              <Text
                style={{
                  fontFamily: 'OpenSans-BoldText',
                  color: Color.gray21,
                  fontSize: 20,
                }}>
                Lịch sử cho vay
              </Text>
              <TouchableOpacity
                onPress={() => viewAllDebt({trangthai: 'chovay'})}>
                <Text style={{color: 'gray', marginRight: 10}}>Tất cả</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.thanhtoan}>
              <FlatList
                data={loan}
                keyExtractor={item => Math.random()}
                showsHorizontalScrollIndicator={false}
                renderItem={data =>
                  data.item.isPay === false && (
                    <View>
                      {user.length > 0 && (
                        <Card
                          name={user.map(temp => {
                            if (temp.id === data.item.userDebt) {
                              return temp.name;
                            }
                          })}
                          imgUrl={data.item.avt}
                          date={data.item.dateCreate}
                          desc={data.item.desc}
                          price={data.item.price}
                          onPress={() => divayhandler({id: data.item.id})}
                        />
                      )}
                    </View>
                  )
                }
              />
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  thanhtoan: {},
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  wrapper: {},

  footer: {
    marginBottom: 100,
  },
  name: {
    color: 'black',
  },
  //#region HEADER

  headerContainerTitle: {
    marginLeft: 10,
    marginVertical: 5,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontFamily: 'OpenSans-BoldText',
    fontSize: 20,
    color: Color.lightSeaGreen,
  },
  headerText1: {
    color: 'grey',
  },
  profileContainer: {
    height: 50,
    width: 50,
    marginRight: 10,
    borderRadius: 25,
    overflow: 'hidden',
  },
  imgProfile: {
    height: '100%',
    width: '100%',
  },
  //#endregion

  //#region SearchBar
  searchBar: {
    backgroundColor: Color.lightGray,
    marginHorizontal: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
  },
  textInput: {},
  //#endregion
  //#region SeeRecipe
  seeViewRecipe: {
    backgroundColor: '#EBFFFF',
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imgSee: {
    height: 70,
    width: '25%',
    borderRadius: 10,
  },
  textSee: {
    width: '75%',
    marginHorizontal: 7,
  },
  //#endregion
  //#region trending recipe
  trendingRecipe: {
    marginVertical: 5,
    marginHorizontal: 10,
  },
  //#endregion
  //#region Category header
  categoryHeader: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 5,
    marginHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  //#endregion
  seeViewRecipexem: {
    color: Color.lightSeaGreen,
    textDecorationColor: Color.lightSeaGreen,
    textDecorationLine: 'underline',
    fontFamily: 'OpenSans-BoldText',
  },
});

export default Main;
