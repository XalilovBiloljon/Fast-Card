// Ambient declarations для CSS модулей (side-effect imports).
// Необходим для TypeScript 6, который ввёл строгую проверку TS2882
// и требует явного объявления типов для non-TS/JS файлов.
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

// Swiper специфичные CSS модули
declare module "swiper/css";
declare module "swiper/css/navigation";
declare module "swiper/css/pagination";
declare module "swiper/css/autoplay";
