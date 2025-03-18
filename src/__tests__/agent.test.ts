import { describe, it, expect, beforeEach } from '@jest/globals';
import { hotelAgent } from '@/mastra/agents/hotelAgent.js';

describe('HotelBookingAgent', () => {
  let agent: typeof hotelAgent;

  beforeEach(() => {
    agent = hotelAgent;
  });

  it('should be defined', () => {
    expect(agent).toBeDefined();
  });

  it('should handle search message', async () => {
    const message = 'Найди отели в Москве с 20 марта по 25 марта для 2 взрослых';
    const response = await agent.stream([{ role: 'user', content: message }]);
    expect(response).toBeDefined();
  });

  it('should handle availability check message', async () => {
    const message = 'Проверь доступность номеров в отеле TEST-123';
    const response = await agent.stream([{ role: 'user', content: message }]);
    expect(response).toBeDefined();
  });

  it('should handle booking message', async () => {
    const message = 'Забронируй номер ROOM-123 в отеле TEST-123';
    const response = await agent.stream([{ role: 'user', content: message }]);
    expect(response).toBeDefined();
  });
});