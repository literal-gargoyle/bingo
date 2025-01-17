import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt, size } = req.body;

    if (!prompt || !size || isNaN(size)) {
        return res.status(400).json({ error: 'Invalid input. Provide a prompt and valid card size.' });
    }

    try {
        const response = await axios.post('https://api.openai.com/v1/completions', {
            model: 'text-davinci-003',
            prompt: `Generate ${size * size} unique items for a Bingo card based on the theme: ${prompt}`,
            max_tokens: 1000,
        }, {
            headers: {
                Authorization: `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`,
            },
        });

        const items = response.data.choices[0].text
            .split('\n')
            .map(item => item.trim())
            .filter(Boolean);

        res.status(200).json({ items });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error generating Bingo items.' });
    }
}
