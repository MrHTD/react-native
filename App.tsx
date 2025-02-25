import React, {useRef, useState} from 'react';
import {
  View, 
  Image, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {WebView} from 'react-native-webview';
import {cart, chat, home, profile} from './src/assets/index';

// Define the base URL
const webURL = 'http://137.59.222.200:3009';

// Error Screen Component
const ErrorScreen = ({onRetry}: {onRetry: () => void}) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorHeading}>404</Text>
    <Text style={styles.errorText}>Oops! Page not found</Text>
    <Text style={styles.errorSubText}>The page you're looking for is unavailable</Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryButtonText}>Retry</Text>
    </TouchableOpacity>
  </View>
);

// Loading Screen Component
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#3fac53" />
  </View>
);

const Tab = createBottomTabNavigator();

// WebView Component
const WebViewContainer = ({currentPage, setCurrentPage}: any) => {
  const webViewRef = useRef<WebView>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  if (hasError) {
    return <ErrorScreen onRetry={handleRetry} />;
  }

  return (
    <ScrollView
      style={styles.webViewContainer}
      contentContainerStyle={{flex: 1}}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#3fac53']}
          tintColor="#3fac53"
        />
      }>
      <WebView
        ref={webViewRef}
        source={{uri: `${webURL}/${currentPage}`}}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        allowUniversalAccessFromFileURLs={true}
        setDisplayZoomControls={false}
        setBuiltInZoomControls={false}
        mixedContentMode="always"
        onShouldStartLoadWithRequest={() => true}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => {
          setIsLoading(false);
          setRefreshing(false);
        }}
        onHttpError={(syntheticEvent) => {
          const {nativeEvent} = syntheticEvent;

          if (nativeEvent.statusCode === 404) {
            setHasError(true);
            setIsLoading(false);
          }
        }}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        style={styles.webView}
      />
      {isLoading && !refreshing && <LoadingScreen />}
    </ScrollView>
  );
};

// Empty screen component used for the tab navigation (avoids duplicate WebViews)
const EmptyScreen = () => <View style={{flex: 1}} />;

const NavigationTabs = ({handleNavigation}: any) => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      headerShown: false,
      tabBarIcon: ({color, size}) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = home;
        } else if (route.name === 'Chat') {
          iconName = chat;
        } else if (route.name === 'Cart') {
          iconName = cart;
        } else if (route.name === 'Profile') {
          iconName = profile;
        }

        return (
          <Image
            source={iconName}
            style={{tintColor: color, width: size, height: size}}
          />
        );
      },
      tabBarActiveTintColor: '#3fac53', // Active tab color
      tabBarInactiveTintColor: 'gray', // Inactive tab color
      tabBarLabelPosition: 'below-icon', // Label position
    })}
    initialRouteName="Home">
    <Tab.Screen
      name="Home"
      listeners={{tabPress: () => handleNavigation('home')}}
      component={EmptyScreen}
    />
    <Tab.Screen
      name="Chat"
      listeners={{tabPress: () => handleNavigation('chats')}}
      component={EmptyScreen}
    />
    <Tab.Screen
      name="Cart"
      listeners={{tabPress: () => handleNavigation('cart')}}
      component={EmptyScreen}
    />
    <Tab.Screen
      name="Profile"
      listeners={{tabPress: () => handleNavigation('manage-my-account')}}
      component={EmptyScreen}
    />
  </Tab.Navigator>
);

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <NavigationContainer>
      <View style={styles.container}>
        {/* WebView Container */}
        <WebViewContainer
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

        {/* Tab Navigator */}
        <View style={styles.tabsContainer}>
          <NavigationTabs
            handleNavigation={(page: string) => setCurrentPage(page)}
          />
        </View>
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
  },
  tabsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white', // Tab bar background
  },
  webViewContainer: {
    flex: 1,
    marginBottom: 50,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 50,
  },
  errorHeading: {
    fontSize: 56,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  errorText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  errorSubText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3fac53',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});

export default App;
