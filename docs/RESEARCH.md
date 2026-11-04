# Açık kaynak araştırması ve teknik kararlar

**Araştırma tarihi:** 2026-11-04. Sürüm/lisans bilgisi upstream depoları ve npm kayıtları üzerinden kontrol edildi. Bu not teknik yönlendirmedir, hukuki görüş değildir.

## Kısa karar

- **Sahne ve animasyon:** Remotion 4.0.540 + React; kodla üretilebilir, kare bazında deterministik, parametreli sahneler.
- **Görüntü üretimi:** Bu oturumda kullanılabilen görüntü üretim aracını veya kullanıcı tarafından sağlanan görselleri kullan; final varlıkları `public/assets/` içine alıp hem makineyle hem gözle doğrula. Ağır model ağırlıklarını repoya/CI'a koyma.
- **Konuşma:** Türkçe final için seçilen dile uygun doğal ses üretim aracı ve açıkça onaylanmış ses; `espeak-ng` yalnızca hızlı taslak. Model/ses lisansı ve ses benzerliği hakları ayrı ayrı kontrol edilmeli.
- **Ses/video post-prodüksiyonu:** FFmpeg + `ffprobe`; Remotion sahne render'ı, FFmpeg normalize/mux/teknik kontrol.
- **Tarayıcı ve görsel QA:** Playwright + gerçek Chromium motoru; CI ekran görüntüsü ve Remotion still artifact'ı.
- **CPU:** Yerel tam render yerine GitHub Actions. Standart runner'da GPU varsaymıyoruz; render concurrency 2, preview ölçekli, tam render elle başlatılıyor.

## Remotion

npm kayıtlarında `remotion`, `@remotion/cli`, `@remotion/player` ve `@remotion/media-utils` sürümü **4.0.540** olarak eşitlendi. Remotion, React bileşenlerini zaman çizelgesine/karelere göre render eder; HTML/CSS, SVG, Canvas ve React animasyonları aynı composition içinde birleştirilebilir. Kod deposu, kurulum ve dokümantasyon:

