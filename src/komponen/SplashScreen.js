/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Image, View, ActivityIndicator} from 'react-native';
import logo from '../assets/jkc.png';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={logo}
        style={{
          width: 200,
          height: 200,
          resizeMode: 'contain',
          marginBottom: 30,
        }}
      />
      <ActivityIndicator size="small" color="orangered" />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
