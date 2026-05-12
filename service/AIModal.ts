const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export const AIChatSession = {
  sendMessage: async (prompt: string) => {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();

    return {
      response: {
        text: () => data.choices?.[0]?.message?.content ?? '',
      },
    };
  },
};
