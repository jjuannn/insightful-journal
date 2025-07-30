import { Button } from "@/components/ui/button";
import { Book, PenTool } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
        </div>
      </div>
    </nav>
  );
};