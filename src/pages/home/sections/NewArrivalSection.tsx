
export const NewArrivalSection = () => {
  return (
    <section className="max-w-[1250px] mx-auto px-4 lg:px-8 mb-20 font-poppins">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-5 h-10 bg-[#DB4444] rounded-sm" />
        <span className="text-[#DB4444] font-semibold text-base">Featured</span>
      </div>

      <h2 className="text-3xl md:text-4xl font-semibold tracking-wide mb-10">New Arrival</h2>

      {/* Сетка: на десктопе — 2 колонки, на мобильных — 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:h-[600px]">

        {/* PlayStation — занимает всю левую колонку по высоте */}
        <div className="relative bg-black rounded-md overflow-hidden group cursor-pointer md:row-span-2 h-[300px] md:h-auto">
          <img
            src="/images/Playstations.png"
            alt="PlayStation 5"
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white">
            <h3 className="text-xl md:text-2xl font-semibold mb-1">PlayStation 5</h3>
            <p className="text-sm text-gray-300 mb-3 max-w-[200px]">Black and White version of the PS5 coming out on sale.</p>
            <a href="#" className="text-white text-sm border-b border-white pb-0.5 hover:text-gray-300 transition-colors">Shop Now</a>
          </div>
        </div>

        {/* Women's Collections — верхний правый */}
        <div className="relative bg-black rounded-md overflow-hidden group cursor-pointer h-[220px] md:h-auto">
          <img
            src="/images/woman.png"
            alt="Women's Collections"
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 p-5 md:p-6 text-white">
            <h3 className="text-lg md:text-xl font-semibold mb-1">Women's Collections</h3>
            <p className="text-xs text-gray-300 mb-2 max-w-[200px]">Featured woman collections that give you another vibe.</p>
            <a href="#" className="text-white text-sm border-b border-white pb-0.5 hover:text-gray-300 transition-colors">Shop Now</a>
          </div>
        </div>

        {/* Нижняя правая часть — два блока в ряд */}
        <div className="grid grid-cols-2 gap-4 h-[220px] md:h-auto">
          {/* Speakers */}
          <div className="relative bg-black rounded-md overflow-hidden group cursor-pointer">
            <img
              src="/images/speakers.png"
              alt="Speakers"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 p-4 text-white">
              <h3 className="text-sm md:text-base font-semibold mb-0.5">Speakers</h3>
              <p className="text-xs text-gray-300 mb-2 hidden sm:block">Amazon wireless speakers</p>
              <a href="#" className="text-white text-xs border-b border-white pb-0.5 hover:text-gray-300 transition-colors">Shop Now</a>
            </div>
          </div>

          {/* Perfume / Gucci */}
          <div className="relative bg-black rounded-md overflow-hidden group cursor-pointer">
            <img
              src="/images/Gucci.png"
              alt="Perfume"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 p-4 text-white">
              <h3 className="text-sm md:text-base font-semibold mb-0.5">Perfume</h3>
              <p className="text-xs text-gray-300 mb-2 hidden sm:block">GUCCI INTENSE OUD EDP</p>
              <a href="#" className="text-white text-xs border-b border-white pb-0.5 hover:text-gray-300 transition-colors">Shop Now</a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
