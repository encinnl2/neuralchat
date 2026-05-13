import React from 'react';
import { View, Image, TouchableOpacity, Text, ScrollView, StyleSheet } from 'react-native';
import { ChatImage } from '../services/anthropic';

interface Props {
  images: ChatImage[];
  onRemove: (index: number) => void;
}

export function ImagePreview({ images, onRemove }: Props) {
  if (images.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {images.map((img, i) => (
        <View key={i} style={styles.item}>
          <Image
            source={{ uri: `data:${img.mediaType};base64,${img.base64}` }}
            style={styles.image}
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.remove} onPress={() => onRemove(i)}>
            <Text style={styles.removeText}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 90,
    borderTopWidth: 1,
    borderTopColor: '#1A2535',
    backgroundColor: '#0D1421',
  },
  content: {
    padding: 8,
    gap: 8,
    flexDirection: 'row',
  },
  item: { position: 'relative' },
  image: {
    width: 72,
    height: 72,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2A3F55',
  },
  remove: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
});
