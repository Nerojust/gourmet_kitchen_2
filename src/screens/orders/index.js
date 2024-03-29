//import liraries
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  Alert,
  Keyboard,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AddComponent from '../../components/AddComponent';
import LoaderShimmerComponent from '../../components/LoaderShimmerComponent';
import OrderProductComponent from '../../components/OrderProductComponent';
import ViewProviderComponent from '../../components/ViewProviderComponent';
import DatePicker from 'react-native-date-picker';
import {
  clearEverythingOrders,
  deleteAllOrders,
  getAllOrderedProducts,
  saveOrderDate,
  setOrderStatus,
  updateCompleteStatusForOrder,
  updateOrderAllItemsByOrderId,
  updateOrderDispatchByOrderId,
} from '../../store/actions/orders';
import ProductSans from '../../components/Text/ProductSans';
import {COLOURS} from '../../utils/Colours';
import dateFormat, {masks} from 'dateformat';
import {getAllProducts, syncZupaProducts} from '../../store/actions/products';
import SearchInputComponent from '../../components/SearchInputComponent';
import SliderTabComponent from '../../components/SliderTabComponent';
import {useIsFocused} from '@react-navigation/native';
import {HeaderComponent} from '../../components/HeaderComponent';
import AsyncStorage from '@react-native-community/async-storage';
import {
  getDateWithoutTime,
  subtractOneDayFromTime,
} from '../../utils/DateFilter';
import moment from 'moment';
import CustomSuccessModal from '../../components/CustomSuccessModal';
import {DIALOG_TIMEOUT} from '../../utils/Constants';
import {useMemo} from 'react';
import {BottomSheetRiderComponent} from '../../components/BottomSheetComponent';
import {getAllRiders} from '../../store/actions/riders';
import {
  dismissBottomSheetDialog,
  getAppVersionNumber,
  showBottomSheet,
} from '../../utils/utils';
import {getAllConfig} from '../../store/actions/config';
import RNExitApp from 'react-native-exit-app';

