import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Toast, ToastContent, ToastTitle, ToastDescription } from "@/components/ui/toast"

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

        // Show toast for POST response
        if (data.message) {
          setToastMessage(data.message);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
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
    triggerResearch(topic);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 text-left">
      <div className="flex w-full max-w-sm items-center gap-2 font-mono font-semibold">
        <Input
          type="text"
          placeholder="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleSubmit}
          className="hover:bg-green-200"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {topics && topics.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Research Topics</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {topics.map((topicItem, index) => (
              <Card key={topicItem.id || index} className="cursor-pointer hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">{topicItem.topic}</CardTitle>
                  <CardDescription>
                    Status: <span className={`font-medium ${topicItem.status === 'succeeded' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {topicItem.status}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Progress: {topicItem.progress}%</p>
                    <p>Created: {new Date(topicItem.createdAt).toLocaleDateString()}</p>
                    {topicItem.completedAt && (
                      <p>Completed: {new Date(topicItem.completedAt).toLocaleDateString()}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <Toast>
          <ToastContent>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div>
              <ToastTitle>Success!</ToastTitle>
              <ToastDescription>{toastMessage}</ToastDescription>
            </div>
          </ToastContent>
        </Toast>
      )}
    </div>
  )
}

export default App
