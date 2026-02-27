# Mission Control

A custom NextJS dashboard for productivity tools, built for Vianni's OpenClaw workspace.

## Features

- **Dashboard Overview**: Stats, charts, recent activity, system status
- **Sidebar Navigation**: Quick access to tools, analytics, calendar, automations
- **Widget System**: Modular widgets for different data visualizations
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (icons)
- **Hosted locally** (port 3000)

## Getting Started

### Development

```bash
cd mission-control
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

- `/app` – Next.js app router pages and layouts
- `/components` – Reusable React components (Sidebar, Header, Widget)
- `/public` – Static assets

## Adding New Tools

1. Create a new page in `/app/tools/[name]`
2. Add a navigation item in `/components/Sidebar.tsx`
3. Optionally create a widget component in `/components`

## Integration with OpenClaw

The dashboard is designed to eventually connect to OpenClaw APIs for:
- Real‑time edge detection counts
- Property lead monitoring
- System health metrics
- Heartbeat logs

## Next Steps

- [ ] Connect to OpenClaw Gateway API
- [ ] Add authentication (NextAuth)
- [ ] Implement real‑time updates (WebSockets)
- [ ] Create tool‑builder interface
- [ ] Deploy to Vercel for remote access

## License

Internal use only.