import React from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import {deviceHeight} from '../utils/responsive-screen';
import ProductListComponent from '../components/ProductListComponent';
import {COLOURS} from '../utils/Colours';
import DeliveryListComponent from './DeliveryListComponent';
import RiderListComponent from './RiderListComponent';
import BreadSizeComponent from './BreadSizeComponent';
import BreadSizeComponent1 from './BreadSizeComponent1';
import SurplusProductSizeComponent from './SurplusProductSizeComponent';
import {ScrollView, TouchableWithoutFeedback} from 'react-native';

export function BottomSheetProductComponent({
  sheetRef,
  dataSource,
  filteredDataSource,
  handleSingleItemPress,
  addProductPress,
  inputValue,
  handleInputSearchText,
  closeAction,
  isProductLoading,
  handleSearchInputSubmit,
  handleRefresh,
  handleAddProduct,
}) {
  return (
    <RBSheet
      ref={sheetRef}
      animationType={'slide'}
      closeDuration={0}
      openDuration={0}
      closeOnDragDown={true}
      closeOnPressMask={true}
      closeOnPressBack={true}
      keyboardAvoidingViewEnabled={true}
      //height={deviceHeight / 1.04}
      height={Platform.OS == 'ios' ? deviceHeight / 1.04 : deviceHeight / 1.055}
      customStyles={{
        wrapper: {
          backgroundColor: COLOURS.transparentColour,
        },
        draggableIcon: {
          width: 0,
          top: 5,
        },
        container: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderColor: COLOURS.lightGray,
          borderWidth: 0.4,
          backgroundColor: COLOURS.white,
        },
      }}>
      <ProductListComponent
        dataSource={dataSource}
        filteredDataSource={filteredDataSource}
        closeAction={closeAction}
        handleRefresh={() => handleRefresh(true, false)}
        handleAddProduct={handleAddProduct}
        isProductLoading={isProductLoading}
        handleSearchInputSubmit={handleSearchInputSubmit}
        handleSingleItemPress={item => handleSingleItemPress(item, true, false)}
        addProductPress={() => addProductPress()}
        inputValue={inputValue}
        handleInputSearchText={handleInputSearchText}
      />
    </RBSheet>
  );
}

export function BottomSheetBreadSizeComponent1({
  sheetRef,
  dataSource,
  handleSingleItemPress,
  closeAction,
  itemName,
}) {
  return (
    <RBSheet
      ref={sheetRef}
      animationType={'slide'}
      closeDuration={0}
      openDuration={0}
      closeOnDragDown={true}
      closeOnPressMask={true}
      closeOnPressBack={true}
      keyboardAvoidingViewEnabled={true}
      //height={deviceHeight / 1.04}
      height={Platform.OS == 'ios' ? deviceHeight / 1.6 : deviceHeight / 1.6}
      customStyles={{
        wrapper: {
          backgroundColor: COLOURS.transparentColour,
        },
        draggableIcon: {
          width: 0,
          top: 5,
        },
        container: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderColor: COLOURS.lightGray,
          borderWidth: 0.4,
          backgroundColor: COLOURS.white,
        },
      }}>
      <BreadSizeComponent1
        dataSource={dataSource}
        closeAction={closeAction}
        itemName={itemName}
        handleSingleItemPress={(key, value) =>
          handleSingleItemPress(key, value)
        }
      />
    </RBSheet>
  );
}
export function BottomSheetBreadSizeComponent({
  sheetRef,
  dataSource,
  handleSingleItemPress,
  closeAction,
  itemName,
}) {
  return (
    <RBSheet
      ref={sheetRef}
      animationType={'slide'}
      closeDuration={0}
      openDuration={0}
      closeOnDragDown={true}
      closeOnPressMask={true}
      closeOnPressBack={true}
      keyboardAvoidingViewEnabled={true}
      //height={deviceHeight / 1.04}
      height={Platform.OS == 'ios' ? deviceHeight / 1.6 : deviceHeight / 1.6}
      customStyles={{
        wrapper: {
          backgroundColor: COLOURS.transparentColour,
        },
        draggableIcon: {
          width: 0,
          top: 5,
        },
        container: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderColor: COLOURS.lightGray,
          borderWidth: 0.4,
          backgroundColor: COLOURS.white,
        },
      }}>
      <BreadSizeComponent
        dataSource={dataSource}
        closeAction={closeAction}
        itemName={itemName}
        handleSingleItemPress={(key, value) =>
          handleSingleItemPress(key, value)
        }
      />
    </RBSheet>
  );
}
export function BottomSheetSurplusSizeComponent({
  sheetRef,
  dataSource,
  handleInsertValueTextChange,
  insertedSizeValue,
  handleCreateSizeNetworkRequest,
  handleSingleItemPress,
  closeAction,
  itemName,
}) {
  return (
    <RBSheet
      ref={sheetRef}
      animationType={'slide'}
      closeDuration={0}
      openDuration={0}
      closeOnDragDown={true}
      closeOnPressMask={true}
      dragFromTopOnly={false}
      closeOnPressBack={true}
      keyboardAvoidingViewEnabled={true}
      //height={deviceHeight / 1.04}
      height={Platform.OS == 'ios' ? deviceHeight / 1.2 : deviceHeight / 1.3}
      customStyles={{
        wrapper: {
          backgroundColor: COLOURS.transparentColour,
        },
        draggableIcon: {
          width: 0,
          top: 5,
        },
        container: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderColor: COLOURS.lightGray,
          borderWidth: 0.4,
          backgroundColor: COLOURS.white,
          //marginBottom: 20,
        },
      }}
      >
      <ScrollView>
        <TouchableWithoutFeedback>
          <SurplusProductSizeComponent
            dataSource={dataSource}
            handleInsertValueTextChange={handleInsertValueTextChange}
            insertedSizeValue={insertedSizeValue}
            handleCreateSizeNetworkRequest={handleCreateSizeNetworkRequest}
            closeAction={closeAction}
            itemName={itemName}
            handleSingleItemPress={(key, value) =>
              handleSingleItemPress(key, value)
            }
          />
        </TouchableWithoutFeedback>
      </ScrollView>
    </RBSheet>
  );
}

