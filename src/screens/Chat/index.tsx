import React, {useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {WebView} from 'react-native-webview';

const ChatScreen = () => {
  const webviewRef = useRef<WebView>(null);

  return (
    <View style={styles.container}>
      <WebView
        source={{uri: 'http://137.59.222.200:3009/chats'}}
        onNavigationStateChange={navState => {
          if (navState.url !== 'http://137.59.222.200:3009/chats') {
            webviewRef.current?.goBack();
          }
        }}
        ref={webviewRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChatScreen;
