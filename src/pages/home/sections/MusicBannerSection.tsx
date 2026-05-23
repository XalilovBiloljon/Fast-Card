import { useEffect, useState } from 'react';

export const MusicBannerSection = () => {
  /*
    Таймер обратного отсчета для баннера.
    Храним целевую дату в стейте, чтобы иметь возможность её обновить.
    Каждую секунду пересчитываем разницу. Если diff <= 0 (таймер истёк),
    вместо остановки обновляем targetDate: прибавляем 3 дня к текущему моменту —
    таймер сбрасывается и запускается заново циклично.
  */
  const [targetDate, setTargetDate] = useState(
    () => new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
  );

  const calcTimeLeft = (target: Date) => {
    const diff = Math.floor((target.getTime() - Date.now()) / 1000);
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return {
      days: Math.floor(diff / (24 * 60 * 60)),
      hours: Math.floor((diff % (24 * 60 * 60)) / (60 * 60)),
      minutes: Math.floor((diff % (60 * 60)) / 60),
      seconds: diff % 60,
    };
  };

  const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = calcTimeLeft(targetDate);
        // Если таймер достиг 0 — сбрасываем целевую дату на 3 дня вперёд
        if (next.days === 0 && next.hours === 0 && next.minutes === 0 && next.seconds === 0) {
          setTargetDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000));
          return prev;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);


  const pad = (n: number) => n.toString().padStart(2, '0');

  const units = [
    { label: 'Days', value: pad(timeLeft.days) },
    { label: 'Hours', value: pad(timeLeft.hours) },
    { label: 'Minutes', value: pad(timeLeft.minutes) },
    { label: 'Seconds', value: pad(timeLeft.seconds) },
  ];

  return (
    <section className="max-w-[1250px] mx-auto px-4 lg:px-8 mb-20 font-poppins">
      <div className="relative bg-black rounded-md overflow-hidden min-h-[280px] md:min-h-[340px] flex items-center">
        {/* Левая часть с текстом */}
        <div className="relative z-10 flex flex-col gap-6 px-8 md:px-14 py-10 md:py-14 max-w-lg">
          <span className="text-[#00FF66] font-semibold text-sm tracking-wide">Categories</span>

          <h2 className="text-white text-3xl md:text-4xl font-semibold leading-tight">
            Enhance Your<br />Music Experience
          </h2>

          {/* Таймер в белых кружках */}
          <div className="flex items-center gap-3 flex-wrap">
            {units.map((unit) => (
              <div
                key={unit.label}
                className="flex flex-col items-center justify-center bg-white rounded-full w-[68px] h-[68px] text-black"
              >
                <span className="text-base font-bold leading-none">{unit.value}</span>
                <span className="text-[10px] mt-0.5 text-gray-600">{unit.label}</span>
              </div>
            ))}
          </div>

          <button className="bg-[#00FF66] hover:bg-[#00dd55] text-black font-semibold text-sm px-8 py-3 rounded-md w-fit transition-colors">
            Buy Now!
          </button>
        </div>

        {/* Изображение JBL — абсолютное на десктопе, под текстом на мобиле */}
        <div className="hidden md:flex absolute right-0 bottom-0 top-0 w-[55%] items-end justify-center pointer-events-none">
          <img
            src="/images/JBL.png"
            alt="JBL"
            className="h-full w-full object-contain object-right-bottom"
          />
        </div>
        <div className="md:hidden w-full flex justify-center pb-8 px-6">
          <img
            src="/images/JBL.png"
            alt="JBL"
            className="max-h-[220px] object-contain"
          />
        </div>
      </div>
    </section>
  );
};