export function BottomSheetRiderComponent({
  sheetRef,
  dataSource,
  filteredDataSource,
  handleSingleItemPress,
  addRiderPress,
  inputValue,
  handleInputSearchText,
  closeAction,
  isRidersLoading,
  handleSearchInputSubmit,
  handleRefresh,
}) {
  return (
    <RBSheet
      ref={sheetRef}
      animationType={'slide'}
      closeDuration={0}
      openDuration={0}
      closeOnDragDown={true}
      closeOnPressMask={true}
      closeOnPressBack={true}
      keyboardAvoidingViewEnabled={true}
      //height={deviceHeight / 1.04}
      height={Platform.OS == 'ios' ? deviceHeight / 1.04 : deviceHeight / 1.055}
      customStyles={{
        wrapper: {
          backgroundColor: COLOURS.transparentColour,
        },
        draggableIcon: {
          width: 0,
          top: 5,
        },
        container: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderColor: COLOURS.lightGray,
          borderWidth: 0.4,
          backgroundColor: COLOURS.white,
        },
      }}>
      <RiderListComponent
        dataSource={dataSource}
        filteredDataSource={filteredDataSource}
        closeAction={closeAction}
        handleRefresh={() => handleRefresh(false, false, true)}
        isRidersLoading={isRidersLoading}
        handleSearchInputSubmit={handleSearchInputSubmit}
        handleSingleItemPress={item =>
          handleSingleItemPress(item, false, false, true)
        }
        addNewRider={() => addRiderPress()}
        inputValue={inputValue}
        handleInputSearchText={handleInputSearchText}
      />
    </RBSheet>
  );
}
export function BottomSheetZupaAssociateProductComponent({
  sheetRef,
  dataSource,
  filteredDataSource,
  handleSingleItemPress,
  addProductPress,
  inputValue,
  handleInputSearchText,
  closeAction,
  isProductLoading,
  handleSearchInputSubmit,
  handleRefresh,
  handleAddProduct,
}) {
  return (
    <RBSheet
      ref={sheetRef}
      animationType={'slide'}
      closeDuration={0}
      openDuration={0}
      closeOnDragDown={true}
      closeOnPressMask={true}
      closeOnPressBack={true}
      keyboardAvoidingViewEnabled={true}
      //height={deviceHeight / 1.04}
      height={Platform.OS == 'ios' ? deviceHeight / 1.04 : deviceHeight / 1.055}
      customStyles={{
        wrapper: {
          backgroundColor: COLOURS.transparentColour,
        },
        draggableIcon: {
          width: 0,
          top: 5,
        },
        container: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderColor: COLOURS.lightGray,
          borderWidth: 0.4,
          backgroundColor: COLOURS.white,
        },
      }}>
      <ProductListComponent
        dataSource={dataSource}
        filteredDataSource={filteredDataSource}
        closeAction={closeAction}
        handleRefresh={handleRefresh}
        handleAddProduct={handleAddProduct}
        isProductLoading={isProductLoading}
        handleSearchInputSubmit={handleSearchInputSubmit}
        handleSingleItemPress={item => handleSingleItemPress(item, false, true)}
        addProductPress={() => addProductPress()}
        inputValue={inputValue}
        handleInputSearchText={handleInputSearchText}
      />
    </RBSheet>
  );
}

export function BottomSheetDeliveryTypesComponent({
  sheetRef,
  dataSource,
  handleSingleItemPress,
  inputValue,
  handleInputSearchText,
  closeAction,
  handleRefresh,
  isDeliveryLoading,
  handleAddDelivery,
}) {
  return (
    <RBSheet
      ref={sheetRef}
      animationType={'slide'}
      closeDuration={0}
      openDuration={0}
      closeOnDragDown={true}
      closeOnPressMask={true}
      closeOnPressBack={true}
      keyboardAvoidingViewEnabled={false}
      height={Platform.OS == 'ios' ? deviceHeight / 1.04 : deviceHeight / 1.055}
      customStyles={{
        wrapper: {
          backgroundColor: COLOURS.transparentColour,
        },
        draggableIcon: {
          //backgroundColor: COLOURS.zupaBlue,
          width: 0,
          top: 5,
        },
        container: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderColor: COLOURS.lightGray,
          borderWidth: 0.4,
          backgroundColor: COLOURS.white,
        },
      }}>
      <DeliveryListComponent
        dataSource={dataSource}
        closeAction={closeAction}
        handleRefresh={() => handleRefresh(false, true, false)}
        isDeliveryLoading={isDeliveryLoading}
        handleSingleItemPress={item =>
          handleSingleItemPress(item, false, true, false)
        }
        InputValue={inputValue}
        handleInputSearchText={handleInputSearchText}
        handleAddDelivery={handleAddDelivery}
      />
    </RBSheet>
  );
}
