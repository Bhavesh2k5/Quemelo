# Contributing to QUEMELO

First off, thank you for considering contributing to QUEMELO! It's people like you that make open-source such a fantastic community to learn, inspire, and create.

## 🧠 Philosophy
QUEMELO was built to be bold, fast, and unapologetic. We intentionally avoid bloated UI frameworks like Tailwind or Bootstrap in favor of raw, highly-optimized Vanilla CSS. We want the interface to feel like a high-end music video.

## 🛠️ How to Contribute

### 1. Report Bugs
If you find a bug, please open an issue in the repository. Provide as much detail as possible, including:
- Steps to reproduce
- Expected behavior vs Actual behavior
- Your OS and Browser version

### 2. Suggest Features
Have a cool idea for a new animation? Want to integrate a new music provider like Spotify or SoundCloud? We'd love to hear it! Open a feature request issue and let's discuss it.

### 3. Submit Pull Requests
If you want to get your hands dirty, follow these steps:
1. **Fork the repo** and create your branch from `main`.
2. **Run it locally** (Make sure you setup your local Postgres DB!).
3. **Make your changes**. Keep your code clean, readable, and well-commented.
4. **Test your changes**. Ensure you haven't broken the song recognition pipeline or the UI layout on mobile devices.
5. **Issue a Pull Request**. Provide a clear and comprehensive description of your changes. Include screenshots or videos if you changed the UI!

## 🎨 Style Guidelines

- **CSS:** Use vanilla CSS and inline React styles. Keep things modular. If you add animations, prioritize GPU-accelerated properties (`transform`, `opacity`).
- **Components:** Functional components only. No class components.
- **Typescript:** Please type your props and state. Avoid `any` where possible.

## ⚠️ Known High-Priority Issues
If you're looking for something to do, here are areas we actively need help with:
- **Audio API Migration:** We need to rip out `node-shazam` and replace it with an official ACRCloud integration so this can be deployed to production safely.
- **Mobile Optimization:** The 3D drag-and-drop carousel is currently optimized for Desktop cursors. We need better Touch Event handlers for iOS/Android.

Once again, thank you for contributing! 🎵⚡
