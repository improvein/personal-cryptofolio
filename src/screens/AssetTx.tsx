import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {SecondaryButton} from '../components';
import DataStorage from '../data/DataStorage';
import {colors} from '../utils';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainStackParamList} from '../RouteNav';
import {Asset} from '../types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  operationButtons: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 15,
    marginVertical: 5,
  },
  operationButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.WHITE,
    borderColor: colors.PRIMARY_COLOR_DARKER,
    borderWidth: 1,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
  },
  operationButtonActive: {
    backgroundColor: colors.PRIMARY_COLOR_DARKER,
  },
  operationButtonText: {
    color: colors.PRIMARY_COLOR_DARKER,
  },
  operationButtonTextActive: {
    color: colors.WHITE,
  },
  fieldWrapper: {
    flex: 0,
    width: '100%',
    paddingHorizontal: 15,
    marginVertical: 5,
  },
  fieldLabel: {
    color: colors.BLACK,
    fontWeight: 'bold',
  },
  fieldInputNumber: {
    height: 40,
    textAlign: 'right',
    padding: 5,
    borderWidth: 1,
    color: colors.BLACK,
    borderColor: colors.GRAY,
    borderRadius: 8,
  },
  fieldInputDate: {
    height: 40,
    textAlign: 'center',
    padding: 5,
    borderWidth: 1,
    color: colors.BLACK,
    borderColor: colors.GRAY,
    borderRadius: 8,
  },
  fieldInputNotes: {
    flex: 1,
    textAlign: 'left',
    textAlignVertical: 'top',
    padding: 5,
    borderWidth: 1,
    color: colors.BLACK,
    borderColor: colors.GRAY,
    borderRadius: 8,
  },
  buttonContainer: {
    width: '90%',
    alignSelf: 'center',
  },
  deleteButton: {
    // alignSelf: 'flex-end',
    // padding: 5,
    position: 'absolute',
    top: -30,
    right: 10,
  },
});

interface AssetTxScreenProps
  extends NativeStackScreenProps<MainStackParamList, 'AssetTxScreen'> {}

export default function AssetTx({navigation, route}: AssetTxScreenProps) {
  const [asset] = useState<Asset>(route.params.asset);
  const [isNew, setIsNew] = useState<boolean>();
  const [date, setDate] = useState<Date>(new Date());
  const [operation, setOperation] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState<number>(0);
  const [price, setPrice] = useState<number>(route.params.currentPrice ?? 0);
  const [notes, setNotes] = useState<string>('');
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] =
    useState<boolean>(false);
  const [amountStr, setAmountStr] = useState<string>('0.0');
  const [priceStr, setPriceStr] = useState<string>('0.0');

  useEffect(() => {
    const transaction = route.params.transaction ?? null;

    const startingAsNew = transaction == null;
    setIsNew(startingAsNew);
    // update with transaction values, if there is one
    if (transaction != null) {
      setDate(new Date(transaction.date));
      setOperation(transaction.amount >= 0 ? 'buy' : 'sell');
      setAmount(Math.abs(transaction.amount));
      setPrice(transaction.price);
      setNotes(transaction.notes ?? '');
      // format numbers
      setAmountStr(transaction.amount.toString());
      setPriceStr(transaction.price.toString());
    }
    navigation.setParams({
      isNew: startingAsNew,
    });
  }, [navigation, route.params.transaction]);

  async function onSave() {
    try {
      // Add the transaction to the storage
      // it will also take care of updating the Asset
      const sign = operation === 'buy' ? 1 : -1;
      await DataStorage.saveAssetTransaction(
        asset,
        amount * sign,
        price,
        date,
        notes,
      );

      navigation.navigate('AssetScreen', {
        asset: asset,
        refresh: true,
      });
    } catch (error) {
      console.warn(`Cannot add the new transaction. ${error}`, error);
      throw error;
    }
  }

  function onAmountInputChange(text: string) {
    if (text.match(/[\d\.]+/)) {
      setAmount(parseFloat(text));
      setAmountStr(text);
    }
  }
  function onPriceInputChange(text: string) {
    if (text.match(/[\d\.]+/)) {
      setPrice(parseFloat(text));
      setPriceStr(text);
    }
  }

  function showDateTimePicker() {
    // only allow changing date if it's a new Tx
    if (isNew) {
      setIsDateTimePickerVisible(true);
    }
  }

  function hideDateTimePicker() {
    setIsDateTimePickerVisible(false);
  }

  function handleDatePicked(pickedDate: Date) {
    const newDate = pickedDate;
    newDate.setSeconds(new Date().getSeconds());
    setDate(newDate);

    hideDateTimePicker();
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.operationButtons}>
          <TouchableOpacity
            style={[
              styles.operationButton,
              operation === 'buy' && styles.operationButtonActive,
            ]}
            onPress={() => setOperation('buy')}>
            <Text
              style={[
                styles.operationButtonText,
                operation === 'buy' && styles.operationButtonTextActive,
              ]}>
              Buy
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.operationButton,
              operation === 'sell' && styles.operationButtonActive,
            ]}
            onPress={() => setOperation('sell')}>
            <Text
              style={[
                styles.operationButtonText,
                operation === 'sell' && styles.operationButtonTextActive,
              ]}>
              Sell
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.fieldWrapper}>
          <Text style={styles.fieldLabel}>Amount</Text>
          <TextInput
            style={styles.fieldInputNumber}
            underlineColorAndroid="transparent"
            keyboardType="numeric"
            onChangeText={onAmountInputChange}
            onSubmitEditing={() => setAmountStr(amount.toString())}
            value={amountStr}
          />
        </View>
        <View style={styles.fieldWrapper}>
          <Text style={styles.fieldLabel}>Price</Text>
          <TextInput
            style={styles.fieldInputNumber}
            underlineColorAndroid="transparent"
            keyboardType="numeric"
            onChangeText={onPriceInputChange}
            onSubmitEditing={() => setPriceStr(price.toString())}
            value={priceStr}
          />
        </View>
        <View style={styles.fieldWrapper}>
          <Text style={styles.fieldLabel}>Date</Text>
          <TouchableOpacity onPress={showDateTimePicker}>
            <Text style={styles.fieldInputDate}>{date.toDateString()}</Text>
          </TouchableOpacity>
          <DateTimePicker
            isVisible={isDateTimePickerVisible}
            onConfirm={handleDatePicked}
            onCancel={hideDateTimePicker}
            date={date}
          />
        </View>
        <View style={[styles.fieldWrapper, {flex: 1}]}>
          <Text style={styles.fieldLabel}>Notes</Text>
          <TextInput
            style={styles.fieldInputNotes}
            multiline
            underlineColorAndroid="transparent"
            onChangeText={text => setNotes(text)}
            value={notes}
          />
        </View>

        <View style={styles.buttonContainer}>
          <SecondaryButton theme="dark" text="DONE" onPress={onSave} />
        </View>
      </ScrollView>
    </View>
  );
}
