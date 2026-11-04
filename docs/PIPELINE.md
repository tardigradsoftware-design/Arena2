# Üretim akışı

## 1. Görseli hazırla ve kontrol et

1. Görev için en-boy oranı, çözünürlük, stil, güvenli alan ve kullanım lisansını belirle.
2. İstenen görseli bu oturumdaki görsel üretme aracıyla oluşturabilir veya kullanıcı kaynağını `public/assets/` içine koyabiliriz. Model ağırlıklarını, checkpoint'leri ve cache'leri repoya ekleme.
3. `npm run check:image -- public/assets/dosya.png` ile dosyayı açılabilirlik/boyut açısından kontrol et. Gerekirse `--expect=1920x1080` ekle.
4. Otomatik kontrolden sonra görüntüyü `read_file`/önizleme ile açıp gözle incele: kompozisyon, anatomi, metin, kenar kırpımı, renk, artefakt ve kaynak/lisans. Otomatik boyut kontrolü kalite onayı değildir.

## 2. Hareket ve tarayıcı önizlemesi

- Sahne, kare başına deterministik React bileşenidir. Zamanı `useCurrentFrame()` ve `useVideoConfig()` ile al; animasyonu CSS/Canvas/SVG/React ile kur.
- `npm run studio` Remotion Studio'yu; `npm run preview` Player'ı gerçek Chromium tabanlı bir tarayıcıda gösterir.
- `npm run test:browser` Player'ı Playwright/Chromium'da açar, temel metin ve yüklenme durumunu doğrular, başarısızlıkta ekran görüntüsü/trace bırakır. İstenen sahne kareleri için bu testi genişletip screenshot karşılaştırması ekleyebiliriz.
- Önemli kare için `npm run still` kullan. PNG'yi görsel olarak açıp kontrol et; gerekirse farklı karelerle tekrarla.

## 3. TTS ve ses tasarımı

- Doğal ses gerekiyorsa önce dil, aksan, ton, hız ve telaffuz sözlüğünü belirle. Bu oturumun konuşma üretme aracı kullanılacaksa önce ses adaylarını dinleyip seç; sonra üretilen dosyayı `public/audio/` içine al ve telaffuzu dinleyerek kontrol et.
- Türkçe hızlı açık kaynak taslak için `scripts/tts/espeak.sh` kullanılabilir. eSpeak NG sesi robotiktir; son ürün standardı değildir.
- Bir gerçek kişinin sesini klonlamadan önce açık rıza ve kullanım haklarını doğrula.
- FFmpeg araçları:
  - `scripts/audio/synthesize-chime.sh`: tekrarlanabilir test tonu üretir.
  - `scripts/audio/normalize.sh`: sesi 48 kHz stereo PCM WAV'a, yaklaşık `-16 LUFS` / `-1.5 dBTP` hedefine normalize eder. Hedefi platforma göre dinleyerek doğrula.
  - `scripts/video/mux-audio.sh`: render edilmiş videonun görüntü akışını yeniden kodlamadan ses ekler.
- Video içine sahne bazlı müzik/konuşma koyarken mümkünse Remotion `<Audio>` bileşenini kullan; FFmpeg'i son miks, normalize, mux ve dönüştürme için kullan. Gereksiz çift encode kaliteyi düşürür.

## 4. Render ve teslim

- `npm run render:preview` düşük çözünürlüklü hızlı kontrol; `npm run render` tam çözünürlüklü MP4.
- `npm run check:video -- dosya.mp4` ve `npm run check:audio -- dosya.wav` `ffprobe` ile akış/codec/süreyi kontrol eder.
- Ağır işlemler GitHub Actions'ta yapılır. `Video Studio CI` bir still, tarayıcı testi ve küçük ses fixture'ı üretir; `Render video` yalnızca elle tetiklenir. Böylece her commit tam video render etmez.
- Çıktılar artifact olarak indirilir; `out/` Git dışında kalır. Teslim öncesi final MP4'ü açıp hem görüntüyü hem sesi dinle.
