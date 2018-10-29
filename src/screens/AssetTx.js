import React, { Component } from 'react';
import {
  Alert, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
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
    alignSelf: 'flex-end',
    padding: 5,
  },
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
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
          </View>
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
    };
    // update with transaction values, if there is one
    if (transaction != null) {
      newState.operation = transaction.amount >= 0 ? 'buy' : 'sell';
      newState.amount = transaction.amount;
      newState.price = transaction.price;
      newState.notes = transaction.notes;
    }

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
          onPress: () => {
            /* do nothing */
          },
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            const { asset, transaction } = this.props.navigation.state.params;
            // DataStorage.removeAsset(asset.coin.ticker).then(() => {
            //   this.props.navigation.navigate('AssetListScreen');
            // });
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

  onAdd = async () => {
    try {
      // Add the transaction to the storage
      // it will also take care of updating the Asset
      const sign = this.state.operation === 'buy' ? 1 : -1;
      await DataStorage.addAssetTransaction(
        this.state.asset,
        this.state.amount * sign,
        this.state.price,
        this.state.date,
        this.state.notes,
      );

      this.props.navigation.navigate('AssetScreen', { asset: this.state.asset });
    } catch (error) {
      console.warn(`Cannot add the new transaction. ${error}`, error);
      throw error;
    }
  };

  decimalParse = (text) => {
    // const parsedText = text.replace(/[^(((\d)+(\.)\d)|((\d)+))]/g, '_').split('_')[0];
    return parseFloat(text);
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.fieldWrapper}>
          <Text style={styles.fieldLabel}>Amount</Text>
          <TextInput
            style={styles.fieldInputNumber}
            underlineColorAndroid="transparent"
            keyboardType="numeric"
            onChangeText={text => this.setState({ amount: this.decimalParse(text) })}
            value={this.state.amount.toString()}
          />
        </View>
        <View style={styles.fieldWrapper}>
          <Text style={styles.fieldLabel}>Price</Text>
          <TextInput
            style={styles.fieldInputNumber}
            underlineColorAndroid="transparent"
            keyboardType="numeric"
            onChangeText={text => this.setState({ price: this.decimalParse(text) })}
            value={this.state.price.toString()}
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
          <SecondaryButton text="DONE" onPress={this.onAdd} />
        </View>
      </View>
    );
  }
}

export default AssetTx;
