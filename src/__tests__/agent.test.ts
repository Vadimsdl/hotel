import { HotelBookingAgent } from '../agent.js';
import { describe, it, expect, beforeEach } from '@jest/globals';

describe('HotelBookingAgent', () => {
  let agent: HotelBookingAgent;

  beforeEach(() => {
    agent = new HotelBookingAgent();
  });

  it('should be defined', () => {
    expect(agent).toBeDefined();
  });

  it('should handle search message', async () => {
    const message = 'Найди отели в Москве с 20 марта по 25 марта для 2 взрослых';
    const response = await agent.handleMessage(message, {});
    expect(response).toBeDefined();
  });

  it('should handle availability check message', async () => {
    const message = 'Проверь доступность номеров в отеле TEST-123';
    const response = await agent.handleMessage(message, {});
    expect(response).toBeDefined();
  });

  it('should handle booking message', async () => {
    const message = 'Забронируй номер ROOM-123 в отеле TEST-123';
    const response = await agent.handleMessage(message, {});
    expect(response).toBeDefined();
  });
});
