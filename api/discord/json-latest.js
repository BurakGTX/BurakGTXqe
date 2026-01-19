// Bu değişken callback function ile aynı dosyada veya global scope'ta olmalı
let lastUser = null;

// Callback function'da lastUser'ı set etmeliyiz
export async function setLastUser(user) {
  lastUser = user;
}

// JSON-Latest Endpoint
export default async function handler(req, res) {
  if (!lastUser) {
    return res.status(404).json({ error: "Henüz giriş yapılmamış" });
  }

  res.status(200).json({ user: lastUser });
}
