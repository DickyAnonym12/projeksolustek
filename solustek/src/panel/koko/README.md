# Panel Koko - Supply Chain Management

Panel Koko merupakan pusat kendali utama dalam sistem Supply Chain Management yang bertanggung jawab atas pengelolaan data master, penetapan harga, validasi logistik, kontrol dana talangan, penyelesaian sengketa, serta verifikasi keuangan.

## Fitur Utama

### 1. Dashboard Operasional
- **Ringkasan Real-time**: Menampilkan kondisi operasional dan keuangan secara real-time
- **Monitoring Dana Talangan**: Perhitungan otomatis dana talangan (PO approved - pembayaran diterima)
- **Notifikasi Peringatan**: Alert otomatis ketika dana talangan melewati threshold
- **Health Check**: Status guardrail harga, vendor mapping, dan audit trail

### 2. Master Katalog (SKU & Spesifikasi)
- **Pengelolaan Item**: Tambah dan kelola data barang dengan nama, varian, satuan
- **SKU Unik**: Setiap barang memiliki identitas unik
- **Proteksi Data**: Item yang sudah digunakan dalam transaksi tidak dapat dihapus, hanya dinonaktifkan
- **Audit Trail**: Semua perubahan data katalog tercatat dalam audit log

### 3. Pricing Engine (Penetapan HET)
- **Komparasi Harga**: Perbandingan harga modal vendor vs harga survei SPPG
- **Penetapan HET**: Koko menetapkan Harga Eceran Tertinggi per wilayah
- **Histori Perubahan**: Sistem menyimpan histori perubahan HET
- **Peringatan Toleransi**: Alert jika harga melebihi ambang batas toleransi (10%)
- **Margin Control**: Kontrol margin keuntungan dan batas kewajaran harga

### 4. Review Pesanan (Logistic Center)
- **Inbox PR**: Daftar pesanan dari Akuntan MBG dengan status "Menunggu Review"
- **Vendor Assignment**: Pilih vendor yang sesuai berdasarkan ketersediaan stok
- **Ongkir Management**: Tambahkan biaya ongkir untuk vendor luar kota
- **Konfirmasi Ganda**: Approval PO memerlukan konfirmasi ganda karena mengikat secara finansial
- **Auto PO Generation**: Sistem otomatis menerbitkan PO, mengurangi stok vendor, dan mencatat dana talangan

### 5. Verifikasi Keuangan
- **Validasi Pembayaran**: Cek bukti transfer dan cocokkan nominal
- **Validasi Nominal**: Sistem mencegah verifikasi jika nominal tidak sesuai
- **Status Closed**: Transaksi dapat ditutup setelah verified, menandakan selesai secara administratif
- **Bukti Pembayaran**: Semua bukti disimpan untuk keperluan audit

### 6. Dispute Center
- **Laporan Ketidaksesuaian**: Menampilkan komplain dari Aslap dengan foto bukti
- **Validasi/Tolak**: Koko memiliki kewenangan untuk validasi atau tolak komplain
- **Penyesuaian Nilai**: Jika divalidasi, sistem menyesuaikan nilai pembayaran vendor
- **Transparansi**: Semua keputusan tercatat dengan waktu, identitas, dan alasan

## Keamanan & Kontrol

### Pengguna Sistem

Sistem ini dirancang untuk beberapa pengguna dengan role berbeda:

- **KOKO**: Satu orang yang mengelola seluruh supply chain dengan akses penuh ke semua modul Panel Koko
- **VENDOR**: Vendor yang menyuplai barang (untuk pengembangan selanjutnya)
- **MBG_AKUNTAN**: Akuntan di unit MBG yang membuat pesanan (untuk pengembangan selanjutnya)
- **MBG_ASLAP**: Aslap di unit MBG yang melakukan quality control (untuk pengembangan selanjutnya)
- **SPPG**: SPPG yang melakukan pembayaran (untuk pengembangan selanjutnya)

### Mekanisme Konfirmasi Ganda
Tindakan berisiko tinggi memerlukan konfirmasi ganda:
- Approval & Terbitkan PO (komitmen dana talangan)
- Penetapan HET (berdampak pada harga)
- Validasi Dispute (penyesuaian nilai pembayaran)
- Close Transaction (finalisasi transaksi)

### Audit Trail
Setiap perubahan data krusial tercatat:
- Penetapan HET
- Approval PO
- Validasi sengketa
- Verifikasi pembayaran
- Penutupan transaksi
- Perubahan status katalog

## Alur Kerja Utama

### Alur Pesanan
1. **PR Masuk** → Akuntan MBG membuat Purchase Request
2. **Review Koko** → Koko assign vendor + ongkir
3. **Approve & PO** → Konfirmasi ganda → PO terbit → Dana talangan tercatat
4. **Vendor Process** → Vendor memproses pesanan
5. **Delivery** → Barang dikirim ke unit MBG
6. **QC Aslap** → Quality control oleh Aslap
7. **Invoice** → Tagihan dibuat untuk SPPG
8. **Payment** → SPPG upload bukti transfer
9. **Verify** → Koko verifikasi pembayaran
10. **Close** → Transaksi ditutup

### Alur Dispute
1. **Komplain Aslap** → Laporan ketidaksesuaian dengan foto bukti
2. **Review Koko** → Koko review bukti dan detail pesanan
3. **Keputusan** → Validasi (adjust nilai) atau Tolak (nilai tetap)
4. **Settlement** → Penyesuaian pembayaran vendor jika divalidasi

## Teknologi

- **State Management**: React Context + useReducer
- **Persistence**: localStorage untuk demo
- **Type Safety**: TypeScript dengan strict types
- **UI Components**: Custom UI library dengan accessibility support

## Catatan Implementasi

Untuk demo, beberapa data masih menggunakan mock:
- Harga modal vendor (akan diinput oleh Vendor)
- Harga survei SPPG (akan diinput oleh SPPG)
- Stok vendor (akan dikelola oleh Vendor)
- Bukti transfer (akan diupload oleh SPPG)

Pada implementasi production, data ini akan terintegrasi dengan backend API.
