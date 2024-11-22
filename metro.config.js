// Learn more https://docs.expo.io/guides/customizing-metro
/************/
// MOST CONFUSING THING YET.... 
// install '@expo/metro-config' but require it without the '@' symbol?!?!
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = config;
