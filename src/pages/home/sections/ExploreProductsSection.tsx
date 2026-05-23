import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProductCard, type IProduct } from '../../../shared/components/ProductCard';

export const ExploreProductsSection = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  /*
    Запрос к API за продуктами при монтировании компонента.
    Ограничиваем список ровно 8 товарами через .slice(0, 8) —
    без сортировки и spread-операторов, порядок API сохраняется как есть.
  */
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/Product/get-products`);
        if (response.data?.data?.products) {
          setProducts(response.data.data.products.slice(0, 8));
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="max-w-[1250px] mx-auto px-4 lg:px-8 mb-20 font-poppins transition-colors duration-300">
      {/* Заголовок секции */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-5 h-10 bg-[#DB4444] rounded-sm" />
        <span className="text-[#DB4444] font-semibold text-base">{t("Our Products")}</span>
      </div>

      <h2 className="text-3xl md:text-4xl font-semibold tracking-wide mb-10 dark:text-white">
        {t("Explore Our Products")}
      </h2>

      {isLoading ? (
        <div className="py-10 text-center text-gray-500">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Кнопка просмотра всех товаров */}
      <div className="flex justify-center mt-14">
        <Link
          to="/products"
          className="bg-[#DB4444] hover:bg-[#c23b3b] text-white px-12 py-4 rounded-md font-medium transition-colors text-center"
        >
          {t("View All Products")}
        </Link>
      </div>

      <div className="w-full border-b border-gray-200 dark:border-zinc-800 mt-14 transition-colors" />
    </section>
  );
};
