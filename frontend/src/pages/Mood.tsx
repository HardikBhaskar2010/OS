import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smile, Heart, ArrowLeft, Sparkles, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import FloatingHearts from "@/components/FloatingHearts";

const moods = [
  { emoji: "😍", label: "In Love", color: "from-pink-500/30 to-rose-500/30", borderColor: "border-pink-400" },
  { emoji: "😊", label: "Happy", color: "from-yellow-500/30 to-amber-500/30", borderColor: "border-yellow-400" },
  { emoji: "🥰", label: "Grateful", color: "from-purple-500/30 to-violet-500/30", borderColor: "border-purple-400" },
  { emoji: "😴", label: "Sleepy", color: "from-indigo-500/30 to-blue-500/30", borderColor: "border-indigo-400" },
  { emoji: "☕", label: "Missing You", color: "from-amber-600/30 to-orange-500/30", borderColor: "border-amber-500" },
  { emoji: "🤗", label: "Thinkin' of U", color: "from-sky-500/30 to-cyan-500/30", borderColor: "border-sky-400" },
];

const Mood = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [justUpdated, setJustUpdated] = useState(false);

  const handleMoodSelect = (index: number) => {
    setSelectedMood(index);
    setJustUpdated(true);
    setTimeout(() => setJustUpdated(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden p-4 md:p-8">
      <FloatingHearts />
      <div className="max-w-4xl mx-auto relative z-10">
        <Link to="/">
          <Button variant="ghost" className="mb-6 gap-2 text-muted-foreground hover:text-primary">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-card/90 backdrop-blur-md border-primary/20 shadow-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent p-10 text-center">
              <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4"><Smile className="w-10 h-10 text-primary" /></div>
              <CardTitle className="text-4xl font-bold">How are you feeling?</CardTitle>
              <p className="text-muted-foreground text-lg mt-2">Update your mood for your partner to see</p>
            </CardHeader>
            <CardContent className="p-10 space-y-12">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {moods.map((mood, index) => (
                  <motion.button
                    key={mood.label}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex flex-col items-center p-8 rounded-3xl border-2 transition-all duration-500 relative overflow-hidden ${
                      selectedMood === index 
                        ? `bg-gradient-to-br ${mood.color} ${mood.borderColor} shadow-xl` 
                        : "bg-accent/10 border-transparent hover:border-primary/20"
                    }`}
                    onClick={() => handleMoodSelect(index)}
                  >
                    <span className="text-6xl mb-4">{mood.emoji}</span>
                    <span className="text-lg font-bold">{mood.label}</span>
                    {selectedMood === index && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4 bg-primary text-white p-1 rounded-full"><Check className="w-4 h-4" /></motion.div>}
                  </motion.button>
                ))}
              </div>

              <AnimatePresence>
                {justUpdated && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-primary/10 p-6 rounded-2xl border border-primary/20 flex items-center justify-center gap-4">
                    <Sparkles className="w-6 h-6 text-primary" />
                    <p className="text-xl font-bold text-primary">Your partner has been notified! 💕</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="border-t border-primary/10 pt-12">
                <div className="flex flex-col md:flex-row items-center gap-8 justify-center">
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold mb-2">Current Status</h3>
                    <p className="text-muted-foreground">Hardik is currently feeling:</p>
                  </div>
                  <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }} className="flex items-center gap-6 p-8 rounded-3xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border-2 border-pink-400 shadow-xl">
                    <span className="text-7xl">😍</span>
                    <div>
                      <p className="text-3xl font-black text-foreground uppercase tracking-widest">In Love</p>
                      <p className="text-muted-foreground mt-1">Updated 5m ago</p>
                    </div>
                    <Heart className="w-10 h-10 text-primary fill-current ml-4 animate-pulse-heart" />
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Mood;