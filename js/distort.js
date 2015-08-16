function barrelDistortion(pixels) {
    "use strict";
    var width = pixels.width;
    var height = pixels.height;
    var xmid = width / 2;
    var ymid = height / 2;
    var rMax = Math.sqrt(Math.pow(xmid, 2) + Math.pow(ymid, 2));
    var x;
    var y;
    var gnRadius;
    var x2;
    var y2;
    var gnRadius2;
    var i;
    var r;
    var g;
    var b;
    var a;
    var pr;
    var alpha;
    var sf;
    var newR;
    var newx;
    var newy;
    var tx;
    var ty;
    var newr;


    var pix2D = [];
    for (y = 0; y < pixels.height; y += 1) {
        pix2D[y] = [];
        for (x = 0; x < pixels.width; x += 1) {
            i = x * 4 + y * 4 * pixels.width;
            r = pixels.data[i];
            g = pixels.data[i + 1];
            b = pixels.data[i + 2];
            a = pixels.data[i + 3];

            // Find radius from pixel to mid point
            pr = Math.sqrt(Math.pow(xmid - x, 2) + Math.pow(ymid - y, 2));
            // Scale as needed
            sf = pr / rMax;
            // Barrel Distortion Function
            newR = pr * (0.19 * Math.pow(sf, 4) + 0.26 * Math.pow(sf, 2) + 1);
            // Get angle from mid point to pixel vector
            alpha = Math.atan2(-(y - ymid), -(x - xmid));
            // Get new X and Y Coordinants
            newx = Math.abs(Math.cos(alpha) * newR - xmid);
            newy = Math.abs(Math.sin(alpha) * newR - ymid);
            // New radius (with new x & y values)
            gnRadius = Math.sqrt(Math.pow(xmid - newx, 2) + Math.pow(ymid - newy, 2));
            // Gather new pixel values
            pix2D[y][x] = [r, g, b, a, newx, newy, newR, gnRadius];
        }
    }

    //Build new picture out of pix2D data
    var cnt = 0;
    for (y2 = 0; y2 < pix2D.length; y2 += 1) {
        for (x2 = 0; x2 < pix2D[y2].length; x2 += 1) {
            tx = Math.round(pix2D[y2][x2][4]);
            ty = Math.round(pix2D[y2][x2][5]);
            newr = pix2D[y2][x2][6];
            gnRadius2 = pix2D[y2][x2][7];
            if (Math.floor(newr) === Math.floor(gnRadius2) && tx >= 0 && tx < width && ty >= 0 && ty < height) {
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
