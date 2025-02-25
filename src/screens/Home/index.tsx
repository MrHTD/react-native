import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {WebView} from 'react-native-webview';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{
          uri: 'http://137.59.222.200:3009',
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        allowUniversalAccessFromFileURLs={true}
        setDisplayZoomControls={false}
        setBuiltInZoomControls={false}
        mixedContentMode="always" // Fix for Android SSL issues
        onShouldStartLoadWithRequest={() => true} // Allow all requests
        onHttpError={(event: {preventDefault: () => any}) =>
          event.preventDefault()
        } // Ignore HTTP errors
        onError={(event: {preventDefault: () => any}) => event.preventDefault()} // Ignore errors
        onReceivedSslError={(event: {preventDefault: () => any}) =>
          event.preventDefault()
        } // Ignore SSL errors (Android)
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
