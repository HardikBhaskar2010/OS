import { useAuth } from "@/contexts/AuthContext";
import FloatingHearts from "@/components/FloatingHearts";
import HeroSection from "@/components/HeroSection";
import DaysCounter from "@/components/DaysCounter";
import LoveLetters from "@/components/LoveLetters";
import PhotoGallery from "@/components/PhotoGallery";
import MoodSharing from "@/components/MoodSharing";
import DailyQuestion from "@/components/DailyQuestion";
import { Heart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();
  // Customize these values for your relationship!
  const anniversaryDate = new Date(2024, 4, 14); // May 14th (month is 0-indexed, so 4 = May)
  const relationshipStart = new Date(2024, 1, 14); // February 14, 2024
  const partnerNames: [string, string] = ["Hardik", "Saumya"];

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <FloatingHearts />
      
      <HeroSection />
      
      <main className="relative z-10 px-4 py-8 max-w-6xl mx-auto -mt-16">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Full width - Days Counter */}
          <motion.div 
            className="md:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DaysCounter 
              anniversaryDate={anniversaryDate} 
              partnerNames={partnerNames}
              relationshipStart={relationshipStart}
            />
          </motion.div>

          {/* User-specific Dashboard */}
          <motion.div 
            className="md:col-span-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {user?.role === 'boyfriend' ? (
              <div className="p-8 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl border border-primary/20 shadow-lg text-center">
                <h2 className="text-2xl font-bold text-primary mb-2">Welcome Back, Hardik! 💕</h2>
                <p className="text-muted-foreground">Ready to make Saumya's day special today?</p>
              </div>
            ) : (
              <div className="p-8 bg-gradient-to-br from-pink-500/20 to-pink-500/5 rounded-3xl border border-pink-500/20 shadow-lg text-center">
                <h2 className="text-2xl font-bold text-pink-500 mb-2">Welcome Back, Saumya! 🌸</h2>
                <p className="text-muted-foreground">See what Hardik has shared with you today.</p>
              </div>
            )}
          </motion.div>

          {/* Left Column */}
          <div className="space-y-6">
            <Link to="/letters" className="block hover-elevate active-elevate-2 transition-transform">
              <LoveLetters />
            </Link>
            <Link to="/questions" className="block hover-elevate active-elevate-2 transition-transform">
              <DailyQuestion />
            </Link>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Link to="/gallery" className="block hover-elevate active-elevate-2 transition-transform">
              <PhotoGallery />
            </Link>
            <Link to="/mood" className="block hover-elevate active-elevate-2 transition-transform">
              <MoodSharing />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <motion.footer 
          className="text-center py-10 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-card/80 backdrop-blur-sm border border-primary/20 shadow-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <p className="text-muted-foreground flex items-center gap-2">
              Made with <Heart className="w-4 h-4 text-primary fill-current animate-pulse-heart" /> for us
            </p>
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          
          <motion.p 
            className="text-xs text-muted-foreground/60 mt-4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            {partnerNames[0]} 💕 {partnerNames[1]} • Forever & Always
          </motion.p>
        </motion.footer>
      </main>
    </div>
  );
};

export default Index;
