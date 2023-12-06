"use client";
import Section from "@/components/account/section";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function SigninPage() {
  return (
    <main className="h-full p-4">
      <Section title="Members Sign In" className="max-w-sm">
        <div className="flex flex-col gap-8 p-2">
          <p className="text-sm">
            Sign in to continue to InternationalStudySpots.
          </p>
          <div className="flex flex-col gap-2">
            <Button
              className="flex flex-1 gap-2"
              variant="outline"
              onClick={() =>
                signIn("discord", { callbackUrl: "/" }, { prompt: "none" })
              }
            >
              <Image
                src="/auth-provider-logos/discord.svg"
                alt="Discord logo"
                height={20}
                width={20}
                className="h-4 w-4"
              />
              Continue with Discord
            </Button>
            <Button
              className="flex flex-1 gap-2"
              variant="outline"
              onClick={() => signIn("google", { callbackUrl: "/" })}
            >
              <Image
                src="/auth-provider-logos/google.svg"
                alt="Google logo"
                height={20}
                width={20}
                className="h-4 w-4"
              />
              Continue with Google
            </Button>
          </div>
          <Image
            src="/fatcat.gif"
            height={200}
            width={200}
            alt="A cat and a baguette"
            className="h-full w-full animate-fade-in duration-1000"
          />
        </div>
      </Section>
    </main>
  );
}
