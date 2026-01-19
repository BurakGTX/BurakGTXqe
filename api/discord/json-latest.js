import axios from "axios";

// global scope'ta lastUser değişkeni
let lastUser = null;

// JSON-Latest endpoint
export async function jsonLatest(req, res) {
  if (!lastUser) return res.status(404).json({ error: "Henüz giriş yapılmamış" });
  res.status(200).json({ user: lastUser });
}

export default async function handler(req, res) {
  const code = req.query.code;
  if (!code) return res.status(400).send("No code provided");

  try {
    // Token al
    const tokenRes = await axios.post(
      "https://discord.com/api/oauth2/token",
      new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: "https://serverburak2.vercel.app/api/discord/callback"
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const accessToken = tokenRes.data.access_token;

    // Kullanıcı bilgilerini al
    const userRes = await axios.get("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    // ❗ Burada lastUser güncelle
    lastUser = userRes.data;

    res.status(200).send("Giriş başarılı! Artık JSON-Latest ile çekebilirsin.");
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).send("Hata oluştu");
  }
}
