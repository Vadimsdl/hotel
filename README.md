# AI Hotel Booking Agent

An intelligent agent for searching and booking hotels, built using Mastra.ai and LiteAPI Travel API.

## Features

- 🔍 Natural language hotel search with geocoding
- 📅 Room availability checking with rate details
- 🏨 Detailed hotel information including weather data
- 📝 Booking process with prebook validation
- 💬 Natural dialogue interface in multiple languages
- 🛡️ Type-safe implementation with Zod schemas
- ✅ Comprehensive error handling
- 🌍 Multi-currency support
- 🌤️ Integrated weather forecasts for destinations

## Technologies

- Mastra.ai Framework for AI agent implementation
- LiteAPI Travel API for hotel data
- TypeScript with Zod schema validation
- Axios for API requests
- Open-Meteo API for geocoding and weather data

## Project Structure

```
src/
  ├── types.ts          # TypeScript interfaces for API responses
  ├── mastra/           # Mastra.ai integration
  │   ├── index.ts      # Main entry point
  │   ├── tools/        # Tool implementations
  │   │   ├── hotelsTool.ts      # Hotel search
  │   │   ├── hotelRatesTool.ts  # Rate checking
  │   │   └── hotelPrebookTool.ts # Booking
  │   ├── workflows/    # Booking workflows
  │   └── agents/       # Agent configurations
  └── __tests__/        # Test suite
```

## Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd hotel-booking-agent
```

2. Install dependencies:

```bash
npm install
```

3. Create a .env file in the root directory and add your API key:

```env
LITEAPI_KEY=your_api_key
OPENAI_API_KEY=your_api_key
```

4. Compile TypeScript:

```bash
npm run build
```

5. Run the application:

```bash
npm start
```

## Usage

The agent supports the following commands:

1. Search for hotels:

```
"Find hotels in Moscow from March 20 to March 25 for 2 adults"
```

2. Check availability:

```
"Check room availability in hotel [Hotel name] for these dates"
```

3. Booking:

```
"Book room [Room name] in this hotel"
```

## Development

1. Run in development mode:

```bash
npm run dev
```

2. Run tests:

```bash
npm test
```

3. Linting:

```bash
npm run lint
```

### Development Guidelines

1. Use Zod schemas for API request/response validation
2. Implement comprehensive error handling for all API calls
3. Maintain type safety with TypeScript interfaces
4. Add tests for new functionality
5. Document API responses and error cases

## API Response Types

The project uses TypeScript interfaces for type-safe API interactions:

- `IHotelResponse` - Hotel search results
- `IHotelRatesResponse` - Room rates and availability
- `IPrebookResponse` - Booking confirmation
- `IGeocodingResponse` - Location coordinates

## Contributing

1. Fork the repository
2. Create a branch for your feature
3. Follow the development guidelines
4. Add tests for new functionality
5. Submit a pull request

## License

MIT

## Acknowledgments

- Mastra.ai for the AI agent framework
- LiteAPI for the comprehensive travel API
- Open-Meteo for geocoding and weather services
