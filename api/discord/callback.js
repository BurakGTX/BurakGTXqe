import axios from 'axios';

export default async function handler(req, res) {
  const code = req.query.code;
  if (!code) return res.status(400).send('No code provided');

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = `https://serverburakgtx.vercel.app/api/discord/callback`;

  try {
    // Token al
    const tokenRes = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const accessToken = tokenRes.data.access_token;

    // Kullanıcı bilgilerini al
    const userRes = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const user = userRes.data;

    // JSON olarak geri dönebiliriz
    res.status(200).json({ user });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).send('Hata oluştu');
  }
}
