import React from "react";
import { cn } from "@/lib/utils";
import Marquee from "./ui/marquee";

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
    <figure
      className={cn(
        "relative w-96 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

const Testimonials: React.FC = () => {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-background">
      {/* First Marquee: Ascending order */}
      <Marquee pauseOnHover className="[--duration:20s]">
        {sortedReviews.map((review) => (
          <ReviewCard key={review.id} {...review} />
        ))}
      </Marquee>

      {/* Second Marquee: Descending order */}
      

      {/* Gradient effect on edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  );
};

export default Testimonials;