//import liraries
import React, {Component, useEffect, useState} from 'react';
import {
  View,
  Text,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import {BackViewMoreSettings} from '../../components/Header';
import {KeyboardObserverComponent} from '../../components/KeyboardObserverComponent';
import ViewProviderComponent from '../../components/ViewProviderComponent';
import {
  capitalizeWord,
  DismissKeyboard,
  sortArrayByDate,
} from '../../utils/utils';
import Averta from '../../components/Text/Averta';
import AvertaBold from '../../components/Text/AvertaBold';
import {deviceWidth, fp} from '../../utils/responsive-screen';
import {COLOURS} from '../../utils/Colours';
import moment from 'moment';
import ProductSansBold from '../../components/Text/ProductSansBold';
import OrderListItemComponent from '../../components/OrderListItemComponent';
import {useDispatch, useSelector} from 'react-redux';
import {
  getOrder,
  updateOrderById,
  updateOrderSpecialNoteById,
} from '../../store/actions/orders';
import LoaderShimmerComponent from '../../components/LoaderShimmerComponent';
import TextInputComponent from '../../components/TextInputComponent';
import useKeyboardHeight from 'react-native-use-keyboard-height';
import {createNote} from '../../store/actions/notes';

// create a component
const OrderDetailsScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {order, updateOrderLoading, error, ordersLoading} = useSelector(
    state => state.orders,
  );
  const {notes, createNoteLoading} = useSelector(state => state.notes);
  const keyboardHeight = useKeyboardHeight();
  const [isAddNewNote, setIsAddNewNote] = useState(false);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [specialNote, setSpecialNote] = useState('');
  let id = route.params.id;
  const [hasDataLoaded, setHasDataLoaded] = useState(false);
  const [specialNoteArray, setSpecialNoteArray] = useState(
    order?.specialnote || [],
  );
  const [hasAddedNewNote, setHasAddedNewNote] = useState(false);
  //console.log('order details redux ', order);

  useEffect(() => {
    if (id) {
      fetchAllData();
    }
  }, [id, hasAddedNewNote]);

  const fetchAllData = () => {
    dispatch(getOrder(route?.params?.id)).then((result, error) => {
      if (result) {
        // setSpecialNoteArray(result?.specialnote);
        setHasDataLoaded(true);
      }
    });
  };
  const onRefresh = async () => {
    fetchAllData();
    setIsRefreshing(false);
  };

  const renderDetails = () => {
    return (
      <View style={{marginHorizontal: 25, marginTop: 10}}>
        <View style={styles.customerNameView}>
          <ProductSansBold style={[styles.labelText, {left: 0}]}>
            CUSTOMER NAME
          </ProductSansBold>
          <TouchableOpacity onPress={null}>
            <AvertaBold style={styles.custName}>
              {order?.customer?.name
                ? capitalizeWord(order?.customer?.name.trim())
                : 'None'}
            </AvertaBold>
          </TouchableOpacity>
        </View>

        <View
          style={[styles.customerNameView, {paddingTop: 5, marginRight: 10}]}>
          <ProductSansBold
            style={[styles.labelText, {paddingBottom: 12, left: 0}]}>
            ORDER DATE
          </ProductSansBold>
          <Averta style={styles.address}>
            {order?.createdat ? moment(order?.createdat).format('LLL') : 'None'}
          </Averta>
        </View>

        <View
          style={[
            styles.customerNameView,
            {paddingTop: 5, marginRight: 10, marginBottom: 30},
          ]}>
          <ProductSansBold
            style={[styles.labelText, {paddingBottom: 12, left: 0}]}>
            ORDERED PRODUCTS
          </ProductSansBold>
          {order?.isset ? (
            <AvertaBold
              style={[
                styles.custName,
                {alignSelf: 'flex-end', fontWeight: '100'},
              ]}>
              {order?.setname}
            </AvertaBold>
          ) : null}
          {order?.products.length > 0 &&
            sortArrayByDate(order?.products).map((item, index) => {
              return (
                <View key={index}>
                  {/* order items list */}
                  <OrderListItemComponent item={item} />
                </View>
              );
            })}
        </View>

        <View style={[styles.customerNameView, {top: -20, marginBottom: 20}]}>
          <View>
            <TouchableOpacity
              style={{alignItems: 'flex-end', marginRight: 20}}
              onPress={!isAddNewNote ? handleAddNote : handleCancelNote}>
              <ProductSansBold
                style={[
                  styles.labelText,
                  {
                    paddingTop: 0,
                    color: COLOURS.purple,
                  },
                ]}>
                {!isAddNewNote ? 'Add Note' : 'Cancel'}
              </ProductSansBold>
            </TouchableOpacity>

            {order?.specialnote && order?.specialnote.length > 0 ? (
              order?.specialnote.map((item, i) => {
                return (
                  <>
                    <ProductSansBold
                      key={i}
                      style={[
                        styles.labelText,
                        {left: 0, paddingTop: 0, flex: 2, paddingBottom: 0},
                      ]}>
                      SPECIAL NOTE {i + 1}
                    </ProductSansBold>
                    <Averta style={[styles.address, {paddingVertical: 10}]}>
                      {item ? item?.note : 'None'}
                    </Averta>
                  </>
                );
              })
            ) : !isAddNewNote ? (
              <Averta
                style={[
                  styles.address,
                  {paddingVertical: 10, color: COLOURS.gray},
                ]}>
                No special note found
              </Averta>
            ) : null}
            {isAddNewNote ? (
              <View style={{marginTop: 10}}>
                <TextInputComponent
                  placeholder={'Add a special note'}
                  handleTextChange={text => setSpecialNote(text)}
                  defaultValue={specialNote ? specialNote.trim() : ''}
                  returnKeyType={'next'}
                  keyboardType={'default'}
                  secureTextEntry={false}
                  widthFigure={deviceWidth / 1.15}
                  heightfigure={95}
                  multiline={true}
                  //editable={isSpecialFieldEditable}
                  capitalize={'sentences'}
                  props={{
                    borderWidth: 0,
                    paddingTop: 12,
                    padding: 20,
                  }}
                />
                {displaySubmitButton()}
              </View>
            ) : null}
          </View>
        </View>
      </View>
    );
  };

  const handleAddNote = () => {
    setSpecialNote('');
    setIsAddNewNote(!isAddNewNote);
  };
  const handleCancelNote = () => {
    setSpecialNote('');
    setIsAddNewNote(false);
  };
  const updateSpecialNote = () =>
    dispatch(createNote({note: specialNote, orderid: id})).then(
      (result, error) => {
        if (result) {
          setHasAddedNewNote(!hasAddedNewNote);
          handleCancelNote();
        }
      },
    );
  const displaySubmitButton = () => {
    return (
      <TouchableOpacity
        onPress={updateSpecialNote}
        activeOpacity={0.6}
        style={{
          marginTop: 5,
          justifyContent: 'center',
          marginBottom:
            keyboardHeight > 0 ? (Platform.OS == 'ios' ? 70 : 100) : 20,
          backgroundColor: COLOURS.blue,
          height: 50,
          borderRadius: 10,
          marginTop: 10,
          alignItems: 'center',
        }}>
        <Text style={{color: COLOURS.white, fontSize: 14, fontWeight: '700'}}>
          {!specialNote ? 'Add Note' : 'Update Note'}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <ViewProviderComponent>
      <DismissKeyboard>
        <KeyboardObserverComponent>
          <BackViewMoreSettings
            backText="Order Details"
            onClose={() => navigation.goBack()}
          />
          <FlatList
            data={[]}
            keyboardShouldPersistTaps={'handled'}
            ListHeaderComponent={hasDataLoaded ? renderDetails() : null}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            renderItem={null}
            keyExtractor={item => item.id}
          />
          <LoaderShimmerComponent isLoading={updateOrderLoading} />
          <LoaderShimmerComponent isLoading={ordersLoading} />
          <LoaderShimmerComponent isLoading={createNoteLoading} />
        </KeyboardObserverComponent>
      </DismissKeyboard>
    </ViewProviderComponent>
  );
};

// define your styles
const styles = StyleSheet.create({
  custName: {
    fontSize: fp(15),
    color: COLOURS.textInputColor,
    fontWeight: 'bold',
  },
  customerNameView: {
    //width: deviceWidth - 50,
    marginTop: 5,
  },
  labelText: {
    fontSize: fp(13),
    color: COLOURS.labelTextColor,
    paddingTop: 5,
    paddingBottom: 12,
    left: 12,
  },
});

//make this component available to the app
export default OrderDetailsScreen;
