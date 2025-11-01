import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Pill, ShoppingCart, Upload, Shield } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center shadow-strong">
              <Pill className="text-primary-foreground" size={48} />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Welcome to MediCare
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your trusted medical delivery and prescription management platform. Order medicines online with ease and safety.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="shadow-medium">
                Get Started
              </Button>
            </Link>
            <Link to="/catalog">
              <Button size="lg" variant="outline">
                Browse Medicines
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center p-6 bg-card rounded-xl shadow-soft">
            <ShoppingCart className="mx-auto mb-4 text-primary" size={40} />
            <h3 className="font-semibold text-lg mb-2">Easy Shopping</h3>
            <p className="text-muted-foreground text-sm">Browse and order medicines from our extensive catalog</p>
          </div>
          <div className="text-center p-6 bg-card rounded-xl shadow-soft">
            <Upload className="mx-auto mb-4 text-primary" size={40} />
            <h3 className="font-semibold text-lg mb-2">Upload Prescriptions</h3>
            <p className="text-muted-foreground text-sm">Safely upload and manage your medical prescriptions</p>
          </div>
          <div className="text-center p-6 bg-card rounded-xl shadow-soft">
            <Shield className="mx-auto mb-4 text-primary" size={40} />
            <h3 className="font-semibold text-lg mb-2">Secure & Fast</h3>
            <p className="text-muted-foreground text-sm">Safe transactions and quick delivery to your doorstep</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
