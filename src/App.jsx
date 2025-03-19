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
    if (!pickupLine) return;
    const updated = [...favorites, pickupLine];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const deleteFavorite = (index) => {
    const updated = favorites.filter((_, i) => i !== index);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const sendViaWhatsApp = (line) => {
    const url = `https://wa.me/?text=${encodeURIComponent(line)}`;
    window.open(url, "_blank");
  };

  const formatPickupLine = (line) => {
    return line.replace(/\*(.*?)\*/g, '<span class="font-bold">$1</span>');
  };

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-violet-200 p-4 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 rounded-lg mb-6 sticky top-0 z-10">
        <h1 className="text-3xl font-extrabold text-violet-600 text-center tracking-wide">
          💘 PickuPapi
        </h1>
      </nav>

      {/* Intro */}
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 mb-6">
        <p className="text-center text-violet-500 text-sm md:text-base leading-relaxed mb-4 font-bold">
          Impress your ❤️ love/crush 💕 by generating the perfect pickup line!
          <br />
          Be cheesy, be funny, be bold — let the flirting begin! 😏✨
        </p>

        <input
          type="text"
          placeholder="Enter a name, hobby, or topic..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="border border-violet-300 rounded-lg p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
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

        {/* Generated Pickup Line */}
        {pickupLine && (
          <div className="mt-6 bg-violet-50 p-4 rounded-lg animate-fade-in">
            <p
              className="text-md text-violet-800 mb-3"
              dangerouslySetInnerHTML={{ __html: `💬 ${formatPickupLine(pickupLine)}` }}
            />
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

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-violet-600 mb-3">⭐ Favorites</h2>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {favorites.map((line, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"
                >
                  <p className="text-sm text-violet-800 w-4/5"
                  dangerouslySetInnerHTML={{ __html: `- ${formatPickupLine(line)}` }}></p>
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

        <footer className="mt-8 text-center text-gray-500 text-xs">
          Made with ❤️ by Dhritiman Saikia
        </footer>
      </div>

      {/* Animation Style */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.6s ease-in-out;
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
