//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {COLOURS} from '../utils/Colours';
import {fp} from '../utils/responsive-screen';
import ProductSans from './Text/ProductSans';

// create a component
const BreadListItemComponent = ({item, onClick}) => {
  //console.log('item', item);

  return (
    <TouchableOpacity
      style={styles.customerNameView}
      activeOpacity={0.6}
      onPress={() => onClick(item)}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{flex: 1.2}}>
          <ProductSans style={styles.productName}>
            {item?.name.trim()}
          </ProductSans>
          <ProductSans style={styles.labelText}>
            {item?.productsize.trim()}
          </ProductSans>
        </View>
        {/* <View style={{flex: 0.12}}>
          <ProductSans
            style={[
              styles.labelText,
              {
                //fontWeight: 'bold',
                fontSize: fp(15),
                color: COLOURS.gray4,
              },
            ]}>
            {item?.count || '0'}
          </ProductSans>
        </View> */}
        <View style={{flex: 0.32}}>
          <ProductSans
            style={[
              styles.labelText,
              {
                fontWeight: 'bold',
                fontSize: fp(19),
                color: COLOURS.labelTextColor,
              },
            ]}>
            {parseInt(item?.sum) == 1 ? item?.sum + ' pc' : item?.sum + ' pcs'}
          </ProductSans>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
  item: {
    backgroundColor: COLOURS.white,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 16,
    paddingHorizontal: 0,
    borderRadius: 10,
    //flex: 1,
  },
  productName: {
    fontSize: fp(16),
    color: COLOURS.textInputColor,
    fontWeight: 'bold',
  },
  priceName: {
    fontSize: fp(15),
    color: COLOURS.textInputColor,
    fontWeight: 'bold',
  },
  quantityName: {
    fontSize: fp(15),
    color: COLOURS.textInputColor,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  customerNameView: {
    backgroundColor: COLOURS.lightGray4,
    padding: 10,
    marginVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  labelText: {
    fontSize: fp(16),
    color: COLOURS.labelTextColor,
    paddingTop: 5,
    paddingBottom: 10,
    // left: 12,
  },
});

//make this component available to the app
export default BreadListItemComponent;
