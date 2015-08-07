function barrelDistortion(pixels) {
    var d = pixels.data;
    var width = pixels.width;
    var height = pixels.height;
    var xmid = width / 2;
    var ymid = height / 2;
    var rMax = Math.sqrt(Math.pow(xmid, 2) + Math.pow(ymid, 2));

    var pix2D = new Array(pixels.height);
    for (var y = 0; y < pixels.height; y++) {
        pix2D[y] = new Array(pixels.width);
        for (var x = 0; x < pixels.width; x++) {
            var i = x * 4 + y * 4 * pixels.width;
            var r = pixels.data[i],
                g = pixels.data[i + 1],
                b = pixels.data[i + 2],
                a = pixels.data[i + 3];

            var pr = Math.sqrt(Math.pow(xmid - x, 2) + Math.pow(ymid - y, 2)); //radius from pixel to pic mid
            var sf = pr / rMax; //Scaling factor
            var newR = pr * (0.19 * Math.pow(sf, 4) + 0.26 * Math.pow(sf, 2) + 1); //barrel distortion function
            var alpha = Math.atan2(-(y - ymid), -(x - xmid)); //Get angle from pic mid to pixel vector
            var newx = Math.abs(Math.cos(alpha) * newR - xmid); //get new x coord for this pixel
            var newy = Math.abs(Math.sin(alpha) * newR - ymid); //get new y coord for this pixel
            var gnRadius = Math.sqrt(Math.pow(xmid - newx, 2) + Math.pow(ymid - newy, 2)); //New radius (with new x - y values)
            pix2D[y][x] = [r, g, b, a, newx, newy, newR, gnRadius]; //Make new y*x picture for reading pixels
        }
    }

    //Build new picture out of pix2D data
    var cnt = 0;
    var inn = 0;
    for (var y = 0; y < pix2D.length; y++) {
        for (var x = 0; x < pix2D[y].length; x++) {
            var tx = Math.round(pix2D[y][x][4]);
            var ty = Math.round(pix2D[y][x][5]);
            var newr = pix2D[y][x][6];
            var gnRadius = pix2D[y][x][7];
            if (Math.floor(newr) == Math.floor(gnRadius) && tx >= 0 && tx < width && ty >= 0 && ty < height) {
                pixels.data[cnt++] = pix2D[ty][tx][0];
                pixels.data[cnt++] = pix2D[ty][tx][1];
                pixels.data[cnt++] = pix2D[ty][tx][2];
                pixels.data[cnt++] = 255;
            } else {
                pixels.data[cnt++] = 50;
                pixels.data[cnt++] = 21;
                pixels.data[cnt++] = 19;
                pixels.data[cnt++] = 255;
            }
        }
    }
    return pixels;
}
