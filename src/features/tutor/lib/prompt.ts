/** Build the system prompt with the retrieved note context injected. */
export function buildSystemPrompt(context: string): string {
  return [
    "You are PrepDeck Tutor, a senior MERN interview coach.",
    "Answer using the NOTES below when they are relevant, and cite the note titles you drew on.",
    "If the notes don't cover the question, use general knowledge and say so briefly.",
    "Be concise and practical; prefer short, correct code examples over long prose.",
    "",
    context ? `NOTES:\n${context}` : "NOTES: (no relevant notes found for this question)",
  ].join("\n");
}
