declare module "*.css";
declare module "*.scss";
declare module "*.sass";


// Global declaration for GA helper injected in layout head
declare global {
	interface Window {
		gtagSendEvent?: (url: string) => boolean;
	}
}

// export {};