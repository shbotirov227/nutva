export function AlertBox() {
  return (
    <div className="bg-white rounded-xl p-6 border-l-4 border-red-500 shadow-md">
      <h2 className="text-lg font-semibold text-red-600 mb-2">⚠️ Main Rules</h2>
      <p className="text-gray-800 border border-red-200 p-4 rounded-md text-sm leading-relaxed">
       Products sold on Nutva.uz are bioactive supplements that support health.
For hygiene and safety reasons, they
        <span className="text-red-600 font-semibold"> cannot be returned or exchanged.</span>
      </p>
    </div>
  );
}
