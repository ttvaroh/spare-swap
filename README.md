# 🔧 Spare Swap

[Spare Swap](https://spare-swap.netlify.app/) is a web application that helps students connect and share spare parts, tools, and components. Built with modern web technologies, it provides a simple and efficient way to list, request, and swap items.

[![Spare Swap Screenshot](./public/home-screen.png)](https://spare-swap.netlify.app/)

---

## 📦 Tech Stack

- **Vite** – Lightning fast development build tool
- **React** – Frontend library for building UI components
- **Tailwind CSS** – Utility-first CSS framework for styling
- **Supabase** – Backend as a service (Postgres, Auth, Storage, Realtime)
- **OpenAI API** – AI-powered features for smarter item descriptions and search

---

## ⚙️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/spare-swap.git
   cd spare-swap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   (or use `pnpm install` / `yarn install`)

3. **Set up environment variables**

   Create a `.env` file in the root of the project:

   ```bash
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_OPENAI_API_KEY=your_openai_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```
.
├── src/
│   ├── components/   # Reusable UI components
│   ├── pages/        # Page-level views
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Supabase & OpenAI client setup
│   └── App.jsx
├── public/           # Static assets
├── index.html
├── vite.config.js
└── tailwind.config.js
```

---

## 🔑 Features

- ✅ User authentication & profiles via Supabase  
- ✅ Real-time listings and updates  
- ✅ Responsive design with Tailwind CSS  
- ✅ AI-powered item descriptions & recommendations using OpenAI  
- ✅ Fast builds and hot-reload dev server with Vite  

---

## 🚀 Deployment

The app is live at: [https://spare-swap.netlify.app/](https://spare-swap.netlify.app/)  

You can also deploy to [Netlify](https://www.netlify.com/), [Vercel](https://vercel.com/), or any static hosting provider.  
Remember to add your `.env` variables in your hosting dashboard.

---

## 📜 License

MIT License © 2025 [Your Name]
