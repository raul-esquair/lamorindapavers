"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { Service } from "@/lib/data/services";

interface ServiceCardProps {
  service: Service;
  className?: string;
  sizes?: string;
}

export default function ServiceCard({ service, className = "", sizes }: ServiceCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Parallax: image moves slower than scroll
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  // 3D tilt on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -8, y: x * 8 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovering(false);
  };

  return (
    <motion.div
      style={{
        perspective: 800,
      }}
    >
      <motion.div
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <Link
          ref={cardRef}
          href={`/services/${service.slug}`}
          className={`group block relative rounded-xl overflow-hidden ${className}`}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={handleMouseLeave}
        >
          {/* Parallax image container */}
          {service.image ? (
            <motion.div
              className="absolute inset-[-16%] will-change-transform"
              style={{ y: imageY }}
            >
              <Image
                src={service.image}
                alt={service.name}
                fill
                style={{ objectPosition: service.imagePosition || "center" }}
                className="object-cover"
                sizes={sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 to-brand-gold/10 group-hover:from-brand-blue/20 group-hover:to-brand-gold/20 transition-all duration-500" />
          )}

          {/* Overlay */}
          <div
            className={`absolute inset-0 transition-all duration-500 ${
              service.image
                ? "bg-gradient-to-t from-warm-gray-900/80 via-warm-gray-900/20 to-warm-gray-900/5 group-hover:from-warm-gray-900/90 group-hover:via-warm-gray-900/30"
                : ""
            }`}
          />

          {/* Shine effect on hover */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: isHovering
                ? `radial-gradient(circle at ${(tilt.y / 8 + 0.5) * 100}% ${(tilt.x / -8 + 0.5) * 100}%, rgba(255,255,255,0.08) 0%, transparent 60%)`
                : "none",
            }}
          />

          {/* Icon badge */}
          {service.icon && (
            <div
              className="absolute top-4 left-4 md:top-5 md:left-5 w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center"
              style={{ transform: "translateZ(30px)" }}
            >
              <img
                src={service.icon}
                alt=""
                className="w-6 h-6 md:w-7 md:h-7 brightness-0 invert"
              />
            </div>
          )}

          {/* Content */}
          <div
            className="absolute inset-0 flex flex-col justify-end p-6 md:p-8"
            style={{ transform: "translateZ(20px)" }}
          >
            <h3 className="text-xl md:text-2xl font-serif text-white group-hover:text-brand-gold transition-colors mb-2">
              {service.name}
            </h3>
            <p className="text-sm font-sans text-warm-gray-300 line-clamp-2">
              {service.shortDescription}
            </p>

            <div className="flex items-center gap-1 mt-3 text-brand-gold text-sm font-sans font-medium opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              Learn More
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
