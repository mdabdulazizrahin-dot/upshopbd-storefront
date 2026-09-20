import { Truck, Shield, RefreshCcw, Headphones } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Quick delivery across Bangladesh',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: '100% secure payment options',
  },
  {
    icon: RefreshCcw,
    title: 'Easy Returns',
    description: '7-day return policy',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Dedicated customer service',
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-12 border-y bg-muted/30">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
