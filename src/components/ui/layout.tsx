import { Toaster } from "@/components/ui/toast";

type CardProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: CardProps) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
