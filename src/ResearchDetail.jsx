import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { LogsDisplay } from "@/components/LogsDisplay";
import { ResultsDisplay } from "@/components/ResultsDisplay";

function ResearchDetail() {
    const { id } = useParams();
    const [topic, setTopic] = useState(null);
    const [result, setResult] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTopic = async () => {
            try {
                const user = localStorage.getItem('user');
                if (!user) return;

                const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/research/topic?topic_id=${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'user': user
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.topic) {
                        setTopic(data.topic);
                        console.log(data.topic.progress);
                        console.log(typeof data.topic.progress);
                        if (data.topic.progress != 100 && data.topic.error == null) {
                            setTimeout(() => {
                                fetchTopic();
                            }, 2000)
                        }
                        else {
                            fetchResult(id);
                        }
                    } else {
                        setError('No topic data found');
                    }
                } else {
                    setError('Failed to fetch research details');
                }
            } catch (err) {
                setError(`Network error occurred ${err}`);
            } finally {
                setLoading(false);
            }
        };

        const fetchResult = async (id) => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/research/result?topic_id=${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.status === "success") {
                        setResult(data.result);
                    }
                    else {
                        setError('No result found')
                    }
                }
                else {
                    setError("Failed to fetch result")
                }
            } catch (error) {
                setError(`Network error occured ${error}`)
            } finally {
                setLoading(false);
            }

        }

        if (id) {
            fetchTopic();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    if (error || !topic) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <div className="text-white text-xl">{error || 'Research not found'}</div>
                <Link to="/">
                    <Button variant="outline" className=" hover:bg-green-300 ">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <Link to="/">
                        <Button variant="outline" className="hover:bg-green-300">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
                <h1 className="text-2xl font-bold">{topic.topic}</h1>
            </div>

            <div className="space-y-6">
                <div className="border p-4 rounded">
                    <h3 className="font-medium mb-3">Research Details</h3>
                    <div className="space-y-1 text-sm">
                        <div><strong>Status:</strong> {topic.status}</div>
                        <div><strong>Progress:</strong> {topic.progress}%</div>
                        <div><strong>Created:</strong> {new Date(topic.createdAt).toLocaleString()}</div>
                        {topic.completedAt && (
                            <div><strong>Completed:</strong> {new Date(topic.completedAt).toLocaleString()}</div>
                        )}
                        {topic.error && (
                            <div className="text-red-600"><strong>Error:</strong> {topic.error}</div>
                        )}
                    </div>
                </div>

                {topic.logs && <LogsDisplay logs={topic.logs} />}

                {result && <ResultsDisplay result={result} />}
            </div>
        </div>
    );
}

export default ResearchDetail;
