export interface IPrebookResponse {
  prebookId: string;
  status: string;
  paymentUrl?: string;
  paymentToken?: string;
  totalAmount: {
    amount: number;
    currency: string;
  };
  expiresAt: string;
}

export interface IHotelRatesResponse {
  data: Array<{
    hotelId: string;
    roomTypes: Array<{
      roomTypeId: string;
      offerId: string;
      supplier: string;
      supplierId: number;
      rates: Array<{
        rateId: string;
        occupancyNumber: number;
        name: string;
        maxOccupancy: number;
        adultCount: number;
        childCount: number;
        boardType: string;
        boardName: string;
        remarks: string;
        priceType: string;
        commission: Array<{
          amount: number;
          currency: string;
        }>;
        retailRate: {
          total: Array<{
            amount: number;
            currency: string;
          }>;
          suggestedSellingPrice: Array<{
            amount: number;
            currency: string;
            source: string;
          }>;
          initialPrice: Array<{
            amount: number;
            currency: string;
          }>;
          taxesAndFees: Array<{
            included: boolean;
            description: string;
            amount: number;
            currency: string;
          }>;
        };
        cancellationPolicies: {
          cancelPolicyInfos: Array<{
            cancelTime: string;
            amount: number;
            currency: string;
            type: string;
            timezone: string;
          }>;
          hotelRemarks: string[];
          refundableTag: string;
        };
      }>;
    }>;
  }>;
  guestLevel: number;
  sandbox: boolean;
  weather: Array<{
    dailyWeather: {
      date: string;
      units: string;
      cloud_cover: { afternoon: number };
      humidity: { afternoon: number };
      precipitation: { total: number };
      temperature: {
        min: number;
        max: number;
        afternoon: number;
        night: number;
        evening: number;
        morning: number;
      };
      pressure: { afternoon: number };
      wind: {
        max: {
          speed: number;
          direction: number;
        };
      };
    };
  }>;
}

export interface IGeocodingResponse {
  results: {
    latitude: number;
    longitude: number;
    name: string;
  }[];
}

export interface IHotelResponse {
  data: {
    id: string;
    name: string;
    hotelDescription: string;
    currency: string;
    country: string;
    city: string;
    latitude: number;
    longitude: number;
    address: string;
    zip: string;
    main_photo: string;
    thumbnail: string;
    stars: number;
    facilityIds?: number[];
  }[];
  hotelIds: string[];
  total: number;
}
