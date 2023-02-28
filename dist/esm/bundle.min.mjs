const dataURLtoFile = (dataURl, filename) => {
  var arr = dataURl.split(','),
    mime = arr[0].match(/:(.*?);/)?.[1],
    bstr = window.atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {
    type: mime
  });
};
const getExtension = (filename, isVideo) => {
  var name = filename.split('.');
  return {
    fileName: name.length > 2 ? name.filter((x, i) => i < name.length - 1).join(".") : name[0],
    extension: isVideo ? 'png' : name[name.length - 1] || 'png'
  };
};
const createImage = (canvas, filename) => {
  var image = canvas.toDataURL();
  var success = image.length > 100000;
  const file = success ? dataURLtoFile(image, filename) : null;
  const imageUrl = success ? URL.createObjectURL(file) : null;
  return [success, file, image, imageUrl];
};
const createCanvas = (page, config) => {
  try {
    var vp = page.getViewport(1);
    const canvas = document.createElement('canvas');
    canvas.width = config.width || 300;
    canvas.height = config.height || 200;
    var scale = Math.min(canvas.width / vp.width, canvas.height / vp.height);
    return page.render({
      canvasContext: canvas.getContext('2d'),
      viewport: page.getViewport(scale)
    }).promise.then(function () {
      return canvas;
    }).catch(err => {
      console.log(err);
      return err;
    });
  } catch (err) {
    return err;
  }
};

const pdfjsDist = require("pdfjs-dist");
const readPdf = (pdf, config) => {
  pdfjsDist.getDocument(pdf).promise.then(doc => {
    const pages = [];
    if (config.pages) {
      if (Array.isArray(config.pages)) {
        pages.push(...config.pages);
      } else {
        switch (typeof config.pages) {
          case "number":
            pages.push(config.pages);
            break;
          case "string":
            const csv = config.pages.split(',');
            csv.map(_csv => {
              const ranged = _csv.split("-");
              if (ranged.length > 1) {
                for (let i = Number(ranged[0]); i <= Number(ranged[1]); i++) {
                  pages.push(i);
                }
              } else {
                pages.push(Number(ranged[0]));
              }
            });
            break;
        }
      }
    }
    while (pages.length < doc.numPages) pages.push(pages.length + 1);
    return Promise.all(pages.map(async num => {
      try {
        const page = await doc.getPage(num);
        createCanvas(page, config).then(canvas => {
          console.log(canvas);
          return createImage(canvas, config.name ?? 'output-image.jpg');
        });
      } catch (err) {
        return [false, err];
      }
    }));
  });
};

const pdfThumbnail = (data, config) => {
  return new Promise(async (resolve, reject) => {
    const file = Array.isArray(data) ? data[0] : data;
    const arrBuffer = await file.arrayBuffer();
    const isVideo = config.fileName === undefined;
    const {
      fileName,
      extension
    } = getExtension(config.fileName ?? file.name, isVideo);
    if (/(pdf|zip|doc)$/gi.test(extension)) {
      try {
        resolve(readPdf(arrBuffer, config));
      } catch (err) {
        reject({
          error: true,
          errorDetails: err
        });
      }
    } else {
      reject({
        error: true,
        errorDetails: {
          wrongFile: true,
          message: 'File type is not pdf'
        }
      });
    }
  });
};

export { createCanvas, createImage, dataURLtoFile, getExtension, pdfThumbnail, readPdf };
