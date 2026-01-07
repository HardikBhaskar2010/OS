import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smile, Heart, Sun, Moon, Sparkles, Coffee, Cloud, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const moods = [
  { emoji: "😍", label: "In Love", color: "from-pink-500/20 to-rose-500/20", borderColor: "border-pink-400" },
  { emoji: "😊", label: "Happy", color: "from-yellow-500/20 to-amber-500/20", borderColor: "border-yellow-400" },
  { emoji: "🥰", label: "Grateful", color: "from-purple-500/20 to-violet-500/20", borderColor: "border-purple-400" },
  { emoji: "😴", label: "Sleepy", color: "from-indigo-500/20 to-blue-500/20", borderColor: "border-indigo-400" },
  { emoji: "☕", label: "Missing You", color: "from-amber-600/20 to-orange-500/20", borderColor: "border-amber-500" },
  { emoji: "🤗", label: "Thinking of You", color: "from-sky-500/20 to-cyan-500/20", borderColor: "border-sky-400" },
];

const MoodSharing = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(2);
  const [partnerMood] = useState(0);
  const [justUpdated, setJustUpdated] = useState(false);

  const handleMoodSelect = (index: number) => {
    setSelectedMood(index);
    setJustUpdated(true);
    setTimeout(() => setJustUpdated(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Card className="bg-card/90 backdrop-blur-md border-primary/20 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <div className="p-2 rounded-lg bg-primary/10">
              <Smile className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span>Mood Sharing</span>
              <p className="text-xs font-normal text-muted-foreground mt-0.5">
                How are you feeling today?
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-5">
          {/* Mood Selection Grid */}
          <div className="grid grid-cols-3 gap-2">
            {moods.map((mood, index) => (
              <motion.div 
                key={mood.label} 
                whileHover={{ scale: 1.05, y: -2 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  className={`w-full h-auto flex-col py-4 relative overflow-hidden rounded-xl transition-all duration-300 ${
                    selectedMood === index
                      ? `bg-gradient-to-br ${mood.color} border-2 ${mood.borderColor} shadow-md`
                      : "bg-accent/30 border border-border hover:bg-accent/50"
                  }`}
                  onClick={() => handleMoodSelect(index)}
                >
                  <AnimatePresence>
                    {selectedMood === index && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center"
                      >
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <motion.span 
                    className="text-3xl mb-1"
                    animate={selectedMood === index ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {mood.emoji}
                  </motion.span>
                  <span className="text-xs text-muted-foreground font-medium">{mood.label}</span>
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Updated confirmation */}
          <AnimatePresence>
            {justUpdated && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center text-sm text-primary flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Mood shared with your partner!
                <Heart className="w-4 h-4 fill-current" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Partner's Mood */}
          <div className="border-t border-border pt-4">
            <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              Your partner is feeling:
            </p>
            <motion.div
              className={`flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br ${moods[partnerMood].color} border-2 ${moods[partnerMood].borderColor}`}
              animate={{ scale: [1, 1.01, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.span 
                className="text-5xl"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {moods[partnerMood].emoji}
              </motion.span>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-lg">{moods[partnerMood].label}</p>
                <p className="text-sm text-muted-foreground">Updated just now</p>
              </div>
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Heart className="w-6 h-6 text-primary fill-current" />
              </motion.div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MoodSharing;
