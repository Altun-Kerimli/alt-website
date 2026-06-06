import "@/app/globals.css";

export const metadata = {
  title: "System Auth - ALT INC",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}