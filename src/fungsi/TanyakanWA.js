import {Linking, Alert} from 'react-native';

function TanyakanWA(isi) {
  let url = 'whatsapp://send?text=' + isi + '&phone=6289615221998';
  Linking.openURL(url)
    .then(data => {
      console.log('WhatsApp Opened');
    })
    .catch(() => {
      Alert.alert(
        'Perhatian',
        'tidak dapat terhubung dengan WA, pastikan HP anda sudah terinstall WA!',
      );
    });
}

export default TanyakanWA;
