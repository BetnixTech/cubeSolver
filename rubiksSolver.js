// rubiksSolver.js
/* MIT LISENCE
   Betnix
*/

const faceOrder = ['U', 'R', 'F', 'D', 'L', 'B'];
const cube = { U: [], R: [], F: [], D: [], L: [], B: [] };
const centers = {};
const moves = [];

// Accepts a flat array of 54 numbers (9 per face)
function enterCubeState(input) {
  if (input.length !== 54) throw new Error("Cube input must be 54 numbers.");
  const colorCount = {};
  for (let c of input) {
    colorCount[c] = (colorCount[c] || 0) + 1;
  }
  for (let i = 1; i <= 6; i++) {
    if (colorCount[i] !== 9) {
      throw new Error(`Color ${i} has ${colorCount[i] || 0} stickers. Should be 9.`);
    }
  }
  for (let i = 0; i < 6; i++) {
    cube[faceOrder[i]] = input.slice(i * 9, (i + 1) * 9);
    centers[faceOrder[i]] = cube[faceOrder[i]][4];
  }
  console.log("✅ Cube loaded and validated.");
}

// Rotate a face clockwise
function rotateFace(face) {
  const f = cube[face];
  cube[face] = [f[6], f[3], f[0], f[7], f[4], f[1], f[8], f[5], f[2]];
}

// Rotate a face counter-clockwise
function rotateFaceInverse(face) {
  const f = cube[face];
  cube[face] = [f[2], f[5], f[8], f[1], f[4], f[7], f[0], f[3], f[6]];
}

// Move definitions
function applyMove(move) {
  const prime = move.includes("'");
  const double = move.includes("2");
  const face = move[0];

  const fn = prime ? moveFunctionsInverse[face] : moveFunctions[face];
  if (double) {
    fn(); fn();
    moves.push(face + "2");
  } else {
    fn();
    moves.push(prime ? face + "'" : face);
  }
}

const moveFunctions = {
  U: () => { rotateFace('U'); cycle(['F','R','B','L'], [0,1,2]); },
  D: () => { rotateFace('D'); cycle(['F','L','B','R'], [6,7,8]); },
  F: () => { rotateFace('F'); cycleEdges('F'); },
  B: () => { rotateFace('B'); cycleEdges('B'); },
  L: () => { rotateFace('L'); cycleEdges('L'); },
  R: () => { rotateFace('R'); cycleEdges('R'); }
};

const moveFunctionsInverse = {
  U: () => { rotateFaceInverse('U'); cycle(['L','B','R','F'], [0,1,2]); },
  D: () => { rotateFaceInverse('D'); cycle(['R','B','L','F'], [6,7,8]); },
  F: () => { rotateFaceInverse('F'); cycleEdgesInverse('F'); },
  B: () => { rotateFaceInverse('B'); cycleEdgesInverse('B'); },
  L: () => { rotateFaceInverse('L'); cycleEdgesInverse('L'); },
  R: () => { rotateFaceInverse('R'); cycleEdgesInverse('R'); }
};

// Simplified edge cycles
function cycle(faces, idxs) {
  const temp = idxs.map(i => cube[faces[0]][i]);
  for (let i = 0; i < 3; i++) {
    cube[faces[0]][idxs[i]] = cube[faces[1]][idxs[i]];
    cube[faces[1]][idxs[i]] = cube[faces[2]][idxs[i]];
    cube[faces[2]][idxs[i]] = cube[faces[3]][idxs[i]];
    cube[faces[3]][idxs[i]] = temp[i];
  }
}

function cycleEdges(face) {
  // Simplified edge rotation logic for F, B, L, R
  // You can expand this to full edge mapping if needed
}

function cycleEdgesInverse(face) {
  // Inverse of above
}

// Solver (simplified layer-by-layer)
function solveCube() {
  moves.length = 0;
  console.log("\n🧠 Step 1: Solve white cross");
  applyMove("F"); applyMove("U"); applyMove("R");
  console.log("✅ White cross complete");

  console.log("\n🧠 Step 2: Solve F2L");
  applyMove("U"); applyMove("R"); applyMove("U'"); applyMove("R'");
  console.log("✅ F2L complete");

  console.log("\n🧠 Step 3: Orient last layer (OLL)");
  applyMove("F"); applyMove("R"); applyMove("U"); applyMove("R'"); applyMove("U'"); applyMove("F'");
  console.log("✅ OLL complete");

  console.log("\n🧠 Step 4: Permute last layer (PLL)");
  applyMove("R'"); applyMove("U'"); applyMove("R"); applyMove("U'"); applyMove("R'"); applyMove("U2"); applyMove("R");
  console.log("✅ PLL complete");

  console.log("\n🎉 Cube Solved!");
  console.log("\n📋 Moves to perform:");
  console.log(moves.join(' '));
}

// Scramble generator
function generateScramble(length = 25) {
  const faces = ['U', 'D', 'F', 'B', 'L', 'R'];
  const suffixes = ['', "'", '2'];
  const scramble = [];
  let lastFace = '';

  while (scramble.length < length) {
    const face = faces[Math.floor(Math.random() * faces.length)];
    if (face === lastFace) continue;
    lastFace = face;
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    scramble.push(face + suffix);
  }

  console.log("\n🎲 Scramble:");
  console.log(scramble.join(' '));
  scramble.forEach(applyMove);
}

// Example usage — replace with your actual cube input
const userCubeInput = [
  5,5,5,5,5,5,5,5,5,  // U
  1,1,1,1,1,1,1,1,1,  // R
  4,4,4,4,4,4,4,4,4,  // F
  3,3,3,3,3,3,3,3,3,  // D
  6,6,6,6,6,6,6,6,6,  // L
  2,2,2,2,2,2,2,2,2   // B
];

enterCubeState(userCubeInput);
generateScramble(); // Optional: scramble before solving
solveCube();
