import React, { Component } from 'react';
import { StyleSheet, ScrollView, FlatList } from 'react-native';
import { LinearGradient } from 'expo';

class App extends Component {
  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <LinearGradient 
          colors={['#3f6b6b', '#121212']}
          style={styles.header}
        />
        <FlatList style={styles.list} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    width: '100%',
    height: 500
  },
  list: {
    width: '100%',
    height: 800,
    backgroundColor: '#121212'
  }
});

export default App;