import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, Heart, ArrowLeft, Feather, Sparkles, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import FloatingHearts from "@/components/FloatingHearts";

interface LoveLetter {
  id: string;
  title: string;
  content: string;
  from: string;
  date: Date;
}

const Letters = () => {
  const [letters, setLetters] = useState<LoveLetter[]>([
    {
      id: "1",
      title: "My First Letter to You",
      content: "Every moment with you feels like a beautiful dream I never want to wake up from. You are my sunshine, my everything. The way you smile lights up my entire world, and I am so grateful to have you in my life. 💕",
      from: "Your Love",
      date: new Date(2024, 0, 14),
    },
    {
      id: "2",
      title: "To My Soulmate",
      content: "I fall in love with you more each day. Thank you for being my best friend, my partner, and my forever person. You make every ordinary day feel extraordinary. ✨",
      from: "Forever Yours",
      date: new Date(2024, 2, 20),
    },
    {
      id: "3",
      title: "Missing You",
      content: "Distance means nothing when someone means everything. I'm counting every second until I can hold you again. You're always in my heart. 🌙",
      from: "Always Thinking of You",
      date: new Date(2024, 4, 5),
    },
  ]);

  const [isWriting, setIsWriting] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<LoveLetter | null>(null);
  const [newLetter, setNewLetter] = useState({ title: "", content: "", from: "" });

  const handleSubmit = () => {
    if (newLetter.title && newLetter.content && newLetter.from) {
      setLetters([
        {
          id: Date.now().toString(),
          ...newLetter,
          date: new Date(),
        },
        ...letters,
      ]);
      setNewLetter({ title: "", content: "", from: "" });
      setIsWriting(false);
    }
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-card/90 backdrop-blur-md border-primary/20 shadow-xl overflow-hidden min-h-[60vh]">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-primary/10 to-transparent border-b border-border/50 p-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <span>Love Letters</span>
                  <p className="text-sm font-normal text-muted-foreground mt-1">
                    {letters.length} heartfelt messages exchanged
                  </p>
                </div>
              </CardTitle>
              <Button
                variant={isWriting ? "secondary" : "default"}
                onClick={() => setIsWriting(!isWriting)}
                className="gap-2"
              >
                {isWriting ? <X className="w-4 h-4" /> : <Feather className="w-4 h-4" />}
                {isWriting ? "Cancel" : "Write a Letter"}
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <AnimatePresence mode="wait">
                {isWriting ? (
                  <motion.div
                    key="write"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-6 max-w-2xl mx-auto py-4"
                  >
                    <div className="flex items-center gap-2 text-primary">
                      <Sparkles className="w-5 h-5" />
                      <span className="font-medium">Write from your heart...</span>
                    </div>
                    <Input
                      placeholder="Give your letter a title..."
                      value={newLetter.title}
                      onChange={(e) => setNewLetter({ ...newLetter, title: e.target.value })}
                      className="text-lg py-6 border-primary/20 focus:border-primary bg-card/50"
                    />
                    <Textarea
                      placeholder="Pour your heart out here..."
                      value={newLetter.content}
                      onChange={(e) => setNewLetter({ ...newLetter, content: e.target.value })}
                      className="min-h-[300px] text-lg border-primary/20 focus:border-primary bg-card/50 resize-none leading-relaxed"
                    />
                    <Input
                      placeholder="Signed with love by..."
                      value={newLetter.from}
                      onChange={(e) => setNewLetter({ ...newLetter, from: e.target.value })}
                      className="border-primary/20 focus:border-primary bg-card/50"
                    />
                    <Button 
                      onClick={handleSubmit} 
                      className="w-full py-8 text-lg gap-3 shadow-lg"
                      disabled={!newLetter.title || !newLetter.content || !newLetter.from}
                    >
                      <Send className="w-5 h-5" />
                      Send Letter
                      <Heart className="w-5 h-5 fill-current animate-pulse-heart" />
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div key="list" className="grid gap-4 md:grid-cols-2">
                    {letters.map((letter, index) => (
                      <motion.div
                        key={letter.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group cursor-pointer"
                        onClick={() => setSelectedLetter(letter)}
                      >
                        <Card className="h-full bg-accent/20 border-primary/10 hover:border-primary/40 hover:shadow-lg transition-all duration-300">
                          <CardContent className="p-5">
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                                {letter.title}
                              </h3>
                              <Heart className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                              {letter.content}
                            </p>
                            <div className="flex justify-between items-center text-sm pt-4 border-t border-primary/5">
                              <span className="text-primary font-semibold">— {letter.from}</span>
                              <span className="text-muted-foreground">{format(letter.date, "MMM d, yyyy")}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedLetter(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="bg-card rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-primary/20 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedLetter(null)}
                className="absolute top-4 right-4"
              >
                <X className="w-6 h-6" />
              </Button>
              
              <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-2 text-primary mb-2 bg-primary/10 px-4 py-1 rounded-full">
                  <Mail className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Love Letter</span>
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-2">{selectedLetter.title}</h2>
                <p className="text-muted-foreground">
                  {format(selectedLetter.date, "MMMM d, yyyy")}
                </p>
              </div>
              
              <div className="bg-accent/10 rounded-2xl p-8 mb-8 border border-primary/5 shadow-inner">
                <p className="text-xl text-foreground leading-relaxed whitespace-pre-wrap font-serif italic text-center">
                  "{selectedLetter.content}"
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <div className="h-px bg-primary/20 flex-1" />
                <p className="text-2xl font-bold text-primary flex items-center gap-3 italic">
                  — {selectedLetter.from}
                  <Heart className="w-6 h-6 fill-current animate-pulse-heart" />
                </p>
                <div className="h-px bg-primary/20 flex-1" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Letters;