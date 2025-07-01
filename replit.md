# Pet Care Platform - Replit.md

## Overview

This is a comprehensive pet care platform built with React + Express.js, featuring a marketplace for pet products, emergency services, pet services directory, and community features. The application is designed as a Korean pet care ecosystem with features like product listings, emergency hospital booking, pet services, and community posts.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and build processes
- **Routing**: Wouter for client-side routing
- **UI Framework**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom pet-themed color palette
- **State Management**: TanStack React Query for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API endpoints
- **Validation**: Zod schemas for runtime type checking
- **Session Management**: Express sessions with PostgreSQL store

### Project Structure
```
├── client/           # React frontend application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route components
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utility functions
├── server/           # Express.js backend
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Database operations
│   └── db.ts         # Database connection
├── shared/           # Shared TypeScript types and schemas
└── migrations/       # Database migration files
```

## Key Components

### Database Schema
- **Users**: User profiles with authentication data
- **Categories**: Hierarchical product categories
- **Listings**: Pet product marketplace listings
- **Emergency Hospitals**: Veterinary emergency services
- **Pet Services**: Pet grooming, training, and boarding services
- **Community Posts**: User-generated content for pet community
- **Emergency Bookings**: Emergency service appointments

### API Endpoints
- `/api/listings` - Pet product marketplace CRUD operations
- `/api/categories` - Product category management
- `/api/emergency-hospitals` - Emergency veterinary services
- `/api/pet-services` - Pet service provider directory
- `/api/community-posts` - Community content management
- `/api/emergency-bookings` - Emergency appointment booking

### UI Components
- Responsive design with mobile-first approach
- Bottom navigation for mobile devices
- Emergency quick access floating button
- Product cards with image galleries
- Service provider listings
- Community post cards with engagement features

## Data Flow

### Client-Server Communication
1. React components use TanStack React Query for data fetching
2. API requests go through centralized `apiRequest` function
3. Server validates requests using Zod schemas
4. Database operations handled through Drizzle ORM
5. Responses include proper error handling and status codes

### State Management
- Server state managed by React Query with caching
- Local form state handled by React Hook Form
- UI state managed through React component state
- Toast notifications for user feedback

## External Dependencies

### Core Dependencies
- **@tanstack/react-query**: Server state management
- **drizzle-orm**: Type-safe database ORM
- **@neondatabase/serverless**: Serverless PostgreSQL client
- **react-hook-form**: Form state management
- **zod**: Runtime type validation
- **wouter**: Lightweight React router

### UI Dependencies
- **@radix-ui/**: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Type checking
- **tsx**: TypeScript execution
- **esbuild**: JavaScript bundler for production

## Deployment Strategy

### Build Process
1. Frontend builds with Vite to static files in `dist/public`
2. Backend builds with esbuild to `dist/index.js`
3. Database migrations run via `drizzle-kit push`

### Environment Setup
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment mode (development/production)
- Development uses Vite dev server with HMR
- Production serves static files through Express

### Hosting Considerations
- Uses Neon Database for serverless PostgreSQL
- Express server handles both API and static file serving
- Configured for Replit deployment with specific plugins
- Supports both development and production modes

## Changelog
```
Changelog:
- July 01, 2025. Initial setup
- July 01, 2025. 당근마켓 스타일 펫 플랫폼 완성
  * 펫용품거래 마켓플레이스 구현 (첫 번째 메뉴)
  * 펫응급센터 24시간 서비스 (두 번째 메뉴)
  * 펫서비스 디렉토리 (미용, 훈련, 카페 등)
  * 펫커뮤니티 기능 (실종, 발견, 입양, 모임)
  * 응급 전화 연결 기능 (1588-0119)
  * 예시 데이터 추가: 응급병원 6곳, 펫서비스 7곳, 커뮤니티 글 6개, 펫용품 12개
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```