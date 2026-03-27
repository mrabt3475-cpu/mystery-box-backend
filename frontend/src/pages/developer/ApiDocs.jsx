export default function ApiDocs() {
  const endpoints = [
    { cat: 'المنتجات', methods: [
      { m: 'GET', p: '/api/v1/products', d: 'جميع المنتجات' },
      { m: 'GET', p: '/api/v1/products/:id', d: 'منتج واحد' },
    ]},
    { cat: 'الصناديق', methods: [
      { m: 'GET', p: '/api/v1/boxes', d: 'الصناديق' },
      { m: 'POST', p: '/api/v1/boxes/:id/open', d: 'فتح صندوق' },
    ]},
    { cat: 'المستخدمين', methods: [
      { m: 'GET', p: '/api/v1/user/:id', d: 'بيانات مستخدم' },
    ]},
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">📘 توثيق API</h1>

      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">🔐 المصادقة</h2>
        <code className="bg-gray-900 p-3 rounded block">X-API-Key: key_xxxxx:sk_xxxxx</code>
      </div>

      {endpoints.map((s, i) => (
        <div key={i} className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">{s.cat}</h2>
          {s.methods.map((ep, j) => (
            <div key={j} className="bg-gray-700 p-3 rounded flex items-center gap-4 mb-2">
              <span className={`px-2 py-1 rounded text-sm ${ep.m === 'GET' ? 'bg-green-600' : 'bg-blue-600'}`}>{ep.m}</span>
              <code className="text-purple-400 flex-1">{ep.p}</code>
              <span className="text-gray-400">{ep.d}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}