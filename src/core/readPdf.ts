import { Config, DocTypes } from './interface';
import { createCanvas, createImage } from "./createThumbImage";
const pdfjsDist =  require("pdfjs-dist")

const readPdf = (pdf:DocTypes, config:Config) => {
  pdfjsDist.getDocument(pdf).promise.then( doc => {
		const pages:number[] = [];
    if (config.pages) {
      if (Array.isArray(config.pages)) {
        pages.push(...config.pages);
      } else {
        switch (typeof config.pages) {
          case "number":
            pages.push(config.pages)
            break
          case "string":
            const csv = config.pages.split(',')
            csv.map(_csv => {
              const ranged = _csv.split("-")
              if (ranged.length > 1) { for (let i = Number(ranged[0]); i <= Number(ranged[1]); i++) {pages.push(i)}}
              else {pages.push(Number(ranged[0]))}
            })
            break;
        }
      }
    }
		while (pages.length < doc.numPages) pages.push(pages.length + 1);

		return Promise.all(
			pages.map(async num => {
				try {
          const page = await doc
            .getPage(num);
          createCanvas(page, config).then((canvas) => {
            console.log(canvas);
            return createImage(canvas, config.name ?? 'output-image.jpg');
          });
        } catch (err) {
          return [false, err];
        }
			})
		);
	});
};

export default readPdf
