import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

const features = [
  {
    id: 1,
    image: '/images/Services.png',
    title: 'FREE AND FAST DELIVERY',
    desc: 'Free delivery for all orders over $140',
  },
  {
    id: 2,
    image: '/images/call.png',
    title: '24/7 CUSTOMER SERVICE',
    desc: 'Friendly 24/7 customer support',
  },
  {
    id: 3,
    image: '/images/currect.png',
    title: 'MONEY BACK GUARANTEE',
    desc: 'We return money within 30 days',
  },
];

export const FeaturesSection = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="max-w-[1250px] mx-auto px-4 lg:px-8 mb-20 font-poppins">
      <div className="flex flex-col sm:flex-row items-center justify-around gap-12 py-10">
        {features.map((feature) => (
          <div key={feature.id} className="flex flex-col items-center text-center gap-4 max-w-[220px]">
            <div className="w-[70px] h-[70px] rounded-full bg-gray-200 flex items-center justify-center p-1">
              <div className="w-[54px] h-[54px] rounded-full bg-black flex items-center justify-center">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-13 h-13"
                />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wide mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Кнопка прокрутки наверх */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 left-8 w-11 h-11 bg-gray-200 hover:bg-gray-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} className="text-black dark:text-white" />
        </button>
      )}
    </section>
  );
};