- [Remotion GitHub](https://github.com/remotion-dev/remotion)
- [Remotion dokümantasyonu](https://www.remotion.dev/docs)
- [Upstream LICENSE.md](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)

**Lisans uyarısı:** Remotion `LICENSE.md` düz MIT lisansı değildir. Upstream metin bireyler, kâr amacı gütmeyenler ve en fazla 3 çalışanlı kuruluşlar için ücretsiz kullanım kapsamı; daha büyük kâr amaçlı kuruluşlar için şirket lisansı tarif ediyor. Ürün/ticari kullanım öncesi en güncel metni tekrar kontrol et. `@remotion/*` paketlerini aynı sürümde tut.

## Gerçek tarayıcı ve görüntü QA

[Playwright](https://github.com/microsoft/playwright) gerçek Chromium/Firefox/WebKit motorlarını otomasyonla kontrol eder; bu projede Chromium kullanılıyor. Tarayıcı ikili dosyaları npm paketine dahil değildir: CI `playwright install` ile Chromium headless shell'i kurar. Remotion render'ı için Remotion'ın kendi headless browser'ı ayrıca kuruluyor. Kullanıcıya yönelik interaktif Player `preview.html` üzerinden açılır.

Görsel test iki katmanlı:

1. `sharp` dosya biçimi, çözünürlük ve piksel istatistiklerini kontrol eder; `ffprobe` video/ses akışlarını doğrular.
2. Playwright Player'ı açar ve ekran görüntüsü alır. Bu, estetik/yazım/marka onayı yerine geçmez; önemli kareler ayrıca insan gözüyle incelenir.

## Açık kaynak görüntü üretimi

[ComfyUI](https://github.com/Comfy-Org/ComfyUI) model değil; farklı diffusion modellerini ve iş akışlarını birleştiren bir runtime/UI. Güncel kaynak kodu GPL-3.0; ComfyUI lisansı kullanılan model ağırlıklarının lisansını belirlemez. Her modelin ağırlık lisansı, kullanım sınırı, eğitim/veri açıklaması ve üretilen işin kullanım hakkı ayrıca incelenmeli.

ComfyUI / SD / FLUX türü üretim, GPU ve model ağırlığı ister. Standart GitHub Actions runner'ında GPU yok varsayımıyla bu hattı CI'a kurmadım: yavaş/masraflı olur, büyük checkpoint'ler artifact sınırını tüketir. Görseli üretim dışı aşamada oluşturup dosya olarak içeri almak daha güvenilir. Sonra bu repo boyut/biçim testini, tarayıcı preview'ını ve video render'ını yapar.

## TTS ve ses üretimi

- [Kokoro kaynak kodu](https://github.com/hexgrad/kokoro) 82M parametreli açık ağırlıklı TTS modelini ve Apache-2.0 lisans bilgisini duyuruyor. Upstream README'de İngilizce, İspanyolca, Fransızca, Hintçe, İtalyanca, Japonca, Brezilya Portekizcesi ve Mandarin akışları listeleniyor; **Türkçe listede yok**. Bu yüzden Türkçe ana TTS motoru olarak seçilmedi. Ses/voice dosyaları ve eğitim verisi için model kartını ve her sesin koşullarını ayrıca kontrol etmek gerekir.
- [Piper (OHF-Voice)](https://github.com/OHF-Voice/piper1-gpl) güncel GPL-3.0 dağıtımına sahip. Eski [rhasspy/piper](https://github.com/rhasspy/piper) arşivlenmiş farklı lisans bilgisi taşıyor. İsim benzerliğine güvenme; kullandığın kod sürümü ile **her ses modelinin** lisansını ayrı kontrol et.
- [eSpeak NG](https://github.com/espeak-ng/espeak-ng) hafif ve diller arası kullanışlı, ancak robotik tınlayan GPL-3.0 konuşma sentezleyicisidir. Burada sadece hızlı Türkçe taslak/smoke-test için sistem paketi olarak kullanılıyor; model ağırlığı repoya alınmıyor.
- Türkçe final anlatımda sesin doğal telaffuzu, özel isimler, tarih/sayı okunuşu, hız, tonlama ve lisans/izinler dinlenerek onaylanmalı. Gerçek kişi sesini taklit etme/klonlama için açık rıza şartını atlama.

## FFmpeg

[FFmpeg upstream](https://github.com/FFmpeg/FFmpeg) ses/video/subtitle akışlarını dönüştüren araçlar sunar. Bu projede:

- Remotion ile sahneleri üret; FFmpeg ile `loudnorm`, yeniden örnekleme, test tonu ve stream-copy mux yap.
- `ffprobe` ile codec, çözünürlük, kare hızı, süre, örnekleme oranı ve kanal sayısını doğrula.
- `-c:v copy` ile ses eklerken görüntüyü yeniden encode etmeden koru; encode gerekiyorsa bir kez yap ve çıktıyı izleyip dinle.
- Upstream, temel kodun ağırlıklı olarak LGPL olduğunu ve bazı opsiyonel bileşenlerin GPL olabildiğini belirtiyor. Distro build'inin `ffmpeg -buildconf` çıktısını ve dağıtım/lisans gereksinimini kontrol et.

## GitHub Actions ve kaynak sınırı

GitHub runner donanımı repo görünürlüğü/planı ve GitHub'ın güncel politika/runner'ına göre değişebilir; **her durumda 4 GB RAM veya GPU garantisi varmış gibi davranmıyoruz**. İş akışlarında `ubuntu-latest`, concurrency 2, düşük ölçekli preview ve elle tetiklenen tam render kullanılıyor. Bir gün daha büyük/görsel üretim modeli gerekiyorsa model inference'ı bu workflow'a taşımak yerine GPU'lu ayrı bir sağlayıcı/runner seçilmeli.

### Kaynaklar

- Remotion: [repository](https://github.com/remotion-dev/remotion), [license](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)
- Playwright: [repository](https://github.com/microsoft/playwright), [browser installation docs](https://playwright.dev/docs/browsers)
- FFmpeg: [repository](https://github.com/FFmpeg/FFmpeg), [filters documentation](https://ffmpeg.org/ffmpeg-filters.html)
- ComfyUI: [repository](https://github.com/Comfy-Org/ComfyUI)
- Kokoro: [repository](https://github.com/hexgrad/kokoro)
- Piper: [current GPL fork](https://github.com/OHF-Voice/piper1-gpl), [archived upstream](https://github.com/rhasspy/piper)
- eSpeak NG: [repository](https://github.com/espeak-ng/espeak-ng)
