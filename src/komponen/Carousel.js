import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Image, FlatList, View, Dimensions} from 'react-native';
import database from '@react-native-firebase/database';

const lebar = Dimensions.get('window').width;

const Carousel = () => {
  const [banners, setBanners] = useState([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [tunggu, setTunggu] = useState(null);

  const indexRef = useRef();

  useEffect(() => {
    readData();
  }, []);

  function readData() {
    database()
      .ref('/banner')
      .once('value')
      .then(snapshot => {
        if (snapshot.exists()) {
          const hasil = snapshot.val();
          setBanners(hasil);
          setTunggu(5000);
        } else {
          setTunggu(null);
        }
      });
  }

  function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  useInterval(() => {
    // Your custom logic here
    let x = bannerIndex;
    const pj = banners.length;
    if (x < pj - 1) {
      x = x + 1;
    } else {
      x = 0;
    }
    indexRef.current.scrollToIndex({index: x});
    setBannerIndex(x);
  }, tunggu);

  const renderItem = ({item, index}) => <Item url={item.img} />;
  return (
    <FlatList
      data={banners}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      pagingEnabled={true}
      horizontal={true}
      ref={indexRef}
      onScrollToIndexFailed={() => indexRef.current.scrollToIndex({index: 0})}
      // initialNumToRender={banners.length}
    />
  );
};

export default Carousel;

const Item = ({url}) => (
  <View>
    <Image style={styles.banner} source={{uri: url}} />
  </View>
);

const styles = StyleSheet.create({
  banner: {width: lebar, height: lebar / 2},
});
