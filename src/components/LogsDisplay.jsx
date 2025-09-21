export function LogsDisplay({ logs }) {
    if (!logs || !Array.isArray(logs)) {
        return null;
    }

    return (
        <div>
            <h3 className="text-lg font-medium mb-3">Process Logs</h3>
            <div className="space-y-2">
                {logs.map((log, index) => (
                    <div key={index} className="border-l-2 border-gray-300 pl-3 py-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-medium text-sm">{log.step}</h4>
                                <p className="text-sm text-gray-600">{log.message}</p>
                                {log.meta && (
                                    <div className="mt-1 text-xs text-gray-500">
                                        <pre className="whitespace-pre-wrap">
                                            {JSON.stringify(log.meta, null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>
                            <span className="text-xs text-gray-400">
                                {new Date(log.createdAt).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
