exports.handler = async function(event) {
    const { imageData, mediaType } = JSON.parse(event.body);
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 256,
            messages: [{
                role: 'user',
                content: [
                    {
                        type: 'image',
                        source: {
                            type: 'base64',
                            media_type: mediaType,
                            data: imageData
                        }
                    },
                    {
                        type: 'text',
                        text: '이 이미지가 듀오링고 레슨 완료 화면인지 판별해주세요. 듀오링고 완료 화면이면 "YES", 아니면 "NO"로만 답해주세요.'
                    }
                ]
            }]
        })
    });

    const data = await response.json();
    return {
        statusCode: 200,
        body: JSON.stringify(data)
    };
};