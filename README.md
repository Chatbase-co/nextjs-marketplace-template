# Nexus AI Project Management SaaS

A Next.js starter template for AI-powered SaaS applications with integrated Chatbase AI agents

## Quick Start

```bash
pnpm install
pnpm dev
```

## Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FChatbase-co%2Fnextjs-marketplace-template&env=NEXT_PUBLIC_CHATBOT_ID&envDescription=chatbot%20id%20from%20chatbase&integration-ids=icfg_jS0nsILSbn7FTwQFbTJy5CSY&products=%5B%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22chatbase%22%2C%22productSlug%22%3A%22chatbot%22%2C%22protocol%22%3A%22other%22%7D%5D)

## Chatbase AI Integration

This template comes pre-configured with Chatbase integration. Here's how to set it up:

### 1. Create Chatbase Account
Visit [Chatbase.co](https://www.chatbase.co) to create your account and chatbot.

### 2. Get Your Chatbot ID
1. Log into your Chatbase dashboard
2. Create a new chatbot or select existing one
3. Copy your chatbot ID

### 3. Configure Environment Variables
You need 1 environment variable: `NEXT_PUBLIC_CHATBOT_ID`

Create `.env.local`:
```env
vercel env pull .env.local
```

### 4. Customize Your Chatbot
- Upload your documentation and FAQs to train the AI agent in the Chatbase Dashboard
- Customize the chatbot's personality and responses
- The chatbot will automatically appear on your site once configured

## Chatbase Resources

- [Chatbase Documentation](https://www.chatbase.co/docs/user-guides/quick-start/introduction) - Complete integration guide
- [API Reference](https://www.chatbase.co/docs/developer-guides/api-integration) - API-ready ai agent integration

## Preview
<img width="1467" height="775" alt="Screenshot 2025-10-22 at 9 08 34 PM" src="https://github.com/user-attachments/assets/2ee2a324-9ba8-4251-bc07-d9077875f560" />
