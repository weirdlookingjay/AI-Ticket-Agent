import { createAgent, gemini } from "@inngest/agent-kit";
import dotenv from "dotenv";

dotenv.config();

const analyzeTicket = async (ticket) => {
  const supportAgent = createAgent({
    model: gemini({
      model: "gemini-1.5-flash-8b",
      apiKey: process.env.GEMINI_API_KEY,
    }),
    name: "AI Ticket Triage Assistant",
    system: `You are an expert AI assistant that process technical support tickets.
    
    You job is to:
    1. Summarize the iussue.
    2. Estimate its priorty.
    3. Provide helpful notes and resource links for hunan moderators.
    4. List relevant technical skills required.

    IMPORTANT:
    - Response with *only* valud raw JSON.
    - Do NOT include markdown, code fences, comments, or any extra formatting.
    - The format must be a raw JSON object.

    Repeat: Do not wrap your output in markdown or code fences.
    `,
  });

  const response = await supportAgent.run(`You are a ticket triage agent.
    Only return a strict JSON object with no extra text, headers, or markdown.

    Analyze the following support ticket and provide a JSON object with:

    - summary: A short 1-2 sentence summary of the issue.
    - priority: One of "low", "medium", or "high".
    - helpfulNotes: A detailed techinical explanation that a moderator can use to solve this issue. Inclide useful
      external links or resources if possible.
    - relatedSkills: An array of relevant skills required to solve the issue (e.g., ["React", "MongoDB]).

    Respond ONLY in this JSON format and do not include any other text or markdown in the answer:

    {
      "summary": "Short summary of the ticket",
      "priority": "high",
      "helpfulNotes": Here are useful tips...",
      "relatedSkills": ["React", "Mode.js"]
    }

    ---

    Ticket information:

    - Title: ${ticket.title}
    - Description: ${ticket.description}    
    `);

  const raw = response.output[0].content;

  try {
    const match = raw.match(/```json\s*([\s\S]*?)\s*```/i);
    const jsonString = match ? match[1] : raw.trim();

    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to parse JSON from AI response:" + error.message);
    return null;
  }
};

export default analyzeTicket;
