"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface RepositoryLoaderProps {
  message?: string;
  size?: number;
}

const RepositoryLoader: React.FC<RepositoryLoaderProps> = ({
  message = "Loading repository data...",
  size = 48
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="relative mb-4">
            <Loader2 
              size={size} 
              className="text-primary animate-spin" 
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[30%] h-[30%] rounded-full bg-background"></div>
            </div>
          </div>
          
          <motion.h3 
            className="text-lg font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {message}
          </motion.h3>
          
          <motion.div 
            className="mt-4 flex space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: "300ms" }}></div>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: "600ms" }}></div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export { RepositoryLoader };
