import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { JournalEntry } from "@/components/JournalEntry";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, PenTool, Sparkles, Brain } from "lucide-react";

const Index = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEntrySubmitted = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-journal-bg">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart className="w-10 h-10 text-primary animate-gentle-bounce" />
            <h1 className="text-4xl font-bold text-foreground">AI Journal Coach</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your personal space for mindful reflection. Write about your day, your feelings, 
            and receive gentle AI-guided insights to support your emotional well-being.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center p-6 border-border/50 shadow-gentle bg-card/50 backdrop-blur-sm hover:shadow-soft-glow transition-all duration-300 animate-fade-in">
            <CardContent className="pt-4">
              <PenTool className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Mindful Writing</h3>
              <p className="text-muted-foreground text-sm">
                Express your thoughts and feelings in a safe, judgment-free space
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 border-border/50 shadow-gentle bg-card/50 backdrop-blur-sm hover:shadow-soft-glow transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardContent className="pt-4">
              <Brain className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">AI Insights</h3>
              <p className="text-muted-foreground text-sm">
                Receive thoughtful, encouraging reflections on your entries
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 border-border/50 shadow-gentle bg-card/50 backdrop-blur-sm hover:shadow-soft-glow transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="pt-4">
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Personal Growth</h3>
              <p className="text-muted-foreground text-sm">
                Track your emotional journey and celebrate your progress
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Journal Entry Component */}
        <JournalEntry key={refreshKey} onEntrySubmitted={handleEntrySubmitted} />
      </div>
    </div>
  );
};

export default Index;
