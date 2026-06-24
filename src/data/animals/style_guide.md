**STYLE GUIDE ILUSTRASI HEWAN**

**Animalpedia Kids**

**PANDUAN VISUAL UNTUK ILUSTRATOR & AI IMAGE GENERATION**

Versi 1.0 | Juni 2026

# Daftar Isi

# 1\. Filosofi & Tujuan Style Guide

Dokumen ini menetapkan standar visual untuk seluruh ilustrasi hewan di Animalpedia Kids - baik dikerjakan oleh ilustrator manusia maupun digenerate menggunakan AI image generation. Tujuannya satu: memastikan 500+ spesies hewan yang akan dibuat terasa berasal dari "satu dunia" visual yang sama, meski dikerjakan oleh orang/proses yang berbeda dan di waktu yang berbeda-beda.

## 1.1 Mengapa Bukan Emoji atau Foto Asli

Emoji aman secara hukum (berasal dari Unicode Standard, bukan karya berlisensi) dan cocok dipakai untuk ikon UI kecil (tombol audio, pin lokasi, XP). Namun emoji tidak cocok menjadi wajah utama hewan karena:

- Render berbeda di setiap merk Android (Samsung, Xiaomi, Oppo merender emoji dengan gaya berbeda)
- Cakupan terbatas - banyak spesies MVP tidak memiliki representasi emoji sama sekali
- Tidak bisa diarahkan gaya/posenya sesuai kebutuhan brand

Foto asli hewan tetap dipakai, tapi terbatas pada section khusus "Lihat Aku di Dunia Nyata" di halaman Detail Hewan - bukan sebagai wajah utama navigasi. Ilustrasi custom adalah elemen visual utama di seluruh aplikasi.

## 1.2 Prinsip Inti

- Ramah dulu, akurat kedua - proporsi boleh disederhanakan demi keramahan visual, tapi ciri khas spesies (corak, bentuk telinga, dll) harus tetap bisa dikenali.
- Satu gaya untuk semua - singa dan semut harus terlihat seperti digambar oleh "orang/sistem yang sama".
- Aman secara emosi - tidak ada hewan yang terlihat menakutkan, agresif, atau menyeramkan, termasuk predator.
- Scalable ke ratusan aset - aturan harus cukup sederhana untuk diterapkan konsisten di 500 spesies oleh tim atau AI yang berbeda.

# 2\. Spesifikasi Teknis File

| **Atribut**             | **Spesifikasi**                                                         |
| ----------------------- | ----------------------------------------------------------------------- |
| Format file             | SVG (utama, untuk ikon/UI) atau PNG dengan transparansi                 |
| Ukuran kanvas master    | 1024 × 1024 px (persegi, mudah di-crop ke rasio apa pun)                |
| Resolusi ekspor Android | @1x 64px, @2x 128px, @3x 192px (mdpi/xhdpi/xxhdpi)                      |
| Background              | Transparan (PNG-24 / SVG tanpa background fill)                         |
| Mode warna              | RGB, sRGB color profile                                                 |
| Ketebalan outline       | Konsisten 6-8 px pada kanvas 1024px (skala proporsional di ukuran lain) |
| Warna outline           | Selalu coklat tua #5B3E2B - TIDAK PERNAH hitam pekat (#000000)          |
| Nama file               | snake_case sesuai id data: lion.png, sea_turtle.png, dst                |

# 3\. Aturan Bentuk & Proporsi

## 3.1 Rasio Kepala-Badan

Semua hewan digambar dengan proporsi "chibi/kawaii ringan" - kepala diperbesar relatif terhadap badan dibanding proporsi anatomis aslinya. Ini bukan kartun bayi penuh (rasio 1:1), tapi tetap condong dewasa-ramah.

| **Tipe Hewan**                        | **Rasio Kepala : Badan** | **Catatan**                                                        |
| ------------------------------------- | ------------------------ | ------------------------------------------------------------------ |
| Mamalia besar (gajah, singa, beruang) | 1 : 2                    | Kepala tetap besar meski badan tetap terlihat gagah/proporsional   |
| Mamalia kecil (kucing, kelinci)       | 1 : 1.5                  | Lebih membulat dari mamalia besar                                  |
| Burung                                | 1 : 1.3                  | Badan oval, kepala bulat menyatu nyaris tanpa leher panjang        |
| Reptil & Amfibi                       | 1 : 2.5                  | Badan tetap memanjang secukupnya agar tetap dikenali (ular, buaya) |
| Hewan laut                            | 1 : 2                    | Sirip/ekor disederhanakan, gerakan tetap terlihat dinamis          |
| Serangga                              | 1 : 1                    | Hampir seluruhnya "wajah" agar terlihat ramah, bukan menyeramkan   |

## 3.2 Mata

- Mata besar dan bulat, diameter minimal 18% dari lebar kepala
- Selalu ada highlight putih kecil (catchlight) di setiap mata untuk kesan hidup/ceria
- Posisi mata menghadap ke depan (forward-facing) meski hewan aslinya bermata samping (contoh: kelinci, kuda)
- Pupil bulat, tidak vertikal/menyipit - termasuk pada predator seperti kucing besar atau ular

