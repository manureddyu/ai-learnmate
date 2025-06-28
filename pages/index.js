import { useState, useEffect } from 'react';
import { jsPDF } from "jspdf";
import confetti from 'canvas-confetti';

const SpeechRecognition = typeof window !== "undefined"
  ? window.SpeechRecognition || window.webkitSpeechRecognition
  : null;

export default function Home() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [difficulty, setDifficulty] = useState("Beginner");
  const [interactionCount, setInteractionCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [topicTags, setTopicTags] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState([]);
  const [tip, setTip] = useState("");

  const tips = [
    "🔍 Learn by teaching someone else!",
    "💡 Always start with the basics before going advanced.",
    "🧠 Space repetition improves long-term memory.",
    "📖 Break big topics into smaller concepts.",
    "📝 Practice quizzes after learning boosts retention."
  ];

  useEffect(() => {
    const dailyTipIndex = new Date().getDate() % tips.length;
    setTip(tips[dailyTipIndex]);
  }, []);

  useEffect(() => {
    if (interactionCount > 0) {
      localStorage.setItem('aiLearnMateProgress', interactionCount);
    }
  }, [interactionCount]);

  useEffect(() => {
    const savedProgress = localStorage.getItem('aiLearnMateProgress');
    if (savedProgress) setInteractionCount(Number(savedProgress));

    const today = new Date().toLocaleDateString();
    const storedDate = localStorage.getItem('aiLearnMateLastDate');
    const storedStreak = localStorage.getItem('aiLearnMateStreak');

    if (storedDate === today) {
      setStreak(parseInt(storedStreak || '1'));
    } else {
      if (storedDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const isYesterday = new Date(storedDate).toLocaleDateString() === yesterday.toLocaleDateString();
        setStreak(isYesterday ? parseInt(storedStreak || '0') + 1 : 1);
      } else {
        setStreak(1);
      }
    }

    localStorage.setItem('aiLearnMateLastDate', today);
    localStorage.setItem('aiLearnMateStreak', streak.toString());

    if ([3, 5, 10].includes(streak)) {
      confetti();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setReply("");

    try {
      const prompt = isQuizMode
        ? `Generate 5 multiple choice questions with 4 options and correct answers on the topic: ${message} at a ${difficulty} level.`
        : isFlashcardMode
        ? `Convert the topic '${message}' into 5 concise flashcards with a question and a brief answer on each at a ${difficulty} level.`
        : `${message} (Explain at a ${difficulty} level)`;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt })
      });

      const data = await res.json();

      if (data.reply) {
        setReply(data.reply);
        setHistory(prev => [...prev, {
          question: message,
          answer: data.reply,
          isQuiz: isQuizMode,
          isFlashcard: isFlashcardMode,
          difficulty
        }]);
        setInteractionCount(prev => prev + 1);
        setTopicTags(prev => [...new Set([...prev, message.trim().split(" ")[0]])]);
      } else {
        setReply("⚠️ No response received from AI.");
      }
    } catch (error) {
      setReply("⚠️ Error contacting AI: " + error.message);
    }

    setLoading(false);
  };

  const startListening = () => {
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("AI LearnMate - AI Response", 10, 10);
    const lines = doc.splitTextToSize(reply, 180);
    doc.text(lines, 10, 20);
    doc.save("ai-response.pdf");
  };

  const generateReadme = () => {
    const lines = [
      `# AI LearnMate`,
      `An AI-powered personalized learning tool built with Next.js.`,
      `\n## Features`,
      `- 🎤 Voice-based input using Web Speech API`,
      `- 📄 Downloadable AI responses in PDF format`,
      `- 🧠 Quiz Generator`,
      `- 🎯 Flashcard Generator`,
      `- 🌗 Dark Mode toggle`,
      `- 🧩 Difficulty Level Selector`,
      `- 🔁 Session History Log`,
      `- 📊 Progress Tracker`,
      `- 🔥 Learning Streak Monitor`,
      `- 🏷️ Topic Tags`,
      `- 💡 Daily Learning Tip`,
      `- 🎉 Confetti Celebrations`,
      `\n## Usage`,
      `Enter a topic and choose the desired output (help, quiz, or flashcard).`,
      `Use the voice button to speak your query.`,
      `\n## Built With`,
      `- Next.js`,
      `- React`,
      `- Groq API`,
      `- jsPDF`,
      `- canvas-confetti`,
      `\n---`,
      `© 2025 AI LearnMate Team`
    ];

    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(doc.splitTextToSize(lines.join("\n"), 180), 10, 10);
    doc.save("AI-LearnMate-README.pdf");
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Segoe UI, sans-serif", backgroundColor: darkMode ? '#121212' : '#f0f4f8', color: darkMode ? '#fff' : '#1a1a1a' }}>
      <div style={{ background: darkMode ? '#222' : 'linear-gradient(to right, #4f46e5, #22c55e)', padding: '1rem 2rem', borderRadius: '12px', marginBottom: '1.5rem', color: '#fff' }}>
        <h1 style={{ fontSize: "2.5rem" }}>AI LearnMate 📘</h1>
        <p style={{ fontSize: "1.2rem" }}>✨ Your AI-powered personalized study buddy with quizzes, flashcards & progress tracking.</p>
        <p style={{ fontSize: "1rem", fontStyle: "italic", marginTop: "0.5rem" }}>💡 Tip of the Day: {tip}</p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        <button onClick={() => setDarkMode(!darkMode)} style={{ padding: "10px", borderRadius: "8px", background: "#1f2937", color: "white" }}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={{ padding: "10px", borderRadius: "8px" }}>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <button onClick={generateReadme} style={{ padding: "10px", borderRadius: "8px", background: "#7c3aed", color: "white" }}>
          📘 Generate README
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your topic/question..."
          required
          rows={4}
          cols={80}
          style={{ padding: "1rem", borderRadius: "10px", width: "100%", marginBottom: "1rem" }}
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          <button type="button" onClick={startListening} disabled={isListening} style={{ padding: "10px", borderRadius: "8px", background: "#0ea5e9", color: "white" }}>
            🎤 {isListening ? "Listening..." : "Speak"}
          </button>
          <button type="submit" onClick={() => { setIsQuizMode(false); setIsFlashcardMode(false); }} style={{ padding: "10px", borderRadius: "8px", background: "#10b981", color: "white" }}>
            Get Help
          </button>
          <button type="submit" onClick={() => { setIsQuizMode(true); setIsFlashcardMode(false); }} style={{ padding: "10px", borderRadius: "8px", background: "#f59e0b", color: "white" }}>
            🧠 Generate Quiz
          </button>
          <button type="submit" onClick={() => { setIsFlashcardMode(true); setIsQuizMode(false); }} style={{ padding: "10px", borderRadius: "8px", background: "#ef4444", color: "white" }}>
            🎯 Flashcard Mode
          </button>
        </div>
      </form>

      <div style={{ marginTop: "2rem" }}>
        <p><strong>Total Interactions:</strong> {interactionCount}</p>
        <p><strong>Learning Streak:</strong> {streak} day{streak !== 1 ? 's' : ''}</p>
        <p><strong>Topics Explored:</strong> {topicTags.join(", ")}</p>
      </div>

      {reply && (
        <div style={{ background: darkMode ? "#222" : "#fff", padding: "1.5rem", marginTop: "2rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <h3>{isQuizMode ? "🧠 Quiz Questions" : isFlashcardMode ? "🎯 Flashcards" : "📘 AI Response"}</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>{reply}</pre>
          <button onClick={downloadPDF} style={{ marginTop: "1rem", padding: "10px", borderRadius: "8px", background: "#14b8a6", color: "white" }}>
            📄 Download PDF
          </button>
        </div>
      )}

      {history.length > 0 && (
        <div style={{ marginTop: "3rem" }}>
          <h2>📚 Previous Q&A History</h2>
          {history.map((item, idx) => (
            <div key={idx} style={{ marginTop: "1rem", padding: "1rem", background: "#f1f5f9", borderRadius: "10px" }}>
              <p><strong>Q:</strong> {item.question}</p>
              <p><strong>{item.isQuiz ? "Quiz" : item.isFlashcard ? "Flashcards" : "Answer"}:</strong> ({item.difficulty})</p>
              <pre style={{ whiteSpace: "pre-wrap" }}>{item.answer}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
