import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {OrderStackNavigator} from './OrdersNavigator';
import {BreadListStackNavigator} from './BreadListNavigator';
import {StoreSalesStackNavigator} from './StoreSalesNavigator';
import {IMAGES} from '../../utils/Images';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {COLOURS} from '../../utils/Colours';
import ProductSans from '../../components/Text/ProductSans';
import {AnalyticsStackNavigator} from './AnalyticsStackNavigator';

export const HomeStackNavigator = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName="OrdersStack"
      screenOptions={({route, navigation}) => ({
        tabBarOptions: {
          showLabel: false,
          style: styles.tabBg,
        },
        headerShown: false,
        tabBarVisible: false,
        tabBarShowLabel: false,
        tabBarIcon: ({focused, color, size}) => {
          switch (route.name) {
            case 'OrdersStack':
              return (
                <TouchableOpacity
                  style={styles.mainView}
                  activeOpacity={0.6}
                  onPress={() => navigation.navigate('OrdersStack')}>
                  <Image
                    source={
                      focused ? IMAGES.activeOrders : IMAGES.inactiveOrders
                    }
                    resizeMode={'contain'}
                    style={[styles.ordersImage]}
                  />
                  <ProductSans
                    style={[
                      styles.textStyle,
                      !focused ? {color: COLOURS.gray3} : null,
                    ]}>
                    Orders
                  </ProductSans>
                </TouchableOpacity>
              );
            case 'BreadListStack':
              return (
                <TouchableOpacity
                  style={styles.mainView}
                  activeOpacity={0.6}
                  onPress={() => navigation.navigate('BreadListStack')}>
                  <Image
                    source={
                      focused ? IMAGES.activeProducts : IMAGES.inActiveProducts
                    }
                    resizeMode={'contain'}
                    style={[styles.ordersImage]}
                  />
                  <ProductSans
                    style={[
                      styles.textStyle,
                      !focused ? {color: COLOURS.gray3} : null,
                    ]}>
                    Bread List
                  </ProductSans>
                </TouchableOpacity>
              );

            case 'StoreSalesStack':
              return (
                <TouchableOpacity
                  style={styles.mainView}
                  activeOpacity={0.6}
                  onPress={() => navigation.navigate('StoreSalesStack')}>
                  <Image
                    source={
                      focused
                        ? IMAGES.activeDashboard
                        : IMAGES.inActiveDashboard
                    }
                    resizeMode={'contain'}
                    style={[styles.productImage]}
                  />
                  <ProductSans
                    style={[
                      styles.textStyle,
                      !focused ? {color: COLOURS.gray3} : null,
                    ]}>
                    Store Sales
                  </ProductSans>
                </TouchableOpacity>
              );
            case 'AnalyticsStack':
              return (
                <TouchableOpacity
                  style={styles.mainView}
                  activeOpacity={0.6}
                  onPress={() => navigation.navigate('AnalyticsStack')}>
                  <Image
                    source={
                      focused
                        ? IMAGES.activeDashboard
                        : IMAGES.inActiveDashboard
                    }
                    resizeMode={'contain'}
                    style={[styles.productImage]}
                  />
                  <ProductSans
                    style={[
                      styles.textStyle,
                      !focused ? {color: COLOURS.gray3} : null,
                    ]}>
                    Analytics
                  </ProductSans>
                </TouchableOpacity>
              );

            default:
              'OrdersStack';
          }
        },
      })}>
      <Tab.Screen name="OrdersStack" component={OrderStackNavigator} />
      <Tab.Screen name="BreadListStack" component={BreadListStackNavigator} />
      <Tab.Screen name="StoreSalesStack" component={StoreSalesStackNavigator} />
      <Tab.Screen name="AnalyticsStack" component={AnalyticsStackNavigator} />
    </Tab.Navigator>
  );
};
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBg: {
    borderTopWidth: 0.4,
    borderTopColor: COLOURS.lightGray,
    elevation: 0,
    backgroundColor: COLOURS.white,
  },
  textStyle: {fontSize: 10, color: COLOURS.blue},
  dashboardImage: {
    width: 23,
    height: 23,
    flex: 1,
    // bottom: -2,
  },
  ordersImage: {
    width: 27,
    height: 27,
    flex: 1,
    //bottom: -2,
  },

  productImage: {
    width: 28,
    height: 28,
    flex: 1,
    //bottom: -2,
  },
  customerImage: {
    width: 26,
    height: 26,
    flex: 1,
    //bottom: -2,
  },
  moreImage: {
    width: 31,
    height: 30,
    flex: 1,
    // bottom: -2,
  },
});
