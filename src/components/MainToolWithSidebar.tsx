import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DeveloperSidebar } from '@/components/DeveloperSidebar';
import { Zap, Code, FileText, X, Copy, CheckCircle2, Sparkles, Menu, PanelLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Suggestion {
  name: string;
  explanation: string;
  confidence: number;
}

interface ProfileUpdate {
  type: 'add_tech' | 'update_goal' | 'update_bio' | 'add_experience';
  data: any;
}

interface DeveloperProfile {
  developerName: string;
  bio: string;
  techStack: string[];
  goal: string;
  stylePreference: string;
}

interface MainToolProps {
  apiKey: string;
  profile: DeveloperProfile;
  onProfileUpdate: (profile: DeveloperProfile) => void;
  onLogout: () => void;
  onNewChat: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export function MainTool({ 
  apiKey, 
  profile, 
  onProfileUpdate, 
  onLogout, 
  onNewChat,
  theme,
  onThemeToggle 
}: MainToolProps) {
  const [input, setInput] = useState('');
  const [inputType, setInputType] = useState('function');
  const [namingStyle, setNamingStyle] = useState(profile.stylePreference);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [rejectedNames, setRejectedNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState('gemini-1.5-flash');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const { toast } = useToast();

  // Increased character limit to 20,000
  const maxChars = 20000;
  const charCount = input.length;
  const charCountColor = charCount > maxChars * 0.9 ? 'text-destructive' : 
                       charCount > maxChars * 0.7 ? 'text-warning' : 'text-muted-foreground';

  const inputTypes = [
    { value: 'function', label: 'Function Name', icon: Code },
    { value: 'class', label: 'Class Name', icon: FileText },
    { value: 'variable', label: 'Variable Name', icon: FileText },
    { value: 'endpoint', label: 'API Endpoint', icon: Code },
    { value: 'label', label: 'Label Name', icon: Sparkles }
  ];

  const namingStyles = [
    { value: 'camelCase', label: 'camelCase' },
    { value: 'snake_case', label: 'snake_case' },
    { value: 'PascalCase', label: 'PascalCase' },
    { value: 'kebab-case', label: 'kebab-case' },
    { value: 'SCREAMING_SNAKE_CASE', label: 'SCREAMING_SNAKE_CASE' }
  ];

  // Load chat history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('chat_history');
    if (savedHistory) {
      try {
        setChatHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }
  }, []);

  // Create developer context summary
  const getDeveloperContext = () => {
    return `
Developer Profile JSON:
${JSON.stringify(profile, null, 2)}

Developer Summary:
Name: ${profile.developerName}
Tech Stack: ${profile.techStack.join(', ')}
Goal: ${profile.goal}
Bio: ${profile.bio}
`;
  };

  // AI-powered developer profile analysis
  const analyzeAndUpdateProfile = async (userInput: string) => {
    try {
      const profileAnalysisPrompt = `
Current Developer Profile JSON:
${JSON.stringify(profile, null, 2)}

User Input: "${userInput}"

Based on the user input provided, is there any new or updated information that should be stored in the developer profile?

Analyze the input for:
- New technologies, frameworks, or tools mentioned
- Experience level changes
- New goals or interests
- Development preferences
- Industry focus or domain expertise

Return a JSON response in this exact format:
{
  "changesDetected": boolean,
  "updatedProfile": {
    "techStack": [...existing + new tech if any],
    "bio": "updated bio if relevant",
    "goal": "updated goal if mentioned",
    "experience": "updated experience if mentioned"
  }
}

Rules:
- Only include fields that need updating in updatedProfile
- If no changes detected, return changesDetected: false and empty updatedProfile: {}
- Preserve all existing profile data unless specifically updating
- Be conservative - only update if clearly mentioned in the input
      `;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: profileAnalysisPrompt }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 500,
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.candidates[0].content.parts[0].text;
        
        // Extract JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const analysisResult = JSON.parse(jsonMatch[0]);
            
            // Validate structure
            if (typeof analysisResult.changesDetected === 'boolean' && 
                typeof analysisResult.updatedProfile === 'object') {
              
              if (analysisResult.changesDetected && Object.keys(analysisResult.updatedProfile).length > 0) {
                const updatedProfile = { ...profile, ...analysisResult.updatedProfile };
                onProfileUpdate(updatedProfile);
                
                toast({
                  title: "Profile Updated! 🧠",
                  description: "I learned something new about you from our conversation.",
                });
              }
            }
          } catch (parseError) {
            console.error('Failed to parse profile analysis:', parseError);
          }
        }
      }
    } catch (error) {
      console.error('Profile analysis failed:', error);
      // Silently fail - don't disrupt the main flow
    }
  };

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
      // Analyze input for profile updates
      analyzeAndUpdateProfile(input);
      
      const developerContext = getDeveloperContext();
      
      const prompt = `
${developerContext}

You are an expert developer naming assistant with deep understanding of the developer's profile and preferences. 

Use the developer profile JSON above for HIGHLY PERSONALIZED naming suggestions based on their:
- Specific tech stack and frameworks
- Coding style preferences  
- Professional goals and focus areas
- Experience level and background

Generate 5 perfect ${inputType} names for the following:

Input Type: ${inputType}
User Input: ${input}

Context:
- Developer: ${profile.developerName}
- Tech Stack: ${profile.techStack.join(', ')}
- Naming Style: ${inputType === 'label' ? 'Human-readable labels (ignore case conventions)' : inputType === 'endpoint' ? 'RESTful/GraphQL conventions' : namingStyle}
- Type: ${inputType}
${rejectedNames.length > 0 ? `- Previously rejected names: ${rejectedNames.join(', ')}` : ''}

Requirements:
${inputType === 'label' ? `
1. Generate human-readable UI labels (ignore naming conventions)
2. Focus on clarity and user experience
3. Consider the developer's domain expertise
4. Make labels intuitive for end users
5. Align with modern UI/UX patterns
` : inputType === 'endpoint' ? `
1. Generate RESTful API endpoint paths (e.g., /api/users, /graphql)
2. Follow REST conventions and HTTP methods
3. Consider the tech stack context (${profile.techStack.join(', ')})
4. Make endpoints intuitive and resource-oriented
5. Align with modern API design patterns
6. Consider backend developer best practices
` : `
1. Names must follow ${namingStyle} convention strictly
2. Consider the tech stack context deeply (${profile.techStack.join(', ')})
3. Avoid previously rejected names completely
4. Make names descriptive but concise
5. Use patterns common in their tech stack
6. Align with developer's goals: ${profile.goal}
`}

Return a JSON array with exactly 5 objects, each with:
- "name": the suggested name
- "explanation": brief 1-line explanation tailored to their profile
- "confidence": number from 1-10 indicating how good this name is

Example format:
[
  {
    "name": "example_name",
    "explanation": "Perfect for React components, matches your style",
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
        
        // Save to chat history
        const newChatEntry = {
          input,
          inputType,
          namingStyle,
          suggestions: suggestionsData,
          rejectedNames: [...rejectedNames],
          timestamp: Date.now(),
          developerContext: getDeveloperContext()
        };
        
        const updatedHistory = [newChatEntry, ...chatHistory].slice(0, 50); // Keep last 50 entries
        setChatHistory(updatedHistory);
        localStorage.setItem('chat_history', JSON.stringify(updatedHistory));
        
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

  const handleNewChatClick = () => {
    setInput('');
    setSuggestions([]);
    setRejectedNames([]);
    onNewChat();
    toast({
      title: "New Chat Started",
      description: "Chat history cleared. Your profile is saved.",
    });
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <DeveloperSidebar
          profile={profile}
          onProfileUpdate={onProfileUpdate}
          onLogout={onLogout}
          onNewChat={handleNewChatClick}
          theme={theme}
          onThemeToggle={onThemeToggle}
        />

        <main className="flex-1 bg-background min-w-0 transition-all duration-300 ease-in-out">
          {/* Header with trigger - visible on all screen sizes */}
          <header className="sticky top-0 z-50 h-16 flex items-center justify-between px-4 sm:px-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-3 min-w-0">
              <SidebarTrigger className="h-10 w-10 p-0 border-2 border-primary/20 hover:bg-primary/10 hover:text-primary hover:border-primary/40 transition-all duration-200 shadow-sm hover:shadow-md flex-shrink-0 inline-flex items-center justify-center rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-background">
                <PanelLeft className="h-5 w-5" />
              </SidebarTrigger>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold font-mono truncate logo-text">
                  namely.ai
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Model: {currentModel}
                </p>
              </div>
            </div>
            
            <Button
              onClick={handleNewChatClick}
              variant="outline"
              size="sm"
              className="gap-2 flex-shrink-0"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">New Chat</span>
            </Button>
          </header>

          {/* Main Content */}
          <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6 overflow-x-hidden">
            {/* Input Section */}
            <Card className="glass-card border-card-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Generate Perfect Names
                </CardTitle>
                <CardDescription>
                  Paste your code snippet or describe what you're naming (up to 20,000 characters)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-x-hidden">
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
                    <Select 
                      value={namingStyle} 
                      onValueChange={setNamingStyle}
                      disabled={inputType === 'label' || inputType === 'endpoint'}
                    >
                      <SelectTrigger className={inputType === 'label' || inputType === 'endpoint' ? 'opacity-50' : ''}>
                        <SelectValue placeholder={inputType === 'label' ? 'Not applicable for labels' : inputType === 'endpoint' ? 'REST/GraphQL conventions' : 'Select style'} />
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
                      {inputType === 'label' ? 'Describe the UI element or feature' : 
                       inputType === 'function' ? 'Paste your function or describe its purpose' :
                       inputType === 'class' ? 'Paste your class or describe its purpose' :
                       inputType === 'endpoint' ? 'Describe the API endpoint functionality' :
                       'Paste your code or describe the variable'}
                    </label>
                    <span className={`text-xs ${charCountColor}`}>
                      {charCount.toLocaleString()}/{maxChars.toLocaleString()}
                    </span>
                  </div>
                  <Textarea
                    placeholder={
                      inputType === 'label' 
                        ? "A button that saves user preferences to the database"
                        : inputType === 'function'
                        ? "const getUserData = async (userId) => {\n  // Your function code here\n  // Supports up to 20,000 characters\n}"
                        : inputType === 'class'
                        ? "class UserManager {\n  // Your class code here\n  // Supports up to 20,000 characters\n}"
                        : inputType === 'endpoint'
                        ? "POST endpoint that creates a new user account with email validation and sends welcome email"
                        : "const userData = // describe your variable purpose"
                    }
                    value={input}
                    onChange={(e) => setInput(e.target.value.slice(0, maxChars))}
                    className="min-h-[200px] font-mono text-sm resize-none transition-smooth focus:ring-2 focus:ring-primary/20"
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
        </main>
      </div>
    </SidebarProvider>
  );
}
