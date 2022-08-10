/* eslint-disable no-shadow */

import React, {useState, useEffect} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useSelector} from 'react-redux';

import database from '@react-native-firebase/database';
import CardTimeline from '../components/CardTimeline';

const ViewAll = () => {
  const user = useSelector(state => state.user);
  const [data, setData] = useState(null);

  const change = () => {
    database()
      .ref('/timeline')
      .limitToLast(40)
      .on('value', snapshot => {
        setData(
          snapshot.val().sort((a, b) => {
            if (a.id - b.id) {
              return -1;
            }
          }),
        );
      });
  };
  useEffect(() => {
    change();

    return () => {};
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={data}
        keyExtractor={item => Math.random()}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        renderItem={data => (
          <View>
            <CardTimeline
              name={user.map(temp => {
                if (temp.id === data.item.userDebt) {
                  return temp.name;
                }
              })}
              timeline={true}
              timelineStatus={data.item.trangthai}
              timelineDesc={user.map(temp => {
                if (temp.id === data.item.userLoan) {
                  return temp.name;
                }
              })}
              date={data.item.dateCreate}
              price={data.item.price}
              desc={data.item.desc}
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

export default ViewAll;
