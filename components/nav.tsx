import Link from "next/link";
import CommandMenu from "@/components/command-menu";
import type { Category } from "@/lib/skills";
import Logo from "@/public/logo.svg";
import Image from "next/image";
import { Paperclip, PlusCircle } from "lucide-react";

export default function Nav({ categories = [] }: { categories?: Category[] }) {
  return (
    <nav className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
      <div className="px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <Link
            href="/"
            className="flex gap-4 items-center text-sm font-sans font-semibold text-foreground shrink-0"
          >
            <svg
              width="34"
              height="27"
              viewBox="0 0 38 27"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#filter0_g_67_2447)">
                <rect
                  x="0.029505"
                  y="-1.4139"
                  width="17.2205"
                  height="17.2205"
                  rx="5"
                  transform="matrix(0.692202 0.721704 -0.721707 0.692199 24.8015 3.16777)"
                  fill="#F8F4F2"
                  stroke="url(#paint0_linear_67_2447)"
                  strokeWidth="2"
                />
                <rect
                  x="-0.337446"
                  y="-1.37336"
                  width="19.3949"
                  height="19.3948"
                  rx="5"
                  transform="matrix(0.855406 0.517958 -0.51796 0.855405 14.8303 1.39734)"
                  fill="#F8F4F2"
                  stroke="url(#paint1_linear_67_2447)"
                  strokeWidth="2"
                />
                <rect
                  x="-1.0742"
                  y="-0.919832"
                  width="19.3949"
                  height="19.3948"
                  rx="5"
                  transform="matrix(0.997017 -0.0771848 0.0771822 0.997017 1.91284 5.93681)"
                  fill="#F8F4F2"
                  stroke="url(#paint2_linear_67_2447)"
                  strokeWidth="2"
                />
                <circle
                  cx="7.04814"
                  cy="11.996"
                  r="3.3184"
                  transform="rotate(6.19549 7.04814 11.996)"
                  fill="url(#paint3_linear_67_2447)"
                  stroke="#F8F4F2"
                  strokeWidth="3"
                />
                <path
                  d="M13.8271 16.4849C14.0191 17.7811 13.124 18.9877 11.8278 19.1797C10.5315 19.3718 9.32497 18.4767 9.13289 17.1804"
                  stroke="url(#paint4_linear_67_2447)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle
                  cx="14.3855"
                  cy="11.3392"
                  r="3.3184"
                  transform="rotate(6.19549 14.3855 11.3392)"
                  fill="url(#paint5_linear_67_2447)"
                  stroke="#F8F4F2"
                  strokeWidth="3"
                />
              </g>
              <defs>
                <filter
                  id="filter0_g_67_2447"
                  x="0.141439"
                  y="0.913818"
                  width="36.5515"
                  height="24.9041"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                  />
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.99900001287460327 0.99900001287460327"
                    numOctaves="3"
                    seed="3190"
                  />
                  <feDisplacementMap
                    in="shape"
                    scale="0"
                    xChannelSelector="R"
                    yChannelSelector="G"
                    result="displacedImage"
                    width="100%"
                    height="100%"
                  />
                  <feMerge result="effect1_texture_67_2447">
                    <feMergeNode in="displacedImage" />
                  </feMerge>
                </filter>
                <linearGradient
                  id="paint0_linear_67_2447"
                  x1="-18.1932"
                  y1="7.72915"
                  x2="64.3767"
                  y2="4.85326"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#FF7E0C" />
                  <stop offset="0.5" stop-color="#FEBB81" />
                  <stop offset="1" stop-color="#3F6FFF" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_67_2447"
                  x1="-20.7923"
                  y1="8.83331"
                  x2="73.5734"
                  y2="5.54657"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#FF7E0C" />
                  <stop offset="0.5" stop-color="#FEBB81" />
                  <stop offset="1" stop-color="#3F6FFF" />
                </linearGradient>
                <linearGradient
                  id="paint2_linear_67_2447"
                  x1="-20.7923"
                  y1="8.83331"
                  x2="73.5734"
                  y2="5.54657"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#FF7E0C" />
                  <stop offset="0.5" stop-color="#FEBB81" />
                  <stop offset="1" stop-color="#3F6FFF" />
                </linearGradient>
                <linearGradient
                  id="paint3_linear_67_2447"
                  x1="0.88262"
                  y1="12.0244"
                  x2="20.612"
                  y2="11.3372"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#FF7E0C" />
                  <stop offset="0.5" stop-color="#FEBB81" />
                  <stop offset="1" stop-color="#3F6FFF" />
                </linearGradient>
                <linearGradient
                  id="paint4_linear_67_2447"
                  x1="3.69849"
                  y1="19.2037"
                  x2="28.8099"
                  y2="13.6766"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#FF7E0C" />
                  <stop offset="0.5" stop-color="#FEBB81" />
                  <stop offset="1" stop-color="#3F6FFF" />
                </linearGradient>
                <linearGradient
                  id="paint5_linear_67_2447"
                  x1="8.22002"
                  y1="11.3676"
                  x2="27.9494"
                  y2="10.6805"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#FF7E0C" />
                  <stop offset="0.5" stop-color="#FEBB81" />
                  <stop offset="1" stop-color="#3F6FFF" />
                </linearGradient>
              </defs>
            </svg>
            Designer Skills
          </Link>
          <span className="text-border hidden sm:block">|</span>
          <p className="text-sm text-muted-foreground hidden sm:block truncate">
            A small library of Agent skills for designers
          </p>
        </div>

        <div className="shrink-0">
          <CommandMenu categories={categories} />
        </div>
      </div>
    </nav>
  );
}
