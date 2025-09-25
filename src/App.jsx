import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Link } from "react-router-dom";

function App() {
  const [topic, setTopic] = useState("");
  const [topics, setTopics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const inputRef = useRef(null);

  const fetchTopics = async () => {
    const user = localStorage.getItem('user');
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/research`, {
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
    inputRef.current.focus();
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
      const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/research`, {
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

  const handleDelete = async (topicItem) => {
    const user = localStorage.getItem('user');
    if (!user || !topicItem?.id) return;

    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/research/${topicItem.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'user': user
        }
      });

      if (response.ok) {
        setTopics(prev => Array.isArray(prev) ? prev.filter(t => t.id !== topicItem.id) : prev);
        setToastMessage('Topic deleted');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        setError('Failed to delete topic');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Failed to delete topic:', err);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-center text-4xl font-semibold font-mono mt-5 text-blue-500">AI Research Agent</h1>
      <div className=" mb-6 mt-10">
        <Input
          type="text"
          placeholder="Search for a Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyPress={handleKeyPress}
          ref={inputRef}
        />
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {loading && <p className="text-gray-500 text-sm mt-2">Loading...</p>}
      {topics && topics.length > 0 ? (
        <div>
          <h3 className="text-lg font-medium mb-3 ">Previous Topics</h3>
          <div className="grid gap-3 md:grid-cols-1">
            {topics.map((topicItem) => (
              <Link key={topicItem.id} to={`/research/${topicItem.id}`} className="block">
                <Card className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between">
                    <h4 className="font-medium text-green-500 inline-block">{topicItem.topic}</h4>
                    <Button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(topicItem); }} className="bg-red-400 hover:bg-red-400 hover:border-2 hover:border-red-500">Delete</Button>
                  </div>
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
      ) : (<p>No Previous Topics Found</p>)}

      {showToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-3 rounded">
          {toastMessage}
        </div>
      )}
    </div>
  )
}

export default App
