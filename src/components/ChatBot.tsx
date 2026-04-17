'use client';

import { useState } from 'react';
import { aiSearchCompanies, exportSearchResults } from '@/lib/api';
import { buildExportFileName, downloadBlob } from '@/lib/utils';

export default function ChatBot() {
  const [messages, setMessages] = useState<any[]>([
    {
      sender: 'bot',
      text: 'Hi 👋 Ask me something like "Fintech companies in London doing payments". Type "export" after search.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<any>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);

    const currentInput = input;
    setInput('');

    // Export command
    if (currentInput.toLowerCase() === 'export') {
      if (!filters) {
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: 'Run a search first before export.' },
        ]);
        return;
      }

      const blob = await exportSearchResults(filters);
      downloadBlob(blob, buildExportFileName('chat_export'));

      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Export started 📥' },
      ]);

      return;
    }

    try {
      setLoading(true);

      const res = await aiSearchCompanies({ prompt: currentInput });

      const parsed = res.parsedFilters;

      setFilters({
        sector: parsed?.sector,
        subSector: parsed?.subSector,
        location: parsed?.location,
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `Found ${res.data.length} companies`,
          data: res.data,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Error fetching results ❌' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 flex flex-col h-[500px]">
      <h2 className="text-lg font-semibold mb-3">Chatbot</h2>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto space-y-3 bg-slate-50 p-4 rounded-xl">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-md p-3 rounded-2xl text-sm ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-800 border'
              }`}
            >
              <p>{msg.text}</p>

              {msg.data && (
                <ul className="mt-2 text-xs space-y-1">
                  {msg.data.map((c: any, idx: number) => (
                    <li key={idx}>
                      {c.companyName} • {c.location}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-sm text-gray-500">Bot is typing...</div>
        )}
      </div>

      {/* Input */}
      <div className="mt-3 flex gap-2">
        <input
          className="flex-1 border rounded-xl px-4 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-slate-900 text-white px-4 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
}