# mvebuy

Multi-Vendor E-Commerce Platform with Next.js, React and Stripe Connect

- This project was build with [YouTube-Tutorial](https://www.youtube.com/watch?v=6fXNWBFPfRM&t=2764s&ab_channel=CodeWithAntonio)

## Thchnologies Used

- [Bun as package manager v1.2.10](https://bun.sh/)

- [NextJs v15.2.4](https://nextjs.org/)

- [TailwingCSS v4](https://tailwindcss.com/)

- [ShadCN UI](https://ui.shadcn.com/)

- [Neobrutalism style](https://www.neobrutalism.dev/)

- [MongoDB](https://www.mongodb.com/?msockid=0f9641a8f8c16fbb361f542bf9516ee6)

- [Payload](https://payloadcms.com/)

- [TRPC](https://trpc.io/)

![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/Avshalom-Ts/mvebuy?utm_source=oss&utm_medium=github&utm_campaign=Avshalom-Ts%2Fmvebuy&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

### FrontEnd Instalation

- Created the project by specific version

```bash
# Check the current version first
bunx create-next-app@latest --version
# Install the app in the current directory
bunx create-next-app@15.2.4 ./
# Add ShadCN UI
bunx --bun shadcn@latest --version
# Add by specific version
bunx --bun shadcn@2.4.0-canary.17 init
# To add component from ShadCN
bunx --bun shadcn@2.4.0-canary.17 add button
# Or for all components avaulable
bunx --bun shadcn@2.4.0-canary.17 add --all
# Add Trpc as tanstack react query
# First check packages versions (run in unix system)
for pkg in "@trpc/server" "@trpc/client" "@trpc/tanstack-react-query" "@tanstack/react-query@latest" "zod" "client-only" "server-only"; do echo "$pkg: $(npm show $pkg version)"; done
# Install packages for trpc by versions
bun add @trpc/server@11.0.3 @trpc/client@11.0.3 @trpc/tanstack-react-query@11.0.3 @tanstack/react-query@5.72.1 zod@3.24.2 client-only@0.0.1 server-only@0.0.1
bun add superjson
```

### BackEnd Instalation

- Create the backend api with payload

```bash
bunx create-payload-app@3.33.0 --use-bun
```

#### .env file

```text
#Added by Payload
DATABASE_URI=mongodb://username:password@address:port/databaseName
PAYLOAD_SECRET=YOUR_SECRET_HERE

# Global settings
NEXT_PUBLIC_APP_URL="http://address:port"
```

#### Getting Started

```bash
# Install dependencies
bun install
# Run the development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

#### Seeding the database with categories using bun(bun is crusial)

Seed file:
src/seed.ts

Added script in the package.json to seed the db

```bahs
bun run db:seed
```
