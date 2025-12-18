import "./globals.css";

export const metadata = {
  title: "Projector Mapping Tool",
  description:
    "Design, calibrate, and transform surfaces with our advanced mapping tool.",
  icons: {
    icon: "/assets/images/favicon_icon.png",
    shortcut: "/assets/images/favicon_icon.png",
    apple: "/assets/images/favicon_icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
