"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// This is a temporary solution to fix the build error
// This page should be removed completely in future updates
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="p-8 w-full max-w-md mx-auto">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">Login Functionality Removed</h2>
          <p className="mb-6">
            The login functionality has been deprecated in this version of the application.
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
