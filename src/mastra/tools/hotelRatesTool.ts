import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import axios from 'axios';
import { IHotelRatesResponse } from '@/types.js';

const LITEAPI_BASE_URL = 'https://api.liteapi.travel/v3.0';
const LITEAPI_KEY = process.env.LITEAPI_KEY;
const headers = {
  'x-api-key': LITEAPI_KEY,
  Accept: 'application/json',
};

const HotelRatesSchema = z.object({
  hotelId: z.string().describe('Hotel ID'),
  checkIn: z.string().describe('Check-in date'),
  checkOut: z.string().describe('Check-out date'),
  adults: z.number().describe('Number of adults'),
  children: z.number().optional().describe('Number of children'),
  currency: z.string().default('USD'),
});

type HotelRatesParams = z.infer<typeof HotelRatesSchema>;

export const hotelRatesTool = createTool({
  id: 'search-hotel-rates',
  description: 'Search for available rooms and rates in a specific hotel',
  inputSchema: HotelRatesSchema,
  outputSchema: z.object({
    rooms: z.array(
      z.object({
        roomTypeId: z.string(),
        name: z.string(),
        maxOccupancy: z.number(),
        boardType: z.string(),
        boardName: z.string(),
        price: z.object({
          amount: z.number(),
          currency: z.string(),
        }),
        suggestedPrice: z.object({
          amount: z.number(),
          currency: z.string(),
          source: z.string(),
        }),
        taxesAndFees: z.array(
          z.object({
            included: z.boolean(),
            description: z.string(),
            amount: z.number(),
            currency: z.string(),
          })
        ),
        cancellationPolicy: z.object({
          cancelTime: z.string(),
          amount: z.number(),
          currency: z.string(),
          type: z.string(),
          timezone: z.string(),
        }),
      })
    ),
    weather: z.array(
      z.object({
        date: z.string(),
        temperature: z.object({
          min: z.number(),
          max: z.number(),
        }),
        precipitation: z.number(),
      })
    ),
  }),
  execute: async ({ context }: { context: HotelRatesParams }) => {
    try {
      return await searchHotelRates(context);
    } catch (error) {
      console.error('Error while searching for rooms:', error);
      throw new Error(
        `Failed to find rooms: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },
});

const searchHotelRates = async (params: HotelRatesParams) => {
  if (!LITEAPI_KEY) {
    throw new Error('LiteAPI key is not configured');
  }

  try {
    const response = await axios.post<IHotelRatesResponse>(
      `${LITEAPI_BASE_URL}/hotels/rates`,
      {
        hotelId: params.hotelId,
        checkin: params.checkIn,
        checkout: params.checkOut,
        currency: params.currency,
        occupancy: [
          {
            adults: params.adults,
            children: params.children || 0,
          },
        ],
      },
      { headers }
    );

    if (!response.data?.data?.[0]?.roomTypes) {
      throw new Error('Invalid API response format');
    }

    const hotelData = response.data.data[0];
    const rooms = hotelData.roomTypes.flatMap((roomType) =>
      roomType.rates.map((rate) => ({
        roomTypeId: roomType.roomTypeId,
        name: rate.name,
        maxOccupancy: rate.maxOccupancy,
        boardType: rate.boardType,
        boardName: rate.boardName,
        price: rate.retailRate.total[0],
        suggestedPrice: rate.retailRate.suggestedSellingPrice[0],
        taxesAndFees: rate.retailRate.taxesAndFees,
        cancellationPolicy: rate.cancellationPolicies.cancelPolicyInfos[0],
      }))
    );

    const weather = response.data.weather.map((w) => ({
      date: w.dailyWeather.date,
      temperature: {
        min: w.dailyWeather.temperature.min,
        max: w.dailyWeather.temperature.max,
      },
      precipitation: w.dailyWeather.precipitation.total,
    }));

    return {
      rooms,
      weather,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message);
      throw new Error(`API request error: ${error.message}`);
    }
    throw error;
  }
};
