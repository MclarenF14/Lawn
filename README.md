# Lawn Mowing Estimator

An AI-powered lawn mowing cost estimation tool that analyzes lawn photos using Groq AI to provide instant pricing estimates for your lawn mowing business.

## Features

- 📸 Upload lawn photos
- 🤖 AI-powered analysis using Groq API
- 💰 Automatic cost estimation
- ⚡ Fast processing with Groq's LLaMA models
- 🚀 Deployed on Vercel

## Tech Stack

- **Frontend**: Next.js (React)
- **Backend**: Next.js API Routes
- **AI**: Groq API
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- Groq API key ([Get one free](https://groq.com))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MclarenF14/Lawn.git
cd Lawn
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```bash
cp .env.example .env.local
```

4. Add your Groq API key to `.env.local`:
```
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment on Vercel

### Quick Deploy

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project" and import this repository
4. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_GROQ_API_KEY`: Your Groq API key
5. Deploy!

Or use the button below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MclarenF14/Lawn)

## Environment Variables

- `NEXT_PUBLIC_GROQ_API_KEY` - Your Groq API key (required)

## Usage

1. Navigate to the home page
2. Upload a lawn photo
3. Wait for AI analysis
4. Receive instant cost estimate

## API Endpoints

- `POST /api/estimate` - Submit lawn photo for analysis

## Project Structure

```
Lawn/
├── pages/
│   ├── api/
│   │   └── estimate.js
│   └── index.js
├── public/
├── styles/
├── .env.example
├── .env.local (git ignored)
├── next.config.js
├── package.json
└── vercel.json
```

## License

MIT

## Support

For issues or questions, please open a GitHub issue.
