import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code2, Shield, Brain, Zap, ArrowRight, Heart, Coffee, Github, Twitter, MessageSquare, FileText, Terminal, Smile, AlertTriangle } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export function LandingPage({ onGetStarted, theme, onThemeToggle }: LandingPageProps) {
  const features = [
    {
      icon: Brain,
      title: "Auto-magical Naming",
      description: "For your ugly functions, variables, classes, API endpoints, and UI labels. We understand even your worst 2 AM spaghetti."
    },
    {
      icon: Shield,
      title: "Zero BS Privacy",
      description: "Your code ≠ Our business. Nothing stored, no cloud, no creepy logs. Just you, your browser, and local storage."
    },
    {
      icon: Zap,
      title: "Zero Setup",
      description: "No signup, no limits, no waiting. Just paste your code and get better names instantly."
    },
    {
      icon: Terminal,
      title: "Backend-Friendly",
      description: "Perfect for frontend devs and backend developers alike. API endpoints, database schemas, you name it."
    }
  ];

  const testimonials = [
    {
      text: "Renamed 482 variables. Lost 2 days of sleep. Worth it.",
      author: "Senior Dev Who Cares Too Much"
    },
    {
      text: "Felt like pair programming with a naming god.",
      author: "Junior Dev (No Longer Junior)"
    },
    {
      text: "namely.ai made my code so readable, I cried. My therapist is impressed.",
      author: "Emotional Coder"
    }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Paste Your Tragic Code",
      description: "Or just explain what it does in plain English. We've seen worse, promise.",
      icon: Code2
    },
    {
      step: "02", 
      title: "namely.ai Works Its Magic",
      description: "Our AI renames everything like a sarcastic senior dev with good taste.",
      icon: Brain
    },
    {
      step: "03",
      title: "Save It Like a Pro",
      description: "Everything stays in your browser's local storage. Romantic, right?",
      icon: Heart
    },
    {
      step: "04",
      title: "Enjoy Naming Clarity",
      description: "Finally. Your future self will thank you instead of cursing your name.",
      icon: Smile
    }
  ];

  return (
    <div className="min-h-screen bg-background font-mono">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold font-mono tracking-tight logo-text">
              namely.ai
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onThemeToggle}
              className="h-9 w-9 p-0"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </Button>
            <Button onClick={onGetStarted} className="gap-2">
              Try namely.ai
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 gradient-hero opacity-20" />
        
        <div className="container relative z-10">
          <div className="mx-auto max-w-5xl text-center space-y-8">
            <Badge variant="secondary" className="text-sm px-4 py-2 font-mono">
              🤡 For anyone who's ever written foo_bar2_copy()
            </Badge>
            
            <h1 className="text-4xl font-bold leading-tight sm:text-6xl md:text-7xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Stop naming things like
              <span className="block font-mono text-destructive">`doStuff()`</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              namely.ai gives your variables, functions, classes, and API endpoints names your future self won't curse you for.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button onClick={onGetStarted} size="lg" className="gap-2 font-mono w-full sm:w-auto text-sm px-4 py-3 sm:text-lg sm:px-8 sm:py-6">
                <Terminal className="h-4 w-4 sm:h-5 sm:w-5" />
                Try namely.ai – It's Free & Local
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-green-500" />
                No account • No limits • No BS
              </div>
            </div>
            
            {/* Code example */}
            <div className="mt-12 max-w-2xl mx-auto">
              <div className="bg-muted/50 border rounded-lg p-4 sm:p-6 text-left font-mono text-xs sm:text-sm overflow-x-auto no-scrollbar whitespace-pre-wrap sm:whitespace-pre break-words">
                <div className="text-destructive mb-2">// Before namely.ai 😭</div>
                <div className="text-mono text-muted-foreground mb-2">const userThing = () =&gt; {'{'} /* mystery function */ {'}'}</div>
                <div className="text-green-500 mb-2">// After namely.ai 😎</div>
                <div className="text-foreground">function calculateUserEngagementScore(analytics) {'{'} ... {'}'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What It Does Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What namely.ai Actually Does</h2>
            <p className="text-lg text-muted-foreground font-mono">
              For anyone who's ever written `final_final_v3_last_thisOne.js` and regretted everything.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.slice(0, 3).map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="glass-card hover:shadow-lg transition-all duration-300 group border-l-4 border-l-primary/50 h-full">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors w-fit">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg font-mono">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <CardDescription className="text-center leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works (Dev-Relatable Flow)</h2>
            <p className="text-lg text-muted-foreground">
              Four simple steps to naming nirvana. We've kept it simple because we're not animals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                    <span className="text-lg font-bold text-primary font-mono">{step.step}</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                  <div className="mx-auto w-fit p-2 rounded-lg bg-muted/50">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Privacy Promise Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <Card className="glass-card border-green-500/20 bg-green-500/5">
              <CardHeader className="text-center">
                <div className="mx-auto p-4 rounded-2xl bg-green-500/10 w-fit mb-4">
                  <Shield className="h-12 w-12 text-green-500" />
                </div>
                <CardTitle className="text-2xl font-mono">🔒 Your Code ≠ Our Business</CardTitle>
                <CardDescription className="text-lg">
                  namely.ai stores NOTHING. Nada. Zero. Zilch. No cloud, no creepy logs, no spying AI.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <p className="text-lg leading-relaxed">
                    Just you, your browser, and local storage. <span className="font-mono text-pink-500">Romantic, right?</span>
                  </p>
                  
                  <div className="bg-muted rounded-lg p-6 font-mono text-sm border border-border">
                    <div className="text-green-500 mb-2">// Privacy Promise</div>
                    <div className="space-y-1">
                      <div>const namelyStorage = localStorage; <span className="text-muted-foreground">// Only here</span></div>
                      <div>const cloudStorage = null; <span className="text-muted-foreground">// Never here</span></div>
                      <div>const yourData = "stays.with.you"; <span className="text-muted-foreground">// Always</span></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Devs Are Saying</h2>
            <p className="text-lg text-muted-foreground font-mono">
              (These are totally real and not made up at all)
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass-card">
                <CardContent className="p-6 space-y-4">
                  <div className="text-4xl">💬</div>
                  <p className="italic text-foreground">"{testimonial.text}"</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    — {testimonial.author}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold font-mono">Use namely.ai Now</h2>
              <h3 className="text-2xl text-primary">Rename Your Shame</h3>
              <p className="text-lg text-muted-foreground">
                No account. No limits. Just great names. 
                <span className="block font-mono text-sm mt-2">Because naming things is hard.</span>
              </p>
            </div>
            
            <Button onClick={onGetStarted} size="lg" className="gap-2 text-sm px-6 py-4 sm:text-xl sm:px-12 sm:py-8 font-mono">
              <Coffee className="h-5 w-5 sm:h-6 sm:w-6" />
              Start Naming Better
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
            
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                No signup required
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                Stays on your machine
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-500" />
                Works in 3 seconds
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-3">
                <span className="font-bold text-xl font-mono tracking-tight logo-text">namely.ai</span>
                <Badge variant="outline" className="text-xs font-mono">v1.0</Badge>
              </div>
              
              <div className="flex items-center gap-4 flex-wrap justify-center md:justify-end">
                <Button variant="ghost" size="sm" className="gap-2" asChild>
                  <a href="https://github.com/vaibhav-space/namely.ai" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository">
                    <Github className="h-5 w-5" />
                    <span className="hidden sm:inline">Open Source</span>
                  </a>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2" asChild>
                  <a href="https://github.com/vaibhav-space" target="_blank" rel="noopener noreferrer" aria-label="Author GitHub">
                    <Github className="h-5 w-5" />
                    <span className="hidden sm:inline">@vaibhav-space</span>
                  </a>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2" asChild>
                  <a href="https://www.linkedin.com/in/vaibhav-space" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    <span className="hidden sm:inline">LinkedIn</span>
                  </a>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2" asChild>
                  <a href="https://x.com/vaibhavspace_" aria-label="Twitter/X">
                    <Twitter className="h-5 w-5" />
                    <span className="hidden sm:inline">Twitter/X</span>
                  </a>
                </Button>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-border text-center">
              <p className="text-muted-foreground font-mono">
                "namely.ai – Because naming things is hard."
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Built with <Heart className="h-4 w-4 inline text-red-500" /> by <a href="https://github.com/vaibhav-space" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@vaibhav-space</a>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Clone: <code className="bg-muted px-2 py-1 rounded text-xs font-mono">git@github.com:vaibhav-space/namely.ai.git</code>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
