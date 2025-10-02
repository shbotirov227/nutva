"use client";

import {
	HydrationBoundary,
  // QueryClient,
  dehydrate,
	QueryClientProvider
} from "@tanstack/react-query";
import {
	ReactNode,
	// useState
} from "react";
import { queryClient } from "@/lib/queryClient";
import "@/i18n";

export function QueryProvider({ children }: { children: ReactNode }) {
	// const [client] = useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			<HydrationBoundary state={dehydrate(queryClient)}>
				{children}
			</HydrationBoundary>
		</QueryClientProvider>
	);
}
