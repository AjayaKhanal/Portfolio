import React from "react";
import { cn } from "../lib/utils";

export function CodeProfile({ data, fileName, ...rest }) {
  return (
    <div className="flex items-center justify-center font-sans bg-white dark:bg-zinc-950">
      <CoderProfileCard data={data} fileName={fileName} {...rest} />
    </div>
  );
}

export const CoderProfileCard = React.forwardRef(
  ({ data = {}, fileName = "code.js", className, ...rest }, ref) => {
  const skills = data.skills || [];
  return (
    <div
      ref={ref}
      className={cn(
        "max-w-2xl w-full mx-auto shadow-md dark:from-[#000000] dark:to-[#0a0d37] border-zinc-300 bg-zinc-100 dark:bg-zinc-900 dark:border-[#1b2c68a0] relative rounded-lg border shadow-lg",
        className
      )}
      {...rest}
    >
      <div className="flex flex-row">
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-pink-500 to-violet-600 opacity-70 dark:opacity-100"></div>
        <div className="h-[2px] w-full bg-gradient-to-r from-violet-600 to-transparent opacity-70 dark:opacity-100"></div>
      </div>

      <div className="px-4 lg:px-8 py-5 flex justify-between items-center bg-zinc-100 dark:bg-zinc-950">
        <div className="flex flex-row space-x-2">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-orange-400"></div>
          <div className="h-3 w-3 rounded-full bg-green-400"></div>
        </div>
        <div className="text-xs text-zinc-700 dark:text-gray-400 font-mono">
          {fileName}
        </div>
      </div>

      <div className="overflow-hidden border-t-[2px] border-zinc-300 dark:border-indigo-900 px-4 lg:px-8 py-4 lg:py-8 relative">
        <div className="absolute -top-24 -left-24 w-56 h-56 bg-blue-600 rounded-full opacity-0 dark:opacity-10 filter blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-pink-600 rounded-full opacity-0 dark:opacity-10 filter blur-3xl"></div>

        <div className="relative flex">
          <div className="hidden md:flex flex-col items-end pr-4  dark:text-gray-500 font-mono text-xs">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="leading-relaxed select-none opacity-70">
                {i + 1}
              </div>
            ))}
          </div>

          <code className="font-mono text-xs md:text-sm lg:text-base w-full">
            <div>
              <span className="mr-2 text-pink-500 dark:text-pink-400">
                const
              </span>
              <span className="mr-2 text-violet-500 dark:text-violet-400">
                coder
              </span>
              <span className="mr-2 text-pink-500 dark:text-pink-400">=</span>
              <span className="text-zinc-600 dark:text-gray-400">{"{"}</span>
            </div>
            <div className="pl-6">
              <span className="text-zinc-800 dark:text-white">name:</span>
              <span className="text-zinc-600 dark:text-gray-400">&#39;</span>
              <span className="text-green-600 dark:text-green-400">
                {data.name}
              </span>
              <span className="text-zinc-600 dark:text-gray-400">&#39;,</span>
            </div>
            <div className="pl-6">
              <span className="text-zinc-800 dark:text-white">role:</span>
              <span className="text-zinc-600 dark:text-gray-400">&#39;</span>
              <span className="text-green-600 dark:text-green-400">
                {data.role}
              </span>
              <span className="text-zinc-600 dark:text-gray-400">&#39;,</span>
            </div>
            <div className="pl-6">
              <span className="text-zinc-800 dark:text-white">country:</span>
              <span className="text-zinc-600 dark:text-gray-400">&#39;</span>
              <span className="text-green-600 dark:text-green-400">
                {data.location}
              </span>
              <span className="text-zinc-600 dark:text-gray-400">&#39;,</span>
            </div>
            <div className="pl-6">
              <span className="text-zinc-800 dark:text-white">skills:</span>
              <span className="text-zinc-600 dark:text-gray-400">{"["}</span>
              <div className="pl-6 flex flex-wrap">
                {skills.map((skill, index) => (
                  <span key={skill} className="mr-1">
                    <span className="text-zinc-700 dark:text-gray-400">
                      &#39;
                    </span>
                    <span className="text-cyan-600 dark:text-cyan-400">
                      {skill}
                    </span>
                    <span className="text-zinc-700 dark:text-gray-400">
                      &#39;
                    </span>
                    {index < skills.length - 1 && (
                      <span className="text-zinc-800 dark:text-gray-400">
                        ,{" "}
                      </span>
                    )}
                  </span>
                ))}
              </div>
              <span className="text-zinc-600 dark:text-gray-400">{"],"}</span>
            </div>
            <div>
              <span className="text-zinc-600 dark:text-gray-400">{"};"}</span>
            </div>
          </code>
        </div>
      </div>

      <div className="px-4 lg:px-8 pb-4 mt-4 border-t border-zinc-300 dark:border-gray-800 pt-3 text-xs text-zinc-600 dark:text-gray-500 flex justify-between items-center">
        <span>UTF-8</span>
        <span>JavaScript</span>
        <span>Ln 12, Col 2</span>
      </div>
    </div>
  );
  }
);

CoderProfileCard.displayName = "CoderProfileCard";
