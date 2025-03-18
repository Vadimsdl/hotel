import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import axios from 'axios';
import { IGeocodingResponse, IHotelResponse } from '@/types.js';

const LITEAPI_BASE_URL = 'https://api.liteapi.travel/v3.0';
const LITEAPI_KEY = process.env.LITEAPI_KEY;
const headers = {
  'x-api-key': LITEAPI_KEY,
  Accept: 'application/json',
};

const HotelSearchSchema = z.object({
  location: z.string().describe('City name'),
  checkIn: z.string().describe('Check-in date'),
  checkOut: z.string().describe('Check-out date'),
  adults: z.number().describe('Number of adults'),
  children: z.number().optional().describe('Number of children'),
  currency: z.string().default('USD'),
  language: z.string().default('ru'),
});

type HotelSearchParams = z.infer<typeof HotelSearchSchema>;

export const hotelTool = createTool({
  id: 'search-hotels',
  description: 'Search for hotels in a specific location',
  inputSchema: HotelSearchSchema,
  outputSchema: z.object({
    hotels: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        address: z.string(),
        description: z.string(),
        rating: z.number(),
        price: z.number().optional(),
        currency: z.string(),
        country: z.string(),
        city: z.string(),
        photo: z.string(),
        latitude: z.number(),
        longitude: z.number(),
        available: z.boolean(),
      })
    ),
    total: z.number(),
  }),
  execute: async ({ context }: { context: HotelSearchParams }) => {
    try {
      return await searchHotels(context);
    } catch (error) {
      console.error('Ошибка при поиске отелей:', error);
      throw new Error(
        `Не удалось найти отели: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`
      );
    }
  },
});

const searchHotels = async (params: HotelSearchParams) => {
  if (!LITEAPI_KEY) {
    throw new Error('API ключ LiteAPI не настроен');
  }

  try {
    const geocodingResponse = await axios.get<IGeocodingResponse>(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(params.location)}&count=1`
    );
    const { latitude, longitude } = geocodingResponse.data.results[0];

    const hotelsResponse = await axios.get<IHotelResponse>(`${LITEAPI_BASE_URL}/data/hotels`, {
      headers,
      params: {
        longitude,
        latitude,
        language: params.language,
        limit: 20,
      },
    });

    if (
      !hotelsResponse.data ||
      !hotelsResponse.data.data ||
      !Array.isArray(hotelsResponse.data.data)
    ) {
      throw new Error('Некорректный формат ответа от API');
    }

    const hotels = hotelsResponse.data.data.map((hotel) => ({
      id: hotel.id,
      name: hotel.name,
      address: hotel.address || '',
      description: hotel.hotelDescription || '',
      rating: hotel.stars || 0,
      price: undefined,
      currency: hotel.currency,
      country: hotel.country,
      city: hotel.city,
      photo: hotel.main_photo || '',
      latitude: hotel.latitude,
      longitude: hotel.longitude,
      available: true,
    }));

    return {
      hotels,
      total: hotelsResponse.data.total || 0,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка API:', error.response?.data || error.message);
      throw new Error(`Ошибка при запросе к API: ${error.message}`);
    }
    throw error;
  }
};
