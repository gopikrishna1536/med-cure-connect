import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  quantity: number;
  medicine: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    stock: number;
  };
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchCart();
  }, [user, navigate]);

  const fetchCart = async () => {
    if (!user) return;

    const { data: cart } = await supabase
      .from('cart')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (cart) {
      const { data: items, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          medicine:medicines (
            id,
            name,
            price,
            image_url,
            stock
          )
        `)
        .eq('cart_id', cart.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load cart",
          variant: "destructive",
        });
      } else {
        setCartItems(items as any || []);
      }
    }
    setLoading(false);
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: newQuantity })
      .eq('id', itemId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    } else {
      fetchCart();
    }
  };

  const removeItem = async (itemId: string) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Item removed from cart",
      });
      fetchCart();
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.medicine.price * item.quantity), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">Loading cart...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">Review your items before checkout</p>
        </div>

        {cartItems.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingBag size={64} className="mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Add some medicines to get started</p>
              <Button onClick={() => navigate('/catalog')}>
                Browse Medicines
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.medicine.image_url}
                        alt={item.medicine.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.medicine.name}</h3>
                        <p className="text-primary font-bold mt-1">
                          ${item.medicine.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </Button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.medicine.stock}
                        >
                          <Plus size={16} />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="ml-2"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-subtle">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-3xl font-bold text-primary">${total.toFixed(2)}</span>
                </div>
                <Button onClick={() => navigate('/checkout')} className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
