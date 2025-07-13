# Weekly Planner & To-Do List App

A modern, feature-rich weekly planner and to-do list app inspired by Tweek. Built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 📅 Week and Month view options with intuitive toggle
- ✅ Task management with checkboxes
- 🎨 Task color coding and categorization
- 📝 Rich task descriptions
- 🔄 Recurring tasks support
- 📱 Responsive design
- 🎯 Today focus button for quick navigation
- 📆 Easy date navigation with month/year picker
- 🌙 "Someday" column for future tasks
- 🔒 Auth0 authentication
- 💾 Data persistence with DrizzleORM
- ⚡ PWA support for offline access

## Tech Stack

- **Framework:** Next.js 15.3.5
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** Auth0
- **Database:** LibSQL/Drizzle
- **State Management:** Zustand
- **UI Components:** Radix UI
- **PWA Support:** next-pwa

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/aravindanugonda/calendar-app.git
   cd calendar-app
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a .env.local file with your Auth0 credentials:
   ```
   AUTH0_SECRET=your-secret
   AUTH0_BASE_URL=http://localhost:3000
   AUTH0_ISSUER_BASE_URL=your-auth0-domain
   AUTH0_CLIENT_ID=your-client-id
   AUTH0_CLIENT_SECRET=your-client-secret
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/src/app` - Next.js 15 app directory
- `/src/components` - React components
- `/src/lib` - Utility functions and configurations
- `/src/store` - Zustand state management
- `/src/types` - TypeScript type definitions
- `/public` - Static assets

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request
