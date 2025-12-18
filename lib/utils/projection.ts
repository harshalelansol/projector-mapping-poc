function getNormalizationCoefficients(srcPts: number[], dstPts: number[], isInverse: boolean) {
    if (isInverse) {
        const tmp = dstPts;
        dstPts = srcPts;
        srcPts = tmp;
    }
    const r = getPerspectiveTransformMatrix(srcPts, dstPts);
    return r;
}

function getPerspectiveTransformMatrix(src: number[], dst: number[]) {
  // src and dst are arrays of 8 numbers [x0,y0, x1,y1, x2,y2, x3,y3]
  // solving for:
  //      / a b c \
  // H = | d e f |
  //      \ g h 1 /
  const r = solveHomography(src, dst);
  return r;
}

function solveHomography(src: number[], dst: number[]) {
    // Basic Gaussian elimination for 8 unknowns
    let i, j, k;
    const a: number[][] = [];
    const b: number[] = [];

    for(i=0; i<4; i++) {
        const x = src[2*i];
        const y = src[2*i+1];
        const X = dst[2*i];
        const Y = dst[2*i+1];
        a.push([x, y, 1, 0, 0, 0, -x*X, -y*X]);
        a.push([0, 0, 0, x, y, 1, -x*Y, -y*Y]);
        b.push(X);
        b.push(Y);
    }

    const x = solveLinearSystem(a, b);
    if (!x) return null; // Singular

    // Matrix 3x3
    // h0 h1 h2
    // h3 h4 h5
    // h6 h7 1
    return [
       x[0], x[1], 0, x[2],
       x[3], x[4], 0, x[5],
       0,    0,    1, 0,
       x[6], x[7], 0, 1
    ];
}

function solveLinearSystem(A: number[][], B: number[]) {
    const n = A.length;
    for (let i = 0; i < n; i++) {
        // Search for maximum in this column
        let maxEl = Math.abs(A[i][i]);
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(A[k][i]) > maxEl) {
                maxEl = Math.abs(A[k][i]);
                maxRow = k;
            }
        }

        // Swap maximum row with current row (column by column)
        for (let k = i; k < n; k++) {
            const tmp = A[maxRow][k];
            A[maxRow][k] = A[i][k];
            A[i][k] = tmp;
        }
        const tmp = B[maxRow];
        B[maxRow] = B[i];
        B[i] = tmp;

        // Make all rows below this one 0 in current column
        for (let k = i + 1; k < n; k++) {
            const c = -A[k][i] / A[i][i];
            for (let j = i; j < n; j++) {
                if (i === j) {
                    A[k][j] = 0;
                } else {
                    A[k][j] += c * A[i][j];
                }
            }
            B[k] += c * B[i];
        }
    }

    // Solve equation Ax=B for an upper triangular matrix A
    const x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        x[i] = B[i] / A[i][i];
        for (let k = i - 1; k >= 0; k--) {
            B[k] -= A[k][i] * x[i];
        }
    }
    return x;
}

export function getPerspectiveTransform(
  srcWidth: number, 
  srcHeight: number, 
  corners: {x: number; y: number}[]
) {
  const src = [0, 0, srcWidth, 0, srcWidth, srcHeight, 0, srcHeight];
  const dst = [
      corners[0].x, corners[0].y,
      corners[1].x, corners[1].y,
      corners[2].x, corners[2].y,
      corners[3].x, corners[3].y
  ];
  
  const matrix = solveHomography(src, dst);
  if (!matrix) return 'none';

  // CSS matrix3d(a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3, a4, b4, c4, d4)
  // Column-major
  // Our matrix is [h0, h1, 0, h2, h3, h4, 0, h5, 0,0,1,0, h6,h7,0,1]
  // Mapping:
  // h0 h1  0 h2
  // h3 h4  0 h5
  //  0  0  1  0
  // h6 h7  0  1
  
  // Convert to Column Major for CSS:
  // h0, h3, 0, h6
  // h1, h4, 0, h7
  //  0,  0, 1, 0
  // h2, h5, 0, 1
  
  const m = matrix;
  return `matrix3d(
      ${m[0].toFixed(9)}, ${m[4].toFixed(9)}, 0, ${m[12].toFixed(9)},
      ${m[1].toFixed(9)}, ${m[5].toFixed(9)}, 0, ${m[13].toFixed(9)},
      0, 0, 1, 0,
      ${m[3].toFixed(9)}, ${m[7].toFixed(9)}, 0, ${m[15].toFixed(9)}
  )`;
}
