import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Overlay} from 'react-native-elements';

const Dropdown = ({label, nilai, setNilai, dtArray}) => {
  const [tampil, setTampil] = React.useState(false);

  function listPress(i) {
    setNilai(dtArray[i].value);
    setTampil(false);
  }

  return (
    <View>
      <TouchableOpacity style={styles.dropdown} onPress={() => setTampil(true)}>
        <Text style={styles.ddLabel}>{label}</Text>
        <Text style={styles.ddVal}>{nilai}</Text>
      </TouchableOpacity>
      <Overlay isVisible={tampil} onBackdropPress={() => setTampil(false)}>
        {dtArray.map((v, i) => (
          <TouchableOpacity
            onPress={() => listPress(i)}
            style={styles.ddkotakList}
            key={i}>
            <Text style={styles.ddItemList}>
              {v.value}: {v.label}
            </Text>
          </TouchableOpacity>
        ))}
      </Overlay>
    </View>
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  dropdown: {
    padding: 15,
    marginBottom: 10,
    borderColor: 'gray',
    borderRadius: 5,
    borderWidth: 0.7,
  },
  ddLabel: {fontWeight: 'bold', color: 'gray'},
  ddVal: {fontStyle: 'italic', fontSize: 18},
  ddkotakList: {
    width: 200,
    padding: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.7,
  },
});
