import { TypedArray, DocumentInitParameters } from './../../node_modules/pdfjs-dist/types/src/display/api.d';
export interface Config {
  width ?: number,
  height ?: number,
  fileName ?: string,
  name ?: string,
  pages ?: number | number[] | string
}

export type DocTypes = string | URL | TypedArray | ArrayBuffer | DocumentInitParameters