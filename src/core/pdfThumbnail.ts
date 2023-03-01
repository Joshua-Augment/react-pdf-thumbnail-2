import { getExtension } from './createThumbImage';
import { Config } from "./interface";
import readPdf from './readPdf';


const pdfThumbnail = (data:File | File[], config: Config) => {
	return new Promise( async (resolve, reject) => {
		const file = Array.isArray(data) ? data[0] : data; 
    const arrBuffer = await file.arrayBuffer()
		const isVideo = config.fileName === undefined;
		const { extension } = getExtension(config.fileName ?? file.name,isVideo);

		if (/(pdf|zip|doc)$/gi.test(extension)) {
			try {
				resolve(readPdf(arrBuffer, config));
			} catch (err) {
				reject({ error: true, errorDetails: err });
			}
		} else {
			reject({
				error: true,
				errorDetails: {
					wrongFile: true,
					message: 'File type is not pdf',
				},
			});
		}
	});
};

export default pdfThumbnail