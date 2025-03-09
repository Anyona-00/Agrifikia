import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample knowledge base (would be expanded in a real application)
const knowledgeBase = {
  crops: [
    {
      name: { en: "Sorghum", sw: "Mtama" },
      description: {
        en: "Drought-resistant grain that grows well in arid conditions.",
        sw: "Nafaka inayostahimili ukame ambayo hukua vizuri katika hali kame."
      },
      planting: {
        en: "Plant at the beginning of the rainy season when soil is moist. Space rows 60-75cm apart.",
        sw: "Panda mwanzoni mwa msimu wa mvua wakati udongo una unyevunyevu. Nafasi ya mistari iwe 60-75cm."
      },
      preservation: {
        en: "Dry thoroughly in the sun until moisture content is below 12%. Store in airtight containers off the ground.",
        sw: "Kausha kabisa juani hadi kiasi cha unyevunyevu kiko chini ya 12%. Hifadhi katika vyombo visivyopitisha hewa mbali na ardhi."
      }
    },
    {
      name: { en: "Millet", sw: "Uwele" },
      description: {
        en: "Hardy cereal that requires little water and grows in poor soil conditions.",
        sw: "Nafaka imara inayohitaji maji kidogo na kukua katika hali duni za udongo."
      },
      planting: {
        en: "Plant when there's sufficient moisture in the soil. Seeds should be planted 2-3cm deep.",
        sw: "Panda wakati kuna unyevunyevu wa kutosha katika udongo. Mbegu zipandwe kwa kina cha 2-3cm."
      },
      preservation: {
        en: "Ensure grains are completely dry. Mix with ash to protect from pests. Store in clay pots or airtight containers.",
        sw: "Hakikisha nafaka zimekauka kabisa. Changanya na jivu kulinda dhidi ya wadudu. Hifadhi katika vyungu vya udongo au vyombo visivyopitisha hewa."
      }
    },
    {
      name: { en: "Cowpeas", sw: "Kunde" },
      description: {
        en: "Legume that improves soil fertility and provides both food and fodder.",
        sw: "Jamii ya mikunde inayoboresha rutuba ya udongo na kutoa chakula na malisho."
      },
      planting: {
        en: "Plant at the onset of rains. Seeds should be planted 3-5cm deep and 30cm apart.",
        sw: "Panda wakati wa kuanza kwa mvua. Mbegu zipandwe kwa kina cha 3-5cm na umbali wa 30cm."
      },
      preservation: {
        en: "Dry pods completely. Shell and sun-dry again. Mix with neem leaves or ash and store in airtight containers.",
        sw: "Kausha maganda kabisa. Menya na kausha tena juani. Changanya na majani ya mwarubaini au jivu na uhifadhi katika vyombo visivyopitisha hewa."
      }
    }
  ],
  regions: [
    {
      name: { en: "Eastern Kenya (Kitui, Makueni)", sw: "Mashariki ya Kenya (Kitui, Makueni)" },
      recommendedCrops: ["Sorghum", "Millet", "Cowpeas"],
      rainySeasons: {
        en: "Short rains: October-December, Long rains: March-May (unreliable)",
        sw: "Mvua fupi: Oktoba-Desemba, Mvua ndefu: Machi-Mei (hazitegemeki)"
      }
    },
    {
      name: { en: "Northern Kenya (Marsabit, Turkana)", sw: "Kaskazini ya Kenya (Marsabit, Turkana)" },
      recommendedCrops: ["Sorghum", "Millet"],
      rainySeasons: {
        en: "April-June with high variability",
        sw: "Aprili-Juni na mabadiliko makubwa"
      }
    }
  ]
};

// Simple language detection function
function detectLanguage(text) {
  const swahiliPatterns = [
    /habari|jambo|asante|shukrani|tafadhali|nini|vipi/i,
    /ni|na|ya|wa|za|kuhusu|kwa|katika/i
  ];
  
  for (const pattern of swahiliPatterns) {
    if (pattern.test(text)) return 'sw';
  }
  
  return 'en';
}

// Simple AI chat route (without external API for MVP)
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  const lang = detectLanguage(message);
  const query = message.toLowerCase();
  let response = '';
  
  // Simple keyword matching (would be replaced with actual AI in production)
  if (lang === 'sw') {
    if (query.includes('mtama') || query.includes('kupand')) {
      const crop = knowledgeBase.crops.find(c => 
        c.name.en.toLowerCase() === 'sorghum' || 
        c.name.sw.toLowerCase() === 'mtama'
      );
      response = `${crop.name.sw}: ${crop.planting.sw}`;
    } else if (query.includes('uwele') || query.includes('millet')) {
      const crop = knowledgeBase.crops.find(c => 
        c.name.en.toLowerCase() === 'millet' || 
        c.name.sw.toLowerCase() === 'uwele'
      );
      response = `${crop.name.sw}: ${crop.description.sw}`;
    } else if (query.includes('hifadhi') || query.includes('kuhifadhi')) {
      response = knowledgeBase.crops[0].preservation.sw;
    } else if (query.includes('mazao') || query.includes('zao')) {
      response = 'Mazao yanayofaa kwa maeneo kame ni pamoja na Mtama, Uwele, na Kunde.';
    } else {
      response = 'Samahani, sijasikia vizuri. Unaweza kuuliza tena kuhusu mazao, nyakati za kupanda, au njia za kuhifadhi?';
    }
  } else {
    if (query.includes('sorghum') || query.includes('plant')) {
      const crop = knowledgeBase.crops.find(c => 
        c.name.en.toLowerCase() === 'sorghum'
      );
      response = `${crop.name.en}: ${crop.planting.en}`;
    } else if (query.includes('millet')) {
      const crop = knowledgeBase.crops.find(c => 
        c.name.en.toLowerCase() === 'millet'
      );
      response = `${crop.name.en}: ${crop.description.en}`;
    } else if (query.includes('preserve') || query.includes('storage')) {
      response = knowledgeBase.crops[0].preservation.en;
    } else if (query.includes('crop') || query.includes('grow')) {
      response = 'Crops suitable for arid regions include Sorghum, Millet, and Cowpeas.';
    } else {
      response = "I'm sorry, I didn't quite understand. Could you ask again about crops, planting times, or preservation methods?";
    }
  }
  
  // In production, you would call OpenAI/Claude API here
  // Instead of the simple keyword matching above
  
  res.json({ message: response });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Add this to your server.js file to use OpenAI's API

import OpenAI from 'openai';


// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Replace the existing /api/chat route with this:
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  const lang = detectLanguage(message);
  
  try {
    // Create a system prompt that incorporates farming knowledge
    const systemPrompt = `You are an agricultural assistant for farmers in arid and semi-arid regions of Kenya.
    Your goal is to provide practical, actionable advice about crop selection, planting times, and preservation methods.
    Be concise and specific. Focus on drought-resistant varieties suitable for ASAL regions.
    If the question is in Kiswahili, respond in Kiswahili. If in English, respond in English.
    Current date: ${new Date().toISOString().split('T')[0]}
    
    You have the following information about crops in ASAL regions:
    ${JSON.stringify(knowledgeBase.crops, null, 2)}
    
    And information about regions:
    ${JSON.stringify(knowledgeBase.regions, null, 2)}`;
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 250,
      temperature: 0.7,
    });
    
    const response = completion.choices[0].message.content;
    res.json({ message: response });
    
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    res.status(500).json({ 
      error: 'Failed to process your request',
      message: lang === 'sw' 
        ? "Samahani, kuna hitilafu ya kiufundi. Tafadhali jaribu tena baadaye."
        : "Sorry, there was a technical error. Please try again later."
    });
  }
});