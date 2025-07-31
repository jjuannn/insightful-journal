import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Book, Calendar, Sparkles, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Session, User } from "@supabase/supabase-js";

interface JournalEntry {
  id: string;
  user_id: string;
  user_input: string;
  ai_response: string;
  timestamp: string;
}

export default function MyJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN") {
        setSession(session);
        setUser(session?.user ?? null);
        return;
      }

      return;
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadEntries();
    } else {
      setEntries([]);
      setIsLoading(false);
    }
  }, [user]);

  const loadEntries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("id, user_input, ai_response, timestamp, user_id")
        .eq("user_id", user?.id)
        .order("timestamp", { ascending: false });

      if (error) {
        throw error;
      }
      setEntries(data as JournalEntry[]);
    } catch (error) {
      console.error("Error loading journal entries:", error);
      toast({
        title: "Error loading entries",
        description: "Failed to load your journal entries. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from("journal_entries")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      setEntries(entries.filter((entry) => entry.id !== id));

      toast({
        title: "Entry deleted",
        description: "Your journal entry has been removed.",
      });
    } catch (error) {
      console.error("Error deleting journal entry:", error);
      toast({
        title: "Error deleting entry",
        description: "Failed to delete your journal entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-journal-bg">
        <Navigation />

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center animate-fade-in">
            <Book className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Sign in to view your journal
            </h3>
            <p className="text-muted-foreground mb-6">
              Please sign in to access your personal journal entries.
            </p>
            <Button
              variant="journal"
              onClick={() => navigate("/auth")}
              className="animate-gentle-bounce"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-journal-bg">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Book className="w-8 h-8 text-primary animate-gentle-bounce" />
            <h1 className="text-3xl font-bold text-foreground">My Journal</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Your mindful reflections and AI insights
          </p>
        </div>
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Loading your journal entries...
            </p>
          </div>
        ) : entries.length === 0 ? (
          <Card className="text-center py-12 border-border/50 shadow-gentle bg-card/50 backdrop-blur-sm animate-fade-in">
            <CardContent>
              <Book className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No entries yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Start your mindful journaling journey by writing your first
                entry.
              </p>
              <Button
                variant="journal"
                onClick={() => (window.location.href = "/")}
                className="animate-gentle-bounce"
              >
                Write First Entry
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {entries.map((entry, index) => (
              <Card
                key={entry.id}
                className="border-border/50 shadow-gentle bg-card/50 backdrop-blur-sm animate-fade-in hover:shadow-soft-glow transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg font-medium text-foreground">
                        {formatDate(entry.timestamp)}
                      </CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteEntry(entry.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      📝 Your Reflection
                    </h4>
                    <p className="text-foreground/80 leading-relaxed bg-muted/30 p-4 rounded-md">
                      {entry.user_input}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-accent-foreground flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      AI Insight
                    </h4>
                    <p className="text-accent-foreground/80 leading-relaxed bg-accent/20 p-4 rounded-md">
                      {entry.ai_response}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
