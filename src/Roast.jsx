import { useState, useEffect } from "react";
import { FaWhatsapp, FaFireAlt, FaTimes, FaSpinner } from "react-icons/fa";

export default function Roast() {
  const [userInput, setUserInput] = useState("");
  const [roastLevel, setRoastLevel] = useState("Mild");
  const [roastLine, setRoastLine] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateRoast = async () => {
    if (!userInput.trim()) return;
    setLoading(true);
    const prompt = `Roast this person based on the following input: "${userInput}". Roast level: ${roastLevel}. Keep it funny, creative, and light-hearted. Avoid being too harsh. Provide only ONE roast, and do NOT introduce it like "Here's one..." Just give the roast directly.`;

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
    setRoastLine(data.candidates[0].content.parts[0].text);
    setLoading(false);
  };

  const saveFavorite = () => {
    if (!roastLine) return;
    const updated = [...favorites, roastLine];
    setFavorites(updated);
    localStorage.setItem("roastFavorites", JSON.stringify(updated));
  };

  const deleteFavorite = (index) => {
    const updated = favorites.filter((_, i) => i !== index);
    setFavorites(updated);
    localStorage.setItem("roastFavorites", JSON.stringify(updated));
  };

  const sendViaWhatsApp = (line) => {
    const url = `https://wa.me/?text=${encodeURIComponent(line)}`;
    window.open(url, "_blank");
  };

  useEffect(() => {
    const saved = localStorage.getItem("roastFavorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-red-100 to-yellow-200 p-4 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 rounded-lg mb-6 sticky top-0 z-10">
        <h1 className="text-3xl font-extrabold text-red-600 text-center tracking-wide">
          🔥 Roast Me Generator
        </h1>
      </nav>

      {/* Intro */}
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 mb-6">
        <p className="text-center text-red-500 text-sm md:text-base leading-relaxed mb-4 font-bold">
          Enter your name or a fun fact — we'll roast you with 🔥. Laugh at yourself (or your friends) and share the burns! 😂🔥
        </p>

        <input
          type="text"
          placeholder="Enter your name or a fun fact..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="border border-red-300 rounded-lg p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
        />

        {/* Roast Level Selector */}
        <div className="flex justify-between items-center mb-4 text-sm font-semibold text-red-700">
          {["Mild", "Medium", "Savage"].map((level) => (
            <button
              key={level}
              onClick={() => setRoastLevel(level)}
              className={`px-4 py-1 rounded-full transition ${
                roastLevel === level
                  ? "bg-red-500 text-white"
                  : "bg-red-100 hover:bg-red-200"
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        <button
          onClick={generateRoast}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg w-full transition duration-300 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <FaSpinner className="animate-spin" /> Roasting...
            </span>
          ) : (
            "Generate Roast"
          )}
        </button>

        {/* Generated Roast */}
        {roastLine && (
          <div className="mt-6 bg-red-50 p-4 rounded-lg animate-fade-in">
            <p className="text-md text-red-800 mb-3">💬 {roastLine}</p>
            <div className="flex justify-end gap-4 text-lg text-red-700">
              <FaWhatsapp
                className="cursor-pointer hover:text-green-600 transition"
                onClick={() => sendViaWhatsApp(roastLine)}
                title="Share on WhatsApp"
              />
              <FaFireAlt
                className="cursor-pointer hover:text-orange-500 transition"
                onClick={saveFavorite}
                title="Save to favorites"
              />
              <FaTimes
                className="cursor-pointer hover:text-red-500 transition"
                onClick={() => setRoastLine("")}
                title="Clear"
              />
            </div>
          </div>
        )}

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-red-600 mb-3">🔥 Saved Roasts</h2>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {favorites.map((line, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"
                >
                  <p className="text-sm text-red-800 w-4/5">- {line}</p>
                  <div className="flex gap-2 text-red-700 text-lg">
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
          Burned with 🔥 by Dhritiman Saikia
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
