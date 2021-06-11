import React from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';

const ScrollParent = ({children}) => {
  return (
    <ScrollView
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled">
      <View style={styles.container}>{children}</View>
    </ScrollView>
  );
};

export default ScrollParent;

const styles = StyleSheet.create({
  container: {padding: 10},
});
