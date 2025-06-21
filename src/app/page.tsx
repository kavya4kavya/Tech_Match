import {
  generateTechContent,
  type GenerateTechContentOutput,
} from '@/ai/flows/generate-tech-content';
import { TechMatchGame } from '@/components/tech-match-game';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

const fallbackContent: GenerateTechContentOutput = {
  pairs: [
    { question: 'What is the time complexity of binary search?', answer: 'O(log n)' },
    { question: 'What does DSA stand for?', answer: 'Data Structures and Algorithms' },
    { question: 'Which company developed React?', answer: 'Facebook' },
    { question: 'What is the file extension for TypeScript files?', answer: '.ts or .tsx' },
    { question: 'What does HTML stand for?', answer: 'HyperText Markup Language' },
    { question: 'What protocol is used to send email?', answer: 'SMTP' },
    { question: 'What does "git clone" do?', answer: 'Creates a local copy of a remote repository' },
    { question: 'What is a NoSQL database?', answer: 'A non-relational database' },
  ]
};

export default async function Home() {
  let content: GenerateTechContentOutput = fallbackContent;
  let infoMessage: React.ReactNode = null;

  const hasApiKey = process.env.GOOGLE_API_KEY && process.env.GOOGLE_API_KEY !== 'your_api_key_here';

  if (hasApiKey) {
    try {
      const aiContent = await generateTechContent({ numPairs: 8 });
      if (aiContent?.pairs?.length > 0) {
        content = aiContent;
      }
    } catch (e: any) {
      console.error("Error generating AI content:", e.message);
      infoMessage = (
        <Alert variant="destructive" className="mb-8 w-full">
          <Terminal className="h-4 w-4" />
          <AlertTitle>AI Content Generation Failed</AlertTitle>
          <AlertDescription>
            There was an issue fetching content from the AI. Using fallback questions for now.
          </AlertDescription>
        </Alert>
      );
    }
  } else {
    infoMessage = (
      <Alert className="mb-8 w-full">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Using Fallback Content</AlertTitle>
        <AlertDescription>
          <p>
            To generate unique questions with AI, please set your <code>GOOGLE_API_KEY</code> in the <code>.env</code> file.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            You can get a key from{' '}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold"
            >
              Google AI Studio
            </a>. After adding the key, please restart the server.
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-background text-foreground">
      <div className="w-full max-w-4xl flex flex-col items-center">
        {infoMessage}
        <TechMatchGame initialPairs={content.pairs} />
      </div>
    </main>
  );
}
