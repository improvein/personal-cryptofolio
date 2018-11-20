# Personal CryptoFolio

![Personal CryptoFolio logo](https://github.com/improvein/personal-cryptofolio/blob/master/src/assets/images/main_logo.png)

Personal Portfolio for crypto assets.

This app allows you to track your portfolio registering all the transactions for each asset you have. It is very similar to many others that exists in the market, but with focus on privacy and data availability.

We think it's worth having a portfolio manager that allows you to keep your information isolated and private from anyone else.

## Core principles - where we are different

* Data availability: export and import your data and allow YOU to be the owner of it
* Privacy: no 3rd parties involved for storage of your data

## Features

* Track several crypto assets (we will add more)
* Track each asset's transactions by registering your operations (buy or sell)
* See your portfolio valuation and profit/loss for each asset at the moment
* Online price retrieval from different sources
* Export your entire portfolio in JSON format
* PIN protection for the app

## Privacy
Some things to consider regarding your privacy:

* Your entire portfolio data is stored in your device. Nothing is sent to any server.
* The only contact with the "outside world" is for price retrieval from price sources like exchanges. But in those cases, nothing from your portfolio is revelead except for the coin of which you want to fetch the price.
* The App can be protected with a PIN.
* Data is stored non-encrypted in the device. (see Future changes & Dev TODOs).<br/>
  However, the isolation the OS provides protects you from other apps trying to access it in most cases.

## Future changes & Dev TODOs
* Enable icons from "react-native-vector-icons" for iOS
* Encrypt data in device based on PIN
