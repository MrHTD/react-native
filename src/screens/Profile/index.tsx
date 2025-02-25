import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const ProfileScreen = () => {
    return (
        <View style={styles.container}>
            <WebView source={{ uri: 'http://137.59.222.200:3009/login' }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default ProfileScreen;