import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  useSidebar
} from '@/components/ui/sidebar';
import { User, Code, Target, LogOut, Edit2, Save, X, Plus, Sun, Moon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DeveloperProfile {
  developerName: string;
  bio: string;
  techStack: string[];
  goal: string;
  experience?: string;
  location?: string;
}

interface DeveloperSidebarProps {
  profile: DeveloperProfile;
  onProfileUpdate: (profile: DeveloperProfile) => void;
  onLogout: () => void;
  onNewChat: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export function DeveloperSidebar({ 
  profile, 
  onProfileUpdate, 
  onLogout, 
  onNewChat,
  theme,
  onThemeToggle 
}: DeveloperSidebarProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editProfile, setEditProfile] = useState<DeveloperProfile>(profile);
  const [newTech, setNewTech] = useState('');
  const { toast } = useToast();
  const { open } = useSidebar();

  useEffect(() => {
    setEditProfile(profile);
  }, [profile]);

  const handleSave = () => {
    if (!editProfile.developerName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your developer name.",
        variant: "destructive",
      });
      return;
    }

    onProfileUpdate(editProfile);
    setIsEditing(false);
    toast({
      title: "Profile Updated! ✨",
      description: "Your developer profile has been saved.",
    });
  };

  const handleCancel = () => {
    setEditProfile(profile);
    setIsEditing(false);
    setNewTech('');
  };

  const addTechStack = () => {
    if (newTech.trim() && !editProfile.techStack.includes(newTech.trim())) {
      setEditProfile(prev => ({
        ...prev,
        techStack: [...prev.techStack, newTech.trim()]
      }));
      setNewTech('');
    }
  };

  const removeTechStack = (tech: string) => {
    setEditProfile(prev => ({
      ...prev,
      techStack: prev.techStack.filter(t => t !== tech)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTechStack();
    }
  };

  return (
    <Sidebar className="border-r border-sidebar-border" collapsible="icon">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-2 rounded-lg bg-sidebar-accent flex-shrink-0">
              <User className="h-4 w-4 text-sidebar-primary" />
            </div>
            {open && (
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-sidebar-foreground truncate">Developer Profile</h2>
                <p className="text-xs text-sidebar-foreground/70 truncate">Personalize your AI experience</p>
              </div>
            )}
          </div>
          {open && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onThemeToggle}
              className="h-8 w-8 p-0 flex-shrink-0"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4 space-y-6">
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {open && "Basic Info"}
            </div>
            {!isEditing && open && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-6 px-2"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            )}
          </SidebarGroupLabel>
          
          {open && (
            <SidebarGroupContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-sidebar-foreground">Name</label>
                    <Input
                      value={editProfile.developerName}
                      onChange={(e) => setEditProfile(prev => ({ ...prev, developerName: e.target.value }))}
                      placeholder="Your name"
                      className="h-8"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-sidebar-foreground">Bio</label>
                    <Textarea
                      value={editProfile.bio}
                      onChange={(e) => setEditProfile(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself..."
                      className="min-h-[60px] text-xs resize-none"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="font-medium text-sidebar-foreground">{profile.developerName}</h3>
                    <p className="text-xs text-sidebar-foreground/70 mt-1 leading-relaxed">
                      {profile.bio || "No bio provided"}
                    </p>
                  </div>
                </>
              )}
            </SidebarGroupContent>
          )}
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            {open && "Tech Stack"}
          </SidebarGroupLabel>
          
          {open && (
            <SidebarGroupContent className="space-y-3">
              {isEditing && (
                <div className="flex gap-1">
                  <Input
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add technology"
                    className="h-7 text-xs"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={addTechStack}
                    className="h-7 w-7 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              )}
              
              <div className="flex flex-wrap gap-1">
                {editProfile.techStack.map((tech) => (
                  <Badge 
                    key={tech} 
                    variant="secondary" 
                    className="text-xs py-0.5 px-2 relative group"
                  >
                    {tech}
                    {isEditing && (
                      <button
                        onClick={() => removeTechStack(tech)}
                        className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-2 w-2" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            </SidebarGroupContent>
          )}
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            {open && "Goals"}
          </SidebarGroupLabel>
          
          {open && (
            <SidebarGroupContent>
              {isEditing ? (
                <Textarea
                  value={editProfile.goal}
                  onChange={(e) => setEditProfile(prev => ({ ...prev, goal: e.target.value }))}
                  placeholder="What are your development goals?"
                  className="min-h-[60px] text-xs resize-none"
                />
              ) : (
                <p className="text-xs text-sidebar-foreground/70 leading-relaxed">
                  {profile.goal || "No goals set"}
                </p>
              )}
            </SidebarGroupContent>
          )}
        </SidebarGroup>

        {isEditing && open && (
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              size="sm"
              className="flex-1"
            >
              <Save className="h-3 w-3 mr-1" />
              Save
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <div className={`${open ? 'space-y-2' : 'flex flex-col items-center space-y-2'}`}>
          {open ? (
            <>
              <Button
                onClick={onNewChat}
                variant="outline"
                className="w-full justify-start"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
              
              <Button
                onClick={onLogout}
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                size="sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={onNewChat}
                variant="outline"
                className="w-8 h-8 p-0 flex items-center justify-center"
                size="sm"
                title="New Chat"
              >
                <Plus className="h-3 w-3" />
              </Button>
              
              <Button
                onClick={onLogout}
                variant="ghost"
                className="w-8 h-8 p-0 flex items-center justify-center text-destructive hover:text-destructive hover:bg-destructive/10"
                size="sm"
                title="Logout"
              >
                <LogOut className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
