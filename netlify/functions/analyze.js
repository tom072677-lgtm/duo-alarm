const Anthropic = require('@anthropic-ai/sdk');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    let imageData, mediaType;
    try {
        ({ imageData, mediaType } = JSON.parse(event.body));
    } catch {
        return { statusCode: 400, body: JSON.stringify({ error: '잘못된 요청 형식' }) };
    }

    if (!imageData || !mediaType) {
        return { statusCode: 400, body: JSON.stringify({ error: '이미지 데이터가 없습니다' }) };
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 10,
        messages: [{
            role: 'user',
            content: [
                {
                    type: 'image',
                    source: { type: 'base64', media_type: mediaType, data: imageData }
                },
                {
                    type: 'text',
                    text: 'Is this a Duolingo lesson or unit completion screen (showing XP earned, streak, or "Lesson Complete")? Answer only YES or NO.'
                }
            ]
        }]
    });

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response)
    };
};
