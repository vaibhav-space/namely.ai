import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Code, FileText, X, Copy, CheckCircle2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Suggestion {
  name: string;
  explanation: string;
  confidence: number;
}

interface ProfileData {
  name: string;
  stack: string;
  stylePreference: string;
}

interface MainToolProps {
  apiKey: string;
  profile: ProfileData;
}

export function MainTool({ apiKey, profile }: MainToolProps) {
  const [input, setInput] = useState('');
  const [inputType, setInputType] = useState('function');
  const [namingStyle, setNamingStyle] = useState(profile.stylePreference);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [rejectedNames, setRejectedNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState('gemini-1.5-flash');
  const { toast } = useToast();

  const maxChars = inputType === 'code' ? 2000 : 500;
  const charCount = input.length;
  const charCountColor = charCount > maxChars * 0.9 ? 'text-destructive' : 
                       charCount > maxChars * 0.7 ? 'text-warning' : 'text-muted-foreground';

  const inputTypes = [
    { value: 'function', label: 'Function', icon: Code },
    { value: 'variable', label: 'Variable', icon: FileText },
    { value: 'class', label: 'Class', icon: FileText },
    { value: 'endpoint', label: 'API Endpoint', icon: Code },
    { value: 'description', label: 'Description', icon: Sparkles }
  ];

  const namingStyles = [
    { value: 'camelCase', label: 'camelCase' },
    { value: 'snake_case', label: 'snake_case' },
    { value: 'PascalCase', label: 'PascalCase' },
    { value: 'kebab-case', label: 'kebab-case' },
    { value: 'SCREAMING_SNAKE_CASE', label: 'SCREAMING_SNAKE_CASE' }
  ];

  const generateNames = async () => {
    if (!input.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some code or description to generate names.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const prompt = `
You are an expert developer naming assistant. Generate 5 perfect ${inputType} names for the following ${inputType === 'code' ? 'code snippet' : 'description'}:

Input: ${input}

Context:
- Developer: ${profile.name}
- Tech Stack: ${profile.stack}
- Naming Style: ${namingStyle}
- Type: ${inputType}
${rejectedNames.length > 0 ? `- Previously rejected names: ${rejectedNames.join(', ')}` : ''}

Requirements:
1. Names must follow ${namingStyle} convention
2. Consider the tech stack context (${profile.stack})
3. Avoid previously rejected names
4. Make names descriptive but concise
5. Consider common patterns in ${profile.stack}

Return a JSON array with exactly 5 objects, each with:
- "name": the suggested name
- "explanation": brief 1-line explanation of why this name fits
- "confidence": number from 1-10 indicating how good this name is

Example format:
[
  {
    "name": "example_name",
    "explanation": "Clear and follows convention",
    "confidence": 9
  }
]
`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate names');
      }

      const data = await response.json();
      const content = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const suggestionsData = JSON.parse(jsonMatch[0]);
        setSuggestions(suggestionsData);
        
        // Save session to localStorage
        const sessionData = {
          input,
          inputType,
          namingStyle,
          suggestions: suggestionsData,
          rejectedNames,
          timestamp: Date.now()
        };
        
        const sessions = JSON.parse(localStorage.getItem('namely_sessions') || '[]');
        sessions.unshift(sessionData);
        localStorage.setItem('namely_sessions', JSON.stringify(sessions.slice(0, 20))); // Keep last 20 sessions
        
        toast({
          title: "Names Generated! ✨",
          description: `${suggestionsData.length} perfect suggestions ready for you.`,
        });
      }
    } catch (error) {
      console.error('Error generating names:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate names. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const rejectName = (nameToReject: string) => {
    setRejectedNames(prev => [...prev, nameToReject]);
    setSuggestions(prev => prev.filter(s => s.name !== nameToReject));
    
    toast({
      title: "Name Rejected",
      description: "We'll avoid similar suggestions in the future.",
    });
  };

  const copyToClipboard = (name: string) => {
    navigator.clipboard.writeText(name);
    toast({
      title: "Copied! 📋",
      description: `"${name}" copied to clipboard.`,
    });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold font-mono logo-text">
            namely.ai
          </h1>
          <p className="text-muted-foreground">
            Lightning-fast AI naming assistant • Model: {currentModel}
          </p>
        </div>

        {/* Input Section */}
        <Card className="glass-card border-card-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Generate Perfect Names
            </CardTitle>
            <CardDescription>
              Paste your code snippet or describe what you're naming
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={inputType} onValueChange={setInputType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {inputTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Style</label>
                <Select value={namingStyle} onValueChange={setNamingStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {namingStyles.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">
                  {inputType === 'endpoint' ? 'Describe the API endpoint functionality' : inputType === 'code' ? 'Paste your code' : 'Describe what you need to name'}
                </label>
                <span className={`text-xs ${charCountColor}`}>
                  {charCount}/{maxChars}
                </span>
              </div>
              <Textarea
                placeholder={inputType === 'code' 
                  ? "const getUserData = async (userId) => {\n  // Your code here\n}"
                  : inputType === 'endpoint'
                  ? "POST endpoint that creates a new user account with email validation"
                  : "A function that validates user email addresses"
                }
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, maxChars))}
                className="min-h-[120px] font-mono text-sm resize-none transition-smooth focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <Button 
              onClick={generateNames}
              disabled={isLoading || !input.trim()}
              className="w-full"
              variant="gradient"
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                  Generating awesome names...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Names
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <Card className="glass-card border-card-border">
            <CardHeader>
              <CardTitle>✨ Perfect Suggestions</CardTitle>
              <CardDescription>
                Click to copy, or reject names to improve future suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {suggestions.map((suggestion, index) => (
                  <div 
                    key={suggestion.name}
                    className="group flex items-center justify-between p-4 rounded-lg glass-card hover:bg-card/50 transition-smooth animate-stagger-fade"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-3">
                        <code className="text-lg font-mono font-semibold text-primary">
                          {suggestion.name}
                        </code>
                        <Badge variant="secondary" className="text-xs">
                          {suggestion.confidence}/10
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {suggestion.explanation}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-smooth">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(suggestion.name)}
                        className="hover:bg-success/10 hover:text-success"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => rejectName(suggestion.name)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rejected Names */}
        {rejectedNames.length > 0 && (
          <Card className="glass-card border-card-border">
            <CardHeader>
              <CardTitle className="text-sm">Rejected Names</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {rejectedNames.map((name) => (
                  <Badge key={name} variant="outline" className="text-xs opacity-60">
                    {name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
