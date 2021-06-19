import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  Button,
  PermissionsAndroid,
} from 'react-native';
import {Card} from 'react-native-elements';
import database from '@react-native-firebase/database';
import RNFetchBlob from 'rn-fetch-blob';

const Pembayaran = () => {
  const [tbData, setTbData] = useState({});
  const [tbBank, setTbBank] = useState({});
  const [tbQris, setTbQris] = useState({});

  useEffect(() => {
    getDt();
  }, []);

  function getDt() {
    const dbRef = database().ref('/setting/pembayaran');
    dbRef.once('value').then(snapshot => {
      if (snapshot.exists()) {
        setTbData(snapshot.val());
        setTbBank(snapshot.val().bri);
        setTbQris(snapshot.val().qris);
        console.log(snapshot.val());
      }
    });
  }

  const checkPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Perbolehkan aplikasi menyimpan data',
          message:
            'Jawa Koi Center membutuhkan akses penyimpanan untuk mendownload file ',
          buttonNeutral: 'Lain kali',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        downloadFile();
        console.log('Storage Permission Granted.');
      } else {
        Alert.alert('Error', 'Anda tidak mengizinkan mendownload file');
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const downloadFile = () => {
    let date = new Date();
    let FILE_URL = tbQris.qrcode;
    let file_ext = getFileExtention(FILE_URL);

    file_ext = '.' + file_ext[0];
    file_ext = file_ext.substring(0, file_ext.indexOf('?'));
    console.log(file_ext);
    const {config, fs} = RNFetchBlob;
    let RootDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir +
          '/file_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        description: 'downloading file...',
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true,
      },
    };

    config(options)
      .fetch('GET', FILE_URL)
      .then(res => {
        // Alert after successful downloading
        console.log('res -> ', JSON.stringify(res));
        Alert.alert('File Downloaded Successfully.');
      })
      .catch(e => console.log(e));
  };

  const getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };

  return (
    <View>
      <Card>
        <Card.Title>TRANSFER BANK</Card.Title>
        <Card.Divider />
        <View style={{flexDirection: 'row'}}>
          <Text style={{width: 100}}>Nama Bank</Text>
          <Text style={{flex: 1}}>{tbBank.namaBank}</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={{width: 100}}>Atas Nama</Text>
          <Text style={{flex: 1}}>{tbBank.atasNama}</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={{width: 100}}>No. Rekening</Text>
          <Text selectable style={{flex: 1}}>
            {tbBank.noRek}
          </Text>
        </View>
        {/* <Card.Image source={require('../images/pic2.jpg')}></Card.Image> */}
      </Card>
      <Card>
        <Card.Title>QRIS</Card.Title>
        <Card.Divider />
        <Text>
          Scan QR-Code berikut untuk melakukan pembayaran menggunakan OVO, DANA,
          GOPAY, LINKAJA atau SHOPEEPAY
        </Text>
        <View style={{alignItems: 'center'}}>
          <Image
            source={{uri: tbQris.qrcode}}
            style={{width: 250, height: 250}}
          />
          <View>
            <Button title="DOWNLOAD QRCODE" onPress={checkPermission} />
          </View>
        </View>
      </Card>
    </View>
  );
};

export default Pembayaran;

const styles = StyleSheet.create({});
