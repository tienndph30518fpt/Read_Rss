
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import convert from 'xml-js';
import HTMLView from 'react-native-htmlview';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [newsItems, setNewsItems] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('https://vnexpress.net/rss/kinh-doanh.rss');
        const xmlData = response.data;
        const jsonData = convert.xml2json(xmlData, { compact: true, spaces: 4 });
        const rssData = JSON.parse(jsonData);
        const newsList = rssData.rss.channel.item || [];
        const formattedNewsList = newsList.map(item => ({
       
          title: item.title._text,
          description: item.description._cdata,
          link: item.link._text,
          imageUrl: item.enclosure && item.enclosure.url ? item.enclosure.url._text : null,
          pubDate: item.pubDate._text,
        }));
        setNewsItems(formattedNewsList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handlePress = (url) => {
    console.log("Bạn đã nhấn vào tin tức có đường dẫn:", url);
    // Điều hướng đến màn hình WebViewScreen và truyền đường dẫn URL của tin tức
    navigation.navigate('WebViewScreen', { url });
  };

  const renderNewsItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item.link)}>
      <View style={[styles.newsItemContainer]}>
        <Text style={[styles.title]}>{item.title}</Text>
        <Image source={{ uri: item.imageUrl }} style={[styles.image]} />
        <HTMLView value={item.description} />
        <Text style={styles.pubDate}>{item.pubDate}</Text>
      </View>
      <View style={styles.separator}></View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container]}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={newsItems}
          renderItem={renderNewsItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  newsItemContainer: {
   
    paddingHorizontal: 10,
   
    marginVertical: 5,
    borderRadius: 10, // Bo góc
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: 90,
    height: 45,
    paddingRight:20,
    borderRadius: 5, // Bo góc cho hình ảnh
  },
  pubDate: {
    fontStyle: 'italic',
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC', // Mầu đường kẻ ngang
  }
});

export default Home;
