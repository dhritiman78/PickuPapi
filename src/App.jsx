import { useState, useEffect } from "react";
import { FaWhatsapp, FaHeart, FaTimes, FaSpinner } from "react-icons/fa";

export default function App() {
  const [userInput, setUserInput] = useState("");
  const [pickupLine, setPickupLine] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const generatePickupLine = async () => {
    if (!userInput.trim()) return;
    setLoading(true);
    const prompt = `Generate a funny and cheesy pickup line based on this input: "${userInput}". Keep it light and humorous. Don't be afraid to be a little silly! 🤪. Give only one which is the best one. No need to introduce like "okay here is one..." just directly give it`;
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );
    const data = await res.json();
    setPickupLine(data.candidates[0].content.parts[0].text);
    setLoading(false);
  };

  const saveFavorite = () => {
    const updated = [...favorites, pickupLine];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const deleteFavorite = (index) => {
    const updated = favorites.filter((_, i) => i !== index);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const formatPickupLine = (line) => {
    return line.replace(/\*(.*?)\*/g, `<span classname="font-bold">$1</span>`);
  };
  

  const sendViaWhatsApp = (line) => {
    const url = `https://wa.me/?text=${encodeURIComponent(line)}`;
    window.open(url, "_blank");
  };

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-violet-100 p-4">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 rounded-lg mb-6 sticky top-0 z-10">
        <h1 className="text-2xl md:text-3xl font-extrabold text-violet-600 text-center">
          💘 PickuPapi
        </h1>
      </nav>

      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        <input
          type="text"
          placeholder="Enter a name or topic..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="border border-violet-300 rounded-lg p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-violet-400"
        />

        <button
          onClick={generatePickupLine}
          className="bg-violet-500 hover:bg-violet-600 text-white font-semibold px-6 py-2 rounded-lg w-full transition duration-300 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <FaSpinner className="animate-spin" /> Generating...
            </span>
          ) : (
            "Generate Line"
          )}
        </button>

        {pickupLine && (
          <div className="mt-6 bg-violet-50 p-4 rounded-lg">
            <p className="text-md text-violet-800 mb-3">💬 {formatPickupLine(pickupLine)}</p>
            <div className="flex justify-end gap-4 text-lg text-violet-700">
            <FaWhatsapp
                      className="cursor-pointer hover:text-green-600 transition"
                      onClick={() => sendViaWhatsApp(pickupLine)}
                      title="Share on WhatsApp"
            />
              <FaHeart
                className="cursor-pointer hover:text-red-500 transition"
                onClick={saveFavorite}
                title="Save to favorites"
              />
              <FaTimes
                className="cursor-pointer hover:text-red-500 transition"
                onClick={() => setPickupLine("")}
                title="Clear"
              />
            </div>
          </div>
        )}

        {favorites.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-violet-600 mb-3">⭐ Favorites</h2>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {favorites.map((line, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"
                >
                  <p className="text-sm text-violet-800">- {line}</p>
                  <div className="flex gap-2 text-violet-700 text-lg">
                    <FaWhatsapp
                      className="cursor-pointer hover:text-green-600 transition"
                      onClick={() => sendViaWhatsApp(line)}
                      title="Share on WhatsApp"
                    />
                    <FaTimes
                      className="cursor-pointer hover:text-red-500 transition"
                      onClick={() => deleteFavorite(idx)}
                      title="Delete"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <footer className="mt-8 text-center text-gray-500 text-sm">
          Made with ❤️ by Dhritiman Saikia
        </footer>
      </div>
    </div>
  );
}
