let particleArray = [];
let snowflakeImages = [];

let gravity;

function preload() {
  snowflakeImages.push(loadImage('snowflake1.png'));
  snowflakeImages.push(loadImage('snowflake2.png'));
  snowflakeImages.push(loadImage('snowflake3.png'));
  snowflakeImages.push(loadImage('snowflake4.png'));
}

function setup() {
  setCanvasContainer('canvas', 600, 600);
  gravity = createVector(0, 0.03);
  background('#12192D');
}

function draw() {
  if (frameCount % 3 === 0) {
    particleArray.push(
      new Particle(random(width), -10, createVector(random(-0.02, 0.02), 0))
    );
  }

  background('#12192D');

  for (let a = 0; a < particleArray.length; a++) {
    particleArray[a].applyForce(gravity);
    particleArray[a].update();
    particleArray[a].display();

    if (particleArray[a].pos.y >= height - particleArray[a].diameter / 2) {
      particleArray[a].pos.y = height - particleArray[a].diameter / 2;
      particleArray[a].vel.mult(0);
      particleArray[a].rotationS = 0;
    }
  }

  for (let a = particleArray.length - 1; a >= 0; a--) {
    if (particleArray[a].isDead()) {
      particleArray.splice(a, 1);
    }
  }
}

function mouseClicked() {
  for (let a = particleArray.length - 1; a >= 0; a--) {
    let d = dist(
      mouseX,
      mouseY,
      particleArray[a].pos.x,
      particleArray[a].pos.y
    );
    if (d < particleArray[a].diameter / 2) {
      particleArray.splice(a, 1);
    }
  }
}

class Particle {
  constructor(x, y, wind) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0.25);
    this.acc = createVector(0, 0);

    // 랜덤한 이미지 선택
    this.image = random(snowflakeImages);

    this.diameter = random(10, 37);
    // this.diameter = 30;

    this.lifeSpan = 255;
    this.color = color(255);

    this.rotationA = random(360);
    this.rotationS = random(-0.05, 0.05);

    this.wind = wind;

    this.xOff = 0;
    this.r = 3;
    this.angle = random(TWO_PI);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.angle += 0.05;
    this.xOff = sin(this.angle) * this.r;

    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // 바닥에 닿았을 때 회전 멈춤
    if (this.pos.y >= height - this.diameter / 2) {
      this.pos.y = height - this.diameter / 2;
      this.vel.mult(0);
      this.rotationS = 0; // 회전 속도를 0으로 설정
      this.angle = 0;

      this.lifeSpan += 2;
    }

    this.pos.add(this.wind);
    this.lifeSpan -= 1;
    this.rotationA += this.rotationS;
  }

  display() {
    noStroke();

    this.color.setAlpha(this.lifeSpan * 2);

    fill(this.color);
    push();
    translate(this.pos.x + this.xOff * 3.5, this.pos.y);
    // rotate(this.rotationA);
    rotate(this.angle);

    imageMode(CENTER);
    image(this.image, 0, 0, this.diameter, this.diameter);

    pop();
  }

  isDead() {
    return this.lifeSpan < 0;
  }
}