// create a component
const OrdersScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {
    orders,
    deleteAllOrdersLoading,
    error,
    isOrderUpdated,
    ordersLoading,
    updateOrderLoading,
    orderDate,
  } = useSelector(state => state.orders);
  //console.log('order date is ', orderDate);
  const {riders, rider, ridersLoading, updateRidersLoading} = useSelector(
    state => state.riders,
  );
  const {configArray, config, configLoading} = useSelector(
    state => state.config,
  );
  // console.log('config redux', configArray);
  const [selectedOrderItem, setSelectedOrderItem] = useState();
  const [isDispatched, setIsDispatched] = useState(false);
  var ordersData = Object.assign([], orders);
  const [filteredOrdersData, setFilteredOrdersData] = useState(ordersData);
  var ridersData = Object.assign([], riders);
  const [filteredRidersData, setFilteredRidersData] = useState(ridersData);
  const [ridersInputValue, setRidersInputValue] = useState('');
  const [selectedRider, setSelectedRider] = useState({});
  const [searchInputValue, setSearchInputValue] = useState('');
  const [isSearchCleared, setIsSearchCleared] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusState, setStatusState] = useState('all');
  const [selectedTab, setSelectedTab] = useState(0);
  const [isTabClicked, setIsTabClicked] = useState(false);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [selectedOrderDate, setSelectedOrderDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isSuccessDispatchModalVisible, setIsSuccessDispatchModalVisible] =
    useState(false);
  const {loginError, accessToken} = useSelector(x => x.users);
  //console.log("token is redux",accessToken)

  useEffect(() => {
    dispatch(getAllRiders());
    dispatch(getAllProducts('', 0, 0, null));
  }, []);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     fetchAllData();
  //   });

  //   fetchAllData();
  //   return unsubscribe;
  // }, [isDispatched, statusState, selectedTab, selectedOrderDate]);

  useEffect(() => {
    fetchAllData();
  }, [
    // isDispatched,
    statusState,
    selectedTab,
    selectedOrderDate,
    isOrderUpdated,
    isSuccessDispatchModalVisible
  ]);
  useEffect(() => {
    dispatch(getAllConfig()).then(result => {
      console.log(
        'DB version:',
        result[0].value,
        'App version',
        getAppVersionNumber(),
      );
      //if the DB version is higher, then show the dialog to update the app
      if (parseInt(result[0]?.value) > parseInt(getAppVersionNumber())) {
        // console.log(
        //   'DB version:',
        //   result[0].value,
        //   'App version',
        //   getAppVersionNumber(),
        // );
        Alert.alert(
          'Update Alert',
          `Please update your app to the latest version`,
          [
            {
              text: 'OK',
              onPress: () => {
                RNExitApp.exitApp();
              },
            },
          ],
          {cancelable: false},
        );
      }
    });
  }, []);

  const fetchAllData = () => {
    dispatch(
      getAllOrderedProducts(statusState, getDateWithoutTime(selectedOrderDate)),
    );
  };

  const onRefresh = async () => {
    fetchAllData();
    setIsRefreshing(false);
  };

  const handleClick = item => {
    //console.log("order item",item)
    navigation.navigate('OrderDetails', {
      id: item.id,
      orderDate: getDateWithoutTime(selectedOrderDate),
    });
  };

  const handleFulfillOrderClick = (value, item) => {
    //console.log('dispatch click item', value, item);
    setSelectedOrderItem(item);
    if (value == 'Fulfill') {
      displayFulfillAllDialog(false, item);
    }
    if (value == 'Dispatch') {
      displayFulfillAllDialog(true, item);
    }
  };

  const displayFulfillAllDialog = (showRiderSheet = false, item) => {
    let count = item?.products.length;
    let msg = count > 1 ? 'items' : 'item';

    Alert.alert(
      'Alert',
      `Do you want to ${
        showRiderSheet ? 'fulfill and dispatch ' : ' fulfill'
      } ${item?.products.length} ${msg} in this order?`,
      [
        {
          text: 'No',
          onPress: () => {
            console.log('cancel Pressed');
          },
        },
        {
          text: 'Yes',
          onPress: () => {
            dispatch(
              updateOrderAllItemsByOrderId(item?.id, orderDate, true),
            ).then(result => {
              if (result) {
                if (showRiderSheet) {
                  showBottomSheet(ridersSheetRef);
                } else {
                  showSuccessDialogDispatch();
                }
              }
            });
          },
        },
      ],
      {cancelable: true},
    );
  };

  const renderItems = ({item, index}) => {
    return (
      <OrderProductComponent
        item={item}
        handleClick={handleClick}
        handleDispatchClick={handleFulfillOrderClick}
      />
    );
  };
  const handleSingleItemPress = async (
    item,
    isProduct,
    isDelivery,
    isRider,
  ) => {
    console.log('clicked item is ', item);

    if (isRider) {
      setSelectedRider(item);
      dismissBottomSheetDialog(ridersSheetRef);

      handlePatchDisptach(item);
    }
  };
  const handlePatchDisptach = rider => {
    //console.log('Patch dispatch');
    let payload = {
      riderId: rider?.id,
    };
    console.log('payload dispatch', payload);
    dispatch(updateOrderDispatchByOrderId(selectedOrderItem?.id, payload)).then(
      result => {
        if (result) {
          setSelectedRider({});
          showSuccessDialogDispatch(false);
        }
      },
    );
  };
  handleRefreshIncaseOfNetworkFailure = (isProduct, isDelivery, isRider) => {
    if (isRider) {
      dispatch(getAllRiders());
    }
  };
  const handleRidersSearchText = text => {
    if (text) {
      const newData = riders?.filter(item => {
        const itemData = item?.name
          ? item?.name.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredRidersData(newData);
      setRidersInputValue(text);
    } else {
      setFilteredRidersData(riders);
      setRidersInputValue(text);
    }
  };
  const handleCloseActionRider = () => {
    setRidersInputValue('');
    dismissBottomSheetDialog(ridersSheetRef);
  };
  const handleAllOrders = () => {
    selectTab(0);
    setStatusState('all');
    dispatch(setOrderStatus('all'));
  };
  const handleIncompleteOrders = () => {
    selectTab(1);
    setStatusState('incomplete');
    dispatch(setOrderStatus('incomplete'));
  };
  const handleCompleteOrders = () => {
    selectTab(2);
    setStatusState('completed');
    dispatch(setOrderStatus('completed'));
  };
  const handlePendingOrders = () => {
    selectTab(2);
    setStatusState('pending');
    dispatch(setOrderStatus('pending'));
  };

  const selectTab = tabIndex => {
    if (tabIndex == 0) {
      setSelectedTab(tabIndex);
      setIsTabClicked(true);
    } else if (tabIndex == 1) {
      setSelectedTab(tabIndex);
      setIsTabClicked(true);
    } else if (tabIndex == 2) {
      setSelectedTab(tabIndex);
      setIsTabClicked(true);
    }
  };

  const handleNewOrder = () => {
    navigation.navigate('NewOrder');
  };
  const handleDeleteOrders = () => {
    //console.log('delete clicked');

    Alert.alert(
      'Alert',
      `Do you want to delete all order records for ${getDateWithoutTime(
        orderDate,
      )} ?`,
      [
        {
          text: 'No',
          onPress: () => {
            console.log('cancel Pressed');
          },
        },
        {
          text: 'Yes',
          onPress: () =>
            dispatch(deleteAllOrders(getDateWithoutTime(orderDate))).then(
              result => {
                if (result.isSuccessful) {
                  showSuccessDialog();
                }
              },
            ),
        },
      ],
      {cancelable: true},
    );
  };

  const renderSuccessModal = () => (
    <CustomSuccessModal
      isModalVisible={isSuccessModalVisible}
      dismissModal={showSuccessDialog}
      message={
        'Orders deleted successfully for ' + getDateWithoutTime(orderDate)
      }
      //onPressButton={() => navigation.goBack()}
    />
  );
  const renderSuccessModalDispatch = () => (
    <CustomSuccessModal
      isModalVisible={isSuccessDispatchModalVisible}
      dismissModal={showSuccessDialogDispatch}
      message={'Order fulfilled successfully'}
      //onPressButton={() => navigation.goBack()}
    />
  );

  const showSuccessDialog = () => {
    setIsSuccessModalVisible(!isSuccessModalVisible);
    setTimeout(() => {
      setIsSuccessModalVisible(false);
      // navigation.goBack();
    }, DIALOG_TIMEOUT);
  };
  const showSuccessDialogDispatch = () => {
    setIsSuccessDispatchModalVisible(!isSuccessDispatchModalVisible);
    setTimeout(() => {
      setIsSuccessDispatchModalVisible(false);
      // navigation.goBack();
    }, DIALOG_TIMEOUT);
  };

  const handleSearch = () => {
    setIsSearchClicked(!isSearchClicked);
    handleCancelSearch();
  };

  const handleSearchChange = text => {
    if (text) {
      orders.sort((a, b) => {
        if (b.name > a.name) return -1;
        if (b.name < a.name) return 1;
        return 0;
      });
      const newData = orders?.filter(item => {
        const itemData = item?.customer?.name
          ? item?.customer?.name.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredOrdersData(newData);
      setSearchInputValue(text);
    } else {
      setFilteredOrdersData(orders);
      setSearchInputValue(text);
    }
  };

  const handleCancelSearch = () => {
    setSearchInputValue('');
    setIsSearchCleared(true);
  };
  const refreshData = () => {
    fetchAllData();
  };
  const goToMessageScreen = () => {
    navigation.navigate('CustomMessage');
  };
  const handleSettingsClick = item => {
    // console.log('clicked item', item);
    if (item == 'delete') {
      handleDeleteOrders();
    } else if (item == 'messages') {
      goToMessageScreen();
    }
  };
  const handleAddRider = () => {
    // console.log('add rider');
    navigation.push('AddRider');
    dismissBottomSheetDialog(ridersSheetRef);
  };
  const renderDatePicker = () => {
    return (
      <DatePicker
        modal
        mode={'date'}
        open={open}
        title={'Select order date range'}
        theme={'auto'}
        date={selectedOrderDate || new Date()}
        //minimumDate={subtractOneDayFromTime(new Date(), 1)}
        onConfirm={date => {
          // console.log('date result', date);
          setOpen(false);
          setSelectedOrderDate(date);
          dispatch(saveOrderDate(getDateWithoutTime(date)));
        }}
        onCancel={() => {
          setOpen(false);
          //setSelectedOrderDate('');
        }}
      />
    );
  };

  const toggleDateModal = () => {
    //console.log('opened');
    setOpen(!open);
  };

  const ridersSheetRef = useRef();
  const renderBottomSheet = () => {
    return (
      <BottomSheetRiderComponent
        sheetRef={ridersSheetRef}
        handleRefresh={handleRefreshIncaseOfNetworkFailure}
        isRidersLoading={ridersLoading}
        filteredDataSource={filteredRidersData}
        dataSource={ridersInputValue.length > 0 ? filteredRidersData : riders}
        closeAction={handleCloseActionRider}
        handleSingleItemPress={handleSingleItemPress}
        inputValue={ridersInputValue}
        // handleSearchInputSubmit={handleProductSubmitSearchext}
        handleInputSearchText={handleRidersSearchText}
        addRiderPress={handleAddRider}
      />
    );
  };
  return (
    <ViewProviderComponent>
      <HeaderComponent
        name={'Orders: ' + moment(selectedOrderDate).format('LL')}
        isDashboard
        displayCalendar
        shouldDisplaySettingIcon
        handleSettingsClick={handleSettingsClick}
        toggleDateModal={toggleDateModal}
        performSearch={handleSearch}
        shouldDisplayIcon={orders.length > 0}
        performRefresh={refreshData}
      />
      {isSearchClicked ? (
        <SearchInputComponent
          shouldDisplaySearchView
          searchPlaceholder={'Search by customer name'}
          searchChange={handleSearchChange}
          inputValue={searchInputValue}
          cancelPress={handleCancelSearch}
        />
      ) : null}
      <SliderTabComponent
        isTabClicked={isTabClicked}
        name1={'All'}
        name2={'Pending'}
        name3={'Incomplete'}
        name4={'Complete'}
        selectedTab={selectedTab}
        onPress1={handleAllOrders}
        onPress2={handlePendingOrders}
        onPress3={handleIncompleteOrders}
        onPress4={handleCompleteOrders}
        allowFourth
      />
      {renderDatePicker()}
      {renderBottomSheet()}
      {renderSuccessModal()}
      {renderSuccessModalDispatch()}

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'flex-end',
          paddingRight: 20,
        }}>
        <ProductSans style={{fontSize: 12, color: COLOURS.labelTextColor}}>
          Total count:
          {searchInputValue.length > 0
            ? filteredOrdersData.length
            : orders.length}
        </ProductSans>
      </View>

      <FlatList
        data={searchInputValue.length > 0 ? filteredOrdersData : orders}
        renderItem={renderItems}
        keyExtractor={item => item?.id}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View>
            {!ordersLoading ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                  top: Platform.OS == 'ios' ? 300 : 0,
                  marginTop: Platform.OS == 'android' ? 300 : 0,
                }}>
                <ProductSans
                  style={{fontSize: 16, color: COLOURS.textInputColor}}>
                  No record found
                </ProductSans>
              </View>
            ) : null}
          </View>
        }
      />
      <AddComponent goto={handleNewOrder} />
      <LoaderShimmerComponent isLoading={updateOrderLoading} />
      <LoaderShimmerComponent isLoading={deleteAllOrdersLoading} />
      <LoaderShimmerComponent isLoading={ordersLoading} />
      <LoaderShimmerComponent isLoading={configLoading} />
    </ViewProviderComponent>
  );
};

//make this component available to the app
export default OrdersScreen;
