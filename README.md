# Weekly Planner & To-Do List App

A modern, feature-rich weekly planner and to-do list app. Built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 📅 **Week and Month views** with intuitive toggle
- ✅ **Task management** with checkboxes and rich descriptions
- 🎨 **Task color coding** and categorization
- 🔄 **Recurring tasks** indicator for easy identification
- 🔍 **Real-time search** functionality across all tasks
- 📱 **Mobile-optimized responsive design** with touch-friendly interface
- 🎯 **Today focus button** for quick navigation
- 📆 **Interactive date navigation** with clickable month/year pickers
- 🌙 **"Someday" column** for future tasks and ideas
- 📅 **Smart task scheduling** - Move someday tasks to specific dates
- 🔒 **Secure authentication** with Auth0 v4
- 💾 **Data persistence** with Turso (LibSQL) and DrizzleORM
- ⚡ **PWA support** for offline access
- 🎨 **Current day highlighting** in both week and month views
- 🔄 **Real-time updates** with optimistic UI
- 👤 **Automatic user provisioning** on first login

## Mobile Experience

### Week View
- **Empty cells**: Tap anywhere to add tasks
- **Cells with tasks**: Tap task indicators to edit, tap "+" button to add new tasks
- **Someday column**: Same intuitive behavior for future task planning

### Month View  
- **Empty cells**: Tap anywhere to add tasks
- **Cells with tasks**: Tap task indicators to edit, tap "+" button to add new tasks
- **Smart interaction**: Only designated buttons trigger actions when cells contain tasks

### Key Mobile Features
- **No button clutter**: Clean interface with context-aware interactions
- **Large touch targets**: Easy interaction on small screens
- **Intuitive gestures**: Natural tap behavior for task management
- **Optimized layout**: Compact but readable design for mobile devices

## Tech Stack

- **Framework:** Next.js 15.3.5 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** Auth0 v4 (with middleware-based protection)
- **Database:** Turso (LibSQL) with DrizzleORM
- **State Management:** Zustand
- **UI Components:** Radix UI
- **PWA Support:** next-pwa
- **Date Handling:** date-fns
- **Deployment:** Vercel

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

3. Create a `.env.local` file with your Auth0 credentials and required environment variables:
   ```env
   # Auth0 configuration (v4 format)
   APP_BASE_URL=http://localhost:3000
   AUTH0_DOMAIN=your-auth0-domain.auth0.com
   AUTH0_SECRET=your-secret
   AUTH0_CLIENT_ID=your-client-id
   AUTH0_CLIENT_SECRET=your-client-secret

   # Database configuration
   TURSO_DATABASE_URL=your-libsql-or-drizzle-connection-string
   TURSO_AUTH_TOKEN=your-auth-token

   # Vercel deployment
   NEXT_PUBLIC_VERCEL_ENV=production
   NEXT_PUBLIC_VERCEL_URL=https://your-vercel-app-url.vercel.app
   ```


4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (protected)/       # Protected routes
│   │   └── dashboard/     # Main dashboard
│   ├── api/               # API routes
│   │   └── tasks/         # Task management API
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (auth redirect)
├── components/
│   ├── calendar/          # Calendar components
│   │   ├── CalendarGrid.tsx
│   │   ├── CalendarHeader.tsx
│   │   ├── MonthView.tsx
│   │   ├── MonthYearPicker.tsx
│   │   └── WeekView.tsx
│   ├── layout/            # Layout components
│   │   └── DashboardWrapper.tsx
│   ├── tasks/             # Task components
│   │   ├── TaskItem.tsx
│   │   ├── TaskList.tsx
│   │   └── TaskModal.tsx
│   └── ui/                # UI components
│       ├── AuthStatus.tsx
│       ├── button.tsx
│       └── ...
├── lib/                   # Utility functions
│   ├── auth.ts            # Auth0 configuration
│   ├── db.ts              # Database configuration
│   └── utils.ts           # Helper functions
├── store/                 # Zustand state management
│   └── calendar-store.ts
├── types/                 # TypeScript type definitions
└── middleware.ts          # Auth0 middleware
```

## Recent Changes

### Latest Updates (Mobile & UX Improvements)
- ✅ **Enhanced Mobile UI** - Streamlined mobile interface with intuitive touch interactions
- ✅ **Fixed Task Editing** - Resolved issues where edit buttons opened new task modals instead of edit modals
- ✅ **Improved Week View Date Display** - Shows full month names instead of abbreviated dates
- ✅ **Enhanced Someday Functionality** - Proper someday task management that persists across all views
- ✅ **Smart Mobile Interactions** - Context-aware clicking behavior for optimal mobile experience
- ✅ **Optimized Button Layout** - Removed redundant buttons on mobile while preserving desktop functionality
- ✅ **Date Scheduling from Someday** - Added ability to move someday tasks to specific dates via edit modal

### Previous Updates
- ✅ **Fixed Auth0 v4 integration** - Proper middleware-based authentication
- ✅ **Enhanced calendar UI** - Removed overlapping welcome message
- ✅ **Added interactive date navigation** - Clickable month/year pickers
- ✅ **Improved current day highlighting** - Better visual indicators
- ✅ **Fixed duplicate email display** - Smart user info handling
- ✅ **Prevented unauthorized API calls** - Better session management
- ✅ **Fixed automatic user creation** - New users created seamlessly on first login
- ✅ **Simplified recurring tasks** - Added checkbox indicator for recurring tasks
- ✅ **Real-time search functionality** - Search across all tasks with instant results
- ✅ **Removed branding** - Clean, generic application name
- ✅ **Mobile responsiveness** - Optimized for iPhone and mobile devices with touch-friendly interactions

### Previous Changes
- Improved session and authentication handling
- Calendar grid background set to white for better UI consistency
- Dashboard header cleaned up
- ESLint errors for unused variables and 'any' types fixed

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request
