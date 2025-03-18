import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Step, Workflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { hotelTool } from '../tools/hotelsTool.js';

const llm = openai('gpt-4o-mini');

const agent = new Agent({
  name: 'Hotel Booking Agent',
  model: llm,
  instructions: `
    You are a hotel booking expert who helps users choose the best accommodation options.
    
    When analyzing hotels and suggesting booking options, structure your response as follows:

    🏨 HOTEL OVERVIEW
    ═══════════════
    
    Found [number] hotels in [city]:

    📍 BEST OPTIONS:
    
    1. [Hotel Name] ⭐[rating]
       • Address: [address]
       • Price: [price] [currency]
       • Features: [key amenities]
       • Recommendation: [why this hotel is suitable]

    2. [Next hotel...]

    💰 PRICE ANALYSIS:
    • Average price: [amount]
    • Best value for money: [hotel name]
    
    🎯 RECOMMENDATIONS:
    • [Specific selection recommendations]
    • [Special notes]

    ⚠️ IMPORTANT NOTES:
    • [Availability information]
    • [Special conditions]
    
    Stick to this format and use emojis for better readability.
    `,
});

const searchHotels = new Step({
  id: 'search-hotels',
  description: 'Search for available hotels in the specified city',
  inputSchema: z.object({
    city: z.string().describe('City to search for hotels'),
    checkIn: z.string().describe('Check-in date'),
    checkOut: z.string().describe('Check-out date'),
    adults: z.number().describe('Number of adults'),
    children: z.number().optional().describe('Number of children'),
  }),
  execute: async ({ context }) => {
    if (!hotelTool.execute) {
      throw new Error('Hotel tool is not properly initialized');
    }

    const searchResult = await hotelTool.execute({
      context: {
        location: context.city,
        checkIn: context.checkIn,
        checkOut: context.checkOut,
        adults: context.adults,
        children: context.children || 0,
        currency: 'USD',
        language: 'ru',
      },
    });

    return searchResult;
  },
});

const suggestBooking = new Step({
  id: 'suggest-booking',
  description: 'Analysis and recommendations for hotel bookings',
  inputSchema: z.object({
    hotels: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        address: z.string(),
        rating: z.number(),
        price: z.number(),
        currency: z.string(),
        amenities: z.array(z.string()),
        images: z.array(z.string()),
        available: z.boolean(),
      })
    ),
  }),
  execute: async ({ context }) => {
    const hotels = context?.getStepResult('search-hotels');
    console.log(hotels, 'hotels');

    if (!hotels || !hotels.hotels || hotels.hotels.length === 0) {
      throw new Error('No hotels found');
    }

    const prompt = `Analyze the following hotel options and suggest the best booking options:
      ${JSON.stringify(hotels, null, 2)}
    `;

    const response = await agent.stream([
      {
        role: 'user',
        content: prompt,
      },
    ]);

    let suggestionsText = '';

    for await (const chunk of response.textStream) {
      process.stdout.write(chunk);
      suggestionsText += chunk;
    }

    return {
      suggestions: suggestionsText,
      hotels: hotels.hotels,
    };
  },
});

const hotelWorkflow = new Workflow({
  name: 'hotel-workflow',
  triggerSchema: z.object({
    city: z.string().describe('City to search for hotels'),
    checkIn: z.string().describe('Check-in date'),
    checkOut: z.string().describe('Check-out date'),
    adults: z.number().describe('Number of adults'),
    children: z.number().optional().describe('Number of children'),
  }),
})
  .step(searchHotels)
  .then(suggestBooking);

hotelWorkflow.commit();

export { hotelWorkflow };
