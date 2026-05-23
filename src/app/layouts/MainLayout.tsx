import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { Header } from '../../widgets/Header/Header';
import { Footer } from '../../widgets/Footer/Footer';
import { NotFoundPage } from '../../pages/NotFoundPage';
import { AIAssistant } from '../../widgets/AIAssistant/AIAssistant';

export const MainLayout = () => {
  /*
    MainLayout - главный слой для страниц приложения.
    Используем flex-box (flex flex-col min-h-screen) для того, 
    чтобы Footer всегда прижимался к низу экрана, даже если контента на странице мало.
    В <Outlet /> рендерится контент текущего роута.
    Обернут в ErrorBoundary для глобальной обработки ошибок роутинга или рендера компонентов,
    FallbackComponent отобразит базовую 404 страницу, если произойдет ошибка.
  */
  return (
    <div className="flex flex-col min-h-screen font-sans bg-white dark:bg-[#18181B] text-black dark:text-gray-100 transition-colors duration-300">
      {/* Шапка */}
      <Header />

      {/* Основной контент страницы */}
      <main className="flex-grow">
        <ErrorBoundary FallbackComponent={NotFoundPage}>
          <Outlet />
        </ErrorBoundary>
      </main>

      {/* Подвал */}
      <Footer />
      
      <AIAssistant />
    </div>
  );
};
