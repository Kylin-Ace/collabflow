import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CollabFlow — Project management, in sync",
  description: "A thoughtful workspace for planning projects and moving work forward together.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en"><body>{children}</body></html>;
}
