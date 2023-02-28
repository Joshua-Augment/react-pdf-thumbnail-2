import {Config} from "./interface"

export const dataURLtoFile = (dataURl : string, filename: string) => {
	var arr = dataURl.split(','),
		mime = arr[0].match(/:(.*?);/)?.[1],
		bstr = window.atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}

	return new File([u8arr], filename, { type: mime });
};

export const getExtension = (filename:string, isVideo:boolean) => {
	var name = filename.split('.');
	return {
		fileName: name.length > 2 ? name.filter((x,i)=>i < name.length - 1).join(".") : name[0],
		extension: isVideo ? 'png' : name[name.length - 1] || 'png',
	};
};

export const createImage = (canvas:HTMLCanvasElement, filename:string) => {
	var image = canvas.toDataURL();
	var success = image.length > 100000;
	const file = success ? dataURLtoFile(image, filename) : null;
	const imageUrl = success ? URL.createObjectURL(file as File) : null;  
	return [success, file, image, imageUrl];
};

export const createCanvas = (page, config:Config) => {
	try {
		var vp = page.getViewport(1);
		const canvas = document.createElement('canvas');
		canvas.width = config.width || 300;
		canvas.height = config.height || 200;
		var scale = Math.min(canvas.width / vp.width, canvas.height / vp.height);
    
		return page
			.render({
				canvasContext: canvas.getContext('2d'),
				viewport: page.getViewport(scale),
			})
			.promise.then(function () {
				return canvas;
			})
			.catch((err) => {
				console.log(err);
				return err;
			});
	} catch (err) {
		return err;
	}
}
