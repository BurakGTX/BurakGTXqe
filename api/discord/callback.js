import axios from "axios";

export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Kod bulunamadı");
  }

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
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      }
    );

    const accessToken = tokenRes.data.access_token;

    const userRes = await axios.get("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const user = userRes.data;

    // Başarılı durumda çok açık bir sayfa dön
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Giriş Başarılı</title>
        <style>
          body { 
            font-family: system-ui, sans-serif; 
            background: #2c2f33; 
            color: #fff; 
            text-align: center; 
            padding: 60px 20px; 
          }
          h1 { color: #57F287; font-size: 3rem; margin-bottom: 10px; }
          .container { max-width: 600px; margin: 0 auto; }
          .info { background: #36393f; padding: 20px; border-radius: 12px; margin: 30px 0; }
          button { 
            background: #5865F2; 
            color: white; 
            border: none; 
            padding: 16px 32px; 
            font-size: 1.3rem; 
            border-radius: 8px; 
            cursor: pointer; 
            margin-top: 20px;
          }
          button:hover { background: #4752C4; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>✓ Giriş Başarılı!</h1>
          <p style="font-size: 1.4rem; margin: 20px 0;">
            Discord hesabınla giriş yapıldı.<br>
            <strong>Şimdi programa geri dönüp</strong><br>
            "Onaylandı mı?" butonuna tıkla!
          </p>
          
          <div class="info">
            <strong>Kullanıcı:</strong> ${user.global_name || user.username}<br>
            <strong>ID:</strong> ${user.id}
          </div>
          
          <p style="color: #b9bbbe; font-size: 0.95rem;">
            Bu pencereyi kapatabilirsin
          </p>
        </div>
      </body>
      </html>
    `);

  } catch (err) {
    console.error(err);
    res.status(500).send(`
      <!DOCTYPE html>
      <html><body style="background:#2c2f33;color:#fff;text-align:center;padding:100px;">
        <h1 style="color:#ed4245;">Bir hata oluştu</h1>
        <p>Lütfen tekrar dene veya geliştiriciye bildir.</p>
      </body></html>
    `);
  }
}
