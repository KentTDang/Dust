import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import OpenAI from "openai";
import express from 'express';
import cors from 'cors';

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
            "content": userMessage + " explain to me why the given charity is a good or bad"
          }
        ]
      });
  
      res.json({ message: completion.choices[0].message.content });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});