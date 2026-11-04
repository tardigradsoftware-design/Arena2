# Arena Motion Studio

Bu depo, görsel/animasyon/video görevlerimizi tekrar edilebilir biçimde üretmek için hazırlandı: **Remotion + React**, gerçek Chromium tarayıcısında önizleme/test, **FFmpeg** ile ses/video işlemleri ve GitHub Actions üzerinde render.

## Hızlı başlangıç

```bash
npm ci
npm run studio
```

- `npm run studio` — Remotion Studio'yu açar (varsayılan port `3000`).
- `npm run preview` — Player önizlemesini `http://localhost:4173/preview.html` adresinde açar.
- `npm run test:browser` — Playwright ile gerçek Chromium motorunda Player'ı açar, metinleri kontrol eder ve ekran görüntüsü alır.
- `npm run test` / `npm run typecheck` — profil ve TypeScript kontrolleri.

## Video ve görsel kontrolü

```bash
npm run still       # out/preview.png üretir
npm run check:image # dosya biçimi, boyutlar ve boş/tek-renk görüntü uyarısı
npm run render:first # VID-001 test videosunu üretir
npm run check:video -- out/vid-001-test.mp4
```

İlk yerel render öncesi Remotion'ın tarayıcısını kurmak gerekebilir:

```bash
npx remotion browser ensure
```

Render dosyaları `out/` altında tutulur ve Git'e eklenmez. Actions'ta `Render video` iş akışını elle başlatıp `preview` veya `final` profilini seçebilirsin; MP4 ve görsel kontrolleri 7 gün saklanan artifact olarak indirilir. **Yerel makinede ağır render yapmıyoruz.** Standart GitHub runner'ında GPU varsayılmıyor; işler en fazla 2 render worker'ı kullanıyor. Bellek kapasitesi repo görünürlüğüne ve GitHub planına göre değişebileceğinden iş akışı sabit bir “4 GB garantisi” varsaymıyor.

## Görsel, TTS ve ses

- Görselleri `public/assets/` altına koy. Üretilen dosyayı `read_file`/önizleme ile gözle de incele; otomatik kontroller tek başına estetik, yazım, anatomi veya lisans uygunluğunu onaylamaz.
- Anlatım dosyalarını `public/audio/` altına koy. Remotion içinde `staticFile('audio/narration.wav')` ve `<Audio />` ile sahneye eklenebilir.
- Türkçe bir taslak TTS üretmek için (GitHub Actions'ta `espeak-ng` kurulu):

  ```bash
  npm run tts:espeak -- "İstanbul'da görsel bir hikâye başlıyor." out/audio/voice-draft.wav
  npm run check:audio -- out/audio/voice-draft.wav
  ```

  eSpeak NG hafif, açık kaynaklı ve robotik tınılı bir taslaktır; doğal anlatım için nihai seslendirme yerine geçmez. İsteğe bağlı ses işleme ve FFmpeg sentez testi:

  ```bash
  npm run audio:sfx
  npm run audio:normalize -- out/audio/voice-draft.wav out/audio/voice-normalized.wav
  bash scripts/video/mux-audio.sh out/studio-intro.mp4 out/audio/voice-normalized.wav out/final.mp4
  ```

- Açık kaynak araştırması, lisans notları, model seçimi ve kaynaklar: [`docs/RESEARCH.md`](docs/RESEARCH.md). Uygulama akışı: [`docs/PIPELINE.md`](docs/PIPELINE.md).

## Klasörler

```text
src/                  Remotion bileşenleri ve tarayıcı Player'ı
public/assets/        Onaylanmış görsel kaynaklar
public/audio/         Onaylanmış anlatım ve ses kaynakları
scripts/              FFmpeg, TTS ve medya doğrulama yardımcıları
tests/                Vitest ve Playwright testleri
.github/workflows/    GitHub Actions doğrulama ve render işleri
out/                  Üretilen çıktılar (Git dışı)
```

Herhangi bir modeli/ağır ağırlığı veya videoyu repoya indirmiyoruz. Model, ses ve görsel haklarını `docs/ASSET_LOG.md` içinde kayda geçir; telif/lisansı belirsiz varlığı üretime alma.
