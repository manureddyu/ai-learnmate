export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const userMessage = req.body.message;
  console.log("User message:", userMessage);

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: userMessage }]
      })
    });

    const data = await response.json();
    console.log("Groq response:", data);

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ message: "Invalid response from Groq", data });
    }

    const aiReply = data.choices[0].message.content;
    res.status(200).json({ reply: aiReply });

  } catch (error) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}
