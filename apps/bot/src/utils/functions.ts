import canvas from "@napi-rs/canvas";

export const generateXPCard = async function generateXPCard(data: {
  overlay: string | null;
  background: string;
  textColor: string;
  progressBarColor: string;
}, userData: {
  status: 'online' | 'idle' | 'dnd' | 'offline' | 'invisible';
  avatar: string;
  level: string;
  xp: string;
  requiredXPForNextLevel: string;
  rank: string;
  username: string;
}) {
  const width = 467 * 4;
  const height = 141 * 4;
  const status = {
    online: "#43b581",
    idle: "#faa61a",
    dnd: "#f04747",
    offline: "#747f8d",
    invisible: "#747f8d",
  };

  const myCanvas = canvas.createCanvas(width, height);
  const ctx = myCanvas.getContext("2d");

  // Register fonts
  canvas.GlobalFonts.registerFromPath("../fonts/Poppins.ttf", "Poppins");
  canvas.GlobalFonts.registerFromPath("../fonts/DejaVuSans.ttf", "DejaVu");

  ctx.roundRect = function (x: number, y: number, width: number, height: number, radius: number) {
    this.beginPath();
    this.moveTo(x + radius, y);
    this.lineTo(x + width - radius, y);
    this.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.lineTo(x + width, y + height - radius);
    this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.lineTo(x + radius, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.lineTo(x, y + radius);
    this.quadraticCurveTo(x, y, x + radius, y);
    this.closePath();
  };

  function drawImageProp(ctx: any, img: any, x: any, y: any, w: any, h: any, offsetX: any, offsetY: any) {

    if (arguments.length === 2) {
        x = y = 0;
        w = ctx.canvas.width;
        h = ctx.canvas.height;
    }

    // default offset is center
    offsetX = typeof offsetX === "number" ? offsetX : 0.5;
    offsetY = typeof offsetY === "number" ? offsetY : 0.5;

    // keep bounds [0.0, 1.0]
    if (offsetX < 0) offsetX = 0;
    if (offsetY < 0) offsetY = 0;
    if (offsetX > 1) offsetX = 1;
    if (offsetY > 1) offsetY = 1;

    var iw = img.width,
        ih = img.height,
        r = Math.min(w / iw, h / ih),
        nw = iw * r,   // new prop. width
        nh = ih * r,   // new prop. height
        cx, cy, cw, ch, ar = 1;

    // decide which gap to fill    
    if (nw < w) ar = w / nw;                             
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
    nw *= ar;
    nh *= ar;

    // calc source rectangle
    cw = iw / (nw / w);
    ch = ih / (nh / h);

    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    // make sure source rectangle is valid
    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;

    // fill image in dest. rectangle
    ctx.drawImage(img, cx, cy, cw, ch,  x, y, w, h);
}

  // Background
  if (isLink(data.background)) {
    const background = await canvas.loadImage(data.background);
    drawImageProp(ctx, background, 0, 0, width, height, 0, 0);
  } else {
    ctx.fillStyle = data.background;
    ctx.globalAlpha = 1;
    ctx.fillRect(0, 0, width, height);
  }

  // Overlay
  ctx.fillStyle = data.overlay || "#000";
  ctx.globalAlpha = 0.75;
  ctx.roundRect(12 * 4, 18 * 4, 443 * 4, 105 * 4, 3 * 4);
  ctx.fill();

  // Avatar circle
  ctx.fillStyle = status[userData.status];
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(61 * 4, 71 * 4, 45 * 4, 0, 2 * Math.PI);
  ctx.fill();

  // Avatar
  const avatar = await canvas.loadImage(userData.avatar);
  ctx.save();
  ctx.beginPath();
  ctx.arc(61 * 4, 71 * 4, 42 * 4, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatar, 19 * 4, 29 * 4, 84 * 4, 84 * 4);
  ctx.restore();

  // Rank and level
  ctx.font = 'bold 80px Poppins';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 0.2;
  ctx.fillStyle = data.textColor;
  ctx.textAlign = 'end';
  ctx.strokeText('LEVEL', 322 * 4, 50 * 4);
  ctx.fillText('LEVEL', 322 * 4, 50 * 4);
  ctx.strokeText(userData.level, 341 * 4, 50 * 4);
  ctx.fillText(userData.level, 341 * 4, 50 * 4);
  ctx.strokeText('RANK', 422 * 4, 50 * 4);
  ctx.fillText('RANK', 422 * 4, 50 * 4);
  ctx.strokeText(userData.rank, 441 * 4, 50 * 4);
  ctx.fillText(userData.rank, 441 * 4, 50 * 4);

  // Username
  ctx.font = '56px DejaVu';
  ctx.fillStyle = 'white';
  ctx.fillText(userData.username, 160 * 4, 83 * 4);

  // Exp points
  ctx.font = '64px Poppins';
  ctx.fillStyle = data.textColor;
  ctx.textAlign = 'end';
  const xpWidth = ctx.measureText(userData.xp).width;
  ctx.fillText(userData.xp, 415 * 4 - xpWidth, 83 * 4);
  ctx.font = '64px Poppins';
  ctx.fillStyle = data.progressBarColor;
  ctx.fillText("/ " + userData.requiredXPForNextLevel, 415 * 4 + xpWidth * 1.5, 83 * 4);

  // Progress bar
  ctx.fillStyle = 'black';
  ctx.roundRect(108 * 4, 91 * 4, 338 * 4, 20 * 4, 12 * 4);
  ctx.fill();
  ctx.fillStyle = '#484B4E';
  ctx.roundRect(109 * 4, 92 * 4, 336 * 4, 18 * 4, 9 * 4);
  ctx.fill();
  ctx.fillStyle = data.progressBarColor;
  ctx.roundRect(109 * 4, 92 * 4, 168 * 4, 18 * 4, 9 * 4);
  ctx.fill();

  return myCanvas.toBuffer("image/png");
};

export const getRandomInt = function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const localeNumber = function localeNumber(num: number) {
  return num.toLocaleString("en-US");
};

function removeDuplicates(array: string[]) {
  const uniqueArray: string[] = [];

  for (const score of array) {
    const [teamA, teamB] = score.split("-");
    const inverseScore = `${teamB}-${teamA}`;

    if (!uniqueArray.includes(score) && !uniqueArray.includes(inverseScore)) {
      uniqueArray.push(score);
    }
  }

  return uniqueArray;
}

export const calculatePossibleScores = function calculatePossibleScores(
  bo: number,
): string[] {
  let scores: string[] = [];

  function getWinsPossible(bo: number) {
    return (bo + 1) / 2;
  }

  function backtrack(scoreA: number, scoreB: number) {
    if (scoreA === getWinsPossible(bo) || scoreB === getWinsPossible(bo)) {
      scores.push(`${scoreA}-${scoreB}`);
      return;
    }

    if (scoreA < getWinsPossible(bo)) {
      backtrack(scoreA + 1, scoreB);
    }

    if (scoreB < getWinsPossible(bo)) {
      backtrack(scoreA, scoreB + 1);
    }
  }

  backtrack(0, 0);

  const uniqueScores = removeDuplicates(scores);
  return uniqueScores;
};

export function removeEmoji(string: string) {
  return string
    .replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      "",
    )
    .replace(
      /([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g,
      "",
    )
    .replace(
      /[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2580-\u27BF]|\uD83E[\uDD10-\uDDFF]/g,
      "",
    )
    .replace(/🪙/gi, "")
    .replace(/🔎/gi, "")
    .replace(/📧/gi, "")
    .replace(/⭐/gi, "")
    .trim();
}

export const capitalize = function (x: string) {
  return x.charAt(0).toUpperCase() + x.slice(1);
};

export const unCapitalize = function (x: string) {
  // remove capitalization
  return x.toLowerCase();
}

export const isLink = function (x: string) {
  return x.startsWith("http://") || x.startsWith("https://");
}