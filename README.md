# PixelCut AI

PixelCut AI is a modern React and Vite single-page experience for an AI background remover.

## Structure

The app is split into reusable components under `src/components`, including the nav, hero, upload flow, content sections, and auth modal.

## Environment

Create a `.env.local` file in the project root with your remove.bg API key:

```bash
VITE_REMOVEBG_API_KEY=your_key_here
```

An `.env.example` file is included as a template.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
