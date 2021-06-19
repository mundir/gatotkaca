import React, {useRef} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import {lebar} from '../fungsi/Dimensi';
import FastImage from 'react-native-fast-image';

const ShareImg = ({src, keterangan, setSelesai}) => {
  const viewShotRef = useRef();

  async function ambilShot() {
    const imgURI = await viewShotRef.current.capture();

    // const shareOptions = {
    //   title: 'Share via',
    //   message: keterangan,
    //   url: imgURI,
    //   social: Share.Social.WHATSAPP,
    // };
    // Share.shareSingle(shareOptions)
    Share.open({
      title: 'Jawa Koi Center',
      subject: 'info',
      message: keterangan,
      url: imgURI,
    })
      .then(res => {
        console.log(res);
        setSelesai(false);
      })
      .catch(err => {
        setSelesai(false);
        err && console.log(err);
      });
  }
  return (
    <ViewShot ref={viewShotRef} options={{format: 'png'}}>
      <View style={{backgroundColor: 'white'}}>
        {/* <FastImage
        source={src}
        style={{width: lebar, height: lebar, resizeMode: 'contain'}}
        onLoad={ambilShot}
      /> */}
        <FastImage
          style={{width: lebar, height: lebar}}
          source={src}
          resizeMode={FastImage.resizeMode.contain}
          onLoad={ambilShot}
        />
        <Text style={{padding: 10}}>{keterangan}</Text>
      </View>
    </ViewShot>
  );
};

export default ShareImg;

const styles = StyleSheet.create({});
