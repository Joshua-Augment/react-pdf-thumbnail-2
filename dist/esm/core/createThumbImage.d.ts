import { PDFPageProxy } from 'pdfjs-dist/types/web/interfaces';
import { Config } from "./interface";
export declare const dataURLtoFile: (dataURl: string, filename: string) => File;
export declare const getExtension: (filename: string, isVideo: boolean) => {
    fileName: string;
    extension: string;
};
export declare const createImage: (canvas: HTMLCanvasElement, filename: string) => (string | boolean | File | null)[];
export declare const createCanvas: (page: PDFPageProxy, config: Config) => Promise<HTMLCanvasElement | string>;
