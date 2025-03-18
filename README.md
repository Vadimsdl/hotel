# AI Hotel Booking Agent

An intelligent agent for searching and booking hotels, built using Mastra.ai and LiteAPI Travel API.

## Features

- 🔍 Natural language hotel search
- 📅 Room availability checking
- 🏨 Detailed hotel and room information
- 📝 Booking process
- 💬 Natural dialogue interface

## Technologies

- Mastra.ai Framework
- LiteAPI Travel API
- TypeScript
- Zod for validation
- Axios for HTTP requests

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
"Check room availability in hotel [ID] for these dates"
```

3. Booking:

```
"Book room [ID] in this hotel"
```

## Project Structure

```
src/
  ├── agent.ts           # Main agent class
  ├── types.ts          # Types and schemas
  ├── tools/            # Tools
  │   ├── hotelSearch.ts
  │   ├── availability.ts
  │   └── booking.ts
  └── config/          # Configuration
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

## Contributing

1. Fork the repository
2. Create a branch for your feature
3. Make changes
4. Submit a pull request

## License

MIT

## Acknowledgments

- Mastra.ai for the excellent framework
- LiteAPI for providing the hotel API
