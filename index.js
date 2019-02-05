import quantize from "quantize";

const toString = array =>
  `#${((1 << 24) + (array[0] << 16) + (array[1] << 8) + array[2])
    .toString(16)
    .slice(1)}`;

const colorThief = pixels => ({
  palette(colorCount, quality) {
    if (
      typeof colorCount === "undefined" ||
      colorCount < 2 ||
      colorCount > 256
    ) {
      colorCount = 10;
    }
    if (typeof quality === "undefined" || quality < 1) {
      quality = 10;
    }

    // Store the RGB values in an array format suitable for quantize function
    let pixelArray = [];
    for (
      let i = 0, offset, r, g, b, a;
      i < pixels.length / 4;
      i = i + quality
    ) {
      offset = i * 4;
      r = pixels[offset + 0];
      g = pixels[offset + 1];
      b = pixels[offset + 2];
      a = pixels[offset + 3];
      // If pixel is mostly opaque and not white
      if (a >= 125) {
        if (!(r > 250 && g > 250 && b > 250)) {
          pixelArray.push([r, g, b]);
        }
      }
    }
    this.data = quantize(pixelArray, colorCount).palette() || null;
    return this;
  },
  color(quality) {
    let palette = this.palette(5, quality).data;
    console.log(palette);

    if (palette) {
      this.data = palette[0];
      return this;
    } else {
      console.error("getColor has error: palette length is zero.");
    }
  },
  __proto__: {
    get() {
      return this.data;
    },
    getHex() {
      if (this.data.map(item => Array.isArray(item)).includes(true)) {
        return this.data.map(item => toString(item));
      } else {
        return toString(this.data);
      }
    }
  }
});

export default colorThief;
