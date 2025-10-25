-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  participant_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (since this is an admin panel)
CREATE POLICY "Events are viewable by everyone"
  ON public.events
  FOR SELECT
  USING (true);

-- Create policy for insert
CREATE POLICY "Authenticated users can insert events"
  ON public.events
  FOR INSERT
  WITH CHECK (true);

-- Create policy for update
CREATE POLICY "Authenticated users can update events"
  ON public.events
  FOR UPDATE
  USING (true);

-- Create policy for delete
CREATE POLICY "Authenticated users can delete events"
  ON public.events
  FOR DELETE
  USING (true);

-- Insert sample data
INSERT INTO public.events (name, start_date, participant_count, status) VALUES
  ('2025 글로벌 테크 컨퍼런스', '2025-03-15', 245, 'active'),
  ('스타트업 네트워킹 데이', '2025-03-20', 180, 'pending'),
  ('AI 혁신 포럼', '2025-04-05', 320, 'active'),
  ('디자인 씽킹 워크샵', '2025-04-12', 95, 'completed');