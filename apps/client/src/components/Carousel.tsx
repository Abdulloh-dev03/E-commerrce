'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import TiltedCard from './TiltedCard';
import { ProductType } from '@repo/types';
import { useGetProductsQuery } from '@/redux/productsApi';
import { Bouncy } from 'ldrs/react';
import 'ldrs/react/Bouncy.css'
import { Button } from './ui/button';
import { IoIosArrowBack, IoIosArrowForward  } from "react-icons/io";

interface StyleObj {
  x: string | number;
  y: string | number;
  scale: number;
  blur: number;
  zIndex: number;
  opacity: number;
}

const positionStylesList: StyleObj[] = [
  { x: '-100%', y: '-5%', scale: 1.5, blur: 30, zIndex: 11, opacity: 0 },
  { x: 0, y: 0, scale: 1, blur: 0, zIndex: 10, opacity: 1 },
  { x: '50%', y: '10%', scale: 0.8, blur: 10, zIndex: 9, opacity: 1 },
  { x: '90%', y: '20%', scale: 0.5, blur: 30, zIndex: 8, opacity: 1 },
  { x: '120%', y: '30%', scale: 0.3, blur: 40, zIndex: 7, opacity: 0 },
  { x: '150%', y: '40%', scale: 0.2, blur: 50, zIndex: 6, opacity: 0 },
  { x: '180%', y: '50%', scale: 0.1, blur: 60, zIndex: 5, opacity: 0 },
];

const hiddenStyle: StyleObj = {
  x: '200%',
  y: '60%',
  scale: 0.1,
  blur: 60,
  zIndex: 4,
  opacity: 0,
};

