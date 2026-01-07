import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ArrowLeft, X, ChevronLeft, ChevronRight, Plus, Heart, ImageIcon, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import FloatingHearts from "@/components/FloatingHearts";

interface Memory {
  id: string;
  url: string;
  caption: string;
  date: string;
}

const Gallery = () => {
  const [memories] = useState<Memory[]>([
    { id: "1", url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&fit=crop", caption: "Our first date 💕", date: "Feb 14, 2024" },
    { id: "2", url: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&fit=crop", caption: "Beach sunset together", date: "Mar 20, 2024" },
    { id: "3", url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&fit=crop", caption: "Dancing in the rain", date: "Apr 15, 2024" },
    { id: "4", url: "https://images.unsplash.com/photo-1544894079-e81a9eb1da4c?w=800&fit=crop", caption: "Our picnic adventure", date: "May 10, 2024" },
    { id: "5", url: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=800&fit=crop", caption: "Stargazing night", date: "Jun 5, 2024" },
    { id: "6", url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&fit=crop", caption: "Coffee date mornings", date: "Jul 20, 2024" },
  ]);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const nextPhoto = () => selectedIndex !== null && setSelectedIndex((selectedIndex + 1) % memories.length);
  const prevPhoto = () => selectedIndex !== null && setSelectedIndex((selectedIndex - 1 + memories.length) % memories.length);

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden p-4 md:p-8">
      <FloatingHearts />
      <div className="max-w-6xl mx-auto relative z-10">
        <Link to="/">
          <Button variant="ghost" className="mb-6 gap-2 text-muted-foreground hover:text-primary">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-card/90 backdrop-blur-md border-primary/20 shadow-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-primary/10 to-transparent border-b border-border/50 p-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Camera className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <span>Our Memories</span>
                  <p className="text-sm font-normal text-muted-foreground mt-1">Captured moments of us</p>
                </div>
              </CardTitle>
              <Button className="gap-2 shadow-lg"><Plus className="w-4 h-4" /> Add Memory</Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {memories.map((memory, index) => (
                  <motion.div
                    key={memory.id}
                    className="relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer group shadow-md"
                    whileHover={{ scale: 1.02, y: -5 }}
                    onClick={() => setSelectedIndex(index)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <img src={memory.url} alt={memory.caption} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 p-4 flex flex-col justify-end">
                      <p className="text-white font-bold text-lg mb-1">{memory.caption}</p>
                      <p className="text-white/70 text-sm">{memory.date}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedIndex(null)}
          >
            <Button variant="ghost" size="icon" className="absolute top-6 right-6 text-white" onClick={() => setSelectedIndex(null)}><X className="w-8 h-8" /></Button>
            <Button variant="ghost" size="icon" className="absolute left-6 text-white hidden md:flex" onClick={(e) => { e.stopPropagation(); prevPhoto(); }}><ChevronLeft className="w-12 h-12" /></Button>
            
            <motion.div
              key={selectedIndex}
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={memories[selectedIndex].url} alt={memories[selectedIndex].caption} className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl" />
              <div className="mt-6 text-center text-white">
                <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
                  {memories[selectedIndex].caption}
                  <Heart className="w-6 h-6 text-primary fill-current" />
                </h2>
                <p className="text-white/60 mt-2 text-lg">{memories[selectedIndex].date}</p>
              </div>
            </motion.div>

            <Button variant="ghost" size="icon" className="absolute right-6 text-white hidden md:flex" onClick={(e) => { e.stopPropagation(); nextPhoto(); }}><ChevronRight className="w-12 h-12" /></Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;