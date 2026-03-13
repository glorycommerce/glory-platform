import Image from "next/image";

type BannerSlotProps = {
  title: string;
};

export function BannerSlot({ title }: BannerSlotProps) {
  const slot =
    title === "Left Promo Slot"
      ? {
          image: "/category-accessories-glory.svg",
          eyebrow: "Accessories Edit",
          heading: "Layered necklaces",
          body: "Distinct jewelry-led artwork tailored for accessory promotions.",
        }
      : title === "Right Promo Slot"
        ? {
            image: "/category-hijabs-glory.svg",
            eyebrow: "Hijab Story",
            heading: "Premium scarves",
            body: "Dedicated scarf-focused artwork built for high-readability promotion slots.",
          }
        : {
            image: "/hero-glory-editorial.svg",
            eyebrow: "Campaign Preview",
            heading: "Featured products",
            body: "A unique in-house campaign visual for homepage drops and timed edits.",
          };

  return (
    <div className='group relative flex h-full min-h-[20rem] overflow-hidden rounded-[1.75rem] border border-black/5 bg-[linear-gradient(180deg,#f7ecd9_0%,#d6bf97_100%)]'>
      <Image
        src={slot.image}
        alt={slot.heading}
        fill
        sizes='(min-width: 768px) 33vw, 100vw'
        className='object-contain object-center p-3 transition duration-500 group-hover:scale-[1.02]'
      />
      <div className='absolute inset-0 bg-gradient-to-t from-black/72 via-black/28 to-transparent' />
      <div className='relative mt-auto p-6 text-white'>
        <p className='text-xs uppercase tracking-[0.28em] text-white/82'>
          {slot.eyebrow}
        </p>
        <h3 className='mt-2 max-w-[15rem] text-[2rem] leading-[1.05] font-semibold text-balance'>
          {slot.heading}
        </h3>
        <p className='mt-3 max-w-[16rem] text-sm leading-6 text-white/88'>
          {slot.body}
        </p>
      </div>
    </div>
  );
}
