-- Love OS Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (for username/password auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('boyfriend', 'girlfriend')),
  display_name TEXT NOT NULL,
  partner_id UUID REFERENCES public.users(id),
  anniversary_date DATE,
  relationship_start DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Moods table (enhanced for new features)
CREATE TABLE IF NOT EXISTS public.moods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  mood_emoji TEXT NOT NULL,
  mood_label TEXT NOT NULL,
  mood_color TEXT NOT NULL,
  note TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mood reactions table (for reacting to partner's mood)
CREATE TABLE IF NOT EXISTS public.mood_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mood_id UUID REFERENCES public.moods(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  reaction_emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(mood_id, user_id)
);

-- Love letters table
CREATE TABLE IF NOT EXISTS public.letters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  from_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  to_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Photos table
CREATE TABLE IF NOT EXISTS public.photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  caption TEXT,
  uploaded_by UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questions table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_text TEXT NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Answers table
CREATE TABLE IF NOT EXISTS public.answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  answer_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(question_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile and partner's"
  ON public.users FOR SELECT
  USING (
    id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    OR id = (SELECT partner_id FROM public.users WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth_user_id = auth.uid());

CREATE POLICY "Users can insert their own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth_user_id = auth.uid());

-- RLS Policies for moods table
CREATE POLICY "Users can view their own and partner's moods"
  ON public.moods FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM public.users 
      WHERE auth_user_id = auth.uid() 
         OR id = (SELECT partner_id FROM public.users WHERE auth_user_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert their own moods"
  ON public.moods FOR INSERT
  WITH CHECK (user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update their own moods"
  ON public.moods FOR UPDATE
  USING (user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can delete their own moods"
  ON public.moods FOR DELETE
  USING (user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- RLS Policies for mood_reactions
CREATE POLICY "Users can view reactions on their moods and partner's moods"
  ON public.mood_reactions FOR SELECT
  USING (true);

CREATE POLICY "Users can add reactions"
  ON public.mood_reactions FOR INSERT
  WITH CHECK (user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can delete their own reactions"
  ON public.mood_reactions FOR DELETE
  USING (user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- RLS Policies for letters
CREATE POLICY "Users can view letters they sent or received"
  ON public.letters FOR SELECT
  USING (
    from_user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    OR to_user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Users can insert letters"
  ON public.letters FOR INSERT
  WITH CHECK (from_user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can delete their own letters"
  ON public.letters FOR DELETE
  USING (from_user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- RLS Policies for photos
CREATE POLICY "Users can view all couple photos"
  ON public.photos FOR SELECT
  USING (true);

CREATE POLICY "Users can upload photos"
  ON public.photos FOR INSERT
  WITH CHECK (uploaded_by = (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can delete their own photos"
  ON public.photos FOR DELETE
  USING (uploaded_by = (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- RLS Policies for questions
CREATE POLICY "Users can view all questions"
  ON public.questions FOR SELECT
  USING (true);

CREATE POLICY "Users can insert questions"
  ON public.questions FOR INSERT
  WITH CHECK (true);

-- RLS Policies for answers
CREATE POLICY "Users can view all answers"
  ON public.answers FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own answers"
  ON public.answers FOR INSERT
  WITH CHECK (user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update their own answers"
  ON public.answers FOR UPDATE
  USING (user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- Enable Realtime for moods table
ALTER PUBLICATION supabase_realtime ADD TABLE public.moods;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mood_reactions;

-- Create indexes for better performance
CREATE INDEX idx_moods_user_id ON public.moods(user_id);
CREATE INDEX idx_moods_created_at ON public.moods(created_at DESC);
CREATE INDEX idx_mood_reactions_mood_id ON public.mood_reactions(mood_id);
CREATE INDEX idx_letters_from_user ON public.letters(from_user_id);
CREATE INDEX idx_letters_to_user ON public.letters(to_user_id);
CREATE INDEX idx_photos_uploaded_by ON public.photos(uploaded_by);
CREATE INDEX idx_answers_question_id ON public.answers(question_id);
CREATE INDEX idx_answers_user_id ON public.answers(user_id);

-- Insert some romantic daily questions
INSERT INTO public.questions (question_text, category, date) VALUES
  ('What is your favorite memory of us together?', 'memories', CURRENT_DATE),
  ('If you could relive one day with me, which would it be?', 'memories', CURRENT_DATE + INTERVAL '1 day'),
  ('What made you fall in love with me?', 'love', CURRENT_DATE + INTERVAL '2 days'),
  ('What is one thing I do that always makes you smile?', 'happiness', CURRENT_DATE + INTERVAL '3 days'),
  ('Where do you see us in 5 years?', 'future', CURRENT_DATE + INTERVAL '4 days'),
  ('What song reminds you of me and why?', 'connection', CURRENT_DATE + INTERVAL '5 days'),
  ('What is your favorite thing about our relationship?', 'love', CURRENT_DATE + INTERVAL '6 days'),
  ('If we could travel anywhere together, where would you want to go?', 'dreams', CURRENT_DATE + INTERVAL '7 days')
ON CONFLICT DO NOTHING;
