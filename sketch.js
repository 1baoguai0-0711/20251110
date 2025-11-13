/*
By Okazz
*/
let palette = ['#03045e', '#0077b6', '#00b4d8', '#90e0ef', '#caf0f8'];
let ctx;
let centerX, centerY;
let motions = [];
let restTime = 300;
let rects = [];
let menu;
let menuX = -200; // 選單初始位置在畫面外
let targetX = -200; // 選單目標位置

// 文字動畫變數
let textAnimationStartFrame;
let textAnimationDuration = 150; // 動畫持續 150 幀
let textStartY;
let textEndY;
let textCurrentY;

function setup() {
	//createCanvas(900, 900);//設定畫布大小
  //產生一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);
	rectMode(CENTER);
	ctx = drawingContext;
	centerX = width / 2;
	centerY = height / 2;
	textFont('Noto Serif TC');
	
  // 初始化選單
  menu = new Menu();
	
	// 初始化文字動畫變數
	textAnimationStartFrame = frameCount;
	textStartY = -100; // 從畫布頂部外開始
	textEndY = height / 2;
	textCurrentY = textStartY;

	tiling();
}

function draw() {
	background('#21212b');
	
	// 檢查滑鼠位置並更新選單
	if (mouseX < 100) {
		targetX = 0;
	} else {
		targetX = -200;
	}
	
	// 平滑移動選單
	menuX = lerp(menuX, targetX, 0.1);
	
	// 繪製所有動態物件
	for (let i of motions) {
		i.run();
	}

	// 更新並繪製文字動畫
	let elapsed = frameCount - textAnimationStartFrame;
	if (elapsed < textAnimationDuration) {
		let progress = elapsed / textAnimationDuration;
		let easedProgress = easeOutElastic(progress);
		textCurrentY = lerp(textStartY, textEndY, easedProgress);
	} else {
		textCurrentY = textEndY; // 確保動畫結束後文字停在正中央
	}

	// 在畫布中央繪製文字
	textSize(80);
	textAlign(CENTER, CENTER);
	fill(255, 255, 255, 150); // 白色，帶有透明度
	text("淡江大學", width / 2, textCurrentY);
	
	// 繪製選單
	menu.display();
}

function tiling() {
	let margin = 0;
	let columns = 18;
	let rows = columns;
	let cellW = (width - (margin * 2)) / columns;
	let cellH = (height - (margin * 2)) / rows;
	let emp = columns * rows;
	let grids = [];

	for (let j = 0; j < columns; j++) {
		let arr = []
		for (let i = 0; i < rows; i++) {
			arr[i] = false;
		}
		grids[j] = arr;
	}

	while (emp > 0) {
		let w = random([1, 2]);
		let h = random([1, 2]);
		let x = int(random(columns - w + 1));
		let y = int(random(rows - h + 1));
		let lap = true;
		for (let j = 0; j < h; j++) {
			for (let i = 0; i < w; i++) {
				if (grids[x + i][y + j]) {
					lap = false;
					break;
				}
			}
		}

		if (lap) {
			for (let j = 0; j < h; j++) {
				for (let i = 0; i < w; i++) {
					grids[x + i][y + j] = true;
				}
			}
			let xx = margin + x * cellW;
			let yy = margin + y * cellH;
			let ww = w * cellW;
			let hh = h * cellH;
			rects.push({ x: xx + ww / 2, y: yy + hh / 2, w: ww, h: hh });
			emp -= w * h;
		}
	}

	for (let i = 0; i < rects.length; i++) {
		let r = rects[i];
		if (r.w == r.h) {
			let rnd = int(random(5));

			if (rnd == 0) {
				motions.push(new Motion1_1_01(r.x, r.y, r.w * 0.75));
			} else if (rnd == 1) {
				motions.push(new Motion1_1_02(r.x, r.y, r.w));
			} else if (rnd == 2) {
				motions.push(new Motion1_1_03(r.x, r.y, r.w));
			} else if (rnd == 3) {
				motions.push(new Motion1_1_04(r.x, r.y, r.w));
			} else if (rnd == 4) {
				motions.push(new Motion1_1_05(r.x, r.y, r.w * 0.5));
			}
		} else {
			let rnd = int(random(4));
			if (rnd == 0) {
				motions.push(new Motion2_1_01(r.x, r.y, r.w * 0.9, r.h * 0.9));
			} else if (rnd == 1) {
				motions.push(new Motion2_1_02(r.x, r.y, r.w, r.h));
			} else if (rnd == 2) {
				motions.push(new Motion2_1_03(r.x, r.y, r.w, r.h));
			} else if (rnd == 3) {
				motions.push(new Motion2_1_04(r.x, r.y, r.w, r.h));
			}
		}
	}
}

