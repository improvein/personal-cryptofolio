import React, { Component } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Header, SecondaryButton } from '../components';
import DataStorage from '../data/DataStorage';
import { colors } from '../utils';

const styles = StyleSheet.create({
  headerChildren: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    width: '100%',
  },
  headerChildrenLeft: {
    flex: 1,
    flexDirection: 'column',
  },
  assetName: {
    color: colors.WHITE,
    fontSize: 10,
    textAlign: 'left',
    letterSpacing: 2,
  },
  currentPrice: {
    color: colors.WHITE,
    fontSize: 15,
    textAlign: 'left',
    letterSpacing: 2,
  },
  deleteButton: {
    // alignSelf: 'flex-end',
    // padding: 5,
    position: 'absolute',
    top: -30,
    right: 10,
  },
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
    fontWeight: 'bold',
  },
  fieldInputNumber: {
    height: 40,
    textAlign: 'right',
    padding: 5,
    borderWidth: 1,
    borderColor: colors.GRAY,
    borderRadius: 8,
  },
  fieldInputDate: {
    height: 40,
    textAlign: 'center',
    padding: 5,
    borderWidth: 1,
    borderColor: colors.GRAY,
    borderRadius: 8,
  },
  fieldInputNotes: {
    flex: 1,
    textAlign: 'left',
    textAlignVertical: 'top',
    padding: 5,
    borderWidth: 1,
    borderColor: colors.GRAY,
    borderRadius: 8,
  },
  buttonContainer: {
    width: '90%',
    alignSelf: 'center',
  },
});

class AssetTx extends Component {
  static navigationOptions = ({ navigation }) => {
    const currentPrice = navigation.getParam('currentPrice', 0);
    const isNew = navigation.getParam('isNew', true);
    return {
      header: (
        <Header
          title={`${isNew ? 'Add' : 'Edit'} Transaction`}
          enableBackArrow="true"
          onBackArrowPress={() => navigation.goBack()}
        >
          <View style={styles.headerChildren}>
            <View style={styles.headerChildrenLeft}>
              <Text style={styles.assetName}>{navigation.state.params.asset.coin.name}</Text>
              <Text style={styles.currentPrice}>{`$ ${currentPrice.toFixed(2)}`}</Text>
            </View>
          </View>
          {isNew ? (
            <View style={styles.deleteButton} />
          ) : (
            <TouchableOpacity style={styles.deleteButton}>
              <Icon
                onPress={navigation.getParam('onRemoveTransaction') || (() => {})}
                name="delete"
                size={20}
                color={colors.WHITE}
              />
            </TouchableOpacity>
          )}
        </Header>
      ),
    };
  };

  constructor(props) {
    super(props);

    const asset = this.props.navigation.getParam('asset');
    const transaction = this.props.navigation.getParam('transaction', null);
    const currentPrice = this.props.navigation.getParam('currentPrice', 0);

    const newState = {
      asset,
      isNew: transaction == null,
      operation: 'buy',
      amount: 0,
      price: currentPrice,
      date: new Date(),
      notes: '',
      isDateTimePickerVisible: false,
    };
    // update with transaction values, if there is one
    if (transaction != null) {
      newState.date = new Date(transaction.date);
      newState.operation = transaction.amount >= 0 ? 'buy' : 'sell';
      newState.amount = Math.abs(transaction.amount);
      newState.price = transaction.price;
      newState.notes = transaction.notes;
    }
    // format numbers
    newState.amountStr = newState.amount.toString();
    newState.priceStr = newState.price.toString();

    // set the state
    this.state = newState;
  }

  componentDidMount() {
    this.props.navigation.setParams({
      onRemoveTransaction: this.removeTransaction,
      isNew: this.state.isNew,
    });
  }

