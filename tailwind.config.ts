const config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // ============================================================================
  // SAFELIST: Classes from theme builder JSON blocks (not scannable by Tailwind)
  // These classes come dynamically from API/database via merchant panel exports
  // ============================================================================
  safelist: [
    // ========================================
    // CONTAINER CLASS (for dynamic content)
    // ========================================
    "container",
    
    // ========================================
    // POSITIONING CLASSES
    // ========================================
    
    // Position - left
    "left-0", "left-4", "left-6", "left-1/2",
    "sm:left-4", "sm:left-6",
    "md:left-16", "md:left-20",
    "lg:left-28", "lg:left-[112px]",
    "-left-0.5", "-left-1", "-left-2", "-left-4",

    // Position - right
    "right-0", "right-4", "right-6",
    "md:right-8",
    "lg:right-11", "lg:right-28",
    "-right-0.5", "-right-1", "-right-2", "-right-4",
    "sm:-right-1", "md:-right-1",

    // Position - top
    "-top-0.5", "-top-1", "-top-2", "-top-4",
    "sm:-top-1", "md:-top-1",
    "top-0", "top-2.5", "top-4", "top-8", "top-1/2",
    "md:top-6", "md:top-auto",
    "lg:top-8",

    // Position - bottom
    "bottom-0", "bottom-4", "bottom-8", "bottom-10", "bottom-20", "bottom-24",
    "md:bottom-12", "md:bottom-32",
    "lg:bottom-14", "lg:bottom-40",
    "sm:bottom-6",
    
    // Z-index
    "z-0", "z-10", "z-20", "z-30", "z-40", "z-50",
    
    // Position types
    "absolute", "relative", "fixed", "sticky",
    "inset-0", "inset-y-0", "inset-x-0",
    
    // ========================================
    // TRANSFORM CLASSES
    // ========================================
    "-translate-x-1/2", "-translate-y-1/2",
    "translate-x-0", "translate-y-0", "translate-y-8",
    "md:translate-x-0",
    
    // Scale
    "scale-95", "scale-100", "scale-105",
    "hover:scale-105", "hover:scale-110", "hover:scale-102",
    "active:scale-95",
    
    // ========================================
    // WIDTH CLASSES
    // ========================================
    
    // Base widths
    "w-full", "w-auto", "w-screen",
    "w-0.5", "w-1", "w-2", "w-2.5", "w-3", "w-4", "w-5", "w-6", "w-8", "w-10", "w-12", "w-14", "w-16", "w-20", "w-24",
    "w-1/2", "w-1/3", "w-2/3", "w-1/4", "w-3/4",
    
    // Arbitrary widths
    "w-[50px]", "w-[86px]", "w-[100px]", "w-[120px]", "w-[140px]", "w-[180px]", "w-[200px]", "w-[320px]", "w-[384px]", "w-[362px]", "w-[45%]",
    
    // Responsive widths
    "w-40", "sm:w-10", "sm:w-12", "sm:w-40", "sm:w-[60px]", "sm:w-[120px]",
    "md:w-10", "md:w-12", "md:w-20", "md:w-24", "md:w-[140px]", "md:w-[450px]",
    "lg:w-[180px]",
    "lg:w-64", "lg:w-72", "lg:w-[750px]",
    "xl:w-72",
    
    // Max widths
    "max-w-24", "max-w-28", "max-w-32", "max-w-36", "max-w-40", "max-w-44", "max-w-48",
    "max-w-md", "max-w-lg", "max-w-xl", "max-w-2xl", "max-w-3xl", "max-w-4xl", "max-w-5xl", "max-w-6xl", "max-w-7xl",
    "max-w-[55%]", "max-w-[90%]", "max-w-[280px]", "max-w-[362px]", "max-w-[384px]", "max-w-[400px]", "max-w-[500px]", "max-w-[550px]", "max-w-[580px]", "max-w-[600px]", "max-w-[640px]", "max-w-[700px]", "max-w-[800px]", "max-w-[900px]", "max-w-[1000px]", "max-w-[1100px]", "max-w-[1440px]",
    "sm:max-w-28", "sm:max-w-32", "sm:max-w-36", "sm:max-w-[85%]", "sm:max-w-[500px]",
    "md:max-w-36", "md:max-w-40", "md:max-w-44", "md:max-w-[400px]", "md:max-w-[550px]", "md:max-w-[600px]", "md:max-w-[900px]",
    "lg:max-w-[500px]", "lg:max-w-[600px]", "lg:max-w-[640px]", "lg:max-w-[1000px]",
    "xl:max-w-[1100px]",
    
    // Min widths
    "min-w-0", "min-w-40", "min-w-[180px]", "min-w-[200px]",
    "sm:min-w-48", "sm:min-w-56", "sm:min-w-[180px]",
    
    // ========================================
    // HEIGHT CLASSES
    // ========================================
    
    // Base heights
    "h-auto", "h-full", "h-screen", "h-2/3",
    "h-0.5", "h-1", "h-2", "h-2.5", "h-3", "h-4", "h-5", "h-6", "h-8", "h-10", "h-12", "h-14", "h-16", "h-20", "h-24", "h-72",
    
    // Arbitrary heights
    "h-[50px]", "h-[80%]", "h-[95%]",
    "h-[86px]", "h-[100px]", "h-[120px]", "h-[140px]", "h-[180px]", "h-[280px]", "h-[300px]", "h-[320px]", "h-[350px]", "h-[400px]", "h-[424px]", "h-[450px]", 
    "h-[480px]", "h-[494px]", "h-[500px]", "h-[520px]", "h-[524px]", "h-[542px]", "h-[550px]", "h-[600px]", "h-[624px]", "h-[650px]",
    
    // Responsive heights
    "h-40", "sm:h-40", "sm:h-[60px]", "sm:h-[120px]", "sm:h-[400px]", "sm:h-[450px]", "sm:h-[500px]", "sm:h-[550px]", "sm:h-[600px]",
    "md:h-10", "md:h-0.5", "md:h-12", "md:h-20", "md:h-24", "md:h-[95%]", "md:h-[140px]", "md:h-[400px]", "md:h-[520px]", "md:h-[560px]", "md:h-[620px]", "md:h-[700px]",
    "lg:h-[180px]",
    "lg:h-1", "lg:h-full", "lg:h-[86px]", "lg:h-[300px]", "lg:h-[400px]", "lg:h-[424px]", "lg:h-[500px]", "lg:h-[524px]", "lg:h-[600px]", "lg:h-[624px]", "lg:h-[650px]",
    "xl:h-[424px]", "xl:h-[524px]", "xl:h-[624px]", "xl:h-[650px]",
    
    // Max heights
    "max-h-6", "max-h-8", "max-h-10", "max-h-12", "max-h-14", "max-h-72",
    "sm:max-h-8", "sm:max-h-10", "sm:max-h-12",
    "md:max-h-10", "md:max-h-12", "md:max-h-14",
    "lg:max-h-12", "lg:max-h-14",
    
    // Min heights
    "min-h-10", "min-h-12", "min-h-14", "min-h-60", "min-h-[52px]", "min-h-[200px]", "min-h-[220px]",
    "min-h-[350px]", "min-h-[400px]", "min-h-[450px]", "min-h-[494px]", "min-h-[542px]",
    "sm:min-h-14", "sm:min-h-16", "sm:min-h-[52px]", "sm:min-h-[220px]", "sm:min-h-[400px]",
    "lg:min-h-60", "lg:min-h-[450px]",
    
    // ========================================
    // FLEXBOX & GRID CLASSES
    // ========================================
    
    // Display
    "flex", "inline-flex", "grid", "inline-grid", "block", "inline-block", "hidden",
    "md:flex", "md:inline-flex", "md:grid", "md:block", "md:hidden",
    "lg:flex", "lg:grid", "lg:hidden",
    "sm:flex", "sm:hidden",
    
    // Flex direction
    "flex-row", "flex-col",
    "sm:flex-row", "md:flex-row", "lg:flex-row",
    
    // Flex wrap
    "flex-wrap", "flex-nowrap",
    
    // Flex properties
    "flex-1", "flex-shrink-0", "shrink-0",
    
    // Align items
    "items-start", "items-center", "items-end", "items-stretch",
    "md:items-center",
    
    // Justify content
    "justify-start", "justify-center", "justify-end", "justify-between", "justify-around",
    "md:justify-start", "md:justify-center", "md:justify-end",
    
    // Gap
    "gap-0.5", "gap-1", "gap-1.5", "gap-2", "gap-3", "gap-4", "gap-5", "gap-6", "gap-8", "gap-10", "gap-12", "gap-16",
    "gap-[5px]", "gap-[10px]",
    "gap-x-2", "gap-x-4", "gap-x-6", "gap-y-4", "gap-y-6", "gap-y-8",
    "sm:gap-3", "sm:gap-4", "sm:gap-6", "sm:gap-8", "sm:gap-[10px]",
    "md:gap-4", "md:gap-6", "md:gap-8", "md:gap-10", "md:gap-12",
    "lg:gap-6", "lg:gap-8", "lg:gap-12", "lg:gap-16",
    
    // Grid columns
    "grid-cols-1", "grid-cols-2", "grid-cols-3", "grid-cols-4", "grid-cols-5", "grid-cols-6",
    "sm:grid-cols-2", "sm:grid-cols-3",
    "md:grid-cols-2", "md:grid-cols-3", "md:grid-cols-4",
    "lg:grid-cols-2", "lg:grid-cols-3", "lg:grid-cols-4", "lg:grid-cols-5",
    "xl:grid-cols-4", "xl:grid-cols-5",
    
    // Grid rows
    "row-span-2", "row-span-3", "row-span-4",
    "col-span-2", "col-span-3", "col-span-full",
    
    // Order
    "order-first", "order-last", "order-1", "order-2",
    "lg:order-first", "lg:order-last", "lg:order-1", "lg:order-2",
    
    // ========================================
    // SPACING - MARGIN
    // ========================================
    
    // Margin all
    "m-0", "m-1", "m-2", "m-3", "m-4", "m-6", "m-8",
    
    // Margin X/Y
    "mx-auto", "mx-2", "mx-3", "mx-4",
    "my-2", "my-3", "my-4",
    
    // Margin top
    "mt-0", "mt-1", "mt-2", "mt-3", "mt-4", "mt-5", "mt-6", "mt-8",
    "sm:mt-4", "md:mt-4", "md:mt-6",
    
    // Margin bottom
    "mb-0", "mb-1", "mb-2", "mb-3", "mb-4", "mb-5", "mb-6", "mb-8", "mb-10", "mb-12", "mb-14", "mb-16", "mb-20",
    "sm:mb-3", "sm:mb-4", "sm:mb-6", "sm:mb-8", "sm:mb-14",
    "md:mb-3", "md:mb-4", "md:mb-5", "md:mb-6", "md:mb-8", "md:mb-10", "md:mb-12", "md:mb-14", "md:mb-16",
    "lg:mb-5", "lg:mb-6", "lg:mb-8", "lg:mb-10", "lg:mb-12", "lg:mb-20",
    
    // Margin left/right
    "ml-0", "ml-2", "ml-4", "mr-0", "mr-2", "mr-4",
    
    // ========================================
    // SPACING - PADDING
    // ========================================
    
    // Padding all
    "p-2", "p-3", "p-4", "p-5", "p-6", "p-8",
    "md:p-4", "md:p-5", "md:p-6", "lg:p-6",
    
    // Padding X
    "px-2", "px-3", "px-4", "px-5", "px-6", "px-8", "px-9", "px-12",
    "sm:px-4", "sm:px-6", "sm:px-8", "sm:px-12",
    "md:px-6", "md:px-8", "md:px-9", "md:px-10", "md:px-12", "md:px-16",
    "lg:px-8", "lg:px-9", "lg:px-12", "lg:px-16", "lg:px-20",
    "xl:px-20",
    "2xl:px-0",
    
    // Padding Y
    "py-0", "py-1.5", "py-2", "py-2.5", "py-3", "py-4", "py-6", "py-8", "py-12", "py-14", "py-16", "py-20", "py-28",
    "sm:py-2", "sm:py-3", "sm:py-4", "sm:py-8", "sm:py-12", "sm:py-14", "sm:py-16", "sm:py-20",
    "md:py-3", "md:py-4", "md:py-6", "md:py-8", "md:py-12", "md:py-16", "md:py-20",
    "lg:py-8", "lg:py-12", "lg:py-16", "lg:py-20", "lg:py-28",
    
    // Padding top/bottom
    "pt-2", "pt-4", "pt-6", "pt-8",
    "pb-2", "pb-4", "pb-6", "pb-8", "pb-12",
    "sm:pb-14",
    "md:pb-4", "md:pb-6", "md:pb-12",
    
    // Padding left/right
    "pl-4", "pl-16", "pr-4", "pr-16",
    "lg:pl-16", "lg:pr-16",
    
    // ========================================
    // TYPOGRAPHY
    // ========================================
    
    // Font families
    "font-sans", "font-serif", "font-mono",
    "font-inter", "font-playfair", "font-roboto", "font-montserrat", "font-poppins", "font-lora", "font-opensans",
    
    // Font sizes
    "text-xs", "text-sm", "text-base", "text-lg", "text-xl", "text-2xl", "text-3xl", "text-4xl", "text-5xl", "text-6xl",
    "text-[9px]", "text-[10px]", "text-[12px]", "text-[14px]", "text-[20px]", "text-[28px]", "text-[32px]",
    "sm:text-sm", "sm:text-base", "sm:text-lg", "sm:text-xl", "sm:text-2xl", "sm:text-3xl", "sm:text-4xl", "sm:text-5xl",
    "md:text-sm", "md:text-base", "md:text-lg", "md:text-xl", "md:text-2xl", "md:text-3xl", "md:text-4xl", "md:text-5xl",
    "lg:text-lg", "lg:text-xl", "lg:text-2xl", "lg:text-3xl", "lg:text-4xl", "lg:text-5xl", "lg:text-6xl",
    
    // Font weights
    "font-normal", "font-medium", "font-semibold", "font-bold",
    "sm:font-bold",
    
    // Line heights
    "leading-4", "leading-5", "leading-6", "leading-7", "leading-8", "leading-9", "leading-10",
    "leading-none", "leading-tight", "leading-snug", "leading-normal", "leading-relaxed", "leading-loose",
    "leading-[1.1]", "leading-[1.3]", "leading-[1.6]", "leading-[14px]", "leading-[18px]", "leading-[21px]", "leading-[30px]", "leading-[42px]",
    "sm:leading-7", "sm:leading-8",
    "md:leading-7", "md:leading-8", "md:leading-tight", "md:leading-[42px]",
    "lg:leading-[1.1]", "lg:leading-[30px]",
    
    // Letter spacing
    "tracking-tight", "tracking-normal", "tracking-wide", "tracking-wider", "tracking-widest",
    "tracking-[0%]", "tracking-[0.1px]", "tracking-[0.2px]",
    "tracking-[0.03em]", "tracking-[0.06em]", "tracking-[0.2em]",
    
    // Text transform
    "uppercase", "lowercase", "capitalize", "normal-case",
    
    // Text alignment
    "text-left", "text-center", "text-right",
    "sm:text-left", "sm:text-center", "sm:text-right",
    "md:text-left", "md:text-center", "md:text-right",
    "lg:text-left", "lg:text-center", "lg:text-right",
    
    // Text decoration
    "underline", "line-through", "no-underline",
    "hover:underline",
    
    // Text overflow
    "truncate", "line-clamp-1", "line-clamp-2", "line-clamp-3",
    "whitespace-nowrap", "whitespace-pre-line",
    
    // ========================================
    // COLORS - TEXT
    // ========================================
    "text-white", "text-black",
    "text-gray-100", "text-gray-200", "text-gray-300", "text-gray-400", "text-gray-500", "text-gray-600", "text-gray-700", "text-gray-800", "text-gray-900",
    "text-red-500", "text-red-600",
    "text-blue-500", "text-blue-600",
    "text-green-500", "text-green-600",
    "text-[#EEEEEE]", "text-[#181D25]", "text-[#252B42]", "text-[#666666]", "text-[#737373]",
    "hover:text-white", "hover:text-gray-900",
    
    // ========================================
    // COLORS - BACKGROUND
    // ========================================
    "bg-transparent", "bg-white", "bg-black",
    "bg-gray-50", "bg-gray-100", "bg-gray-200", "bg-gray-300", "bg-gray-400", "bg-gray-500", "bg-gray-600", "bg-gray-700", "bg-gray-800", "bg-gray-900",
    "bg-red-500", "bg-red-600",
    "bg-blue-500", "bg-blue-600",
    "bg-green-500", "bg-green-600",
    "bg-white/10", "bg-white/20", "bg-white/60", "bg-white/70", "bg-white/80",
    "bg-black/10", "bg-black/20", "bg-black/30", "bg-black/40", "bg-black/50",
    "bg-[#DCEEE7]", "bg-[#F7F7F7]", "bg-[#F9FAFB]", "bg-[#EBF4FF]", "bg-[#F3E8FF]",
    "hover:bg-white", "hover:bg-gray-50", "hover:bg-gray-100", "hover:bg-white/10",
    "hover:bg-[#3465F0]",
    
    // ========================================
    // BORDERS
    // ========================================
    
    // Border width
    "border", "border-0", "border-2",
    "border-t", "border-b", "border-l", "border-r",
    
    // Border color
    "border-white", "border-black", "border-transparent",
    "border-gray-100", "border-gray-200", "border-gray-300", "border-gray-400",
    "border-white/80",
    "border-[#EEEEEE]", "border-[#E0E5EB]",
    
    // Border radius
    "rounded", "rounded-sm", "rounded-md", "rounded-lg", "rounded-xl", "rounded-2xl", "rounded-3xl", "rounded-full",
    "rounded-[3px]",
    "md:rounded-2xl",
    
    // ========================================
    // SHADOWS
    // ========================================
    "shadow", "shadow-sm", "shadow-md", "shadow-lg", "shadow-xl", "shadow-2xl",
    "hover:shadow-lg", "hover:shadow-xl",
    
    // ========================================
    // EFFECTS
    // ========================================
    
    // Opacity
    "opacity-0", "opacity-50", "opacity-70", "opacity-80", "opacity-90", "opacity-100",
    "hover:opacity-80", "hover:opacity-90", "hover:opacity-100",
    
    // Backdrop
    "backdrop-blur-sm", "backdrop-blur",
    
    // Grayscale
    "grayscale", "grayscale-0",
    "hover:grayscale-0",
    
    // ========================================
    // TRANSITIONS & ANIMATIONS
    // ========================================
    "transition", "transition-all", "transition-colors", "transition-opacity", "transition-shadow", "transition-transform",
    "duration-100", "duration-150", "duration-200", "duration-300", "duration-500", "duration-700",
    "ease-in", "ease-out", "ease-in-out",
    "delay-100", "delay-200", "delay-300",
    
    // ========================================
    // OBJECT FIT & POSITION
    // ========================================
    "object-contain", "object-cover", "object-fill", "object-none",
    "object-center", "object-top", "object-bottom", "object-right-bottom",
    "bg-cover", "bg-center", "bg-no-repeat",
    
    // ========================================
    // OVERFLOW & VISIBILITY
    // ========================================
    "overflow-hidden", "overflow-auto", "overflow-scroll", "overflow-visible",
    "overflow-x-auto", "overflow-y-auto",
    "visible", "invisible",
    "pointer-events-none", "pointer-events-auto",
    
    // ========================================
    // CURSOR & INTERACTION
    // ========================================
    "cursor-pointer", "cursor-default", "cursor-not-allowed",
    "select-none", "select-text",
    "group", "group-hover:opacity-100",
    
    // ========================================
    // ASPECT RATIO
    // ========================================
    "aspect-square", "aspect-video", "aspect-auto", "aspect-[4/3]",
    "lg:aspect-square",
    
    // ========================================
    // SIZING - SPECIFIC COMPONENT CLASSES
    // ========================================
    
    // Badge/Icon sizes
    "w-14", "h-14",
    "lg:w-[86px]", "lg:h-[86px]",
    
    // Swiper/Carousel specific
    "swiper-slide", "swiper-wrapper",
    
    // ========================================
    // RESPONSIVE VISIBILITY
    // ========================================
    "sm:block", "sm:inline-block",
    "md:block", "md:inline-block",
    "lg:block", "lg:inline-block",
    "xl:block",
    
    // ========================================
    // FORM ELEMENTS
    // ========================================
    "resize-none",
    "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent", "focus:outline-none",
    
    // ========================================
    // SPACING FOR SPECIFIC COMPONENTS
    // ========================================
    
    // Space between (for flex children)
    "space-x-2", "space-x-4", "space-y-2", "space-y-4", "space-y-6", "space-y-12", "space-y-20",
    "lg:space-y-20",
    
    // Self alignment
    "self-start", "self-center", "self-end",
    
    // Place content
    "place-items-center",
    
    // ========================================
    // NAV BUTTON SPECIFIC (from hero/swiper)
    // ========================================
    "nav-button",
    "disabled:opacity-50", "disabled:cursor-not-allowed",
    
    // ========================================
    // HERO COMPONENT SPECIFIC CLASSES
    // ========================================
    
    // Hero1 specific - rounded container, progress bar
    "w-[18px]", "h-[18px]",
    "left-6", "right-6",
    "md:left-16", "md:right-16",
    "lg:left-28", "lg:right-28",
    "lg:bottom-14",
    "bg-white/30",
    "lg:opacity-0", "lg:group-hover:opacity-100",
    
    // Hero3 specific - rounded-[30px] arrows, blue pagination
    "w-[60px]", "h-[60px]",
    "rounded-[30px]",
    "w-3.5", "h-3.5",
    "border-[#EEEEEE]", "hover:border-[#3465F0]",
    "bg-[#3465F0]", "hover:bg-[#3465F0]",
    "text-[#3465F0]",
    
    // Hero4 specific - rectangular indicators, white SVG arrows
    "w-[62px]", "h-2.5",
    "bg-white/50", "hover:bg-white/70",
    "lg:left-10", "lg:right-10",
    "lg:w-8", "lg:h-12",
    "drop-shadow-lg",
    
    // Responsive min heights/widths for buttons
    "sm:min-w-48", "sm:min-h-14", "sm:min-w-56", "sm:min-h-16",
    "sm:text-xl", "lg:text-2xl",
    "sm:px-6", "sm:leading-8",
    "sm:font-bold",
    
    // Group hover for hero arrows
    "group-hover:opacity-100",
    "lg:group-hover:opacity-100",
    
    // Additional hover states
    "hover:text-white",
    "hover:w-2.5", "hover:h-2.5",
  ],
  theme: {
    // Container configuration to match merchant panel
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2.5rem",
        "2xl": "3rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
    },
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        "work-sans": ["Work Sans", "sans-serif"],
      },
      boxShadow: {
        "zatiq-blue": "0px 0px 8px 0px var(--primary-color-50)",
      },
      colors: {
        blue: {
          zatiq: "var(--primary-color)",
          "zatiq/15": "var(--primary-color-15)",
          "zatiq/10": "var(--primary-color-10)",
          "zatiq/25": "var(--primary-color-25)",
          "zatiq/50": "var(--primary-color-50)",
          "zatiq/75": "var(--primary-color-75)",
        },
        black: {
          full: "#000000",
          zatiq: "#383838",
          "2": "#4A4A4A",
          "3": "#CDCDCD",
          "4": "#E8E8E8",
          "1.1": "#16151A",
          "1.2": "#1F1E25",
          "18": "#18181B",
          "27": "#272727",
          "3f": "#3f3f46",
          disabled: "#AFAFAF",
        },
        landing: {
          primary: "var(--landing-primary-color)",
          "primary/15": "var(--landing-primary-color-15)",
          "primary/10": "var(--landing-primary-color-10)",
          "primary/25": "var(--landing-primary-color-25)",
          "primary/50": "var(--landing-primary-color-50)",
          secondary: "var(--landing-secondary-color)",
          "secondary/15": "var(--landing-secondary-color-15)",
          "secondary/10": "var(--landing-secondary-color-10)",
          "secondary/25": "var(--landing-secondary-color-25)",
          "secondary/50": "var(--landing-secondary-color-50)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
