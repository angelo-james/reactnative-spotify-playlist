import React, { Component } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  FlatList, 
  View, 
  Image, 
  Text, 
  TouchableOpacity 
} from 'react-native';
import { Font, LinearGradient } from 'expo';
import ApolloCLient from 'apollo-boost';
import { ApolloProvider, Query } from 'react-apollo';
import gql from 'graphql-tag';

const client = new ApolloCLient({
  uri: 'http://localhost:4000/'
})

class App extends Component {
  state = { 
    fontLoaded: false,
    staticData: [
      {key: '0', title: 'Title', artist: 'Artist', album: 'Album'}, 
      {key: '1', title: 'Title', artist: 'Artist', album: 'Album'}, 
      {key: '2', title: 'Title', artist: 'Artist', album: 'Album'}, 
      {key: '3', title: 'Title', artist: 'Artist', album: 'Album'}, 
      {key: '4', title: 'Title', artist: 'Artist', album: 'Album'}, 
      {key: '5', title: 'Title', artist: 'Artist', album: 'Album'}, 
      {key: '6', title: 'Title', artist: 'Artist', album: 'Album'}, 
      {key: '7', title: 'Title', artist: 'Artist', album: 'Album'}, 
      {key: '8', title: 'Title', artist: 'Artist', album: 'Album'}, 
      {key: '9', title: 'Title', artist: 'Artist', album: 'Album'}
    ]
  };

  async componentDidMount() {
    await Font.loadAsync({
      'gibson-regular': require('./assets/gibson-regular.ttf'),
      'gibson-bold': require('./assets/gibson-bold.ttf')
    })

    this.setState({ fontLoaded: true });
  }

  calculatePlaylistHeight = () => {
    if (this.state.currentScrollPos > 173) {
      const height = 160 - (this.state.currentScrollPos - 172);
      return height >= 0 ? height : 0;
    }
    return 510;
  }
  
  calculateButtonPos = () => {
    return this.state.currentScrollPos < 376 ? 1 : -this.state.currentScrollPos;
  }
  
  calculateArtSize = () => {
    return {
      width: (185 - (this.state.currentScrollPos / 10)),
      height: (185 - (this.state.currentScrollPos / 10)),
      opacity: (1 - (this.state.currentScrollPos / 350))
    }
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <Query
          query={gql`
            {
              playlist {
                name
                creator
                followers
                albumArt
                songs {
                  key
                  title
                  artist
                  album
                }
              }
            }
          `}
        >
          {({ loading, error, data }) => {
            if (loading || error) return <View />
            return <View>
          
            <ScrollView 
              contentContainerStyle={styles.container}
              onScroll={(event) => {
                this.setState({ currentScrollPos: event.nativeEvent.contentOffset.y })
              }}
            >
              <LinearGradient 
                colors={['#3f6b6b', '#121212']}
                style={styles.header}
              />
              {this.state.fontLoaded ? (
              <FlatList style={styles.list}
                data={data.playlist.songs}
                renderItem={({item}) => (
                  <View style={styles.playlistItem}>
                    <Text style={styles.playlistItemTitle}>{item.title}</Text>
                    <Text style={styles.playlistItemMeta}>{`${item.artist} • ${item.album}`}</Text>
                  </View>
                )}
              />) : null }
            </ScrollView>
            {this.state.fontLoaded ? (
              <View 
                style={{...styles.playlistDetails, height: this.calculatePlaylistHeight()}}
                pointerEvents="none"
              >
                <Image style={this.calculateArtSize()} source={{ uri: data.playlist.albumArt }} />

                {this.state.currentScrollPos < 103 ? <Text style={styles.playlistTitle}>{data.playlist.name}</Text> : null}
                {this.state.currentScrollPos < 53 ? <Text style={styles.playlistSubtitle}>`BY {data.playlist.creator} • {data.playlist.followers}`</Text> : null}
                {this.state.currentScrollPos < 28 ? (<TouchableOpacity style={{ ...styles.playlistButton, top: this.calculateButtonPos() }}><Text style={styles.playlistButtonText}>SHUFFLE PLAY</Text></TouchableOpacity>) : null }
              </View>)
              : null}
          </View>
          }}
        </Query>
      </ApolloProvider>

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
  },
  playlistDetails: {
    width: '100%',
    height: 600,
    position: 'absolute',
    top: 90,
    display: 'flex',
    alignItems: 'center'
  },
  playlistArt: {
    width: 180,
    height: 180,
  },
  playlistTitle: {
    fontFamily: 'gibson-bold',
    color: '#fff',
    fontSize: 30,
    marginTop: 50
  },
  playlistSubtitle: {
    fontFamily: 'gibson-regular',
    color: '#b9bdbe',
    fontSize: 12,
    marginTop: 15,
    textTransform: 'uppercase'
  },
  playlistButton: {
    backgroundColor: '#2ab759',
    width: 230,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    marginTop: 20
  },
  playlistButtonText: {
    fontFamily: 'gibson-bold',
    fontSize: 12,
    color: '#fff',
    letterSpacing: 2
  },
  playlistItem: {
    marginLeft: 25,
    marginBottom: 25
  },
  playlistItemTitle: {
    fontFamily: 'gibson-bold',
    fontSize: 18,
    color: '#fff'
  },
  playlistItemMeta: {
    fontFamily: 'gibson-regular',
    color: '#b9bdbe',
    fontSize: 15
  }
});

export default App;