function easeInOutQuint(x) {
	return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}

function easeOutElastic(x) {
	const c4 = (2 * Math.PI) / 3;

	return x === 0
		? 0
		: x === 1
		? 1
		: Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}

/*------------------------------------------------------------------------------------------*/

class Motion1_1_01 {
	/*
	円四角モーフィング
	*/
	constructor(x, y, w) {
		this.x = x;
		this.y = y;
		this.w = w;

		this.toggle = int(random(2));
		this.clr = random(palette);
		this.initialize();
		this.duration = 80;
		this.currentW = w;
		this.colors = palette.slice();
		shuffle(this.colors, true);
		this.color1 = color(this.colors[0]);
		this.color2 = color(this.colors[1]);
		this.currentW = this.w;

		if (this.toggle) {
			this.currentColor = this.color1;
			this.corner = this.w;
		} else {
			this.currentColor = this.color2;
			this.corner = 0;
		}
	}

	show() {
		noStroke();
		fill(this.currentColor);
		square(this.x, this.y, this.currentW, this.corner);
	}

	update() {
		if (0 < this.timer && this.timer < this.duration) {
			let nrm = norm(this.timer, 0, this.duration - 1);
			let n = nf(easeInOutQuint(nrm), 0, 4);
			if (this.toggle) {
				this.corner = lerp(this.w, 0, n);
				this.currentColor = lerpColor(this.color1, this.color2, n);
			} else {
				this.corner = lerp(0, this.w, n);
				this.currentColor = lerpColor(this.color2, this.color1, n);
			}
			this.currentW = lerp(this.w, this.w / 2, sin(n * PI));
		}

		if (this.timer > this.duration) {
			if (this.toggle) {
				this.toggle = 0;
			} else {
				this.toggle = 1;
			}
			this.initialize();
		}

		this.timer++;
	}

	initialize() {
		if (this.toggle) {
		} else {
		}
		this.timer = -int(random(restTime));
	}

	run() {
		this.show();
		this.update();
	}
}

class Motion1_1_02 {
	/*
	惑星衛星
	*/
	constructor(x, y, w) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.colors = palette.slice();
		shuffle(this.colors, true);
		this.satelliteSize = this.w * 0.2;
		this.orbitW = this.w * 0.4;
		this.orbitH = this.w * 0.1;
		this.timer = int(-random(100));
		this.currentaAngle = random(10);
		this.angleStep = random([1, -1]) * 0.01;
		this.coin = random([-1, 1])
	}

	show() {
		push();
		translate(this.x, this.y);
		rotate(this.currentaAngle);
		noStroke();
		fill(this.colors[0]);
		circle(0, 0, this.w * 0.5);

		fill(this.colors[1]);
		circle(this.orbitW * cos(this.timer / 50 * this.coin), this.orbitH * sin(this.timer / 50 * this.coin), this.satelliteSize);
		pop();
	}

	update() {
		this.timer++;
		this.currentaAngle += this.angleStep;
	}

	run() {
		this.show();
		this.update();
	}
}

class Motion1_1_03 {
	/*
	チェック＆ポルカドット
	*/
	constructor(x, y, w) {
		this.x = x;
		this.y = y;
		this.w = w;

		this.toggle = int(random(2));
		this.initialize();
		this.duration = 150;
		this.color = palette.slice();
		shuffle(this.colors, true);



		this.gridCount = 4;
		this.cellW = this.w / this.gridCount;

		this.squareW = 0;
		this.circleD = 0;

		if (this.toggle) {
			this.squareW = this.cellW;
		} else {
			this.circleD = this.cellW * 0.75;
		}
	}

