import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
}

const Catalog = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchMedicines();
  }, [user, navigate]);

  const fetchMedicines = async () => {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .order('name');

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load medicines",
        variant: "destructive",
      });
    } else {
      setMedicines(data || []);
    }
    setLoading(false);
  };

  const addToCart = async (medicineId: string) => {
    if (!user) return;

    // Get or create cart
    let { data: cart } = await supabase
      .from('cart')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!cart) {
      const { data: newCart, error: cartError } = await supabase
        .from('cart')
        .insert({ user_id: user.id })
        .select()
        .single();

      if (cartError) {
        toast({
          title: "Error",
          description: "Failed to create cart",
          variant: "destructive",
        });
        return;
      }
      cart = newCart;
    }

    // Check if item already in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cart.id)
      .eq('medicine_id', medicineId)
      .maybeSingle();

    if (existingItem) {
      // Update quantity
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + 1 })
        .eq('id', existingItem.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update cart",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Quantity updated in cart",
        });
      }
    } else {
      // Add new item
      const { error } = await supabase
        .from('cart_items')
        .insert({
          cart_id: cart.id,
          medicine_id: medicineId,
          quantity: 1,
        });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add to cart",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Added to cart",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">Loading medicines...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Medicine Catalog</h1>
          <p className="text-muted-foreground">Browse and order your medicines with ease</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {medicines.map((medicine) => (
            <Card key={medicine.id} className="overflow-hidden hover:shadow-medium transition-shadow">
              <CardHeader className="p-0">
                <img
                  src={medicine.image_url}
                  alt={medicine.name}
                  className="w-full h-48 object-cover"
                />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg mb-2">{medicine.name}</CardTitle>
                <CardDescription className="text-sm line-clamp-2 mb-3">
                  {medicine.description}
                </CardDescription>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    ${medicine.price.toFixed(2)}
                  </span>
                  <Badge variant={medicine.stock > 0 ? "default" : "destructive"}>
                    <Package size={12} className="mr-1" />
                    {medicine.stock} in stock
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button
                  onClick={() => addToCart(medicine.id)}
                  className="w-full"
                  disabled={medicine.stock === 0}
                >
                  <ShoppingCart size={16} className="mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
