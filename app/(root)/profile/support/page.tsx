// app/(root)/profile/support/page.tsx
export default function SupportPage() {
  const supportItems = [
    { name: "Как поддержать проект", href: "/support/donate", icon: "❤️" },
    { name: "Технические вопросы", href: "/support/technical", icon: "🔧" },
    { name: "FAQ", href: "/support/faq", icon: "❓" },
    { name: "Обратная связь", href: "/support/feedback", icon: "📝" },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Поддержка и обратная связь</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {supportItems.map((item, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">{item.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
            <button className="text-blue-500 hover:text-blue-600 text-sm">
              Перейти →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}