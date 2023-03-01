var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const dataURLtoFile = (dataURl, filename) => {
    var _a;
    var arr = dataURl.split(','), mime = (_a = arr[0].match(/:(.*?);/)) === null || _a === void 0 ? void 0 : _a[1], bstr = window.atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};
export const getExtension = (filename, isVideo) => {
    var name = filename.split('.');
    return {
        fileName: name.length > 2 ? name.filter((x, i) => i < name.length - 1).join(".") : name[0],
        extension: isVideo ? 'png' : name[name.length - 1] || 'png',
    };
};
export const createImage = (canvas, filename) => {
    var image = canvas.toDataURL();
    var success = image.length > 100000;
    const file = success ? dataURLtoFile(image, filename) : null;
    const imageUrl = success ? URL.createObjectURL(file) : null;
    return [success, file, image, imageUrl];
};
export const createCanvas = (page, config) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var vp = page.getViewport();
        const canvas = document.createElement('canvas');
        canvas.width = config.width || 300;
        canvas.height = config.height || 200;
        var scale = Math.min(canvas.width / vp.width, canvas.height / vp.height);
        return page
            .render({
            canvasContext: canvas.getContext('2d'),
            viewport: page.getViewport({ scale }),
        })
            .promise.then(() => {
            return canvas;
        })
            .catch((err) => {
            console.log(err);
            return err;
        });
    }
    catch (err) {
        return err;
    }
});
//# sourceMappingURL=createThumbImage.js.map