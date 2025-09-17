import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [comment, setComment] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/comments");
      setHistory(res.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:4000/api/comment", { comment });
      setResult(res.data.sentiment);
      setComment("");
      fetchComments();
    } catch (error) {
      console.error("Error analyzing comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSentimentColor = (sentiment) => {
    switch(sentiment?.toLowerCase()) {
      case "positive": return "bg-green-100 text-green-800 border-green-200";
      case "negative": return "bg-red-100 text-red-800 border-red-200";
      case "neutral": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch(sentiment?.toLowerCase()) {
      case "positive": return "😊";
      case "negative": return "😞";
      case "neutral": return "😐";
      default: return "❓";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Sentiment Analysis</h1>
          <p className="text-purple-200">Discover the emotion behind your text</p>
        </div>
        
        {/* Main Content */}
        <div className="p-6">
          <div className="mb-6">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your text for analysis
            </label>
            <textarea
              id="comment"
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
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </span>
              ) : "Analyze Sentiment"}
            </button>
          </div>

          {/* Result Display */}
          {result && (
            <div className={`p-4 mb-6 rounded-lg border ${getSentimentColor(result)} transition-all duration-300 animate-fadeIn`}>
              <div className="flex items-center">
                <span className="text-2xl mr-3">{getSentimentIcon(result)}</span>
                <div>
                  <h3 className="font-semibold">Analysis Result</h3>
                  <p className="capitalize">This text is <span className="font-bold">{result}</span></p>
                </div>
              </div>
            </div>
          )}

          {/* History Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Analysis History
            </h2>
            
            {history.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No analysis history yet. Your results will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {history.map((item) => (
                  <div key={item._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start">
                      <p className="text-gray-700 flex-1 pr-2">{item.text}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getSentimentColor(item.sentiment)} flex items-center`}>
                        {getSentimentIcon(item.sentiment)} <span className="ml-1">{item.sentiment}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center text-xs text-gray-500 border-t">
          Sentiment Analysis Tool • Powered by AI
        </div>
      </div>
    </div>
  );
}