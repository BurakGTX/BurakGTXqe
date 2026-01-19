import axios from "axios";
import { setLastUser } from "./json-latest.js"; // aynı repo içi import

export default async function handler(req, res) {
  const code = req.query.code;
  if (!code) return res.status(400).send("No code provided");

  try {
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

    const userRes = await axios.get("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    // lastUser'ı güncelle
    setLastUser(userRes.data);

    // JSON veya basit mesaj dönebilirsin
    res.status(200).send("Giriş başarılı! Artık JSON-Latest ile çekebilirsin.");
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).send("Hata oluştu");
  }
}
