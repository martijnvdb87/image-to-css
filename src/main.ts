import './style.css';

const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');
const filepicker: HTMLInputElement = <HTMLInputElement>document.getElementById('filepicker');
const scale: HTMLInputElement = <HTMLInputElement>document.getElementById('scale');
const html: HTMLTextAreaElement = <HTMLTextAreaElement>document.getElementById('html');
const css: HTMLTextAreaElement = <HTMLTextAreaElement>document.getElementById('css');
const classname: HTMLInputElement = <HTMLInputElement>document.getElementById('classname');
const transparent: HTMLInputElement = <HTMLInputElement>document.getElementById('transparent');

filepicker.addEventListener('change', (e: Event) => {
  const target: HTMLInputElement = e.target as HTMLInputElement;
  const files: FileList = target.files as FileList;

  if(files.length != 1) {
    target.value = '';
    return;
  }

  const file: File = files[0];

  if(!['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type)) {
    target.value = '';
    return;
  }
  
  const fileReader = new FileReader();
  fileReader.onload = () => {
    const context = canvas.getContext('2d');

    if(!context) {
      target.value = '';
      return;
    }
    
    const image = new Image();
    image.onload = () => {
      const pixelScale: number = parseInt(scale.value);
      const widthScale: number = image.width / pixelScale;
      const heightScale: number = image.height / pixelScale;

      canvas.width = image.width;
      canvas.height = image.height;

      context.fillStyle = transparent.value;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0);

      const pixels = [];

      for(let x = 0; x < widthScale; x++) {
        for(let y = 0; y < heightScale; y++) {
          const posX = x * pixelScale;
          const posY = y * pixelScale;

          const data = context.getImageData(posX, posY, pixelScale, pixelScale).data;
          var hex = "#" + ("000000" + rgbToHex(data[0], data[1], data[2])).slice(-6);

          if(hex !== transparent.value) {
            console.log(transparent.value);
            pixels.push(`${x + 1}em ${y + 1}em ${hex}`);
          }
        }
      }

      const classnameValue = classname.value;

      html.innerHTML = `<div class="${classnameValue}"></div>`;

      css.innerHTML = `.${classnameValue} {
  position: relative;
  height: ${heightScale}em;
  width: ${widthScale}em;
  font-size: 1em;
  overflow: hidden;
}

.${classnameValue}::before {
  position: absolute;
  top: -1em;
  left: -1em;
  height: 1em;
  width: 1em;
  content: '';
}

.${classnameValue}::before {
  box-shadow: ${pixels.join(', ')};
}`;

    };
    image.src = URL.createObjectURL(file);
  };
  fileReader.readAsDataURL(file);    // begin reading

  console.dir(file);
});

function rgbToHex(r: number, g: number, b: number) {
  if (r > 255 || g > 255 || b > 255)
      throw "Invalid color component";
  return ((r << 16) | (g << 8) | b).toString(16);
}