	show() {
		push();
		translate(this.x, this.y);
		noStroke();
		for (let i = 0; i < this.gridCount; i++) {
			for (let j = 0; j < this.gridCount; j++) {
				let cellX = - (this.w / 2) + i * this.cellW + (this.cellW / 2);
				let cellY = - (this.w / 2) + j * this.cellW + (this.cellW / 2);
				if ((i + j) % 2 == 0) {
					fill(this.colors[0]);
					square(cellX, cellY, this.squareW);
				} else {

				}

				fill(this.colors[1]);
				circle(cellX, cellY, this.circleD);
			}
		}
		pop();
	}

	update() {
		if (0 < this.timer && this.timer < this.duration) {
			let nrm = norm(this.timer, 0, this.duration - 1);
			let n = nf(easeInOutQuint(nrm), 0, 4);
			if (this.toggle) {
				this.squareW = lerp(this.cellW, 0, n);
				this.circleD = lerp(0, this.cellW * 0.75, n);

			} else {
				this.squareW = lerp(0, this.cellW, n);

				this.circleD = lerp(this.cellW * 0.75, 0, n);
			}
		}

		if (this.timer > this.duration) {
			if (this.toggle) {
				this.toggle = 0;
			} else {
				this.toggle = 1;
			}
			this.initialize();
		}
		this.timer++;
	}

	initialize() {
		if (this.toggle) {
		} else {
		}
		this.timer = -int(random(restTime));
	}

	run() {
		this.show();
		this.update();
	}
}

class Motion1_1_04 {
	/*
	4半円合体
	*/
	constructor(x, y, w) {
		this.x = x;
		this.y = y;
		this.w = w;

		this.toggle = int(random(2));
		this.initialize();
		this.duration = 80;
		this.colors = palette.slice();
		shuffle(this.colors, true);

		this.arcD = this.w / 2;
		if (this.toggle) {
			this.shiftX = 0;
			this.shiftY = 0;
			this.arcA = 0;
		} else {
			this.shiftX = this.w / 2;
			this.shiftY = this.w / 2;
			this.arcA = PI;
		}

	}

	show() {
		push();
		translate(this.x, this.y);
		noStroke();
		for (let i = 0; i < 4; i++) {
			push();
			translate(this.shiftX, this.shiftY);
			rotate(this.arcA);
			fill(this.colors[i]);
			arc(0, 0, this.arcD, this.arcD, 0, PI / 2);
			pop();
			rotate(TAU / 4);
		}
		pop();
	}

	update() {
		if (0 < this.timer && this.timer < this.duration) {
			let nrm = norm(this.timer, 0, this.duration - 1);
			let n = nf(easeInOutQuint(nrm), 0, 4);
			if (this.toggle) {
				this.shiftX = lerp(0, this.w / 2, n);
				this.shiftY = lerp(0, this.w / 2, n);
				this.arcA = lerp(0, PI, n);
			} else {
				this.shiftX = lerp(this.w / 2, 0, n);
				this.shiftY = lerp(this.w / 2, 0, n);
				this.arcA = lerp(PI, 0, n);
			}
		}

		if (this.timer > this.duration) {
			if (this.toggle) {
				this.toggle = 0;
			} else {
				this.toggle = 1;
			}
			this.initialize();
		}
		this.timer++;
	}

	initialize() {
		if (this.toggle) {
		} else {
		}
		this.timer = -int(random(restTime));
	}

	run() {
		this.show();
		this.update();
	}
}

class Motion1_1_05 {
	/*
	四色四角
	*/
	constructor(x, y, w) {
		this.x = x;
		this.y = y;
		this.w = w;

		this.toggle = int(random(2));
		this.initialize();
		this.duration = 120;
		this.colors = palette.slice();
		shuffle(this.colors, true);
		this.squareW = this.w * 0.4;
		this.counter = 0;
		this.timer++;
	}

	show() {
		push();
		translate(this.x, this.y);
		noStroke();
		fill(this.colors[this.counter % this.colors.length]);
		square(this.w * 0.25, -this.w * 0.25, this.squareW);
		fill(this.colors[(this.counter + 1) % this.colors.length]);
		square(this.w * 0.25, this.w * 0.25, this.squareW);
		fill(this.colors[(this.counter + 2) % this.colors.length]);
		square(-this.w * 0.25, this.w * 0.25, this.squareW);
		fill(this.colors[(this.counter + 3) % this.colors.length]);
		square(-this.w * 0.25, -this.w * 0.25, this.squareW);
		pop();
	}

