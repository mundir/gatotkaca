import React from 'react';
import {StyleSheet, View} from 'react-native';

const CardList = ({children}) => {
  return <View style={styles.card}>{children}</View>;
};

export default CardList;

const styles = StyleSheet.create({
  card: {
    padding: 10,
    borderColor: 'gray',
    borderWidth: 0.8,
    borderRadius: 3,
    marginBottom: 5,
  },
});
