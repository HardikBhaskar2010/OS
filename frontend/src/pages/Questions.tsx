import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircleHeart, ArrowLeft, RefreshCw, Send, Sparkles, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import FloatingHearts from "@/components/FloatingHearts";

const questions = [
  "What's one thing about me that always makes you smile?",
  "If we could go anywhere in the world together, where would you want to go?",
  "What's your favorite memory of us?",
  "What song reminds you of our relationship?",
  "What do you love most about our relationship?",
  "If you could relive any day we spent together, which one would it be?",
  "What's something new you'd like us to try together?",
  "What made you fall in love with me?",
  "What's the sweetest thing I've ever done for you?",
  "What are you most looking forward to in our future together?",
];

const Questions = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const getNewQuestion = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentQuestion((prev) => (prev + 1) % questions.length);
      setAnswer("");
      setSubmitted(false);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden p-4 md:p-8">
      <FloatingHearts />
      <div className="max-w-3xl mx-auto relative z-10">
        <Link to="/">
          <Button variant="ghost" className="mb-6 gap-2 text-muted-foreground hover:text-primary">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="bg-card/90 backdrop-blur-md border-primary/20 shadow-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/20 via-accent/30 to-transparent p-8 text-center border-b border-border/50">
              <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4">
                <MessageCircleHeart className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold">Daily Love Question</CardTitle>
              <p className="text-muted-foreground mt-2">Connecting one answer at a time</p>
            </CardHeader>
            <CardContent className="p-8 md:p-12 space-y-8">
              <div className="relative py-8">
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={currentQuestion}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-2xl md:text-3xl font-bold text-center leading-tight text-foreground"
                  >
                    "{questions[currentQuestion]}"
                  </motion.h2>
                </AnimatePresence>
              </div>

              {!submitted ? (
                <div className="space-y-6">
                  <Textarea
                    placeholder="Write your heart out..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="min-h-[200px] text-xl border-primary/20 focus:border-primary bg-accent/5 resize-none p-6 rounded-2xl"
                  />
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={getNewQuestion} className="flex-1 py-8 text-lg gap-2 rounded-2xl"><RefreshCw className="w-5 h-5" /> Next Question</Button>
                    <Button onClick={() => answer.trim() && setSubmitted(true)} disabled={!answer.trim()} className="flex-1 py-8 text-lg gap-2 rounded-2xl shadow-lg"><Send className="w-5 h-5" /> Share Answer</Button>
                  </div>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6 py-8">
                  <div className="text-6xl mb-4">💖</div>
                  <h3 className="text-2xl font-bold">Answer Shared with Love!</h3>
                  <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10">
                    <p className="text-xl italic font-serif leading-relaxed">"{answer}"</p>
                  </div>
                  <Button variant="ghost" onClick={getNewQuestion} className="text-primary gap-2 text-lg"><Sparkles className="w-5 h-5" /> Answer Another</Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Questions;