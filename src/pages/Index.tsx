import { useState, useEffect } from 'react';
import { ApiKeySetup } from '@/components/ApiKeySetup';
import { ProfileSetup } from '@/components/ProfileSetup';
import { MainTool } from '@/components/MainToolWithSidebar';
import { LandingPage } from '@/components/LandingPage';
import { useTheme } from '@/hooks/useTheme';
// import heroImage from '@/assets/hero-image.jpg';

interface DeveloperProfile {
  developerName: string;
  bio: string;
  techStack: string[];
  goal: string;
  stylePreference: string;
}

const Index = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isValidated, setIsValidated] = useState(false);
  const [profile, setProfile] = useState<DeveloperProfile | null>(null);
  const [showHero, setShowHero] = useState(true);
  const [showLanding, setShowLanding] = useState(true);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // Check for existing data in localStorage
    const savedApiKey = localStorage.getItem('namely_api_key');
    const savedProfile = localStorage.getItem('developer_profile');
    
    if (savedApiKey && savedProfile) {
      setApiKey(savedApiKey);
      setIsValidated(true);
      setShowLanding(false);
      
      try {
        const parsed = JSON.parse(savedProfile);
        // Convert old profile format to new format if needed
        if (parsed.name && !parsed.developerName) {
          const converted: DeveloperProfile = {
            developerName: parsed.name,
            bio: '',
            techStack: parsed.stack ? parsed.stack.split(',').map((s: string) => s.trim()) : [],
            goal: '',
            stylePreference: parsed.stylePreference || 'camelCase'
          };
          setProfile(converted);
          localStorage.setItem('developer_profile', JSON.stringify(converted));
        } else {
          setProfile(parsed);
        }
      } catch (error) {
        console.error('Error parsing profile:', error);
      }
    }

    // Hide hero after a few seconds if showing
    const timer = setTimeout(() => setShowHero(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleApiKeyValidated = (validatedKey: string) => {
    setApiKey(validatedKey);
    setIsValidated(true);
  };

  const handleProfileComplete = (profileData: DeveloperProfile) => {
    setProfile(profileData);
  };

  const handleProfileUpdate = (updatedProfile: DeveloperProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem('developer_profile', JSON.stringify(updatedProfile));
  };

  const handleLogout = () => {
    localStorage.removeItem('namely_api_key');
    localStorage.removeItem('developer_profile');
    localStorage.removeItem('chat_history');
    setApiKey('');
    setIsValidated(false);
    setProfile(null);
    setShowLanding(true);
  };

  const handleGetStarted = () => {
    setShowLanding(false);
    setShowHero(false);
  };

  const handleNewChat = () => {
    localStorage.removeItem('chat_history');
    // Keep profile and API key, just clear chat history
  };

  // Show landing page for new users
  if (showLanding && !isValidated) {
    return (
      <LandingPage 
        onGetStarted={handleGetStarted}
        theme={theme}
        onThemeToggle={toggleTheme}
      />
    );
  }

  // Show hero screen for returning users
  if (showHero && isValidated && profile) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          // style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 gradient-hero" />
        
        <div className="relative z-10 text-center space-y-6 animate-slide-up">
          <div className="space-y-2">
            <h1 className="text-6xl md:text-8xl font-bold font-mono logo-text">
              namely.ai
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 font-mono">
              Welcome back, {profile.developerName}!
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="animate-pulse">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce mx-1" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show API key setup if not validated
  if (!isValidated) {
    return <ApiKeySetup onValidated={handleApiKeyValidated} existingKey={apiKey} />;
  }

  // Show profile setup if not completed
  if (!profile) {
    return <ProfileSetup onComplete={handleProfileComplete} />;
  }

  // Show main tool
  return (
    <MainTool 
      apiKey={apiKey} 
      profile={profile} 
      onProfileUpdate={handleProfileUpdate}
      onLogout={handleLogout}
      onNewChat={handleNewChat}
      theme={theme}
      onThemeToggle={toggleTheme}
    />
  );
};

export default Index;
