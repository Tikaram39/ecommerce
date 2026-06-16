import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const SLIDES = [
  {
    id: 1,
    title: "Mega Sale is Live!",
    subtitle: "Up to 70% off on Electronics",
    cta: "Shop Now",
    link: "/shop?category=Electronics",
    bg: "from-purple-600 via-indigo-600 to-blue-600",
    badge: "🔥 Limited Time",
  },
  {
    id: 2,
    title: "New Fashion Arrivals",
    subtitle: "Discover the latest trends this season",
    cta: "Explore Fashion",
    link: "/shop?category=Fashion",
    bg: "from-pink-500 via-rose-500 to-red-500",
    badge: "✨ New Collection",
  },
  {
    id: 3,
    title: "Top Gadgets 2025",
    subtitle: "Cutting-edge tech at your fingertips",
    cta: "View Gadgets",
    link: "/shop?category=Gadgets",
    bg: "from-emerald-500 via-teal-500 to-cyan-500",
    badge: "💡 Tech Week",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c === 0 ? SLIDES.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c + 1) % SLIDES.length);

  const slide = SLIDES[current];

  return (
    <div className={`relative bg-gradient-to-r ${slide.bg} text-white overflow-hidden transition-all duration-700`}>
      <div className="max-w-7xl mx-auto px-4 py-24 sm:py-32 relative z-10">
        <div className="max-w-2xl animate-fade-in">
          <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
            {slide.badge}
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 leading-tight">
            {slide.title}
          </h1>
          <p className="text-xl text-white/80 mb-8">{slide.subtitle}</p>
          <div className="flex gap-4">
            <Link
              to={slide.link}
              className="px-8 py-3 bg-white text-purple-700 font-bold rounded-full hover:shadow-xl hover:scale-105 transition-all"
            >
              {slide.cta}
            </Link>
            <Link
              to="/shop"
              className="px-8 py-3 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all"
            >
              Browse All
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 right-20 w-64 h-64 bg-white/5 rounded-full translate-y-1/2" />

      {/* Controls */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === current ? "bg-white scale-125" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
