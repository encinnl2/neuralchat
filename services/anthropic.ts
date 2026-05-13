import { ANTHROPIC_BASE_URL, ANTHROPIC_MODEL, ANTHROPIC_API_KEY } from '@env';

export interface ChatImage {
  base64: string;
  mediaType: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  images?: ChatImage[];
}

export async function sendToAI(history: ChatMessage[]): Promise<string> {
  const messages = history.map((msg) => {
    if (msg.role === 'assistant') {
      return { role: 'assistant', content: msg.content };
    }

    const parts: any[] = [];

    if (msg.images && msg.images.length > 0) {
      msg.images.forEach((img) => {
        parts.push({
          type: 'image',
          source: {
            type: 'base64',
            media_type: img.mediaType,
            data: img.base64,
          },
        });
      });
    }

    parts.push({ type: 'text', text: msg.content || '(gambar dikirim)' });

    return { role: 'user', content: parts };
  });

  const response = await fetch(`${ANTHROPIC_BASE_URL}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 1024,
      system:
        'Kamu adalah asisten AI yang cerdas dan ramah. Kamu bisa menganalisis gambar dan menjawab pertanyaan. Jawab dalam bahasa yang sama dengan user.',
      messages,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API Error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text = data.content
    ?.map((b: any) => b.text || '')
    .join('')
    .trim();

  return text || 'Maaf, tidak ada respons dari AI.';
}
