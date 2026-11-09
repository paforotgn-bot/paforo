import type { Metadata } from 'next';
import { Archivo, JetBrains_Mono } from 'next/font/google';
import './globals.css';

// Un solo grotesk para todo. Variable, para poder apretar el peso en los
// titulares sin cargar un fichero por corte.
const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

const mono = JetBrains_Mono({
  variable: '--font-mono-ui',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://paforo.com'),
  title: 'Paforo — Pablo Fontanet',
  description:
    'Construyo webs y software para negocios de Tarragona. Ticketeras, plataformas de gestión y webs que posicionan.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${archivo.variable} ${mono.variable} antialiased`}>
      <body className="grain min-h-svh bg-ink text-paper">{children}</body>
    </html>
  );
}
