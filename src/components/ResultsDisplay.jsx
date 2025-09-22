
export function ResultsDisplay({ results }) {
    if (!results || !results.result) {
        return null;
    }

    const { result } = results;

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Research Results</h3>

            {result.final_synthesis && (
                <div className="border p-4 rounded">
                    <h4 className="font-medium mb-2">Summary</h4>
                    <p className="text-gray-600 mb-3">{result.final_synthesis.overview}</p>

                    {result.final_synthesis.keywords && (
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Keywords:</p>
                            <div className="flex flex-wrap gap-1">
                                {result.final_synthesis.keywords.map((keyword, index) => (
                                    <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {result.articles && result.articles.length > 0 && (
                <div>
                    <h4 className="font-medium mb-3">Articles</h4>
                    <div className="space-y-3">
                        {result.articles.map((article, index) => (
                            <div key={index} className="border p-3 rounded">
                                <h5 className="font-medium mb-2">
                                    <a
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-600 hover:underline"
                                    >
                                        {article.title}
                                    </a>
                                </h5>
                                <p className="text-sm text-gray-600 mb-2">{article.summary}</p>

                                {article.keywords && article.keywords.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {article.keywords.map((keyword, keywordIndex) => (
                                            <span key={keywordIndex} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
