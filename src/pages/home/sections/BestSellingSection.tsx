import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { ProductCard, type IProduct } from '../../../shared/components/ProductCard';

export const BestSellingSection = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();


  useEffect(() => {
    const fetchBestSelling = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/Product/get-products`);
        if (response.data?.data?.products) {
          // Отбираем ровно 4 товара для секции бестселлеров
          setProducts(response.data.data.products.slice(0, 4));
        }
      } catch (error) {
        console.error('Failed to fetch best selling products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBestSelling();
  }, []);

  return (
    <section className="max-w-[1250px] mx-auto px-4 lg:px-8 py-16 border-b border-gray-200 dark:border-zinc-800 font-poppins transition-colors duration-300">
      <div className="flex items-center gap-4 mb-5">
        <div className="w-5 h-10 bg-[#DB4444] rounded-sm" />
        <span className="text-[#DB4444] font-semibold text-sm">{t("This Month")}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-10 w-full">
        <h2 className="text-3xl font-semibold text-black dark:text-white tracking-wide">{t("Best Selling Products")}</h2>
        <Link
          to="/products"
          className="bg-[#DB4444] hover:bg-[#c23b3b] text-white px-8 sm:px-10 py-3 sm:py-4 rounded font-medium transition-colors text-sm tracking-wider whitespace-nowrap self-start sm:self-auto"
        >
          {t("View All")}
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <span className="text-gray-500">Loading products...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-10">
          <span className="text-gray-500">No products found</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
