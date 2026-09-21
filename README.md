<div align="center">

  # 🍿 FilmFluff - OMDb Film ve Dizi Keşif Platformu

  **OMDb API Kullanılarak Geliştirilmiş Modern, Cam Efektli (Glassmorphic) Tek Sayfa Film Arama Uygulaması (SPA)**

  [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
  [![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
  [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  [![OMDb API](https://img.shields.io/badge/OMDb%20API-Yellow?style=for-the-badge&logo=imdb&logoColor=black)](https://www.omdbapi.com/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

  [Özellikler](#-öne-çıkan-özellikler) •
  [Teknolojiler](#-kullanılan-teknolojiler) •
  [Proje Yapısı](#-proje-dizin-yapısı) •
  [Kurulum ve Kullanım](#-kurulum-ve-kullanım) •
  [API Bilgisi](#-omdb-api-yapılandırması)

</div>

---

## 📌 Proje Hakkında

**FilmFluff**, sinemaseverlerin film ve dizileri kolayca aramasını, detaylı IMDb puanlarını, oyuncu kadrolarını, yönetmen ve özet bilgilerini görüntülemesini sağlayan **Single Page Application (SPA)** mimarisinde geliştirilmiş bir web uygulamasıdır.

Uygulama [OMDb API](https://www.omdbapi.com/) (Open Movie Database) servisinden canlı veri çeker. Şık Glassmorphism (buzlu cam) arayüz tasarımı, Gece/Gündüz tema seçeneği ve gelişmiş filtreleme seçenekleriyle kullanıcı dostu bir deneyim sunar.

---

## ✨ Öne Çıkan Özellikler

- 🔍 **Canlı Otomatik Tamamlama (Debounced Autocomplete)**: Arama çubuğuna yazıldığı anda (300ms geciktirme ile) hızlı öneri listesi sunar.
- ✨ **Popüler Keşifler (Slider Carousel)**: Ana sayfada IMDb'nin en popüler kültür filmlerini sergileyen yatay kaydırılabilir özel film slider'ı.
- 🎭 **Gelişmiş Filtre Seçenekleri**:
  - Tür Filtresi (*Film* / *Dizi*)
  - Yıl Filtresi (*Örn: 2024*)
  - Kategori Filtresi (*Aksiyon, Komedi, Dram, Korku, Bilim Kurgu, Animasyon*)
- 🎬 **Detaylı Film Modalı**: Film kartına tıklandığında açılan popup pencerede:
  - Yüksek kaliteli afiş
  - Yönetmen ve oyuncu kadrosu
  - Renklendirilmiş IMDb Puanı ⭐ (>7 üzeri yeşil renk vurgusu)
  - Detaylı film özeti (Plot)
- 🌙 / 🌸 **Gündüz ve Gece Modu (Dynamic Glassmorphic Theme)**:
  - Kullanıcı tercihine göre anında tema değiştirme.
  - Seçilen tema ve son yapılan arama `localStorage` ile taranarak sayfa yenilense dahi korunur.
- 📱 **Tamamen Responsive Tasarım**: Mobil, tablet ve masaüstü cihazlarla %100 uyumlu layout.

---

## 🛠️ Kullanılan Teknolojiler

| Teknoloji | Açıklama |
| :--- | :--- |
| **HTML5** | Semantik web yapısı ve modern UI elemanları |
| **CSS3** | Glassmorphism (buzlu cam efekti), CSS Değişkenleri, Flexbox & Grid |
| **Vanilla JavaScript (ES6+)** | `async/await`, `Fetch API`, Debouncing, DOM manipülasyonu, `localStorage` |
| **OMDb API** | Film, dizi, IMDb puanı ve afiş verilerini sağlayan REST API |
| **Google Fonts (Poppins)** | Modern ve okunabilir tipografi |

---

## 📁 Proje Dizin Yapısı

```
omdb-project/
├── index.html        # Ana HTML yapısı ve modal bileşenleri
├── style.css         # Glassmorphism stil tanımları, renk değişkenleri ve responsive kurallar
├── app.js            # OMDb API entegrasyonu, debounced arama, slider ve tema kontrolleri
└── README.md         # Proje dokümantasyonu
```

---

## 🚀 Kurulum ve Çalıştırma

Proje herhangi bir derleme (build) veya sunucu gerektirmez. Doğrudan tarayıcıda çalıştırılabilir.

1. **Depoyu klonlayın:**
   ```bash
   git clone https://github.com/iamhilals/omdb-project.git
   cd omdb-project
   ```

2. **Uygulamayı Çalıştırın:**
   - `index.html` dosyasını çift tıklayarak tarayıcınızda açın veya Live Server eklentisi ile çalıştırın.

---

## 🔑 OMDb API Yapılandırması

Uygulama varsayılan olarak tanımlı bir OMDb API anahtarı ile çalışmaktadır. Kendi API anahtarınızı kullanmak isterseniz `app.js` dosyasının en üstündeki `API_KEY` sabitini değiştirebilirsiniz:

```javascript
// app.js
const API_KEY = 'YOUR_OMDB_API_KEY';
const BASE_URL = 'https://www.omdbapi.com/';
```

> 💡 *Ücretsiz OMDb API anahtarı almak için [omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx) adresini ziyaret edebilirsiniz.*

---



## 📜 Lisans

Bu proje açık kaynaklı bir çalışmadır.

<div align="center">
  <sub>FilmFluff • Sinema Keşif Platformu 🍿</sub>
</div>
