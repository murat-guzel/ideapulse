import { getAnthropicClient } from "./client";

interface IdeaInput {
  title: string;
  problem: string;
  target_user: string;
  solution: string;
  monetization: string;
}

export async function generateIdeaSummary(idea: IdeaInput): Promise<string | null> {
  try {
    const client = getAnthropicClient();

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20250501",
      max_tokens: 150,
      messages: [
        {
          role: "user",
          content: `You are a startup analyst. Given the following startup idea, write exactly 2 concise sentences summarizing what it does and who it's for. Be neutral and factual. Do not use marketing language.

Title: ${idea.title}
Problem: ${idea.problem}
Target User: ${idea.target_user}
Solution: ${idea.solution}
Monetization: ${idea.monetization}`,
        },
      ],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    return textBlock ? textBlock.text.trim() : null;
  } catch (error) {
    console.error("AI summary generation failed:", error);
    return null;
  }
}
