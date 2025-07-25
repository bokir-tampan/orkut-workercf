# 🌐 API Proxy untuk ORKUT QRIS (Cloudflare Worker)

Ini adalah **Cloudflare Worker API Proxy** untuk layanan QRIS dari aplikasi **OrderKuota (ORKUT)**. Worker ini memberikan interface sederhana dan dokumentasi bawaan agar bisa mengakses layanan seperti login, OTP, cek mutasi, dan tarik saldo QRIS.

---

## 📄 Fitur

* 🔐 Login & verifikasi OTP
* 📊 Cek mutasi QRIS (masuk / keluar)
* 💸 Tarik saldo QRIS
* 📘 Dokumentasi HTML bawaan di endpoint `/docs`
* ⚡ Ringan & mudah dideploy via Cloudflare Workers

---


## 📋 Dokumentasi API

### ✅ 1. Login - Minta OTP

**Endpoint:** `POST /api/login`
**Deskripsi:** Mengirimkan OTP ke email akun ORKUT.

**Payload JSON:**

```json
{
  "username": "your_orkut_username",
  "password": "your_orkut_password"
}
```

**Contoh `curl`:**

```bash
curl -X POST https://yourdomain.workers.dev/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"username","password":"pw orkut"}'
```

---

### 🔐 2. Verifikasi OTP - Dapatkan Token

**Endpoint:** `POST /api/get-token`
**Deskripsi:** Verifikasi OTP yang dikirim ke email & dapatkan `auth_token`.

**Payload JSON:**

```json
{
  "username": "username",
  "otp": "kode_otp_dari_email"
}
```

**Contoh `curl`:**

```bash
curl -X POST https://yourdomain.workers.dev/api/get-token \
  -H "Content-Type: application/json" \
  -d '{"username":"username","otp":"otpnya"}'
```

---

### 📈 3. Cek Mutasi QRIS

**Endpoint:** `POST /api/mutasi`
**Deskripsi:** Menampilkan riwayat transaksi QRIS.

**Payload JSON:**

```json
{
  "username": "your_orkut_username",
  "token": "your_auth_token"
}
```

**Contoh `curl`:**

```bash
curl -X POST https://yourdomain.workers.dev/api/mutasi \
  -H "Content-Type: application/json" \
  -d '{"username":"username","token":"token","amount":"nominal"}'
```

---

### 💵 4. Tarik Saldo QRIS

**Endpoint:** `POST /api/withdraw`
**Deskripsi:** Menarik saldo QRIS ke akun utama.

**Payload JSON:**

```json
{
  "username": "your_orkut_username",
  "token": "your_auth_token",
  "amount": "jumlah_ditarik_dalam_rupiah"
}
```

**Contoh `curl`:**

```bash
curl -X POST https://yourdomain.workers.dev/api/withdraw \
  -H "Content-Type: application/json" \
  -d '{"username":"username","token":"token","amount":"nominal"}'
```

---

## 🧪 Test Lokal dengan curl

```bash
# 1. Minta OTP
curl -X POST https://yourdomain.workers.dev/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"username","password":"otpnya"}'

# 2. Verifikasi OTP (misalnya dapat kode 678900 dari email)
curl -X POST https://yourdomain.workers.dev/api/get-token \
  -H "Content-Type: application/json" \
  -d '{"username":"username","otp":"otpnya"}'

# 3. Cek Mutasi
curl -X POST https://yourdomain.workers.dev/api/mutasi \
  -H "Content-Type: application/json" \
  -d '{"username":"usernamee","token":"token","amount":"nominal"}'

# 4. Tarik Saldo QRIS
curl -X POST https://yourdomain.workers.dev/api/withdraw \
  -H "Content-Type: application/json" \
  -d '{"username":"username","token":"token","amount":"10000"}'
```

---

## 👥 Kontribusi

Pull request, issue, dan ide sangat diterima. Silakan fork dan bantu proyek ini berkembang 🙌

---

## 📜 Lisensi

MIT License - bebas digunakan, tapi gunakan dengan bijak.