	update() {
		if (this.timer % 15 == 0) {
			this.counter++
		}
		this.timer++;
	}

	initialize() {
		if (this.toggle) {
		} else {
		}
		this.timer = -int(random(1200));
	}

	run() {
		this.show();
		this.update();
	}
}


/*------------------------------------------------------------------------------------------*/

class Motion2_1_01 {
	/*
	〜
	*/
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.angle = int(random(2)) * PI;
		if (this.w < this.h) {
			this.angle += PI / 2;
		}
		this.minS = min(this.w, this.h);
		this.st = this.minS * 0.15;
		this.color = random(palette);
		this.timer = 0;
		this.speed = 0.025 * random([-1, 1]);
	}

	show() {
		push();
		translate(this.x, this.y);
		rotate(this.angle);
		noFill();
		stroke(this.color);
		strokeWeight(this.st);
		beginShape();
		let num = 100;
		for (let i = 0; i < num; i++) {
			let theta = map(i, 0, num, 0, PI * 5);
			let r = lerp(0, this.minS * 0.4, sin(map(i, 0, num, 0, PI)));
			let xx = map(i, 0, num - 1, -this.minS, this.minS);
			let yy = r * sin(theta + (this.timer * this.speed));
			vertex(xx, yy);
		}
		endShape();
		pop();
	}

	update() {
		this.timer++;
	}
	run() {
		this.show();
		this.update();
	}
}

class Motion2_1_02 {
	/*
	4円背の順
	*/
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.angle = int(random(2)) * PI;
		if (this.w < this.h) {
			this.angle += PI / 2;
		}
		this.minS = min(this.w, this.h);

		this.toggle = int(random(2));
		this.color = random(palette);
		this.initialize();
		this.duration = 120;
		this.targetSize = [];
		this.targetSize[0] = this.minS * 0.5;
		this.targetSize[1] = this.minS * 0.4;
		this.targetSize[2] = this.minS * 0.3;
		this.targetSize[3] = this.minS * 0.2;

		this.circleD = [];
		if (this.toggle) {
			this.circleD[0] = this.targetSize[0];
			this.circleD[1] = this.targetSize[1];
			this.circleD[2] = this.targetSize[2];
			this.circleD[3] = this.targetSize[3];
		} else {
			this.circleD[0] = this.targetSize[3];
			this.circleD[1] = this.targetSize[2];
			this.circleD[2] = this.targetSize[1];
			this.circleD[3] = this.targetSize[0];
		}

	}

	show() {
		push();
		translate(this.x, this.y);
		rotate(this.angle);
		noStroke();
		fill(this.color);
		circle(this.minS / 4 * 3, 0, this.circleD[0]);
		circle(this.minS / 4, 0, this.circleD[1]);
		circle(-this.minS / 4, 0, this.circleD[2]);
		circle(-this.minS / 4 * 3, 0, this.circleD[3]);
		pop();
	}

	update() {
		if (0 < this.timer && this.timer < this.duration) {
			let nrm = norm(this.timer, 0, this.duration - 1);
			let n = nf(easeInOutQuint(nrm), 0, 4);
			if (this.toggle) {
				this.circleD[0] = lerp(this.targetSize[0], this.targetSize[3], n);
				this.circleD[1] = lerp(this.targetSize[1], this.targetSize[2], n);
				this.circleD[2] = lerp(this.targetSize[2], this.targetSize[1], n);
				this.circleD[3] = lerp(this.targetSize[3], this.targetSize[0], n);
			} else {
				this.circleD[0] = lerp(this.targetSize[3], this.targetSize[0], n);
				this.circleD[1] = lerp(this.targetSize[2], this.targetSize[1], n);
				this.circleD[2] = lerp(this.targetSize[1], this.targetSize[2], n);
				this.circleD[3] = lerp(this.targetSize[0], this.targetSize[3], n);
			}
		}

		if (this.timer > this.duration) {
			if (this.toggle) {
				this.toggle = 0;
			} else {
				this.toggle = 1;
			}
			this.initialize();
		}

		this.timer++;
	}

	initialize() {
		this.timer = int(-random(restTime));
	}

	run() {
		this.show();
		this.update();
	}
}

