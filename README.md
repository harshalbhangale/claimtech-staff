# Multi-Tenant Staff Portal

A clean, modern multi-tenant staff portal built with React, TypeScript, and Chakra UI. This boilerplate provides a simple foundation for staff applications with tenant-specific branding and theming.

## Features

- **Multi-tenant Architecture**: Automatic tenant detection via subdomain
- **Tenant-specific Branding**: Dynamic logos, colors, and themes per tenant
- **Clean Staff Interface**: Simple login and dashboard pages
- **Modern UI**: Built with Chakra UI and Poppins font
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Access different tenants**:
   - `http://resolvemyclaim.localhost:5173` - Resolve My Claim theme
   - `http://blueclaim.localhost:5173` - Blue Claim theme
   - `http://localhost:5173` - Default theme

## Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   └── dashboard/          # Dashboard-specific components
├── contexts/
│   └── TenantContext.tsx   # Multi-tenant context
├── layouts/
│   ├── AuthLayout.tsx      # Authentication layout
│   ├── DashboardLayout.tsx # Dashboard layout
│   └── RootLayout.tsx      # Root layout with tenant provider
├── pages/
│   ├── auth/
│   │   └── Login.tsx       # Login page
│   └── Dashboard.tsx       # Main dashboard
├── utils/
│   └── tenantUtils.ts      # Tenant configuration utilities
└── router.tsx              # Application routing
```

## Adding New Tenants

1. **Update tenant configuration** in `src/utils/tenantUtils.ts`:
   ```typescript
   const tenantConfigs: Record<string, TenantConfig> = {
     // ... existing tenants
     newtenant: {
       name: 'New Tenant',
       primaryColor: '#your-color',
       accentColor: '#your-accent',
       logo: '/path/to/logo.png',
       secured: '/icons/secured.png',
       theme: 'your-theme',
     },
   };
   ```

2. **Add tenant assets** to the `public/icons/` directory

3. **Configure subdomain** in your development environment

## Customization

### Theme Configuration
The global theme is configured in `src/components/ui/provider.tsx` with Poppins font and customizable colors.

### Tenant-specific Styling
Each tenant can have unique:
- Primary and accent colors
- Logo and branding assets
- Theme variants

### Adding New Pages
1. Create new page components in `src/pages/`
2. Update routing in `src/router.tsx`
3. Add navigation links in `src/layouts/DashboardLayout.tsx`

## Development

- **Framework**: React 18 with TypeScript
- **UI Library**: Chakra UI
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Styling**: Chakra UI with custom theme

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

This project is a boilerplate template for multi-tenant staff applications.
