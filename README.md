# Personal CryptoFolio

![Personal CryptoFolio logo](https://github.com/improvein/personal-cryptofolio/blob/master/src/assets/images/main_logo.png)

Personal Portfolio for crypto assets.

This mobile app allows you to track your portfolio registering all the transactions for each asset you have. It is very similar to many others that exists in the market, but with focus on privacy and data availability.

We think it's worth having a portfolio manager that allows you to keep your information isolated and private from anyone else.

Download from the stores (Android only for the moment, iOS coming later):

<a href='https://play.google.com/store/apps/details?id=com.improvein.personalcryptofolio'><img alt='Get it on Google Play' height="50" src='https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png'/></a>

## Core principles - where we are different

* **Data availability**: export and import your data and allow YOU to be the owner of it
* **Privacy**: no 3rd parties involved in the storage of your data

## Features

* Track several crypto assets (we will add more)
* Track each asset's transactions by registering your operations (buy or sell)
* See your portfolio valuation and profit/loss
  * You can see it at a portfolio level by clicking on the total valuation amount in the main screen
  * Or you can see it an asset level in each asset's screen
* Online price retrieval from different sources:
  * Binance
  * Bitfinex
  * Bitstamp
  * Bittrex
  * Kraken
* Export your entire portfolio in JSON format<br>
  _(at the moment only available with the "share" option)_
* Import your entire portfolio in JSON format<br>
  _(at the moment only by copy-pasting the JSON content)_
* PIN protection for the app

## Privacy
Some things to consider regarding your privacy:

* Your entire portfolio data is stored in your device. Nothing is sent to any server.
* The only contact with the "outside world" is for price retrieval from price sources like exchanges. But in those cases, nothing from your portfolio is revelead except for the coin which you want to fetch the price for.
* The App can be protected with a PIN.
* Data is stored non-encrypted in the device. (see [future features](https://github.com/improvein/personal-cryptofolio/issues)).<br/>
  However, the isolation the modern OS provides protects you from other apps trying to access it in most cases.

## Contribute
You are more than welcome to contribute!

Just [report an issue](https://github.com/improvein/personal-cryptofolio/issues) or [make a pull request](https://github.com/improvein/personal-cryptofolio/pulls), whatever you want.

## Development
This is a React Native application.

So after cloning the repo make sure you install all the dependencies:
```
npm install
```

Then plug your phone or start an emulator for the OS you want. OS specific instructions below.

### Android
Before starting you need to create the file `android/local.properties` with this:
```
APP_RELEASE_STORE_FILE=/location/to/your/keystore.file
APP_RELEASE_STORE_PASSWORD=your_store_password
APP_RELEASE_KEY_ALIAS=your_key_alias
APP_RELEASE_KEY_PASSWORD=your_key_password
```
(if you have any doubt as for the use of these parameters, check the [android/app/build.grade](https://github.com/improvein/personal-cryptofolio/blob/master/android/app/build.grade) file)

Then run the project in debug mode in Android:
```
react-native run-android --appIdSuffix "debug"
```
(the suffix thing is because the app is configured to add a "debug" prefix to the package name when running on debug mode. That way it doesn't run into conflics with your production app that might be installed on the device)

### iOS
(@TODO: NEED MORE DETAILS HERE)

Run the project in iOS:
```
npm run ios
```

For more information about how to develop and build using React Native: https://facebook.github.io/react-native/
