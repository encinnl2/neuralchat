import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  ScrollView,
} from 'react-native';
import { Message } from '../hooks/useChat';

interface Props {
  message: Message;
}

export function ChatBubble({ message }: Props) {
  const isUser = message.role === 'user';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const time = message.timestamp.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Animated.View
      style={[
        styles.wrapper,
        isUser ? styles.wrapperUser : styles.wrapperAI,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {!isUser && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>✦</Text>
        </View>
      )}

      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI, message.error && styles.bubbleError]}>
        {/* Images */}
        {message.images && message.images.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesRow}>
            {message.images.map((img, i) => (
              <Image
                key={i}
                source={{ uri: `data:${img.mediaType};base64,${img.base64}` }}
                style={styles.image}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        )}

        {/* Text */}
        {message.content ? (
          <Text style={[styles.text, isUser ? styles.textUser : styles.textAI]}>
            {message.content}
          </Text>
        ) : null}

        {/* Time */}
        <Text style={[styles.time, isUser ? styles.timeUser : styles.timeAI]}>{time}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 12,
    alignItems: 'flex-end',
  },
  wrapperUser: { justifyContent: 'flex-end' },
  wrapperAI: { justifyContent: 'flex-start' },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#0EA5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 4,
  },
  avatarText: { fontSize: 14, color: '#fff' },
  bubble: {
    maxWidth: '78%',
    borderRadius: 18,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  bubbleUser: {
    backgroundColor: '#0EA5E9',
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: '#1A2535',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#2A3F55',
  },
  bubbleError: {
    backgroundColor: '#2A1A1A',
    borderColor: '#5A2A2A',
  },
  imagesRow: { marginBottom: 8 },
  image: {
    width: 180,
    height: 180,
    borderRadius: 12,
    marginRight: 8,
  },
  text: { fontSize: 15, lineHeight: 22 },
  textUser: { color: '#FFFFFF' },
  textAI: { color: '#E2EAF0' },
  time: { fontSize: 10, marginTop: 6 },
  timeUser: { color: 'rgba(255,255,255,0.6)', textAlign: 'right' },
  timeAI: { color: '#4A6080' },
});