  removeTransaction = () => {
    Alert.alert(
      'Remove transaction',
      'Are you sure you want to remove the transaction from the asset history?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            const { asset, transaction } = this.props.navigation.state.params;
            DataStorage.removeAssetTransaction(asset, transaction.date).then(() => {
              this.props.navigation.navigate('AssetScreen', { asset, refresh: true });
            });
          },
        },
      ],
      { cancelable: false },
    );
  };

  renderRemoveButton = (navigation) => {
    if (this.state.isNew) {
      return <Text />;
    }
    return (
      <TouchableOpacity style={styles.deleteButton}>
        <Icon
          onPress={navigation.getParam('onRemoveTransaction') || (() => {})}
          name="delete"
          size={20}
          color={colors.WHITE}
        />
      </TouchableOpacity>
    );
  };

  onSave = async () => {
    try {
      // Add the transaction to the storage
      // it will also take care of updating the Asset
      const sign = this.state.operation === 'buy' ? 1 : -1;
      await DataStorage.saveAssetTransaction(
        this.state.asset,
        this.state.amount * sign,
        this.state.price,
        this.state.date,
        this.state.notes,
      );

      this.props.navigation.navigate('AssetScreen', { asset: this.state.asset, refresh: true });
    } catch (error) {
      console.warn(`Cannot add the new transaction. ${error}`, error);
      throw error;
    }
  };

  parseFloatInput = (text, stateProp, stateStrProp) => {
    const newState = {};

    if (text.match(/[\d\.]+/)) {
      newState[stateProp] = parseFloat(text);
      newState[stateStrProp] = text;
    }

    this.setState(newState);
  };

  showDateTimePicker = () => {
    // only allow changing date if it's a new Tx
    if (this.state.isNew) {
      this.setState({ isDateTimePickerVisible: true });
    }
  };

  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  handleDatePicked = (date) => {
    const newDate = date;
    newDate.setSeconds(new Date().getSeconds());
    this.setState({ date: newDate });

    this.hideDateTimePicker();
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.operationButtons}>
            <TouchableOpacity
              style={[
                styles.operationButton,
                this.state.operation === 'buy' && styles.operationButtonActive,
              ]}
              onPress={() => this.setState({ operation: 'buy' })}
            >
              <Text
                style={[
                  styles.operationButtonText,
                  this.state.operation === 'buy' && styles.operationButtonTextActive,
                ]}
              >
                Buy
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.operationButton,
                this.state.operation === 'sell' && styles.operationButtonActive,
              ]}
              onPress={() => this.setState({ operation: 'sell' })}
            >
              <Text
                style={[
                  styles.operationButtonText,
                  this.state.operation === 'sell' && styles.operationButtonTextActive,
                ]}
              >
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
              onChangeText={text => this.parseFloatInput(text, 'amount', 'amountStr')}
              onSubmitEditing={() => this.setState(prevState => ({
                amountStr: prevState.amount.toString(),
              }))
              }
              value={this.state.amountStr}
            />
          </View>
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Price</Text>
            <TextInput
              style={styles.fieldInputNumber}
              underlineColorAndroid="transparent"
              keyboardType="numeric"
              onChangeText={text => this.parseFloatInput(text, 'price', 'priceStr')}
              onSubmitEditing={() => this.setState(prevState => ({
                priceStr: prevState.price.toString(),
              }))
              }
              value={this.state.priceStr}
            />
          </View>
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Date</Text>
            <TouchableOpacity onPress={this.showDateTimePicker}>
              <Text style={styles.fieldInputDate}>{this.state.date.toDateString()}</Text>
            </TouchableOpacity>
            <DateTimePicker
              isVisible={this.state.isDateTimePickerVisible}
              onConfirm={this.handleDatePicked}
              onCancel={this.hideDateTimePicker}
              date={this.state.date}
            />
          </View>
          <View style={[styles.fieldWrapper, { flex: 1 }]}>
            <Text style={styles.fieldLabel}>Notes</Text>
            <TextInput
              style={styles.fieldInputNotes}
              multiline
              underlineColorAndroid="transparent"
              onChangeText={text => this.setState({ notes: text })}
              value={this.state.notes}
            />
          </View>

          <View style={styles.buttonContainer}>
            <SecondaryButton theme="dark" text="DONE" onPress={this.onSave} />
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default AssetTx;
