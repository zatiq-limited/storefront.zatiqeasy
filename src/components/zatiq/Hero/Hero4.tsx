import React from "react";

const Hero4: React.FC = () => {
  return (
    <div className="relative font-montserrat w-full max-w-[1440px] min-h-[500px] sm:min-h-[600px] lg:h-[716px] mx-auto bg-[#7FC5D9] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/assets/hero/hero-4.png"
          alt="Shopping Background"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Left Arrow */}
      <button className="hidden md:flex absolute left-4 lg:left-10 top-1/2 -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 items-center justify-center text-white hover:bg-white/10 transition z-10">
        <svg
          width="24"
          height="45"
          viewBox="0 0 24 45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_804_32118)">
            <g clip-path="url(#clip1_804_32118)">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M23.4992 43.7724C23.3409 43.9302 23.1528 44.0554 22.9457 44.1408C22.7386 44.2263 22.5166 44.2703 22.2924 44.2703C22.0682 44.2703 21.8462 44.2263 21.6391 44.1408C21.432 44.0554 21.2439 43.9302 21.0856 43.7724L0.631046 23.4352C0.472307 23.2778 0.346367 23.0908 0.260435 22.8849C0.174505 22.679 0.130272 22.4582 0.130272 22.2353C0.130272 22.0124 0.174505 21.7917 0.260435 21.5858C0.346367 21.3799 0.472307 21.1928 0.631046 21.0354L21.0856 0.698261C21.4057 0.380028 21.8398 0.201248 22.2924 0.201248C22.7451 0.201248 23.1792 0.380028 23.4992 0.698261C23.8193 1.01649 23.9991 1.4481 23.9991 1.89815C23.9991 2.3482 23.8193 2.77981 23.4992 3.09805L4.24809 22.2353L23.4992 41.3726C23.658 41.53 23.7839 41.717 23.8698 41.9229C23.9558 42.1288 24 42.3496 24 42.5725C24 42.7954 23.9558 43.0161 23.8698 43.222C23.7839 43.4279 23.658 43.6149 23.4992 43.7724Z"
                fill="white"
              />
            </g>
          </g>
          <defs>
            <clipPath id="clip0_804_32118">
              <rect width="24" height="44.4706" fill="white" />
            </clipPath>
            <clipPath id="clip1_804_32118">
              <rect
                width="24"
                height="44.4706"
                fill="white"
                transform="translate(24 44.4707) rotate(-180)"
              />
            </clipPath>
          </defs>
        </svg>
      </button>

      {/* Right Arrow */}
      <button className="hidden md:flex absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 items-center justify-center text-white hover:bg-white/10 transition z-10">
        <svg
          width="24"
          height="45"
          viewBox="0 0 24 45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_804_32115)">
            <g clip-path="url(#clip1_804_32115)">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.565226 0.69834C0.723564 0.540513 0.911663 0.415294 1.11875 0.329856C1.32583 0.244418 1.54784 0.200439 1.77205 0.200439C1.99625 0.200439 2.21826 0.244418 2.42534 0.329856C2.63243 0.415294 2.82053 0.540513 2.97886 0.69834L23.4334 21.0355C23.5921 21.1929 23.7181 21.3799 23.804 21.5858C23.8899 21.7917 23.9342 22.0125 23.9342 22.2354C23.9342 22.4583 23.8899 22.679 23.804 22.8849C23.7181 23.0908 23.5921 23.2779 23.4334 23.4353L2.97886 43.7724C2.6588 44.0907 2.22469 44.2695 1.77205 44.2695C1.3194 44.2695 0.885294 44.0907 0.565226 43.7724C0.245158 43.4542 0.0653456 43.0226 0.0653456 42.5726C0.0653456 42.1225 0.245158 41.6909 0.565226 41.3727L19.8164 22.2354L0.565226 3.09813C0.406488 2.9407 0.280546 2.75368 0.194615 2.54778C0.108684 2.34188 0.0644531 2.12115 0.0644531 1.89823C0.0644531 1.67531 0.108684 1.45458 0.194615 1.24869C0.280546 1.04279 0.406488 0.855769 0.565226 0.69834Z"
                fill="white"
              />
            </g>
          </g>
          <defs>
            <clipPath id="clip0_804_32115">
              <rect width="24" height="44.4706" fill="white" />
            </clipPath>
            <clipPath id="clip1_804_32115">
              <rect width="24" height="44.4706" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </button>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center mt-24 lg:mt-0">
        <div className="px-4 md:px-20 lg:px-0 lg:ml-40 pt-8 lg:pt-8 w-full lg:w-auto">
          {/* Summer 2025 Tag */}
          <div className="mb-6 lg:mb-9">
            <span
              className="text-white font-bold tracking-widest uppercase text-sm sm:text-base leading-5 sm:leading-6"
            >
              SUMMER 2025
            </span>
          </div>

          {/* Main Heading */}
          <h1
            className="text-white max-w-[600px] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 lg:mb-9 leading-tight sm:leading-[60px] lg:leading-[80px] tracking-[0.2px]"
          >
            NEW COLLECTION
          </h1>

          {/* Description */}
          <p
            className="text-white mb-6 lg:mb-9 leading-normal text-base sm:text-lg lg:text-xl max-w-full sm:max-w-[376px] font-normal"
          >
            We know how large objects will act,
            <br />
            but things on a small scale.
          </p>

          {/* CTA Button */}
          <button
            className="bg-[#01B7DF] min-w-[180px] sm:min-w-56 min-h-12 sm:min-h-16 text-white font-bold uppercase hover:bg-[#26A661] transition-colors rounded text-lg sm:text-xl lg:text-2xl tracking-[0.1px] px-4 sm:px-6 leading-[28px] sm:leading-[32px]"
          >
            SHOP NOW
          </button>
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex z-10">
        <div className="w-[62px] h-2.5 bg-white"></div>
        <div className="w-[62px] h-2.5 bg-white/50"></div>
      </div>
    </div>
  );
};

export default Hero4;
