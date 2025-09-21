import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Toast, ToastContent, ToastTitle, ToastDescription } from "@/components/ui/toast"
import { Link } from "react-router-dom";

function App() {
  const [topic, setTopic] = useState("");
  const [topics, setTopics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const fetchTopics = async () => {
    const user = localStorage.getItem('user');
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:4000/research', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'user': user
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTopics(data.topics);
      } else {
        setError('Failed to fetch topics');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Failed to fetch topics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // create a uuid for user and store it which is used to differentiate user sessions
    let user = localStorage.getItem('user');

    if (!user) {
      user = uuidv4();
      localStorage.setItem('user', user);
    }

    fetchTopics();
  }, []);

  const triggerResearch = async (topic) => {
    const user = localStorage.getItem('user');
    if (!user) return;

    setError(null);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/research', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'user': user
        },
        body: JSON.stringify({ topic })
      });

      if (response.ok) {
        const data = await response.json();

        if (data.message) {
          setToastMessage(data.message);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
          fetchTopics();
        }
      } else {
        setError(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (err) {
      setError(`Network error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (topic.trim()) {
      triggerResearch(topic);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex gap-2 mb-6">
        <Input
          type="text"
          placeholder="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button
          type="button"
          className="bg-black text-white hover:bg-gray-600"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {topics && topics.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3 ">Research Topics</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {topics.map((topicItem) => (
              <Link key={topicItem.id} to={`/research/${topicItem.id}`} className="block">
                <Card className="p-4 hover:bg-gray-50">
                  <h4 className="font-medium text-green-500">{topicItem.topic}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Status: {topicItem.status} • {topicItem.progress}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(topicItem.createdAt).toLocaleDateString()}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-3 rounded">
          {toastMessage}
        </div>
      )}
    </div>
  )
}

export default App
