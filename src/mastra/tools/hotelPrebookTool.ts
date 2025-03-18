import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import axios from 'axios';
import { IPrebookResponse } from '@/types.js';

const LITEAPI_BASE_URL = 'https://book.liteapi.travel/v3.0';
const LITEAPI_KEY = process.env.LITEAPI_KEY;
const headers = {
  'x-api-key': LITEAPI_KEY,
  Accept: 'application/json',
};

const HotelPrebookSchema = z.object({
  offerId: z
    .string()
    .describe('The unique identifier of the selected offer from the search results'),
  usePaymentSdk: z.boolean().describe('Specifies whether to use the payment processing SDK'),
  voucherCode: z.string().optional().describe('Optional voucher code to apply discounts'),
  addons: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        price: z.object({
          amount: z.number(),
          currency: z.string(),
        }),
        description: z.string().optional(),
      })
    )
    .optional()
    .describe('Additional services or extras to add to the booking'),
});

type HotelPrebookParams = z.infer<typeof HotelPrebookSchema>;

export const hotelPrebookTool = createTool({
  id: 'prebook-hotel',
  description: 'Create a pre-booking session for a specific hotel room offer',
  inputSchema: HotelPrebookSchema,
  outputSchema: z.object({
    prebookId: z.string(),
    status: z.string(),
    paymentUrl: z.string().optional(),
    paymentToken: z.string().optional(),
    totalAmount: z.object({
      amount: z.number(),
      currency: z.string(),
    }),
    expiresAt: z.string(),
  }),
  execute: async ({ context }: { context: HotelPrebookParams }) => {
    try {
      return await prebookHotel(context);
    } catch (error) {
      console.error('Error during pre-booking:', error);
      throw new Error(
        `Failed to create pre-booking: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },
});

const prebookHotel = async (params: HotelPrebookParams) => {
  if (!LITEAPI_KEY) {
    throw new Error('LiteAPI key is not configured');
  }

  try {
    const response = await axios.post<IPrebookResponse>(
      `${LITEAPI_BASE_URL}/rates/prebook`,
      {
        offerId: params.offerId,
        usePaymentSdk: params.usePaymentSdk,
        voucherCode: params.voucherCode,
        addons: params.addons,
      },
      { headers }
    );

    if (!response.data?.prebookId) {
      throw new Error('Invalid API response format');
    }

    return {
      prebookId: response.data.prebookId,
      status: response.data.status,
      paymentUrl: response.data.paymentUrl,
      paymentToken: response.data.paymentToken,
      totalAmount: response.data.totalAmount,
      expiresAt: response.data.expiresAt,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message);
      throw new Error(`API request error: ${error.message}`);
    }
    throw error;
  }
};
