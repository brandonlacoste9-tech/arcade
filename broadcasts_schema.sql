-- 1. Create the broadcasts table
CREATE TABLE public.broadcasts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    message text NOT NULL,
    priority text NOT NULL DEFAULT 'info', -- 'info', 'milestone', 'system'
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE public.broadcasts ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Anyone can read active broadcasts
CREATE POLICY "Anyone can view active broadcasts" ON public.broadcasts
    FOR SELECT USING (is_active = true);

-- 4. Policy: Only admins can insert/update broadcasts
CREATE POLICY "Admins can manage broadcasts" ON public.broadcasts
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 5. Enable real-time for broadcasts
ALTER PUBLICATION supabase_realtime ADD TABLE public.broadcasts;
