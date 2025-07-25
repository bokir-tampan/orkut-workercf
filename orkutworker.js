const documentationHTML = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Dokumentasi API QRIS</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px; }
    h1 { color: #333; }
    h2 { margin-top: 30px; }
    pre { background: #eee; padding: 10px; border-radius: 5px; overflow-x: auto; }
    code { background: #eee; padding: 2px 5px; }
  </style>
</head>
<body>
  <h1>📘 Dokumentasi API QRIS</h1>

  <h2>1. Login (Step 1: Minta OTP)</h2>
  <p><strong>Endpoint:</strong> <code>POST /api/login</code></p>
  <pre>{
  "username": "username orkut",
  "password": "pw orkut"
}</pre>
  <p>Deskripsi: Mengirimkan OTP ke Email.</p>

  <h2>2. Login (Step 2: Verifikasi OTP)</h2>
  <p><strong>Endpoint:</strong> <code>POST /api/get-token</code></p>
  <pre>{
  "username": "username orkut",
  "otp": "123456"
}</pre>
  <p>Deskripsi: Verifikasi OTP dan mendapatkan token akses.</p>

  <h2>3. Cek Mutasi QRIS</h2>
  <p><strong>Endpoint:</strong> <code>POST /api/qris-history</code></p>
  <pre>{
  "username": "username orkut",
  "token": "auth_token",
  "jenis": "masuk | keluar"
}</pre>
  <p>Deskripsi: Menampilkan daftar transaksi QRIS berdasarkan jenis (masuk / keluar).</p>

  <h2>4. Tarik Saldo QRIS</h2>
  <p><strong>Endpoint:</strong> <code>POST /api/qris-withdraw</code></p>
  <pre>{
  "username": "username orkut",
  "token": "auth_token",
  "amount": "10000"
}</pre>
  <p>Deskripsi: Menarik saldo QRIS sejumlah nominal tertentu ke rekening yang terdaftar.</p>

  <hr>
  <p><small>Cek mutasi ORKUT UNOFFICIAL segala yang terjadi tanggung sendiri..</small></p>
</body>
</html>
`;

const API_BASE = "https://app.orderkuota.com:443/api/v2";
const HEADERS = {
  "Host": "app.orderkuota.com",
  "User-Agent": "okhttp/4.10.0",
  "Content-Type": "application/x-www-form-urlencoded"
};

const APP_PARAMS = {
  app_version_name: "25.03.14",
  app_version_code: "250314",
  app_reg_id: "di309HvATsaiCppl5eDpoc:APA91bFUcTOH8h2XHdPRz2qQ5Bezn-3_TaycFcJ5pNLGWpmaxheQP9Ri0E56wLHz0_b1vcss55jbRQXZgc9loSfBdNa5nZJZVMlk7GS1JDMGyFUVvpcwXbMDg8tjKGZAurCGR4kDMDRJ"
};

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (request.method === "GET" && (pathname === "/" || pathname === "/docs")) {
    return new Response(documentationHTML, {
      headers: { "Content-Type": "text/html; charset=UTF-8" }
    });
  }

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());

  switch (pathname) {
    case "/api/login":
      return loginRequest(data.username, data.password);
    case "/api/get-token":
      return getToken(data.username, data.otp);
    case "/api/qris-history":
      return getQrisHistory(data.username, data.token, data.jenis || "");
    case "/api/qris-withdraw":
      return withdrawQris(data.username, data.token, data.amount);
    default:
      return new Response("Not Found", { status: 404 });
  }
}

async function loginRequest(username, password) {
  const payload = new URLSearchParams({ username, password, ...APP_PARAMS });
  return safeFetch(`${API_BASE}/login`, payload);
}

async function getToken(username, otp) {
  const payload = new URLSearchParams({ username, password: otp, ...APP_PARAMS });
  return safeFetch(`${API_BASE}/login`, payload);
}

async function getQrisHistory(username, token, jenis) {
  const payload = new URLSearchParams({
    auth_token: token,
    auth_username: username,
    "requests[qris_history][jumlah]": "",
    "requests[qris_history][jenis]": jenis,
    "requests[qris_history][page]": "1",
    "requests[qris_history][dari_tanggal]": "",
    "requests[qris_history][ke_tanggal]": "",
    "requests[qris_history][keterangan]": "",
    "requests[0]": "account",
    ...APP_PARAMS
  });

  return safeFetch(`${API_BASE}/get`, payload);
}

async function withdrawQris(username, token, amount) {
  const payload = new URLSearchParams({
    auth_token: token,
    auth_username: username,
    "requests[qris_withdraw][amount]": amount,
    ...APP_PARAMS
  });

  return safeFetch(`${API_BASE}/get`, payload);
}


async function safeFetch(url, payload) {
  try {
    const upstream = await fetch(url, {
      method: "POST",
      headers: HEADERS,
      body: payload
    });

    const contentType = upstream.headers.get("content-type") || "text/plain";
    const { readable, writable } = new TransformStream();
    upstream.body.pipeTo(writable);

    return new Response(readable, {
      status: upstream.status,
      headers: { "Content-Type": contentType }
    });

  } catch (err) {
    return new Response(JSON.stringify({
      error: "Request failed",
      details: err.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
