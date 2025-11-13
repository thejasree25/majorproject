import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [comment, setComment] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE = "http://localhost:4000/api"; // ✅ Local backend

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${API_BASE}/comment`);
      setHistory(res.data);
    } catch (error) {
      console.error("❌ Error fetching comments:", error);
    }
  };

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/comment`, { comment });
      setResult(res.data.sentiment);
      setComment("");
      fetchComments();
    } catch (error) {
      console.error("❌ Error analyzing comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/comment/${id}`);
      fetchComments();
    } catch (error) {
      console.error("❌ Error deleting comment:", error);
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case "positive":
      case "neutral":
        return "bg-green-100 text-green-800 border-green-200";
      case "negative":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case "positive": return "😊";
      case "negative": return "😞";
      case "neutral": return "😐";
      default: return "❓";
    }
  };

  const getSentimentLabel = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case "positive": return "good";
      case "negative": return "bad";
      case "neutral": return "okay";
      default: return sentiment;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Sentiment Analysis</h1>
          <p className="text-purple-200">Discover the emotion behind your text</p>
        </div>

        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter your text for analysis
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Type your comment here..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
            rows="4"
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || !comment.trim()}
            className={`mt-4 w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              isLoading || !comment.trim()
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg"
            }`}
          >
            {isLoading ? "Analyzing..." : "Analyze Sentiment"}
          </button>

          {result && (
            <div
              className={`p-4 mt-6 rounded-lg border ${getSentimentColor(result)} transition-all duration-300`}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{getSentimentIcon(result)}</span>
                <div>
                  <h3 className="font-semibold">Analysis Result</h3>
                  <p className="capitalize">
                    This text is <span className="font-bold">{getSentimentLabel(result)}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Analysis History</h2>
          {history.length === 0 ? (
            <p className="text-gray-500 text-center">No analysis history yet.</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {history.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md"
                >
                  <div className="flex justify-between items-start">
                    <p className="text-gray-700 flex-1">{item.text}</p>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSentimentColor(item.sentiment)}`}>
                        {getSentimentIcon(item.sentiment)} {getSentimentLabel(item.sentiment)}
                      </span>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-4 text-center text-xs text-gray-500 border-t">
          Sentiment Analysis Tool • Powered by AI
        </div>
      </div>
    </div>
  );
}
