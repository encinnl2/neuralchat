# 🤖 NeuralChat AI

Aplikasi Android AI Chat yang bisa kirim teks dan foto, ditenagai oleh AI.

---

## ✨ Fitur

- Chat real-time dengan AI
- Kirim & analisis foto (kamera / galeri)
- Dark mode futuristik
- Typing indicator animasi
- Riwayat percakapan per sesi

---

## ⚙️ Setup

### 1. Install dependencies
```bash
npm install
npx expo install
```

### 2. Isi konfigurasi `.env`
File `.env` sudah tersedia. Pastikan isinya:
```
ANTHROPIC_BASE_URL=https://opencode.ai/zen
ANTHROPIC_MODEL=minimax-m2.5-free
ANTHROPIC_API_KEY=sk-EGthZACKdpfCGYgq4SfceSzoFE7JJ07DSxzEKDGkkRk3CTRTI7aaH6lddUo4ZbvA
```

---

## 🚀 Jalankan di Emulator / HP

```bash
# Dengan Expo Go (HP fisik)
npm start

# Di Android Emulator
npm run android
```

---

## 📦 Build APK

### Langkah 1 — Install EAS CLI
```bash
npm install -g eas-cli
```

### Langkah 2 — Login Expo (gratis)
```bash
eas login
```

### Langkah 3 — Konfigurasi project (sekali saja)
```bash
eas build:configure
```

### Langkah 4 — Build APK
```bash
npm run build:apk
```

> File `.apk` siap didownload setelah ~10–15 menit (build di cloud EAS).

### Build Lokal (tanpa akun EAS)
```bash
npm run build:apk:local
```
> Butuh Android Studio + JDK terinstall.

---

## 🎨 Ganti Icon Aplikasi

### Cara 1 — Ganti Manual
1. Siapkan file gambar **PNG 1024×1024 px** (background solid, bukan transparan)
2. Rename menjadi `icon.png`
3. Taruh di folder `assets/`
4. Rebuild APK → icon otomatis berubah

File yang perlu diganti:
| File | Ukuran | Keterangan |
|---|---|---|
| `assets/icon.png` | 1024×1024 | Icon utama |
| `assets/adaptive-icon.png` | 1024×1024 | Icon adaptive Android |
| `assets/splash.png` | 1284×2778 | Splash screen (opsional) |

### Cara 2 — Generate Otomatis dari 1 Gambar
Upload `icon.png` ke salah satu tool gratis:
- [appicon.co](https://appicon.co) — paling mudah
- [makeappicon.com](https://makeappicon.com) — lebih lengkap

Download hasilnya, taruh di folder `assets/`, rebuild APK.

### Tips Icon
- Gunakan rasio **1:1** (persegi sempurna)
- Jangan taruh teks penting di pinggir (bisa terpotong)
- Warna kontras agar terlihat di background terang & gelap
- Setelah ganti icon, **wajib rebuild APK**

---

## 📁 Struktur Project

```
neuralchat/
├── app/
│   ├── index.tsx          ← Screen utama chat
│   └── _layout.tsx        ← Layout & status bar
├── components/
│   ├── ChatBubble.tsx     ← Bubble pesan
│   ├── TypingIndicator.tsx← Animasi AI mengetik
│   └── ImagePreview.tsx   ← Preview foto sebelum kirim
├── services/
│   └── anthropic.ts       ← Koneksi ke API AI
├── hooks/
│   └── useChat.ts         ← State management chat
├── assets/
│   ├── icon.svg           ← Icon sumber (edit di sini)
│   ├── icon.png           ← Icon utama (1024×1024)
│   └── adaptive-icon.png  ← Icon adaptive Android
├── .env                   ← Konfigurasi API (jangan di-share!)
├── .env.example           ← Template .env
├── app.json               ← Konfigurasi Expo
└── eas.json               ← Konfigurasi build APK
```

---

## 🔑 Variabel Environment

| Variabel | Keterangan |
|---|---|
| `ANTHROPIC_BASE_URL` | Base URL API endpoint |
| `ANTHROPIC_MODEL` | Model AI yang digunakan |
| `ANTHROPIC_API_KEY` | API key (rahasia, jangan di-share) |

---

## ⚠️ Penting

- Jangan upload `.env` ke GitHub
- API key sudah terisi, jangan hardcode di kode
- Maksimal ukuran foto: **5MB**
