import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import dateFns from 'date-fns';
import {colors} from '../utils';
import {Transaction} from '../types';

const styles = StyleSheet.create({
  container: {
    width: '95%',
    paddingBottom: 5,
    marginBottom: 5,
    // alignItems: 'center',
    borderBottomColor: colors.GRAY,
    borderBottomWidth: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    width: '100%',
    // padding: 15,
  },
  fieldWrapper: {
    flex: 1,
    margin: 10,
  },
  fieldLabel: {
    fontSize: 10,
  },
  fieldContent: {
    fontSize: 12,
  },
});

interface AssetTxItemProps {
  transaction: Transaction;
  onPressItem: (transaction: Transaction) => void;
}

export default function AssetTxItem({
  transaction,
  onPressItem,
}: AssetTxItemProps) {
  /**
   * Press event handler
   */
  function onPress() {
    onPressItem(transaction);
  }

  /**
   * Long press event handler
   */
  function onLongPress() {
    console.log('Long press');
  }

  const costIncome = transaction.price * transaction.amount;
  const operation = transaction.amount >= 0 ? 'buy' : 'sell';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      onLongPress={onLongPress}>
      <View style={styles.contentContainer}>
        <View style={styles.fieldWrapper}>
          <Text style={styles.fieldLabel}>
            Amount
            {operation === 'buy' ? ' (Buy)' : ' (Sell)'}
          </Text>
          <Text style={styles.fieldContent}>
            {transaction.amount.toFixed(8)}
          </Text>
        </View>
        <View style={styles.fieldWrapper}>
          <Text style={styles.fieldLabel}>Price</Text>
          <Text style={styles.fieldContent}>{`$ ${transaction.price.toFixed(
            2,
          )}`}</Text>
        </View>
        <View style={styles.fieldWrapper}>
          <Text style={styles.fieldLabel}>
            {operation === 'buy' ? 'Cost' : 'Income'}
          </Text>
          <Text style={styles.fieldContent}>{`$ ${Math.abs(costIncome).toFixed(
            2,
          )}`}</Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.fieldWrapper}>
          <Text style={styles.fieldLabel}>Notes</Text>
          <Text style={styles.fieldContent}>{transaction.notes || ''}</Text>
        </View>
        <View style={styles.fieldWrapper}>
          <Text style={styles.fieldLabel}>Date</Text>
          <Text style={styles.fieldContent}>
            {/* TODO: convert the date to local */}
            {dateFns.format(transaction.date, 'yyyy-MM-dd HH:mm')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
