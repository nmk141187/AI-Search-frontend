'use client';

type TabType = 'structured' | 'ai' | 'chat';

interface Props {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
}

export default function SearchTabs({ activeTab, onChange }: Props) {
  const tabs = [
    { id: 'structured', label: 'Search' },
    { id: 'ai', label: 'AI Search' },
    { id: 'chat', label: 'Chatbot' },
  ];

  return (
    <div className="flex gap-2 border-b pb-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id as TabType)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
            activeTab === tab.id
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}