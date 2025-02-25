import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const CartScreen = () => {
    return (
        <View style={styles.container}>
            <WebView source={{ uri: 'http://137.59.222.200:3009/cart' }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default CartScreen;