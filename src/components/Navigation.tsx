import { Button } from "@/components/ui/button";
import { Book, PenTool, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="bg-card/50 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer animate-gentle-bounce" 
          onClick={() => navigate('/')}
        >
          <PenTool className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-semibold text-foreground">AI Journal Coach</h1>
        </div>
        
        <div className="flex gap-2">
          {user ? (
            <>
              <Button
                variant={location.pathname === '/' ? 'journal' : 'ghost'}
                onClick={() => navigate('/')}
                className="transition-all duration-300"
              >
                <PenTool className="w-4 h-4" />
                Journal
              </Button>
              <Button
                variant={location.pathname === '/my-journal' ? 'journal' : 'ghost'}
                onClick={() => navigate('/my-journal')}
                className="transition-all duration-300"
              >
                <Book className="w-4 h-4" />
                My Journal
              </Button>
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              variant="journal"
              onClick={() => navigate('/auth')}
              className="transition-all duration-300"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};