import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const WebViewScreen = ({ route }) => {
  const { url } = route.params;

  // Mã JavaScript để chặn video quảng cáo
  const blockAdsScript = `
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        const addedNodes = Array.from(mutation.addedNodes);
        addedNodes.forEach(node => {
          if (node.tagName === 'VIDEO') {
            node.style.display = 'none';
          }
        });
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  `;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: url }}
        injectedJavaScript={blockAdsScript}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default WebViewScreen;
