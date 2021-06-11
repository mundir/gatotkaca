import React from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Overlay} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

const lebar = 800;
const tinggi = Math.floor(lebar * 1.3);

const AmbilFoto = ({
  imgDetail,
  setImgDetail,
  setIsLoading,
  produkID,
  onEdit,
}) => {
  const [tampilOverlay, setTampilOverlay] = React.useState(false);
  const [imgIndex, setImgIndex] = React.useState(0);

  const settingImg = {
    mediaType: 'photo',
    includeBase64: false,
    maxWidth: lebar,
    maxHeight: tinggi,
  };

  function getImgDetail(i) {
    setImgIndex(i);
    setTampilOverlay(true);
  }

  function ambilKamera() {
    setTampilOverlay(false);
    launchCamera(settingImg, hasil => {
      memprosesImg(hasil);
    });
  }

  function ambilGaleri() {
    setTampilOverlay(false);
    launchImageLibrary(settingImg, hasil => {
      memprosesImg(hasil);
    });
  }

  const memprosesImg = hasil => {
    if (!hasil.didCancel) {
      let tempArr = [...imgDetail];
      const ast = hasil.assets[0];
      tempArr[imgIndex] = {uri: ast.uri};
      setImgDetail(tempArr);
      if (onEdit) {
        uploadImage(ast.uri);
      }
    }
  };

  async function uploadImage(uri) {
    setIsLoading(true);
    const tref = `/produk/${produkID}/detail${imgIndex}.jpg`;
    try {
      await storage().ref(tref).putFile(uri);
      Alert.alert('SUKSES', 'Suskses Upload Image');
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  const listFoto = [
    {
      onPress: () => ambilKamera(),
      label: 'Ambil Foto Kamera',
    },
    {
      onPress: () => ambilGaleri(),
      label: 'Ambil Foto Galeri',
    },
  ];

  return (
    <View>
      <Text style={styles.label}>Foto Detail</Text>
      <View style={styles.row}>
        {imgDetail.map((v, i) => {
          return (
            <TouchableOpacity
              key={i}
              onPress={() => getImgDetail(i)}
              style={styles.kotak}>
              <Image source={v} style={styles.image} />
            </TouchableOpacity>
          );
        })}
        <View style={styles.wrapKotak}>
          <TouchableOpacity
            onPress={() => getImgDetail(imgDetail.length)}
            style={styles.kotakKosong}>
            <Icon name="plus-circle" size={20} color="red" />
          </TouchableOpacity>
        </View>
      </View>
      <Overlay
        isVisible={tampilOverlay}
        onBackdropPress={() => setTampilOverlay(false)}>
        {listFoto.map((v, i) => (
          <TouchableOpacity
            onPress={v.onPress}
            style={styles.ddkotakList}
            key={i}>
            <Text style={styles.ddItemList}>{v.label}</Text>
          </TouchableOpacity>
        ))}
      </Overlay>
    </View>
  );
};

export default AmbilFoto;

const styles = StyleSheet.create({
  ddLabel: {fontWeight: 'bold', color: 'gray'},
  ddVal: {fontStyle: 'italic', fontSize: 18},
  ddkotakList: {
    width: 200,
    padding: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.7,
  },
  label: {marginLeft: 15, fontWeight: 'bold', color: 'gray'},
  row: {flexDirection: 'row'},
  kotak: {
    width: 100,
    height: 100,
    backgroundColor: '#d1d1d1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginRight: 5,
  },
  image: {width: 90, height: 90, resizeMode: 'cover'},
  wrapKotak: {
    width: 100,
    height: 100,
    backgroundColor: '#d1d1d1',
    padding: 5,
  },
  kotakKosong: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'gray',
    borderRadius: 10,
  },
});
