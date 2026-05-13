import React, { useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { ChatBubble } from '../components/ChatBubble';
import { TypingIndicator } from '../components/TypingIndicator';
import { ImagePreview } from '../components/ImagePreview';
import { useChat } from '../hooks/useChat';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ChatScreen() {
  const {
    messages,
    isLoading,
    selectedImages,
    inputText,
    setInputText,
    sendMessage,
    addImage,
    removeImage,
    clearChat,
  } = useChat();

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages, isLoading]);

  const pickImage = async (useCamera: boolean) => {
    const permission = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Izin Diperlukan', 'Berikan izin akses untuk melanjutkan.');
      return;
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsMultipleSelection: true, quality: 0.8 });

    if (result.canceled) return;

    for (const asset of result.assets) {
      const info = await FileSystem.getInfoAsync(asset.uri);
      if (info.exists && (info as any).size > MAX_FILE_SIZE) {
        Alert.alert('File Terlalu Besar', 'Maksimal ukuran gambar 5MB.');
        continue;
      }
      const base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: FileSystem.EncodingType.Base64 });
      const mediaType = asset.mimeType || 'image/jpeg';
      addImage({ base64, mediaType });
    }
  };

  const handleAttach = () => {
    Alert.alert('Pilih Sumber Foto', '', [
      { text: 'Kamera', onPress: () => pickImage(true) },
      { text: 'Galeri', onPress: () => pickImage(false) },
      { text: 'Batal', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>✦</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>NeuralChat AI</Text>
              <View style={styles.statusRow}>
                <View style={styles.dot} />
                <Text style={styles.statusText}>ONLINE</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={clearChat} style={styles.clearBtn}>
            <Text style={styles.clearText}>Bersihkan</Text>
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatBubble message={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={isLoading ? <TypingIndicator /> : null}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Image Preview */}
        <ImagePreview images={selectedImages} onRemove={removeImage} />

        {/* Input Bar */}
        <SafeAreaView edges={['bottom']} style={styles.inputBar}>
          <TouchableOpacity onPress={handleAttach} style={styles.attachBtn}>
            <Text style={styles.attachIcon}>📎</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ketik pesan..."
            placeholderTextColor="#3D5066"
            multiline
            maxLength={2000}
            onSubmitEditing={sendMessage}
            blurOnSubmit={false}
          />

          <TouchableOpacity
            onPress={sendMessage}
            style={[styles.sendBtn, (!inputText.trim() && selectedImages.length === 0) && styles.sendBtnDisabled]}
            disabled={isLoading || (!inputText.trim() && selectedImages.length === 0)}
          >
            {isLoading
              ? <ActivityIndicator size="small" color="#fff" />
              : <Text style={styles.sendIcon}>➤</Text>
            }
          </TouchableOpacity>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#080C14' },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0D1421',
    borderBottomWidth: 1,
    borderBottomColor: '#1A2535',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#0EA5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { fontSize: 18, color: '#fff' },
  headerTitle: { color: '#E8F4F0', fontWeight: '700', fontSize: 16 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#7DF9D0' },
  statusText: { color: '#7DF9D0', fontSize: 10, letterSpacing: 1 },
  clearBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#1A2535',
    borderWidth: 1,
    borderColor: '#2A3F55',
  },
  clearText: { color: '#7DF9D0', fontSize: 12 },
  list: { paddingVertical: 12 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#0D1421',
    borderTopWidth: 1,
    borderTopColor: '#1A2535',
    gap: 8,
  },
  attachBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#1A2535',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2A3F55',
  },
  attachIcon: { fontSize: 18 },
  input: {
    flex: 1,
    backgroundColor: '#1A2535',
    borderWidth: 1,
    borderColor: '#2A3F55',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#E2EAF0',
    fontSize: 15,
    maxHeight: 120,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#0EA5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#1A2535' },
  sendIcon: { color: '#fff', fontSize: 16 },
});