## 3.3 Outline & Shading

- Outline tebal konsisten di seluruh tubuh, warna coklat tua (#5B3E2B), tidak pernah hitam pekat
- Shading datar (flat color) dengan maksimal 1 lapis bayangan lembut, tidak ada gradasi kompleks atau tekstur realistis
- Tidak ada bayangan jatuh (drop shadow) di belakang karakter - karakter berdiri bebas di atas transparan

# 4\. Palet Warna

Warna corak asli hewan tetap dipertahankan secara umum (singa tetap oranye-coklat, zebra tetap hitam putih), namun saturasi dinaikkan dan dibuat lebih cerah/hangat dibanding warna alami yang sering kusam.

## 4.1 Warna Sistem (Bingkai, Latar Kartu, Aksen UI)

| **Warna**                   | **Hex** | **Penggunaan**                       |
| --------------------------- | ------- | ------------------------------------ |
| **Krem (background utama)** | #FBF3E7 | Latar belakang umum seluruh aplikasi |
| **Hijau Daun**              | #3FA66C | Aksen mamalia darat & tombol utama   |
| **Hijau Tua**               | #2C7A4F | Teks aksen & status "Aman"           |
| **Oranye Matahari**         | #F2994A | CTA, reward, sticker badge           |
| **Biru Langit**             | #4FA8D8 | Aksen hewan laut & burung            |
| **Kuning Sticker**          | #FFC857 | Highlight fakta menarik, XP          |
| **Coklat Tinta**            | #5B3E2B | Semua outline ilustrasi & teks utama |

## 4.2 Aturan Saturasi Warna Hewan

- Naikkan saturasi 15-25% dari warna referensi foto asli
- Naikkan brightness sedikit agar tidak terlihat kusam/kotor (hindari warna lumpur/abu gelap polos)
- Maksimal 4 warna utama per hewan (warna dasar, warna corak/pola, warna mata, warna aksen seperti hidung/mulut)
- Hewan berwarna alami gelap/pudar (misalnya tikus, kelelawar) tetap diberi 1 warna aksen cerah (telinga dalam, pipi, atau perut) agar tidak terlihat suram

# 5\. Pose & Aset Wajib per Hewan

Setiap entri hewan di database minimal harus memiliki 3 aset ilustrasi berikut, dengan framing dan gaya yang konsisten:

| **Aset**                 | **Deskripsi**                                                                                  | **Dipakai di**                     |
| ------------------------ | ---------------------------------------------------------------------------------------------- | ---------------------------------- |
| Pose Utama (Hero)        | Badan penuh atau 3/4, menghadap depan-kiri sedikit, ekspresi netral-ramah, posisi berdiri/khas | Header Detail Hewan, kartu Explore |
| Avatar Bulat (Headshot)  | Crop kepala/wajah saja, pas dalam lingkaran, ekspresi tersenyum ringan                         | Family Tree, Koleksi, avatar kecil |
| Pose Aksi (opsional V2+) | Pose dinamis sesuai perilaku khas (singa mengaum, lumba-lumba melompat)                        | Animasi ringan, kartu Daily Animal |

## 5.1 Sudut & Framing Pose Utama

- Hewan menghadap depan atau 3/4 ke kiri - konsisten di semua aset agar terasa seperti "berbaris" rapi saat ditampilkan berdampingan
- Area aman (safe zone) margin 10% dari tepi kanvas - jangan ada bagian tubuh terpotong tepi
- Hewan berdiri/mengambang di tengah kanvas, tidak menyentuh tepi bawah kanvas

# 6\. Ekspresi & Bahasa Tubuh

Karena audiens utama berusia 4-10 tahun, semua hewan - termasuk predator alami seperti singa, hiu, atau buaya - harus terlihat aman secara emosional. Ini bukan berarti menghilangkan identitas mereka, tapi melunakkan ekspresi yang berpotensi menakutkan.

| **✓ LAKUKAN**<br><br>Mulut tertutup atau tersenyum tipis tanpa menunjukkan gigi/taring runcing | **✕ HINDARI**<br><br>Mulut terbuka lebar menunjukkan taring tajam atau ekspresi mengaum/menyerang |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **✓ LAKUKAN**<br><br>Mata besar bulat dengan alis natural atau tanpa alis sama sekali          | **✕ HINDARI**<br><br>Alis menukik tajam ke bawah yang membentuk kesan marah/galak                 |
| **✓ LAKUKAN**<br><br>Pose santai berdiri, duduk, atau berjalan natural                         | **✕ HINDARI**<br><br>Pose menerkam, mencakar, atau condong agresif ke arah penonton               |
| **✓ LAKUKAN**<br><br>Warna corak natural khas spesies (loreng harimau, totol macan tutul)      | **✕ HINDARI**<br><br>Tambahan elemen darah, luka, atau tekstur kasar/menyeramkan                  |

# 7\. Panduan Khusus per Kategori

## 7.1 Mamalia

Fokus pada tekstur bulu yang disederhanakan jadi pola/gradasi datar (bukan helai demi helai). Surai singa, belang harimau, dan pola serupa digambar sebagai bentuk geometris sederhana, bukan tekstur rambut detail.

## 7.2 Burung

Sayap dapat digambar sedikit terbuka/santai untuk menunjukkan karakter tanpa perlu pose terbang penuh. Paruh disederhanakan, dihindari bentuk yang terlalu runcing/tajam (contoh: paruh elang dibuat sedikit lebih membulat di ujung).

## 7.3 Reptil & Amfibi

Sisik dan tekstur kulit disederhanakan menjadi pola garis/segitiga datar berulang, bukan tekstur kasar realistis. Mata reptil tetap dibuat bulat (bukan pupil vertikal menyipit) untuk menjaga kesan ramah.

## 7.4 Hewan Laut

Gunakan gradasi warna biru-hijau yang lembut untuk bagian bawah tubuh (perut) vs bagian atas yang lebih gelap/cerah, mengikuti pola natural banyak hewan laut, namun tetap flat-shaded tanpa gradien kompleks.

## 7.5 Serangga

Perbesar mata dan perkecil/sederhanakan kaki dan antena agar tidak terkesan menyeramkan. Warna dibuat lebih cerah dan playful dibanding warna asli yang sering gelap/kusam (contoh: semut hitam pekat → coklat hangat).

# 8\. Template Prompt untuk AI Image Generation

Jika ilustrasi dibuat menggunakan AI image generation, gunakan struktur prompt berikut secara konsisten untuk setiap hewan agar hasilnya seragam. Ganti bagian dalam tanda kurung siku sesuai kebutuhan.

**TEMPLATE PROMPT - POSE UTAMA**

Flat vector illustration of a cute, friendly \[NAMA HEWAN\], children's storybook style, big round eyes with white catchlight, soft rounded body shape, thick warm-brown outline (#5B3E2B), flat color shading with one soft shadow layer, no gradients, no fur/scale texture detail, standing in a relaxed front-facing 3/4 pose, gentle smiling or neutral expression, no visible sharp teeth or claws, vibrant warm color palette, transparent background, centered composition with 10% margin, 1024x1024.

**TEMPLATE PROMPT - AVATAR BULAT**

Flat vector headshot illustration of a cute, friendly \[NAMA HEWAN\] face, children's storybook style, big round eyes with white catchlight, gentle smile, thick warm-brown outline (#5B3E2B), flat color shading, fits neatly within a circular crop, transparent background, centered, 1024x1024.

## 8.1 Kata Kunci Wajib

- "flat vector illustration" - mencegah hasil terlalu realistis/3D
- "children's storybook style" - mengarahkan ke nuansa ramah anak
- "thick warm-brown outline" - memastikan outline konsisten, bukan hitam
- "no visible sharp teeth or claws" - wajib disertakan khusus untuk predator
- "transparent background" - agar aset bisa langsung dipakai tanpa edit tambahan

## 8.2 Kata Kunci yang Harus Dihindari dalam Prompt

- "realistic", "photorealistic", "3D render", "textured fur/scale"
- "fierce", "roaring", "aggressive", "attacking"
- "dark", "gritty", "realistic shadow/lighting"

# 9\. Checklist Quality Assurance

Setiap aset ilustrasi - baik dari ilustrator maupun AI generation - wajib lolos checklist ini sebelum dimasukkan ke database aplikasi:

| **No.** | **Item Pemeriksaan**                                                                        |
| ------- | ------------------------------------------------------------------------------------------- |
| 1       | Outline berwarna coklat tua (#5B3E2B), bukan hitam pekat                                    |
| 2       | Mata bulat besar dengan highlight putih, pupil tidak menyipit/vertikal                      |
| 3       | Tidak ada gigi taring, cakar terjulur, atau ekspresi agresif                                |
| 4       | Proporsi kepala-badan sesuai kategori (lihat tabel Bab 3.1)                                 |
| 5       | Background transparan, tidak ada bayangan jatuh                                             |
| 6       | Maksimal 4 warna utama, saturasi cerah (tidak kusam/pudar)                                  |
| 7       | Ukuran ekspor tersedia minimal di 3 resolusi (mdpi/xhdpi/xxhdpi)                            |
| 8       | Nama file sesuai format snake_case dan id data yang terdaftar                               |
| 9       | Pose menghadap depan/3-4 kiri, area aman margin 10% terpenuhi                               |
| 10      | Sudah dibandingkan berdampingan dengan minimal 2 aset hewan lain untuk cek konsistensi gaya |

# Catatan Penutup

Style guide ini adalah dokumen hidup. Saat ilustrasi pertama (10-20 hewan pertama) selesai dibuat, lakukan review konsistensi bersama tim sebelum melanjutkan ke ratusan aset berikutnya - lebih murah memperbaiki arah di awal dibanding mengulang ratusan aset di akhir.

**Prinsip pengingat: ramah dulu, akurat kedua, dan semua hewan - termasuk predator - harus terasa aman dipandang oleh anak usia 4 tahun sekalipun.**