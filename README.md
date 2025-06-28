
![image alt](https://github.com/manureddyu/ai-learnmate/blob/834942f9ac487ba3286979aa597507019cc95218/Screenshot%202025-06-28%20193301.png)
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



# 📘 AI LearnMate

**AI LearnMate** is a personalized AI-powered learning assistant built during the REVA University AI Product Show Hackathon 2025. It empowers students to study smarter through instant topic explanations, quizzes, flashcards, and learning analytics — using voice, text, or PDF input.

---

## 🚀 Live Demo

🔗 [https://ai-learnmate.vercel.app](https://ai-learnmate.vercel.app)

---

## 🎯 Features

- 💡 **Explain Topics** with Beginner, Intermediate, and Advanced difficulty levels
- 🧠 **Generate Quizzes** automatically based on your input or uploaded PDFs
- 🎯 **Create Flashcards** for revision in a gamified format
- 🎤 **Voice Input** via Web Speech API
- 📄 **Upload PDFs** and get AI responses/quiz/flashcards from the content
- 📈 **Track Learning Streaks** and see interaction history
- 🌗 **Dark Mode Toggle**
- 📥 **Download Responses as PDF**
- 🎉 **Confetti Celebrations** for milestones

---

## 🧪 Try These:

- **Type:** "Explain me about Machine Learning at a beginner level"
- **Upload PDF:** Your notes and select Quiz or Flashcard mode
- **Use Voice:** Click 🎤 "Speak" and ask your topic aloud

---

## 🛠 Tech Stack

| Layer        | Technology         |
|--------------|--------------------|
| Frontend     | [Next.js](https://nextjs.org/) (React) |
| AI Backend   | [Groq API](https://console.groq.com)   |
| Voice Input  | Web Speech API     |
| PDF Export   | jsPDF              |
| File Upload  | FileReader API     |
| UI FX        | canvas-confetti    |
| Deployment   | Vercel             |

---

## 📂 Environment Setup

Create a `.env.local` file at the root:


