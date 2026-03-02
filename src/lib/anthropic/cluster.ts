import { getAnthropicClient } from "./client";
import type { AiTheme } from "@/types/database";

export async function clusterComments(comments: string[]): Promise<AiTheme[]> {
  if (comments.length === 0) return [];

  try {
    const client = getAnthropicClient();

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20250501",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `You are analyzing user feedback on a startup idea. Below are anonymous comments from validators.
Group these into 2-5 distinct themes. For each theme, provide:
1. A short theme label (3-5 words)
2. A one-sentence summary
3. The sentiment (positive, negative, neutral)

Return as JSON array only: [{"label": "...", "summary": "...", "sentiment": "positive|negative|neutral"}]

Comments:
${comments.join("\n")}`,
        },
      ],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    if (textBlock) {
      return JSON.parse(textBlock.text.trim()) as AiTheme[];
    }

    return [];
  } catch (error) {
    console.error("AI comment clustering failed:", error);
    return [];
  }
}
