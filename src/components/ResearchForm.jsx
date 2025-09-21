import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export function ResearchForm({ 
  topic, 
  setTopic, 
  loading, 
  error, 
  response, 
  onSubmit 
}) {
  return (
    <div className="flex flex-col items-center gap-4 mt-24 font-mono">
      <div className="flex justify-center items-center w-full max-w-sm gap-2">
        <Input 
          type="text" 
          placeholder="Enter research topic" 
          value={topic}
          required
          className="text-white"
          onChange={(e) => setTopic(e.target.value)}
        />
        <Button type="submit" variant="outline" onClick={onSubmit}>
          Search
        </Button>
      </div>
      
      {loading && (
        <Alert variant="default">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Loading...</AlertTitle>
          <AlertDescription>
            Researching your topic, please wait...
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {typeof error === 'string' ? error : JSON.stringify(error, null, 2)}
          </AlertDescription>
        </Alert>
      )}
      
      {response && !loading && (
        <Alert variant="default">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Research Results</AlertTitle>
          <AlertDescription>
            <pre className="whitespace-pre-wrap">
              {typeof response === 'string' ? response : JSON.stringify(response, null, 2)}
            </pre>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
