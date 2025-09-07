// app/(root)/profile/legal/page.tsx
export default function LegalPage() {
  const legalDocs = [
    { name: "Оферта", href: "/legal/offer" },
    { name: "Согласие на обработку Персональных данных", href: "/legal/personal-data" },
    { name: "Правила сервиса", href: "/legal/rules" },
    { name: "Лицензия", href: "/legal/license" },
    { name: "Политика обработки Персональных данных", href: "/legal/privacy-policy" },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Правовая информация</h1>
      
      <div className="space-y-4">
        {legalDocs.map((doc, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
            <h3 className="font-semibold text-gray-900 mb-2">{doc.name}</h3>
            <button className="text-blue-500 hover:text-blue-600 text-sm">
              Посмотреть документ →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}