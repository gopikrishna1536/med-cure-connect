-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create medicines table
CREATE TABLE public.medicines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create cart table
CREATE TABLE public.cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID REFERENCES public.cart(id) ON DELETE CASCADE NOT NULL,
  medicine_id UUID REFERENCES public.medicines(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  UNIQUE (cart_id, medicine_id)
);

-- Create storage bucket for prescriptions
INSERT INTO storage.buckets (id, name, public)
VALUES ('prescriptions', 'prescriptions', false);

-- Create prescriptions table
CREATE TABLE public.prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_path TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create addresses table
CREATE TABLE public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_status TEXT DEFAULT 'completed',
  order_date TIMESTAMPTZ DEFAULT NOW(),
  address_id UUID REFERENCES public.addresses(id)
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  medicine_id UUID REFERENCES public.medicines(id) NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Medicines policies (public read, admin write)
CREATE POLICY "Anyone can view medicines" ON public.medicines
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert medicines" ON public.medicines
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update medicines" ON public.medicines
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete medicines" ON public.medicines
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Cart policies
CREATE POLICY "Users can view own cart" ON public.cart
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own cart" ON public.cart
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Cart items policies
CREATE POLICY "Users can view own cart items" ON public.cart_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.cart WHERE cart.id = cart_items.cart_id AND cart.user_id = auth.uid())
  );

CREATE POLICY "Users can insert own cart items" ON public.cart_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.cart WHERE cart.id = cart_items.cart_id AND cart.user_id = auth.uid())
  );

CREATE POLICY "Users can update own cart items" ON public.cart_items
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.cart WHERE cart.id = cart_items.cart_id AND cart.user_id = auth.uid())
  );

CREATE POLICY "Users can delete own cart items" ON public.cart_items
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.cart WHERE cart.id = cart_items.cart_id AND cart.user_id = auth.uid())
  );

-- Prescriptions storage policies
CREATE POLICY "Users can upload own prescriptions" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'prescriptions' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own prescriptions" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'prescriptions' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all prescriptions" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'prescriptions' AND
    public.has_role(auth.uid(), 'admin')
  );

-- Prescriptions table policies
CREATE POLICY "Users can view own prescriptions" ON public.prescriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can upload own prescriptions" ON public.prescriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all prescriptions" ON public.prescriptions
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Addresses policies
CREATE POLICY "Users can view own addresses" ON public.addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses" ON public.addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses" ON public.addresses
  FOR UPDATE USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Order items policies
CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

CREATE POLICY "Users can create order items" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

CREATE POLICY "Admins can view all order items" ON public.order_items
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    NEW.email
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile and role on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample medicines
INSERT INTO public.medicines (name, description, price, stock, image_url) VALUES
('Paracetamol 500mg', 'Pain relief and fever reducer. Safe for adults and children.', 5.99, 100, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'),
('Ibuprofen 400mg', 'Anti-inflammatory pain reliever. Reduces pain, fever and inflammation.', 7.99, 150, 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400'),
('Amoxicillin 250mg', 'Antibiotic for bacterial infections. Prescription required.', 12.99, 80, 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400'),
('Cetirizine 10mg', 'Antihistamine for allergies. Relieves sneezing, itching, and runny nose.', 6.49, 120, 'https://images.unsplash.com/photo-1550572017-4895a2e641e0?w=400'),
('Omeprazole 20mg', 'Reduces stomach acid. Treats heartburn and acid reflux.', 9.99, 90, 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400'),
('Metformin 500mg', 'Diabetes medication. Controls blood sugar levels.', 11.99, 75, 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400'),
('Vitamin D3 1000IU', 'Supports bone health and immune function. Daily supplement.', 8.99, 200, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400'),
('Aspirin 75mg', 'Blood thinner. Prevents heart attacks and strokes.', 4.99, 180, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'),
('Losartan 50mg', 'Blood pressure medication. Treats hypertension.', 13.99, 60, 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400'),
('Salbutamol Inhaler', 'Relieves asthma and breathing difficulties. Fast-acting bronchodilator.', 15.99, 50, 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400'),
('Ranitidine 150mg', 'Reduces stomach acid. Treats ulcers and heartburn.', 7.49, 110, 'https://images.unsplash.com/photo-1550572017-4895a2e641e0?w=400'),
('Multivitamin Tablets', 'Complete daily nutrition. Essential vitamins and minerals.', 12.49, 150, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400'),
('Simvastatin 20mg', 'Lowers cholesterol. Reduces risk of heart disease.', 14.99, 70, 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400'),
('Amlodipine 5mg', 'Blood pressure medication. Prevents chest pain.', 10.99, 85, 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400'),
('Loratadine 10mg', 'Antihistamine for allergies. Non-drowsy formula.', 6.99, 130, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400')