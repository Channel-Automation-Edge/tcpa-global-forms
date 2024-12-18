import React from "react";
import Marquee from "./ui/marquee";
import BlurFade from "./ui/blur-fade";

interface Review {
  name: string;
  id: string;
  body: string;
  img: string;
}

const reviews: Review[] = [
  {
    name: "Emily R.",
    id: "1",
    body: "I was blown away by the quality of service I received from this company. The contractor who came to my home was knowledgeable, professional, and friendly. He explained everything in detail and made sure I was comfortable with the work before starting. I highly recommend this company to anyone looking for reliable and trustworthy contractors.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "David K.",
    id: "2",
    body: "I've had my fair share of bad experiences with contractors in the past, but this company exceeded my expectations in every way. The consultation was thorough, the estimate was accurate, and the work was completed on time. The contractor even cleaned up after himself, which was a nice touch. I'll definitely be using this company again in the future.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "Sarah T.",
    id: "3",
    body: "I was hesitant to hire a contractor for my home repair project, but this company made the process so easy and stress-free. The contractor who came to my home was friendly and courteous, and he took the time to explain everything in detail. The work was completed quickly and efficiently, and the price was very reasonable. I highly recommend this company to anyone looking for a hassle-free experience",
    img: "https://avatar.vercel.sh/james",
  },
];

const sortedReviews = [...reviews].sort((a, b) => a.id.localeCompare(b.id)); // Ascending order

const ReviewCard: React.FC<Review> = ({ img, name, body }) => {
  return (
    <figure className="relative w-96 cursor-pointer overflow-hidden rounded-xl border p-4">
      <div className="absolute inset-0 bg-lpurple opacity-90"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img className="rounded-full" width="32" height="32" alt="" src={img} />
            <figcaption className="text-sm font-medium text-gray-900">{name}</figcaption>
          </div>
          
        </div>
        <div className="flex items-center mt-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <svg key={index} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09L5.5 10.18 1 6.18l5.932-.862L10 1l3.068 4.318L19 6.18l-4.5 4L15.878 18z" />
            </svg>
          ))}
        </div>
        <hr className="my-2 border-gray-300" />
        <blockquote className="text-sm text-gray-700">{body}</blockquote>
      </div>
    </figure>
  );
};

const Testimonials: React.FC = () => {
  return (
    <div>
      <div className="relative flex w-full pt-16 pb-10 flex-col   items-center justify-center overflow-hidden bg-white">
        <div className="text-center">
          <BlurFade delay={3 * 0.15} inView yOffset={15} className="font-semibold text-2xl md:text-3xl text-gray-800 dark:text-neutral-200 mb-[25px]">
            What our  <span className="text-xorange">satisfied</span> clients say about us
          </BlurFade>
          <p className="mt-2 md:mt-4 text-gray-500 dark:text-neutral-500"></p>
        </div>

        <BlurFade delay={6 * 0.15} inView yOffset={15}>
        {/* First Marquee: Ascending order */}
        <Marquee pauseOnHover className="[--duration:20s]">
          {sortedReviews.map((review) => (
            <ReviewCard key={review.id} {...review} />
          ))}
        </Marquee>


        </BlurFade>
        <div className="hidden sm:block pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
        <div className="hidden sm:block pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
      </div>
    </div>
  );
};

export default Testimonials;