class Motion2_1_03 {
	/*
	←←←
	*/
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.angle = int(random(2)) * PI;
		if (this.w < this.h) {
			this.angle += PI / 2;
		}
		this.minS = min(this.w, this.h);
		this.toggle = int(random(2));
		this.colors = palette.slice();
		shuffle(this.colors, true);
		this.initialize();
		this.duration = 150;
		this.shift = 0;
	}

	show() {
		push();
		translate(this.x, this.y);
		rotate(this.angle);
		stroke(0);
		strokeWeight(0);
		noFill();
		rect(0, 0, this.minS * 2, this.minS);
		ctx.clip();
		fill(this.colors[1]);

		for (let i = 0; i < 8; i++) {
			let xx = map(i, 0, 8, -this.minS, this.minS * 2.5);
			this.tri(xx - this.shift, 0, this.minS * 0.5);
		}

		pop();
	}

	update() {
		if (0 < this.timer && this.timer < this.duration) {
			let nrm = norm(this.timer, 0, this.duration - 1);
			let n = nf(easeInOutQuint(nrm), 0, 4);
			this.shift = lerp(0, this.minS * 1.3125, n);
			if (this.toggle) {
			} else {
			}
		}

		if (this.timer > this.duration) {
			if (this.toggle) {
				this.toggle = 0;
			} else {
				this.toggle = 1;
			}
			this.initialize();
		}

		this.timer++;
	}

	initialize() {
		this.timer = int(-random(restTime));
	}

	run() {
		this.show();
		this.update();
	}

	tri(x, y, w) {
		beginShape();
		vertex(x, y);
		vertex(x + (w / 2), y - (w / 2));
		vertex(x + (w / 2), y + (w / 2));
		endShape();
	}
}

class Motion2_1_04 {
	/*
	ボール
	*/
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.angle = int(random(2)) * PI;
		if (this.w < this.h) {
			this.angle += PI / 2;
		}
		this.minS = min(this.w, this.h);
		this.toggle = int(random(2));
		this.colors = palette.slice();
		shuffle(this.colors, true);
		this.initialize();
		this.duration = 30;

		this.circleW = this.minS / 4;
		this.circleH = this.minS / 2;

		if (this.toggle) {
			this.shift = -(this.minS - this.circleW / 2);
		} else {
			this.shift = (this.minS - this.circleW / 2);
		}
	}

	show() {
		push();
		translate(this.x, this.y);
		rotate(this.angle);
		stroke(0);
		strokeWeight(0);
		fill(this.colors[0]);
		fill(this.colors[1]);
		ellipse(this.shift, 0, this.circleW, this.circleH);

		pop();
	}

	update() {
		if (0 < this.timer && this.timer < this.duration) {
			let nrm = norm(this.timer, 0, this.duration - 1);
			let n = nf(easeInOutQuint(nrm), 0, 4);
			this.circleW = lerp(this.minS / 4, this.minS / 2, sin(n * PI));
			this.circleH = lerp(this.minS / 2, this.minS / 4, sin(n * PI));
			if (this.toggle) {
				this.shift = lerp(-(this.minS - this.circleW / 2), (this.minS - this.circleW / 2), n);
			} else {
				this.shift = lerp((this.minS - this.circleW / 2), -(this.minS - this.circleW / 2), n);
			}

		}

		if (this.timer > this.duration) {
			if (this.toggle) {
				this.toggle = 0;
			} else {
				this.toggle = 1;
			}
			this.initialize();
		}

		this.timer++;
	}

	initialize() {
		this.timer = int(-random(restTime));
	}

	run() {
		this.show();
		this.update();
	}
}
/*------------------------------------------------------------------------------------------*/

class Menu {
  constructor() {
    this.items = [
      "第一單元作品",
      "第一單元講義",
      "測驗系統",
      "淡江大學",
      "回到首頁"
    ];
    this.urls = {
      "第一單元作品": "https://1baoguai0-0711.github.io/20251020/",
      "第一單元講義": "https://hackmd.io/@9bxRGkqSTtm3MxsO-5tSeA/ryPgPQ0slx",
      "測驗系統": "https://1baoguai0-0711.github.io/20251103/",
      "淡江大學": "https://www.tku.edu.tw/",
      "教育科技學系": "https://www.et.tku.edu.tw/"
    };
    this.isSubMenuVisible = false;
    
    this.setupClickHandler();
  }
  
