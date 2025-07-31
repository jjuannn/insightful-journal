import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Send } from "lucide-react";
import { useGemini } from "@/hooks/use-gemini";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface JournalEntryProps {
  onEntrySubmitted: () => void;
}

interface JournalEntry {
  id: string;
  userInput: string;
  aiResponse: string;
  timestamp: string;
}

export const JournalEntry = ({ onEntrySubmitted }: JournalEntryProps) => {
  const [userInput, setUserInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { generateJournalAnswer } = useGemini();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!userInput.trim()) {
      toast({
        title: "Empty journal entry",
        description: "Please write something before reflecting with AI.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await generateJournalAnswer(userInput);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      setAiResponse(response);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Authentication Error",
          description: "Please log in to save your journal entry.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const { error } = await supabase.from("journal_entries").insert([
        {
          user_id: user.id,
          user_input: userInput.trim(),
          ai_response: response,
          timestamp: new Date().toISOString(),
        },
      ]);

      if (error) {
        throw error;
      }

      onEntrySubmitted();

      toast({
        title: "Reflection saved",
        description: "Your journal entry has been saved with AI insights.",
      });
      navigate("/my-journal");
    } catch (error) {
      console.error("Error saving journal entry:", error);
      toast({
        title: "Something went wrong",
        description: "Failed to save journal entry. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewEntry = () => {
    setUserInput("");
    setAiResponse("");
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50 shadow-gentle bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl font-semibold text-foreground">
            <Sparkles className="w-6 h-6 text-primary animate-pulse-soft" />
            How are you feeling today?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Write about your day, your feelings, or anything on your mind... This is your safe space to reflect."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="min-h-32 resize-none bg-input/50 border-border/50 focus:bg-background transition-all duration-300"
            disabled={isLoading}
          />
          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !userInput.trim()}
              variant="journal"
              size="lg"
              className="flex-1 animate-fade-in"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Reflecting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Reflect with AI
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
