import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, UserPlus, Loader2, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import FloatingHearts from "@/components/FloatingHearts";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    display_name: "",
    role: "boyfriend",
    anniversary_date: "",
    relationship_start: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    setIsLoading(true);
    
    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate("/login");
    } catch (error) {
      // Error handled by context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
      <FloatingHearts />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="bg-card/90 backdrop-blur-md border-primary/20 shadow-xl">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-primary/10">
                <Heart className="w-12 h-12 text-primary fill-current" />
              </div>
            </div>
            <CardTitle className="text-3xl">Join Love OS 💕</CardTitle>
            <CardDescription>Create your account to start your journey</CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  className="border-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_name">Display Name</Label>
                <Input
                  id="display_name"
                  type="text"
                  placeholder="How should we call you?"
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  required
                  className="border-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label>I am the...</Label>
                <RadioGroup
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2 flex-1">
                    <RadioGroupItem value="boyfriend" id="boyfriend" />
                    <Label htmlFor="boyfriend" className="cursor-pointer">Boyfriend 🧑</Label>
                  </div>
                  <div className="flex items-center space-x-2 flex-1">
                    <RadioGroupItem value="girlfriend" id="girlfriend" />
                    <Label htmlFor="girlfriend" className="cursor-pointer">Girlfriend 👩</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="border-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="border-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="anniversary_date">Anniversary Date (Optional)</Label>
                <Input
                  id="anniversary_date"
                  type="date"
                  value={formData.anniversary_date}
                  onChange={(e) => setFormData({ ...formData, anniversary_date: e.target.value })}
                  className="border-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="relationship_start">Relationship Start (Optional)</Label>
                <Input
                  id="relationship_start"
                  type="date"
                  value={formData.relationship_start}
                  onChange={(e) => setFormData({ ...formData, relationship_start: e.target.value })}
                  className="border-primary/20"
                />
              </div>

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
