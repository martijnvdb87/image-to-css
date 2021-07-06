import './style.css';

const app: HTMLDivElement = <HTMLDivElement>document.querySelector('#app');

const canvas: HTMLCanvasElement = document.createElement('canvas');
const filepicker: HTMLInputElement = <HTMLInputElement>document.getElementById('filepicker');
const scale: HTMLInputElement = <HTMLInputElement>document.getElementById('scale');

app.append(canvas);

filepicker.addEventListener('change', (e: Event) => {
  const target: HTMLInputElement = e.target as HTMLInputElement;
  const files: FileList = target.files as FileList;

  if(files.length != 1) {
    target.value = '';
    return;
  }

  const file: File = files[0];

  if(!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
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

      console.dir(widthScale);
      context.drawImage(image, 0, 0);

      const pixels = [];

      for(let x = 1; x <= widthScale; x++) {
        for(let y = 1; y <= heightScale; y++) {
          const posX = x * pixelScale;
          const posY = y * pixelScale;

          const data = context.getImageData(posX, posY, pixelScale, pixelScale).data;
          var hex = "#" + ("000000" + rgbToHex(data[0], data[1], data[2])).slice(-6);

          pixels.push(`${x}em ${y}em ${hex}`);

        }
      }
      console.log(pixels.join(', '));

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