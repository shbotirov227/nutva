/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "*.css";
declare module "*.scss";
declare module "*.sass";
// global.d.ts
declare module "swiper/css";
declare module "swiper/css/pagination";
declare module "swiper/css/effect-fade";

declare module "pdfjs-dist/webpack.mjs" {
  const value: any;
  export = value;
}


// Global declaration for GA helper injected in layout head
// declare global {
	interface Window {
		gtagSendEvent?: (url: string) => boolean;
	}
// }

// export {};