import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { dark } from "@clerk/themes";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { ModalProvider } from "@/components/providers/modal-provider";
import { cn } from "@/lib/utils";
import { SocketProvider } from "@/components/providers/socket-provider";
import QueryProvider from "@/components/providers/query-provider";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Discord Clone",
	description: "A discord clone made with Next.js",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider appearance={{ baseTheme: dark }}>
			<html lang="en" suppressHydrationWarning>
				<body className={cn(font.className, "bg-white dark:bg-[#313338]")}>
					<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
						<SocketProvider>
							<ModalProvider />
							<QueryProvider>{children}</QueryProvider>
						</SocketProvider>
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
