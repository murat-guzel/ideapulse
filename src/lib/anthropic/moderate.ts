import { getAnthropicClient } from "./client";

interface ModerationResult {
  flagged: boolean;
  reason: string | null;
  category: string | null;
}

export async function moderateContent(text: string): Promise<ModerationResult> {
  try {
    const client = getAnthropicClient();

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20250501",
      max_tokens: 100,
      messages: [
        {
          role: "user",
          content: `You are a content moderator. Analyze the following text for:
1. Spam or nonsensical content
2. Offensive or abusive language
3. Personal information (emails, phone numbers, addresses)
4. Promotional links or solicitation

Text to analyze:
${text}

Respond with JSON only: {"flagged": boolean, "reason": string | null, "category": string | null}`,
        },
      ],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    if (textBlock) {
      const parsed = JSON.parse(textBlock.text.trim());
      return {
        flagged: Boolean(parsed.flagged),
        reason: parsed.reason || null,
        category: parsed.category || null,
      };
    }

    return { flagged: false, reason: null, category: null };
  } catch (error) {
    console.error("AI moderation failed:", error);
    // Fail open — don't block submissions if moderation is unavailable
    return { flagged: false, reason: null, category: null };
  }
}
