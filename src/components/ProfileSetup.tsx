import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Code, Palette } from 'lucide-react';

interface ProfileData {
  name: string;
  stack: string;
  stylePreference: string;
}

interface DeveloperProfile {
  developerName: string;
  bio: string;
  techStack: string[];
  goal: string;
  stylePreference: string;
}

interface ProfileSetupProps {
  onComplete: (profile: DeveloperProfile) => void;
  existingProfile?: DeveloperProfile;
}

export function ProfileSetup({ onComplete, existingProfile }: ProfileSetupProps) {
  const [profile, setProfile] = useState<DeveloperProfile>(
    existingProfile || {
      developerName: '',
      bio: '',
      techStack: [],
      goal: '',
      stylePreference: 'camelCase'
    }
  );

  const handleSubmit = () => {
    if (!profile.developerName.trim()) return;
    
    localStorage.setItem('developer_profile', JSON.stringify(profile));
    onComplete(profile);
  };

  const namingStyles = [
    { value: 'camelCase', label: 'camelCase (e.g., getUserData)' },
    { value: 'snake_case', label: 'snake_case (e.g., get_user_data)' },
    { value: 'PascalCase', label: 'PascalCase (e.g., GetUserData)' },
    { value: 'kebab-case', label: 'kebab-case (e.g., get-user-data)' },
    { value: 'SCREAMING_SNAKE_CASE', label: 'SCREAMING_SNAKE_CASE (e.g., GET_USER_DATA)' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 rounded-full glass-card">
              <User className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Set Up Your Profile
          </h1>
          <p className="text-muted-foreground">
            Help us generate better suggestions tailored to you
          </p>
        </div>

        <Card className="glass-card border-card-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Developer Profile
            </CardTitle>
            <CardDescription>
              Tell us about your coding style and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Name</label>
              <Input
                placeholder="e.g., Alex Smith"
                value={profile.developerName}
                onChange={(e) => setProfile(prev => ({ ...prev, developerName: e.target.value }))}
                className="transition-smooth focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <Textarea
                placeholder="Tell us about yourself as a developer..."
                value={profile.bio}
                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                className="min-h-[80px] transition-smooth focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tech Stack</label>
              <Input
                placeholder="e.g., React, TypeScript, Node.js (comma-separated)"
                defaultValue={profile.techStack.join(', ')}
                onChange={(e) => {
                  // Allow user to type freely, split on save
                  const value = e.target.value;
                  // Split by comma and/or space, clean up
                  const techs = value.split(/[,\s]+/).filter(Boolean).map(s => s.trim());
                  setProfile(prev => ({ 
                    ...prev, 
                    techStack: techs
                  }));
                }}
                className="transition-smooth focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-xs text-muted-foreground">
                Enter technologies separated by commas or spaces
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Goals</label>
              <Textarea
                placeholder="What are your development goals?"
                value={profile.goal}
                onChange={(e) => setProfile(prev => ({ ...prev, goal: e.target.value }))}
                className="min-h-[60px] transition-smooth focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Preferred Naming Style
              </label>
              <Select
                value={profile.stylePreference}
                onValueChange={(value) => setProfile(prev => ({ ...prev, stylePreference: value }))}
              >
                <SelectTrigger className="transition-smooth focus:ring-2 focus:ring-primary/20">
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

            <Button 
              onClick={handleSubmit}
              disabled={!profile.developerName.trim()}
              className="w-full"
              size="lg"
            >
              Continue to namely.ai
            </Button>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                You can update these preferences anytime in settings
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
