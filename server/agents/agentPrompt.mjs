import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import OpenAI from "openai";
import express from 'express';
import cors from 'cors';
import urlMetadata from 'url-metadata';

// Get the directory name of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables from the root directory
config({ path: join(__dirname, '../.env') });

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: apiKey });

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
    try {
        const { userMessage } = req.body;
        const completion = await openai.chat.completions.create({
            model: "gpt-4-0125-preview",
            messages: [
                {
                    "role": "user",
                    "content": userMessage + " In 3 sentences or less, explain to me why the given charity is a good or bad. Also, provide 2-3 relevant resource links. Format the response in Markdown."
                }
            ]
        });

        const aiResponse = completion.choices[0].message.content;
        
        // Extract URLs from the AI response
        const urlRegex = /\[.*?\]\((https?:\/\/[^\s]+)\)/g;
        const urls = [...aiResponse.matchAll(urlRegex)].map(match => match[1]);

        // Fetch metadata for each URL
        const resourcesWithMetadata = await Promise.all(urls.map(async (url) => {
            try {
                const metadata = await urlMetadata(url);
                return {
                    url: url,
                    title: metadata.title || 'No title available',
                    description: metadata.description || 'No description available'
                };
            } catch (error) {
                console.error(`Error fetching metadata for ${url}:`, error);
                return {
                    url: url,
                    title: 'Unable to fetch title',
                    description: 'Unable to fetch description'
                };
            }
        }));

        res.json({ 
            message: aiResponse,
            resources: resourcesWithMetadata
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});