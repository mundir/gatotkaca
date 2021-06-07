import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Dimensions,
  TouchableHighlight,
  Pressable,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Konstanta from '../fungsi/konst';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ribuan} from '../fungsi/myFunc';
import imgSold from '../aset/sold2.png';
import Tombol from './Tombol';

const lebarHalf = Dimensions.get('window').width / 2;
const numCols = 2;

const formatData = dataList => {
  const totalRows = Math.floor(dataList.length / numCols);
  let totalLastRow = dataList.length - totalRows * numCols;

  while (totalLastRow !== 0 && totalLastRow !== numCols) {
    dataList.push({id: 'kosong', empty: true});
    totalLastRow++;
  }
  return dataList;
};

const ListProduk = () => {
  const initData = [
    {
      id: 'A001',
      img: 'img1.jpg',
      nama: 'Ini Adalah Produk kesatu',
      harga: 20000,
      diskon: 2,
      stok: 3,
      terjual: 4,
    },
    {
      id: 'A002',
      img: 'img2.jpg',
      nama: 'Ini Adalah Produk kesatu',
      harga: 20000,
      diskon: 2,
      stok: 3,
      terjual: 4,
    },
    {
      id: 'A003',
      img: 'img3.jpg',
      nama: 'Ini Adalah Produk kesatu',
      harga: 20000,
      diskon: 2,
      stok: 3,
      terjual: 4,
    },
    {
      id: 'A004',
      img: 'img4.jpg',
      nama: 'Ini Adalah Produk kesatu',
      harga: 20000,
      diskon: 2,
      stok: 3,
      terjual: 4,
    },
    {
      id: 'A005',
      img: 'img5.jpg',
      nama: 'Ini Adalah Produk kesatu',
      harga: 20000,
      diskon: 2,
      stok: 3,
      terjual: 4,
    },
    {
      id: 'A006',
      img: 'img6.jpg',
      nama: 'Ini Adalah Produk kesatu',
      harga: 20000,
      diskon: 2,
      stok: 3,
      terjual: 4,
    },
    {
      id: 'A007',
      img: 'img7.jpg',
      nama: 'Ini Adalah Produk kesatu',
      harga: 20000,
      diskon: 2,
      stok: 3,
      terjual: 4,
    },
    {
      id: 'A008',
      img: 'img8.jpg',
      nama: 'Ini Adalah Produk kesatu',
      harga: 20000,
      diskon: 2,
      stok: 3,
      terjual: 4,
    },
    {
      id: 'A009',
      img: 'img9.jpg',
      nama: 'Ini Adalah Produk kesatu',
      harga: 20000,
      diskon: 2,
      stok: 3,
      terjual: 4,
    },
  ];

  const RenderItem = ({item, index}) => <ProdukItem dtx={item} />;
  return (
    <View style={styles.containerList}>
      <FlatList
        data={formatData(initData)}
        renderItem={RenderItem}
        keyExtractor={item => item.id}
        numColumns={numCols}
      />
    </View>
  );
};

export default ListProduk;

const styles = StyleSheet.create({
  containerList: {marginBottom: 100},
  itemStyle: {width: lebarHalf, padding: 5},
  cardItem: {
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 10,
  },
  imgWrap: {alignItems: 'center', marginTop: 5},
  productImg: {width: lebarHalf - 25, height: lebarHalf},
  cardData: {paddingHorizontal: 10, paddingVertical: 3},
  tNamaProduk: {height: 40, color: Konstanta.warna.satu, fontWeight: 'bold'},
  fieldRow: {flexDirection: 'row', justifyContent: 'space-between'},
  tHarga: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Konstanta.warna.satu,
    textAlign: 'right',
  },
  tField: {color: Konstanta.warna.text, fontSize: 12},
});

const ProdukItem = ({dtx, onImg, onBeli}) => {
  // const url = `${Konstanta.api.imgBarang}/${dtx.id}/${dtx.img}`;
  const urlImg = `${Konstanta.api.imgBarang}/${dtx.img}`;
  const diskonRp =
    dtx.diskon > 0 ? Math.floor((dtx.diskon / 100) * dtx.harga) : 0;
  if (dtx.empty) {
    return <View style={[styles.itemStyle, styles.itemInvisible]} />;
  }

  return (
    <View style={styles.itemStyle}>
      <View style={styles.cardItem}>
        <Pressable>
          <View>
            <View onPress={onImg} style={styles.imgWrap}>
              <FastImage
                style={styles.productImg}
                source={{uri: urlImg}}
                resizeMode={FastImage.resizeMode.cover}
              />
            </View>
            {dtx.status === 'habis' && (
              <View style={styles.soldWrap}>
                <Image source={imgSold} style={styles.soldImg} />
              </View>
            )}
          </View>
          <View style={styles.cardData}>
            <Text
              style={styles.tNamaProduk}
              numberOfLines={2}
              ellipsizeMode="tail">
              {dtx.nama}
            </Text>
            <View style={styles.fieldRow}>
              <Text style={styles.tField}>Stok {dtx.stok}</Text>
              <Text style={styles.tField}>terjual {dtx.terjual}</Text>
            </View>
            {diskonRp > 0 && (
              <View style={styles.fieldRow}>
                <Text
                  style={[styles.tField, {textDecorationLine: 'line-through'}]}>
                  Rp {ribuan(dtx.harga)}
                </Text>
                <Text style={styles.tField}>Disc {dtx.diskon}%</Text>
              </View>
            )}
            <Text style={styles.tHarga}>Rp {ribuan(dtx.harga - diskonRp)}</Text>
          </View>
        </Pressable>
        <View style={[styles.cardData, {marginBottom: 5}]}>
          <Tombol icon="home" warna={Konstanta.warna.satu} text="beli" />
        </View>
      </View>
    </View>
  );
};
