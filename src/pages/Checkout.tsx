import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';

const addressSchema = z.object({
  full_name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  address: z.string().trim().min(10, "Address must be at least 10 characters").max(200),
  city: z.string().trim().min(2, "City must be at least 2 characters").max(100),
  state: z.string().trim().min(2, "State must be at least 2 characters").max(100),
  pincode: z.string().trim().regex(/^\d{5,6}$/, "Invalid pincode"),
  phone: z.string().trim().regex(/^\d{10}$/, "Phone must be 10 digits"),
});

interface CartItem {
  id: string;
  quantity: number;
  medicine: {
    id: string;
    name: string;
    price: number;
    stock: number;
  };
}

const Checkout = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });
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
      const { data: items } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          medicine:medicines (
            id,
            name,
            price,
            stock
          )
        `)
        .eq('cart_id', cart.id);

      setCartItems(items as any || []);
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart first",
        variant: "destructive",
      });
      return;
    }

    try {
      // Validate form data
      const validated = addressSchema.parse(formData);
      setProcessing(true);

      // Create address
      const { data: address, error: addressError } = await supabase
        .from('addresses')
        .insert([{
          user_id: user!.id,
          full_name: validated.full_name,
          address: validated.address,
          city: validated.city,
          state: validated.state,
          pincode: validated.pincode,
          phone: validated.phone,
        }])
        .select()
        .single();

      if (addressError) throw addressError;

      // Calculate total
      const total = cartItems.reduce((sum, item) => sum + (item.medicine.price * item.quantity), 0);

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user!.id,
          total_amount: total,
          address_id: address.id,
          payment_status: 'completed',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items and update stock
      for (const item of cartItems) {
        // Insert order item
        const { error: itemError } = await supabase
          .from('order_items')
          .insert({
            order_id: order.id,
            medicine_id: item.medicine.id,
            quantity: item.quantity,
            price: item.medicine.price,
          });

        if (itemError) throw itemError;

        // Update medicine stock
        const newStock = item.medicine.stock - item.quantity;
        const { error: stockError } = await supabase
          .from('medicines')
          .update({ stock: newStock })
          .eq('id', item.medicine.id);

        if (stockError) throw stockError;
      }

      // Clear cart
      const { data: cart } = await supabase
        .from('cart')
        .select('id')
        .eq('user_id', user!.id)
        .single();

      await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cart.id);

      toast({
        title: "Order placed successfully!",
        description: "Your order has been confirmed",
      });

      navigate(`/order-confirmation/${order.id}`);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to place order",
          variant: "destructive",
        });
      }
    } finally {
      setProcessing(false);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.medicine.price * item.quantity), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Checkout</h1>
          <p className="text-muted-foreground">Complete your order</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
                <CardDescription>Where should we deliver your order?</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="123456"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="9876543210"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={processing}>
                    {processing ? 'Processing...' : 'Place Order'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.medicine.name} × {item.quantity}</span>
                    <span className="font-semibold">
                      ${(item.medicine.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
