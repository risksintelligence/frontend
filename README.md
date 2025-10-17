# RiskX Frontend

Next.js-based frontend dashboard for the RiskX Risk Intelligence Observatory.

## Features

- Next.js 14 with TypeScript
- Tailwind CSS for styling
- Real-time dashboard with WebSocket support
- Interactive risk visualizations
- ML model explainability interface
- Policy simulation tools
- Responsive design

## Environment Variables

Required environment variables:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
NEXT_PUBLIC_APP_NAME=RiskX
NODE_ENV=production
```

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Build and Export

```bash
# Build for production
npm run build

# Export static files
npm run export
```

The exported files will be in the `out/` directory.

## Deployment

Deploy to Render as a static site using the provided render.yaml configuration:

```bash
# Connect your GitHub repository to Render
# Render will automatically build and deploy when you push to main branch
```

## Configuration

The frontend is configured to work with static export:
- `next.config.js` sets `output: 'export'`
- All API calls are made to the backend service
- No server-side rendering features are used