const Carousel: React.FC = () => {
  const router = useRouter();
  const { data: products = [], isLoading, isError } = useGetProductsQuery({});
  const numItems = products.length;
  const [order, setOrder] = useState<number[]>([]);
  const [direction, setDirection] = useState<'next' | 'prev' | null>(null);
  const [showDetail] = useState<boolean>(false);
  const [clickLock, setClickLock] = useState<boolean>(false);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const detailTl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (products.length > 0) {
      setOrder(Array.from({ length: products.length }, (_, i) => i));
    }
  }, [products.length]);

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, numItems);
  }, [numItems]);

  const handleNext = (): void => {
    if (clickLock || showDetail) return;
    setClickLock(true);
    setDirection('next');
  };

  const handlePrev = (): void => {
    if (clickLock || showDetail) return;
    setClickLock(true);
    setDirection('prev');
  };

  const handleSeeMore = (): void => {
    const centerProduct = products[order[1] ?? -1];
    if (centerProduct && centerProduct.id) {
      router.push(`/products/${centerProduct.id}`);
    }
  };


  useGSAP(
    () => {
      if (!direction) return;
      const tl = gsap.timeline({
        onComplete: () => {
          setOrder((prev) => {
          if (prev.length === 0) return prev; 
          if (direction === 'next') {
            const first = prev[0];
            if (first === undefined) return prev;
            return [...prev.slice(1), first];
          } else {
            const newOrder = [...prev];
            const lastItem = newOrder.pop();
            if (lastItem === undefined) return prev;
            newOrder.unshift(lastItem);
            return newOrder;
          }
        });
          setDirection(null);
          setClickLock(false);
        },
      });

      itemRefs.current.forEach((el, index) => {
        if (!el) return;
        const shift = direction === 'next' ? -1 : 1;
        const targetIndex = (index + shift + numItems) % numItems;
        const target = positionStylesList[targetIndex] || hiddenStyle;

        tl.to(
          el,
          {
            x: target.x,
            y: target.y,
            scale: target.scale,
            filter: `blur(${target.blur}px)`,
            zIndex: target.zIndex,
            opacity: target.opacity,
            duration: 0.5,
            ease: 'power1.inOut',
          },
          0
        );
      });
    },
    { dependencies: [direction] }
  );

  const centerProduct = products[order[1] ?? -1];


  useEffect(() => {
  if (!centerProduct || showDetail) return;

  const centerEl = itemRefs.current[1];
  if (!centerEl) return;

  const title = centerEl.querySelector(".introduce .title");
  const topic = centerEl.querySelector(".introduce .topic");
  const des = centerEl.querySelector(".introduce .des");
  const seeMore = centerEl.querySelector(".introduce .seeMore");

  gsap.fromTo(
    [title, topic, des, seeMore],
    {
      y: 20,
      opacity: 0,
      filter: "blur(10px)",
    },
    {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.12,
    }
  );
}, [centerProduct, showDetail]);


  useEffect(() => {
    const centerIndex = 1;
    const centerEl = itemRefs.current[centerIndex];
    if (!centerEl) return;

    const img = centerEl.querySelector('img');
    const introduce = centerEl.querySelector('.introduce');
    const detail = centerEl.querySelector('.detail');
    const dTitle = detail?.querySelector('.title');
    const dDes = detail?.querySelector('.des');
    const specs = detail?.querySelector('.specifications');
    const checkout = detail?.querySelector('.checkout');

    if (detailTl.current) {
      detailTl.current.kill();
    }

    detailTl.current = gsap.timeline({ paused: true });

    detailTl.current
      .to(introduce, { opacity: 0, duration: 0.5, ease: 'power1.inOut' })
      .to(img, { right: '50%', duration: 1.5, ease: 'power2.inOut' }, 0)
      .to(detail, { opacity: 1, duration: 0.5, ease: 'power1.inOut' }, 0.5)
      .fromTo(
        [dTitle, dDes, specs, checkout],
        { y: -30, filter: 'blur(10px)', opacity: 0 },
        {
          y: 0,
          filter: 'blur(0px)',
          opacity: 1,
          duration: 0.5,
          ease: 'power1.inOut',
          stagger: 0.2,
        },
        1
      );

    if (showDetail) {
      detailTl.current.play();
    } else {
      detailTl.current.reverse();
    }
  }, [showDetail, order]);

  const getItemClasses = (posIndex: number): string => {
    const base = 'absolute left-0 w-full sm:w-[85%] md:w-[75%] lg:w-[70%] h-full text-xs sm:text-sm md:text-base lg:text-[15px]';
    const transition = direction ? 'transition-none' : 'transition-all duration-500';
    const pointer = posIndex === 1 ? 'pointer-events-auto' : 'pointer-events-none';
    return `${base} ${transition} ${pointer}`;
  };

  if (isLoading) {
    return (
      <div 
  className="flex justify-center items-center h-screen">
  <Bouncy
  size="80"
  speed="1.75"
  color="gray" 
/></div>
    );
  }

  if (isError) {
    return (
      <div className="relative h-96 sm:h-[500px] md:h-[600px] lg:h-[800px] overflow-hidden mt-[-50px] flex items-center justify-center">
        <div className="text-lg sm:text-xl md:text-2xl font-medium text-red-600">Failed to load products</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="relative h-96 sm:h-[500px] md:h-[600px] lg:h-[800px] overflow-hidden mt-[-50px] flex items-center justify-center">
        <div className="text-lg sm:text-xl md:text-2xl font-medium">No products available</div>
      </div>
    );
  }

  const getProductImage = (product: ProductType): string => {
    // Prefer first image from first variant with images
    const fromVariant = product?.variants?.find(
      (v) => Array.isArray(v.images) && v.images.length > 0
    )?.images?.[0];

    if (typeof fromVariant === "string" && fromVariant.length > 0) {
      return fromVariant;
    }

    // Backward compatibility: support legacy product.images if it exists
    // @ts-expect-error legacy field on some payloads
    if (product && product.images) {
      // @ts-expect-error legacy field on some payloads
      if (typeof product.images === "string") {
        // @ts-expect-error legacy field on some payloads
        return product.images;
      }
      // @ts-expect-error legacy field on some payloads
      if (typeof product.images === "object" && product.images !== null) {
        // @ts-expect-error legacy field on some payloads
        const imageValues = Object.values(product.images as Record<string, string>);
        return (imageValues[0] as string) || "/placeholder.png";
      }
    }

    return "/placeholder.png";
  };

  return (
    <div
      className={`relative h-96 sm:h-[450px] md:h-[500px] lg:h-[600px] overflow-hidden mt-8 px-2 sm:px-4 ${direction || ''}`}
    >
      <div className="absolute w-full lg:max-w-[1140px] h-[80%] left-1/2 -translate-x-1/2 ">
        {order.map((prodIndex, posIndex) => {
          const product = products[prodIndex];
          if (!product) return null;

          const isCenter = posIndex === 1;
          const itemClasses = getItemClasses(posIndex);
          const initialStyle = positionStylesList[posIndex] || hiddenStyle;

          return (
            <div
              key={product.id}
              className={itemClasses}
              ref={(el) => {
                itemRefs.current[posIndex] = el;
              }}
              style={{
                transform: `translateX(${initialStyle.x}) translateY(${initialStyle.y}) scale(${initialStyle.scale})`,
                filter: `blur(${initialStyle.blur}px)`,
                zIndex: initialStyle.zIndex,
                opacity: initialStyle.opacity,
              }}
            >
              <div
                className={`w-1/2 sm:w-[55%] md:w-[50%] absolute right-0 top-1/2 -translate-y-1/2 object-contain ${
                  direction ? 'transition-none' : 'transition-[right] duration-[1.5s]'
                }`}
              >
                <TiltedCard
                  imageSrc={getProductImage(product)}
                  altText={product.name}
                  captionText={product.name}
                  containerHeight="300px"
                  containerWidth="300px"
                  imageHeight="300px"
                  imageWidth="300px"
                  rotateAmplitude={12}
                  scaleOnHover={1.2}
                  showMobileWarning={false}
                  showTooltip={true}
                  displayOverlayContent={true}
                />
              </div>

              <div
                className={`introduce ${
                  !showDetail && isCenter ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                } w-full sm:w-80 md:w-96 lg:w-[400px] absolute top-1/2 -translate-y-1/2 px-2 sm:px-0 ${
                  direction ? 'transition-none' : 'transition-opacity duration-500'
                }`}
              >
                <div className="title text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-tight line-clamp-2">
                  {product.name}
                </div>

                <div className="hidden md:block text-sm md:text-base lg:text-lg text-gray-600 my-1 md:my-2 line-clamp-2">
                  {product.shortDescription || 'No short description available'}
                </div>

                <button
                  onClick={handleSeeMore}
                  className="mt-2 sm:mt-[1.2em] py-1 sm:py-[5px] border-0 border-b border-gray-600 bg-transparent font-bold text-xs sm:text-sm md:text-base lg:tracking-[3px] transition-bg duration-500 hover:bg-gray-200 hover:dark:text-zinc-700 cursor-pointer"
                >
                  SEE MORE →
                </button>
              </div>

              <div
                className={`detail ${
                  showDetail && isCenter
                    ? 'opacity-100 w-1/2 absolute right-0 top-1/2 -translate-y-1/2 text-right pointer-events-auto'
                    : 'opacity-0 pointer-events-none'
                } ${direction ? 'transition-none' : 'transition-opacity duration-500'}`}
              >
                <div className="title text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                  {product.name}
                </div>
                <div className="des text-sm sm:text-base md:text-lg">
                  {product.description || 'No description available'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-2.5 w-full flex justify-between left-1/2 -translate-x-1/2 px-2 sm:px-4">
        <Button
          onClick={handlePrev}
          variant={"outline"}
          className='cursor-pointer'
        >
          <IoIosArrowBack/>
        </Button>

        <Button
          onClick={handleNext}
          variant={"outline"}
          className='cursor-pointer'
        >
          <IoIosArrowForward />
        </Button>
      </div>    
    </div>
  );
};

export default Carousel;
