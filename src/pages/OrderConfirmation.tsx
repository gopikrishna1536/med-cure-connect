import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Package, MapPin } from 'lucide-react';

interface Order {
  id: string;
  total_amount: number;
  order_date: string;
  address: {
    full_name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  order_items: Array<{
    quantity: number;
    price: number;
    medicine: {
      name: string;
    };
  }>;
}

const OrderConfirmation = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { orderId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchOrder();
  }, [user, orderId, navigate]);

  const fetchOrder = async () => {
    if (!orderId || !user) return;

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        address:addresses (*),
        order_items (
          quantity,
          price,
          medicine:medicines (name)
        )
      `)
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      navigate('/catalog');
    } else {
      setOrder(data as any);
    }
    setLoading(false);
  };

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

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">Order not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <CheckCircle className="mx-auto mb-4 text-success" size={80} />
          <h1 className="text-4xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your order. Your medicines are being prepared.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package size={20} />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                <p className="font-mono text-sm">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                <p>{new Date(order.order_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Items Ordered</p>
                <div className="space-y-2">
                  {order.order_items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.medicine.name} × {item.quantity}</span>
                      <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-primary">${order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin size={20} />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-semibold">{order.address.full_name}</p>
                <p className="text-sm">{order.address.address}</p>
                <p className="text-sm">
                  {order.address.city}, {order.address.state} - {order.address.pincode}
                </p>
                <p className="text-sm">Phone: {order.address.phone}</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button onClick={() => navigate('/catalog')} className="flex-1" variant="outline">
              Continue Shopping
            </Button>
            <Button onClick={() => navigate('/')} className="flex-1">
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