  setupClickHandler() {
    document.querySelector('canvas').addEventListener('click', (e) => {
      if (menuX > -100) {
        let mouseY = e.clientY;
        let firstItemY = height/3;
        
        // 檢查第一個選項
        if (e.clientX < 200 && mouseY > firstItemY - 20 && mouseY < firstItemY + 20) {
          this.showIframe(this.urls["第一單元作品"]);
        }
        
        // 檢查第二個選項
        if (e.clientX < 200 && mouseY > firstItemY + 40 && mouseY < firstItemY + 80) {
          this.showIframe(this.urls["第一單元講義"]);
        }
        
        // 檢查第三個選項
        if (e.clientX < 200 && mouseY > firstItemY + 100 && mouseY < firstItemY + 140) {
          this.showIframe(this.urls["測驗系統"]);
        }
        
        // 檢查第四個選項
        if (e.clientX < 200 && mouseY > firstItemY + 160 && mouseY < firstItemY + 200) {
          this.showIframe(this.urls["淡江大學"]);
        }

        // 計算子選單的 Y 座標範圍
        let tkuItemIndex = 3; // "淡江大學" 的索引
        let tkuItemY = firstItemY + tkuItemIndex * 60;
        let subMenuClickY = tkuItemY + 40; // 子選單的中心 Y 座標
        // 檢查子選單選項
        if (this.isSubMenuVisible && e.clientX < 200 && mouseY > subMenuClickY - 20 && mouseY < subMenuClickY + 20) {
          this.showIframe(this.urls["教育科技學系"]);
        }

        // 檢查「回到首頁」選項，考慮子選單的位移
        let homeYOffset = this.isSubMenuVisible ? 60 : 0;
        let homeItemY = firstItemY + 4 * 60;
        if (e.clientX < 200 && mouseY > homeItemY + homeYOffset - 20 && mouseY < homeItemY + homeYOffset + 20) {
          window.location.reload(); // 回到首頁通常是重新載入
        }
      }
    });

    document.getElementById('iframe-close').addEventListener('click', () => {
      document.getElementById('iframe-container').style.display = 'none';
    });
  }
  
  showIframe(url) {
    const container = document.getElementById('iframe-container');
    const iframe = document.getElementById('content-iframe');
    iframe.src = url;
    container.style.display = 'block';
  }
  
  display() {
    push();
		translate(menuX, 0);

		// 選單背景
		fill(33, 33, 43, 220);
		noStroke();
		rect(100, height/2, 200, height);

		// 選單選項
		textSize(32);
		textAlign(LEFT, CENTER);

		// 決定子選單是否可見
		let tkuItemIndex = 3;
		let tkuItemY = height/3 + tkuItemIndex * 60;
		let isHoveringTku = mouseX < 200 && mouseY > tkuItemY - 20 && mouseY < tkuItemY + 20 && menuX > -100;
		
		let subMenuX = 20;
		let subMenuY = tkuItemY + 40;
		let isHoveringSubMenu = this.isSubMenuVisible && mouseX > subMenuX && mouseX < subMenuX + 180 && mouseY > subMenuY - 20 && mouseY < subMenuY + 20;

		this.isSubMenuVisible = isHoveringTku || isHoveringSubMenu;

		for(let i = 0; i < this.items.length; i++) {
			let yOffset = 0;
			// 如果項目在淡江大學之後，且子選單可見，則向下移動
			if (i > tkuItemIndex && this.isSubMenuVisible) {
				yOffset = 60;
			}
			let itemY = height/3 + i * 60 + yOffset;
			let isHovering = mouseX < 200 && mouseY > itemY - 20 && mouseY < itemY + 20 && menuX > -100;

			fill(255);
			text(this.items[i], 20, itemY);

			// 滑鼠懸停效果
			if(isHovering) {
				fill(255, 100);
				noStroke();
				rect(100, itemY, 180, 40); // 懸停背景
			}
		}

		// 處理淡江大學子選單
		if (this.isSubMenuVisible) {
			// 子選單背景
			fill(isHoveringSubMenu ? [100, 100, 120, 220] : [60, 60, 70, 220]);
			rect(100, subMenuY, 180, 40);
			
			// 子選單文字
			fill(isHoveringSubMenu ? [255, 255, 0] : 255);
			textSize(24); // 子選單文字可以小一點
			text("教育科技學系", subMenuX, subMenuY);
		}

		pop();
  }
}
