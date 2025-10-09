# Nexus AI Project Management SaaS

A Next.js starter template for AI-powered SaaS applications with integrated Chatbase AI agents

## Quick Start

```bash
git clone <your-repo-url>
cd nextjs-template
pnpm install
pnpm dev
```

## Chatbase AI Integration

This template comes pre-configured with Chatbase integration. Here's how to set it up:

### 1. Create Chatbase Account
Visit [Chatbase.co](https://www.chatbase.co) to create your account and chatbot.

### 2. Get Your Chatbot ID
1. Log into your Chatbase dashboard
2. Create a new chatbot or select existing one
3. Copy your chatbot ID

### 3. Configure Environment Variables
Create `.env.local`:

```env
NEXT_PUBLIC_CHATBOT_ID=your_chatbot_id_here
```

### 4. Customize Your Chatbot
- Upload your documentation and FAQs to train the AI agent in the Chatbase Dashboard
- Customize the chatbot's personality and responses
- The chatbot will automatically appear on your site once configured

## Chatbase Resources

- [Chatbase Documentation](https://www.chatbase.co/docs/user-guides/quick-start/introduction) - Complete integration guide
- [API Reference](https://www.chatbase.co/docs/developer-guides/api-integration) - API-ready ai agent integration