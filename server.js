const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

app.post('/login', async (req, res) => {
    try {
        let { username, password } = req.body;
        
        let response = await axios.post('https://www.duolingo.com/login', {
            login: username,
            password: password
        }, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json',
                'Origin': 'https://www.duolingo.com',
                'Referer': 'https://www.duolingo.com/login'
            }
        });

        let token = response.headers['jwt'] || 
                    response.headers['authorization'] ||
                    response.data?.jwt;

        console.log('전체 헤더:', response.headers);
        console.log('전체 데이터:', response.data);

        res.json({ token, headers: response.headers });

    } catch (error) {
        res.json({ error: error.message, status: error.response?.status });
    }
});

app.get('/xp/:username', async (req, res) => {
    try {
        let token = req.headers['authorization'];
        let username = req.params.username;
        
        let response = await axios.get(
            `https://www.duolingo.com/2017-06-30/users?fields=totalXp&username=${username}`,
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
        res.json(response.data);
    } catch (error) {
        res.json({ error: '실패' });
    }
});

app.listen(3000, () => {
    console.log('서버 시작! http://localhost:3000');
});