import { useState, useCallback } from 'react';
import { sendToAI, ChatMessage, ChatImage } from '../services/anthropic';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  images?: ChatImage[];
  timestamp: Date;
  error?: boolean;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: 'Halo! Saya NeuralChat AI 👋\nKirim pesan atau foto, saya siap membantu!',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<ChatImage[]>([]);
  const [inputText, setInputText] = useState('');

  const addImage = useCallback((img: ChatImage) => {
    setSelectedImages((prev) => [...prev, img]);
  }, []);

  const removeImage = useCallback((index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearImages = useCallback(() => setSelectedImages([]), []);

  const sendMessage = useCallback(async () => {
    const text = inputText.trim();
    if (!text && selectedImages.length === 0) return;
    if (isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      images: selectedImages.length > 0 ? [...selectedImages] : undefined,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setSelectedImages([]);
    setIsLoading(true);

    try {
      // Build history for API (exclude welcome message images from context if needed)
      const history: ChatMessage[] = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
        images: m.images,
      }));

      const reply = await sendToAI(history);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: reply,
          timestamp: new Date(),
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '⚠️ Gagal terhubung ke AI. Periksa koneksi internet kamu.',
          timestamp: new Date(),
          error: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, selectedImages, isLoading, messages]);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: '0',
        role: 'assistant',
        content: 'Halo! Saya NeuralChat AI 👋\nKirim pesan atau foto, saya siap membantu!',
        timestamp: new Date(),
      },
    ]);
    setSelectedImages([]);
    setInputText('');
  }, []);

  return {
    messages,
    isLoading,
    selectedImages,
    inputText,
    setInputText,
    sendMessage,
    addImage,
    removeImage,
    clearImages,
    clearChat,
  };
}
