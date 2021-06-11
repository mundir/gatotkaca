import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
  View,
  Image,
} from 'react-native';
import Konstanta from './Konstanta';
import FastImage from 'react-native-fast-image';
import {ribuan} from './Fungsi';
import Icon from 'react-native-vector-icons/FontAwesome';
import sold from '../assets/sold2.png';

const lebar = Dimensions.get('window').width;
const numColumns = 2;

const ProdukItem = ({datas, onDetail, onBeli, onChat, onShare}) => {
  const url = `${Konstanta.api.imgBarang}/${datas.id}/${datas.img}`;
  if (datas.empty) {
    return <View style={[styles.itemStyle, styles.itemInvisible]} />;
  }

  return (
    <View style={styles.itemStyle}>
      <View style={styles.cardItem}>
        <View>
          <TouchableOpacity onPress={onDetail} style={styles.imgWrap}>
            <FastImage
              style={styles.productImg}
              source={{uri: url}}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
          {datas.status === 'habis' && (
            <View style={styles.soldWrap}>
              <Image source={sold} style={styles.soldImg} />
            </View>
          )}
        </View>
        <View style={styles.cardData}>
          <Text
            style={styles.tNamaProduk}
            numberOfLines={2}
            ellipsizeMode="tail">
            {datas.nama}
          </Text>
          <Text style={styles.tField}>Jenis {datas.namaJenis}</Text>
          <View style={styles.rowBagikan}>
            <TouchableOpacity onPress={onChat}>
              <Text style={{color: 'green'}}>
                <Icon name="whatsapp" size={16} color="green" /> Chat
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onShare}>
              <Text style={{color: Konstanta.warna.dua}}>
                <Icon name="share-alt" size={16} color={Konstanta.warna.dua} />{' '}
                Bagikan
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.tField}>Stok {datas.stok}</Text>
            <Text style={styles.tField}>terjual {datas.terjual}</Text>
          </View>
          <Text style={styles.tHarga}>Rp {ribuan(datas.harga)}</Text>
          <TouchableOpacity
            disabled={datas.status === 'habis' ? true : false}
            style={styles.tombol}
            onPress={onBeli}>
            <Icon name="cart-plus" size={18} color="#fff" />
            <Text style={styles.tombolText}> Beli </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProdukItem;

const styles = StyleSheet.create({
  containerList: {padding: 5, marginBottom: 100},
  itemStyle: {
    padding: 3,
    // height: (lebar / numColumns) * 1.7,
    width: Math.floor(lebar / numColumns) - 5,
  },
  cardItem: {
    backgroundColor: 'white',
    flex: 1,
    borderWidth: 0.5,
    borderColor: Konstanta.warna.disabled,
    borderRadius: 10,
  },
  imgWrap: {borderRadius: 10},
  productImg: {
    borderRadius: 10,
    width: '100%',
    height: (lebar / numColumns) * 1.2,
  },
  soldWrap: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.37)',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  soldImg: {width: '100%', height: 120, resizeMode: 'contain'},
  cardData: {padding: 10},
  tNamaProduk: {color: Konstanta.warna.satu},
  fieldRow: {flexDirection: 'row', justifyContent: 'space-between'},
  rowBagikan: {
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tField: {fontSize: 10, color: Konstanta.warna.text},
  tHarga: {
    textAlign: 'right',
    fontSize: 18,
    fontWeight: 'bold',
    color: Konstanta.warna.satu,
  },
  tombol: {
    backgroundColor: Konstanta.warna.satu,
    borderRadius: 10,
    flexDirection: 'row',
    paddingVertical: 11,
    justifyContent: 'center',
  },
  tombolText: {fontWeight: 'bold', color: 'white'},
  itemInvisible: {backgroundColor: 'transparent'},
});
