import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Key, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiKeySetupProps {
  onValidated: (apiKey: string) => void;
  existingKey?: string;
}

export function ApiKeySetup({ onValidated, existingKey }: ApiKeySetupProps) {
  const [apiKey, setApiKey] = useState(existingKey || '');
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const { toast } = useToast();

  const validateApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    
    try {
      // Test the API key with a simple request
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: 'Test' }]
          }]
        })
      });

      if (response.ok) {
        setIsValid(true);
        localStorage.setItem('namely_api_key', apiKey);
        toast({
          title: "API Key Validated! ✨",
          description: "Your Gemini API key is working perfectly.",
          variant: "default",
        });
        setTimeout(() => onValidated(apiKey), 1000);
      } else {
        throw new Error('Invalid API key');
      }
    } catch (error) {
      toast({
        title: "Validation Failed",
        description: "Invalid API key. Please check and try again.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 rounded-full glass-card">
              <Key className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome to namely.ai
          </h1>
          <p className="text-muted-foreground">
            Let's get you set up with your Gemini API key
          </p>
        </div>

        <Card className="glass-card border-card-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Key Setup
            </CardTitle>
            <CardDescription>
              Enter your Google Gemini API key to start generating perfect function names. <br />
              <span className="text-xs text-muted-foreground mt-1 block">
                We use Google's Gemini API because it's completely FREE with generous usage limits (15 requests/min, 1500 requests/day). <br />
                All thanks to Google for providing this amazing free tier! 🙏
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter your Gemini API key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && validateApiKey()}
                className="transition-smooth focus:ring-2 focus:ring-primary/20"
              />
              {isValid && (
                <div className="flex items-center gap-2 text-success text-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  API key validated successfully!
                </div>
              )}
            </div>

            <Button 
              onClick={validateApiKey} 
              disabled={isValidating || !apiKey.trim()}
              className="w-full"
              variant="gradient"
              size="lg"
            >
              {isValidating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Validating...
                </>
              ) : (
                'Validate & Continue'
              )}
            </Button>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Don't have an API key?{' '}
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Get your FREE key here
                </a>{' '}
                (takes 30 seconds, no credit card required)
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-start gap-3 p-4 rounded-lg glass-card">
          <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Your API key is secure</p>
            <p>It's stored locally in your browser and never sent to our servers.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
