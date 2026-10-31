const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 600;
const FLOOR_Y = 500;
const PLAYER_WIDTH = 34;
const PLAYER_HEIGHT = 48;

const WEAPONS = [
  { name: "Sunbolt", rate: 260, speed: 10, damage: 18, spread: 0, pierce: 0, color: "#ffd36a" },
  { name: "Stormbow", rate: 680, speed: 13, damage: 34, spread: 0, pierce: 2, color: "#8de0e0" },
  { name: "Hexscatter", rate: 620, speed: 9, damage: 13, spread: 0.2, pierce: 0, color: "#dc9aff" }
];

const SKILLS = [
  { name: "Rune Burst", key: "Q", cooldown: 6500 },
  { name: "Aegis", key: "W", cooldown: 9000 },
  { name: "Blink", key: "E", cooldown: 5200 }
];

const ROOM_PLATFORMS = [
  [{ x: 230, y: 390, w: 190 }, { x: 590, y: 335, w: 160 }],
  [{ x: 145, y: 350, w: 160 }, { x: 430, y: 405, w: 210 }, { x: 755, y: 330, w: 130 }],
  [{ x: 270, y: 330, w: 180 }, { x: 640, y: 390, w: 190 }]
];

const UPGRADES = [
  { name: "Keen Edge", detail: "All weapon damage +20%", apply: () => { gameStats.damageMultiplier *= 1.2; } },
  { name: "Quick Hands", detail: "Fire weapons 15% faster", apply: () => { gameStats.fireRateMultiplier *= 1.15; } },
  { name: "Vitality", detail: "Max health +25 and heal 25", apply: () => { playerState.maxHealth += 25; playerState.health = min(playerState.maxHealth, playerState.health + 25); } },
  { name: "Fleet Boots", detail: "Move 15% faster", apply: () => { gameStats.moveMultiplier *= 1.15; } },
  { name: "Rune Mastery", detail: "Skills recharge 15% faster", apply: () => { gameStats.cooldownMultiplier *= 0.85; } },
  { name: "High Leap", detail: "Jump higher and gain 10 health", apply: () => { gameStats.jumpMultiplier *= 1.12; playerState.health = min(playerState.maxHealth, playerState.health + 10); } }
];

let playerBody;
let playerState;
let gameStats;
let screenState = "title";
let roomIndex = 0;
let roomEnemies = [];
let playerShots = [];
let enemyShots = [];
let upgradeChoices = [];
let xp = 0;
let xpGoal = 45;
let level = 1;
let nextShotAt = 0;
let skillReadyAt = [0, 0, 0];
let shieldUntil = 0;
let flashUntil = 0;
let gameStartedAt = 0;

function setup() {
  const gameCanvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  gameCanvas.parent("game-canvas");
  textFont("Georgia");
  textAlign(CENTER, CENTER);
  playerBody = new Sprite(90, FLOOR_Y - PLAYER_HEIGHT / 2, PLAYER_WIDTH, PLAYER_HEIGHT);
  playerBody.collider = "none";
  playerBody.visible = false;
  resetGame();
  screenState = "title";
}

function resetGame() {
  playerBody.x = 90;
  playerBody.y = FLOOR_Y - PLAYER_HEIGHT / 2;
  playerState = {
    velocityY: 0,
    grounded: true,
    facing: 1,
    health: 100,
    maxHealth: 100,
    invulnerableUntil: 0,
    weaponIndex: 0
  };
  gameStats = { damageMultiplier: 1, fireRateMultiplier: 1, moveMultiplier: 1, cooldownMultiplier: 1, jumpMultiplier: 1 };
  roomIndex = 0;
  xp = 0;
  xpGoal = 45;
  level = 1;
  nextShotAt = 0;
  skillReadyAt = [0, 0, 0];
  shieldUntil = 0;
  flashUntil = 0;
  playerShots = [];
  enemyShots = [];
  spawnRoom();
  gameStartedAt = millis();
}

function update() {
  if (screenState === "title") {
    drawScene();
    drawTitle();
    return;
  }
  if (screenState === "levelup") {
    drawScene();
    drawLevelUp();
    return;
  }
  if (screenState === "win" || screenState === "lose") {
    drawScene();
    drawEndScreen();
    return;
  }

  updatePlayer();
  updateCombat();
  updateEnemies();
  updateProjectiles();
  checkRoomProgress();
  drawScene();
  drawHud();
  drawCombatants();
  drawAimMark();
}

function spawnRoom() {
  roomEnemies = [];
  playerShots = [];
  enemyShots = [];
  playerBody.x = 80;
  playerBody.y = FLOOR_Y - PLAYER_HEIGHT / 2;
  playerState.velocityY = 0;

  if (roomIndex < 3) {
    const enemyTypes = ["guard", "hexer", "guard", "brute"];
    for (let index = 0; index < enemyTypes.length; index++) {
      roomEnemies.push(makeEnemy(enemyTypes[index], 560 + index * 105, FLOOR_Y - 22));
    }
  } else {
    roomEnemies.push(makeEnemy("boss", 760, FLOOR_Y - 68));
  }
}

function makeEnemy(type, x, y) {
  const boss = type === "boss";
  const stats = {
    guard: { health: 45, speed: 1.35, damage: 12, reward: 18, size: 38 },
    hexer: { health: 38, speed: 0.8, damage: 10, reward: 22, size: 38 },
    brute: { health: 80, speed: 0.72, damage: 19, reward: 28, size: 52 },
    boss: { health: 360, speed: 1.05, damage: 18, reward: 90, size: 116 }
  }[type];
  return {
    type,
    x,
    y,
    health: stats.health,
    maxHealth: stats.health,
    speed: stats.speed,
    damage: stats.damage,
    reward: stats.reward,
    size: stats.size,
    facing: -1,
    nextAttackAt: millis() + random(500, 1400),
    hurtUntil: 0,
    alive: true,
    boss,
    phase: 1
  };
}

function updatePlayer() {
  const moveSpeed = 4.4 * gameStats.moveMultiplier;
  if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
    playerBody.x -= moveSpeed;
    playerState.facing = -1;
  }
  if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
    playerBody.x += moveSpeed;
    playerState.facing = 1;
  }

  playerState.velocityY += 0.72;
  playerBody.y += playerState.velocityY;

  const platforms = roomIndex < 3 ? ROOM_PLATFORMS[roomIndex] : [];
  let landed = false;
  for (const platform of platforms) {
    const crossedPlatform = playerBody.y + PLAYER_HEIGHT / 2 >= platform.y &&
      playerBody.y + PLAYER_HEIGHT / 2 - playerState.velocityY <= platform.y;
    const overlapsPlatform = playerBody.x + PLAYER_WIDTH / 2 > platform.x - platform.w / 2 &&
      playerBody.x - PLAYER_WIDTH / 2 < platform.x + platform.w / 2;
    if (playerState.velocityY >= 0 && crossedPlatform && overlapsPlatform) {
      playerBody.y = platform.y - PLAYER_HEIGHT / 2;
      playerState.velocityY = 0;
      landed = true;
      break;
    }
  }

  if (!landed && playerBody.y + PLAYER_HEIGHT / 2 >= FLOOR_Y) {
    playerBody.y = FLOOR_Y - PLAYER_HEIGHT / 2;
    playerState.velocityY = 0;
    landed = true;
  }
  playerState.grounded = landed;

  playerBody.x = constrain(playerBody.x, 28, CANVAS_WIDTH - 28);
  if (mouseIsPressed && mouseButton === LEFT) fireWeapon();
  if (millis() > playerState.invulnerableUntil) flashUntil = 0;
}

function updateCombat() {
  for (let shotIndex = playerShots.length - 1; shotIndex >= 0; shotIndex--) {
    const shot = playerShots[shotIndex];
    shot.x += shot.velocityX;
    shot.y += shot.velocityY;
    shot.life -= 1;
    for (const enemy of roomEnemies) {
      if (!enemy.alive || shot.hitIds.includes(enemy)) continue;
      const hitRadius = enemy.size * (enemy.boss ? 0.38 : 0.42);
      if (dist(shot.x, shot.y, enemy.x, enemy.y - (enemy.boss ? 0 : 6)) < hitRadius + 10) {
        enemy.health -= shot.damage;
        enemy.hurtUntil = millis() + 110;
        shot.hitIds.push(enemy);
        if (enemy.health <= 0) defeatEnemy(enemy);
        if (shot.pierceLeft > 0) shot.pierceLeft -= 1;
        else shot.life = 0;
        break;
      }
    }
    if (shot.life <= 0 || shot.x < -30 || shot.x > CANVAS_WIDTH + 30 || shot.y < -30 || shot.y > CANVAS_HEIGHT + 30) {
      playerShots.splice(shotIndex, 1);
    }
  }
}

function updateEnemies() {
  const now = millis();
  for (const enemy of roomEnemies) {
    if (!enemy.alive) continue;
    const dx = playerBody.x - enemy.x;
    const distanceToPlayer = abs(dx);
    enemy.facing = dx < 0 ? -1 : 1;
    if (enemy.boss) {
      enemy.phase = enemy.health <= enemy.maxHealth / 2 ? 2 : 1;
      const bossTarget = playerBody.x > enemy.x ? CANVAS_WIDTH - 155 : 760;
      enemy.x += constrain(bossTarget - enemy.x, -enemy.speed, enemy.speed);
      enemy.y = FLOOR_Y - 68 + sin(now / 310) * 8;
      if (now >= enemy.nextAttackAt) {
        fireEnemyPattern(enemy, enemy.phase === 2 ? 3 : 1);
        enemy.nextAttackAt = now + (enemy.phase === 2 ? 1120 : 1650);
      }
      continue;
    }

    const enemyFloorY = enemy.type === "brute" ? FLOOR_Y - 25 : FLOOR_Y - 19;
    enemy.y = enemyFloorY;
    if (distanceToPlayer > (enemy.type === "hexer" ? 250 : 45)) {
      enemy.x += enemy.facing * enemy.speed;
    }
    enemy.x = constrain(enemy.x, 320, CANVAS_WIDTH - 45);
    if (now >= enemy.nextAttackAt) {
      if (enemy.type === "hexer" && distanceToPlayer < 510) {
        fireEnemyPattern(enemy, 1);
        enemy.nextAttackAt = now + 1900;
      } else if (distanceToPlayer < enemy.size + 28) {
        damagePlayer(enemy.damage, enemy.x);
        enemy.nextAttackAt = now + 1100;
      }
    }
  }
}

function fireEnemyPattern(enemy, count) {
  const targetX = playerBody.x;
  const targetY = playerBody.y - 5;
  const baseAngle = atan2(targetY - enemy.y, targetX - enemy.x);
  const speed = enemy.boss ? (enemy.phase === 2 ? 5.3 : 4.2) : 3.4;
  for (let index = 0; index < count; index++) {
    const offset = count === 1 ? 0 : (index - (count - 1) / 2) * 0.24;
    const angle = baseAngle + offset;
    enemyShots.push({ x: enemy.x, y: enemy.y - 4, velocityX: cos(angle) * speed, velocityY: sin(angle) * speed, damage: enemy.damage, radius: enemy.boss ? 10 : 7 });
  }
}

function updateProjectiles() {
  for (let index = enemyShots.length - 1; index >= 0; index--) {
    const shot = enemyShots[index];
    shot.x += shot.velocityX;
    shot.y += shot.velocityY;
    if (dist(shot.x, shot.y, playerBody.x, playerBody.y - 5) < shot.radius + 17) {
      damagePlayer(shot.damage, shot.x);
      enemyShots.splice(index, 1);
      continue;
    }
    if (shot.x < -20 || shot.x > CANVAS_WIDTH + 20 || shot.y < -20 || shot.y > CANVAS_HEIGHT + 20) enemyShots.splice(index, 1);
  }
}

function fireWeapon() {
  const weapon = WEAPONS[playerState.weaponIndex];
  const now = millis();
  if (now < nextShotAt || screenState !== "playing") return;
  nextShotAt = now + weapon.rate / gameStats.fireRateMultiplier;
  const aimX = mouseX >= 0 && mouseX <= CANVAS_WIDTH ? mouseX : playerBody.x + playerState.facing * 100;
  const aimY = mouseY >= 0 && mouseY <= CANVAS_HEIGHT ? mouseY : playerBody.y;
  const angle = atan2(aimY - (playerBody.y - 6), aimX - playerBody.x);
  const count = playerState.weaponIndex === 2 ? 3 : 1;
  for (let index = 0; index < count; index++) {
    const spread = count === 1 ? 0 : (index - 1) * weapon.spread;
    const shotAngle = angle + spread;
    playerShots.push({
      x: playerBody.x + cos(shotAngle) * 22,
      y: playerBody.y - 6 + sin(shotAngle) * 22,
      velocityX: cos(shotAngle) * weapon.speed,
      velocityY: sin(shotAngle) * weapon.speed,
      damage: weapon.damage * gameStats.damageMultiplier,
      life: 95,
      pierceLeft: weapon.pierce,
      hitIds: [],
      color: weapon.color
    });
  }
}

function useSkill(skillIndex) {
  if (screenState !== "playing") return;
  const now = millis();
  const readyTime = skillReadyAt[skillIndex];
  if (now < readyTime) return;
  skillReadyAt[skillIndex] = now + SKILLS[skillIndex].cooldown * gameStats.cooldownMultiplier;

  if (skillIndex === 0) {
    for (const enemy of roomEnemies) {
      if (enemy.alive && dist(playerBody.x, playerBody.y, enemy.x, enemy.y) < (enemy.boss ? 205 : 170)) {
        enemy.health -= 44 * gameStats.damageMultiplier;
        enemy.hurtUntil = now + 150;
        if (enemy.health <= 0) defeatEnemy(enemy);
      }
    }
    flashUntil = now + 300;
  } else if (skillIndex === 1) {
    shieldUntil = now + 2200;
  } else {
    const aimDirection = mouseX >= 0 && mouseX <= CANVAS_WIDTH && abs(mouseX - playerBody.x) > 10
      ? Math.sign(mouseX - playerBody.x)
      : playerState.facing;
    playerBody.x = constrain(playerBody.x + aimDirection * 150, 30, CANVAS_WIDTH - 30);
    playerState.facing = aimDirection;
    playerState.invulnerableUntil = now + 650;
  }
}

function damagePlayer(damage, sourceX) {
  const now = millis();
  if (now < shieldUntil || now < playerState.invulnerableUntil || screenState !== "playing") return;
  playerState.health -= damage;
  playerState.invulnerableUntil = now + 850;
  playerBody.x = constrain(playerBody.x + (playerBody.x < sourceX ? -25 : 25), 28, CANVAS_WIDTH - 28);
  if (playerState.health <= 0) {
    playerState.health = 0;
    screenState = "lose";
  }
}

function defeatEnemy(enemy) {
  if (!enemy.alive) return;
  enemy.alive = false;
  gainExperience(enemy.reward);
  if (enemy.boss) screenState = "win";
}

function gainExperience(amount) {
  xp += amount;
  if (xp >= xpGoal && screenState === "playing") {
    xp -= xpGoal;
    level += 1;
    xpGoal = 45 + (level - 1) * 24;
    upgradeChoices = shuffle(UPGRADES.slice()).slice(0, 3);
    screenState = "levelup";
  }
}

function chooseUpgrade(choiceIndex) {
  const upgrade = upgradeChoices[choiceIndex];
  if (!upgrade || screenState !== "levelup") return;
  upgrade.apply();
  screenState = "playing";
  if (xp >= xpGoal) {
    xp -= xpGoal;
    level += 1;
    xpGoal = 45 + (level - 1) * 24;
    upgradeChoices = shuffle(UPGRADES.slice()).slice(0, 3);
    screenState = "levelup";
  }
}

function checkRoomProgress() {
  if (roomEnemies.some((enemy) => enemy.alive)) return;
  if (playerBody.x > CANVAS_WIDTH - 66 && roomIndex < 3) {
    roomIndex += 1;
    spawnRoom();
  }
}

function keyPressed() {
  if (screenState === "title") {
    if (keyCode === ENTER || key === " ") startGame();
    return false;
  }
  if (screenState === "win" || screenState === "lose") {
    if (key === "r" || key === "R" || keyCode === ENTER) startGame();
    return false;
  }
  if (screenState === "levelup") {
    if (key === "1" || key === "2" || key === "3") chooseUpgrade(Number(key) - 1);
    return false;
  }

  if (key === " " && playerState.grounded) {
    playerState.velocityY = -13 * gameStats.jumpMultiplier;
    playerState.grounded = false;
  } else if (key === "q" || key === "Q") {
    useSkill(0);
  } else if (key === "w" || key === "W") {
    useSkill(1);
  } else if (key === "e" || key === "E") {
    useSkill(2);
  } else if (key === "1" || key === "2" || key === "3") {
    playerState.weaponIndex = Number(key) - 1;
  }
  return false;
}

function mousePressed() {
  if (screenState === "title") {
    startGame();
  } else if (screenState === "levelup") {
    for (let index = 0; index < 3; index++) {
      const cardX = CANVAS_WIDTH / 2 + (index - 1) * 235;
      if (mouseX > cardX - 100 && mouseX < cardX + 100 && mouseY > 270 && mouseY < 430) chooseUpgrade(index);
    }
  } else if (screenState === "win" || screenState === "lose") {
    startGame();
  } else if (mouseButton === LEFT) {
    fireWeapon();
  }
  return false;
}

function startGame() {
  resetGame();
  screenState = "playing";
}

function drawScene() {
  const palette = [
    { sky: "#25263b", glow: "#b36b62", ground: "#51404a", accent: "#efb36c" },
    { sky: "#1c3440", glow: "#7f9d79", ground: "#344d47", accent: "#aee1b3" },
    { sky: "#392638", glow: "#b86a59", ground: "#4e3540", accent: "#ffca79" },
    { sky: "#211b2c", glow: "#bd4666", ground: "#3e2e42", accent: "#e98bad" }
  ][roomIndex];
  background(palette.sky);
  noStroke();
  for (let stripe = 0; stripe < 12; stripe++) {
    const shade = lerpColor(color(palette.sky), color(palette.glow), stripe / 18);
    fill(shade);
    rect(0, stripe * 34, CANVAS_WIDTH, 35);
  }
  fill(255, 227, 184, 35);
  circle(780, 140, 180);
  fill(255, 227, 184, 150);
  circle(780, 140, 68);
  drawRuins(palette);

  fill(palette.ground);
  rect(0, FLOOR_Y, CANVAS_WIDTH, CANVAS_HEIGHT - FLOOR_Y);
  fill(palette.accent);
  rect(0, FLOOR_Y, CANVAS_WIDTH, 3);
  for (let tileX = 0; tileX < CANVAS_WIDTH; tileX += 64) {
    stroke(20, 17, 26, 65);
    line(tileX, FLOOR_Y + 18, tileX + 32, CANVAS_HEIGHT);
    noStroke();
  }

  if (roomIndex < 3) {
    for (const platform of ROOM_PLATFORMS[roomIndex]) drawPlatform(platform, palette);
  }
  if (screenState === "playing" && roomIndex < 3 && !roomEnemies.some((enemy) => enemy.alive)) drawGate(palette);
}

function drawRuins(palette) {
  noStroke();
  for (let index = 0; index < 8; index++) {
    const ruinX = index * 145 - 20;
    const ruinHeight = 85 + (index % 3) * 36;
    fill(18, 19, 30, 95);
    rect(ruinX, FLOOR_Y - ruinHeight, 92, ruinHeight);
    rect(ruinX - 10, FLOOR_Y - ruinHeight - 12, 112, 16);
    fill(255, 220, 184, 30);
    rect(ruinX + 18, FLOOR_Y - ruinHeight + 20, 9, 28);
    rect(ruinX + 62, FLOOR_Y - ruinHeight + 20, 9, 28);
  }
  fill(palette.accent);
  for (let spark = 0; spark < 22; spark++) {
    const starX = (spark * 173 + 61) % CANVAS_WIDTH;
    const starY = 58 + (spark * 71) % 225;
    circle(starX, starY, spark % 3 === 0 ? 3 : 1.5);
  }
}

function drawPlatform(platform, palette) {
  noStroke();
  fill("#211f2a");
  rect(platform.x - platform.w / 2, platform.y, platform.w, 16, 3);
  fill(palette.accent);
  rect(platform.x - platform.w / 2, platform.y, platform.w, 3);
  fill(255, 255, 255, 12);
  rect(platform.x - platform.w / 2 + 8, platform.y + 6, platform.w - 16, 2);
}

function drawGate(palette) {
  const gateX = CANVAS_WIDTH - 60;
  noFill();
  stroke(palette.accent);
  strokeWeight(5);
  arc(gateX, FLOOR_Y, 76, 100, PI, TWO_PI);
  line(gateX - 38, FLOOR_Y, gateX - 38, FLOOR_Y - 50);
  line(gateX + 38, FLOOR_Y, gateX + 38, FLOOR_Y - 50);
  noStroke();
  const gateGlow = color(palette.accent);
  gateGlow.setAlpha(38);
  fill(gateGlow);
  rect(gateX - 34, FLOOR_Y - 48, 68, 46);
  fill("#f5e1b4");
  textSize(12);
  text("ENTER", gateX, FLOOR_Y - 20);
}

function drawHud() {
  noStroke();
  fill(16, 17, 25, 225);
  rect(0, 0, CANVAS_WIDTH, 80);
  fill("#f3e7c9");
  textAlign(LEFT, CENTER);
  textSize(17);
  text(roomIndex < 3 ? `THE SUNKEN KEEP  ·  ROOM ${roomIndex + 1} / 3` : "THE ASHEN REGENT  ·  FINAL BATTLE", 24, 21);
  textSize(12);
  fill("#cabda7");
  text(`LEVEL ${level}`, 24, 53);

  fill("#46343b");
  rect(100, 44, 170, 15, 7);
  fill(playerState.health > 30 ? "#e17869" : "#f05955");
  rect(100, 44, 170 * (playerState.health / playerState.maxHealth), 15, 7);
  fill("#f3e7c9");
  textAlign(CENTER, CENTER);
  textSize(11);
  text(`${playerState.health} / ${playerState.maxHealth}`, 185, 51);

  fill("#373440");
  rect(286, 44, 210, 15, 7);
  fill("#e9c174");
  rect(286, 44, 210 * min(1, xp / xpGoal), 15, 7);
  fill("#d9cdb8");
  textAlign(LEFT, CENTER);
  text(`${xp} / ${xpGoal} XP`, 286, 30);

  textAlign(RIGHT, CENTER);
  textSize(12);
  fill("#c7bdad");
  text("WEAPON", 610, 28);
  textSize(14);
  fill(WEAPONS[playerState.weaponIndex].color);
  text(`${playerState.weaponIndex + 1}  ${WEAPONS[playerState.weaponIndex].name}`, 610, 52);
  drawSkillStatus(0, 716);
  drawSkillStatus(1, 804);
  drawSkillStatus(2, 892);
  if (roomIndex === 3 && roomEnemies[0]) drawBossHealth(roomEnemies[0]);
  textAlign(CENTER, CENTER);
}

function drawSkillStatus(skillIndex, x) {
  const ready = millis() >= skillReadyAt[skillIndex];
  fill(ready ? "#8dd9b3" : "#9b8c83");
  textAlign(CENTER, CENTER);
  textSize(12);
  const remaining = max(0, (skillReadyAt[skillIndex] - millis()) / 1000);
  text(`${SKILLS[skillIndex].key}  ${ready ? SKILLS[skillIndex].name : `${remaining.toFixed(1)}s`}`, x, 29);
  noFill();
  stroke(ready ? "#8dd9b3" : "#725e5e");
  strokeWeight(2);
  rect(x - 34, 43, 68, 21, 5);
  noStroke();
}

function drawBossHealth(boss) {
  fill("#231d29");
  rect(306, 87, 348, 13, 6);
  fill(boss.phase === 1 ? "#dc7093" : "#ff976f");
  rect(306, 87, 348 * max(0, boss.health / boss.maxHealth), 13, 6);
  fill("#f5dfc2");
  textAlign(CENTER, CENTER);
  textSize(11);
  text(`PHASE ${boss.phase}`, 480, 108);
}

function drawCombatants() {
  for (const shot of playerShots) {
    noStroke();
    fill(shot.color);
    circle(shot.x, shot.y, 13);
    fill(255, 245, 205, 180);
    circle(shot.x, shot.y, 5);
  }
  for (const shot of enemyShots) {
    noStroke();
    fill("#fa796e");
    circle(shot.x, shot.y, shot.radius * 2);
    fill("#ffd6a2");
    circle(shot.x, shot.y, shot.radius);
  }
  for (const enemy of roomEnemies) if (enemy.alive) drawEnemy(enemy);
  drawPlayer();
}

function drawPlayer() {
  const now = millis();
  if (now < playerState.invulnerableUntil && frameCount % 8 < 4) return;
  const x = playerBody.x;
  const y = playerBody.y;
  const aimX = mouseX >= 0 && mouseX <= CANVAS_WIDTH ? mouseX : x + playerState.facing * 100;
  const aimY = mouseY >= 0 && mouseY <= CANVAS_HEIGHT ? mouseY : y;
  const angle = atan2(aimY - (y - 6), aimX - x);

  if (now < shieldUntil) {
    noFill();
    stroke("#8de0e0");
    strokeWeight(3);
    circle(x, y, 72);
    noStroke();
  }
  if (now < flashUntil) {
    noFill();
    stroke("#ffd36a");
    strokeWeight(7);
    circle(x, y, map(flashUntil - now, 0, 300, 235, 90));
    noStroke();
  }

  push();
  translate(x, y);
  scale(playerState.facing, 1);
  noStroke();
  fill("#b34f4d");
  triangle(-11, -9, -31, 20, 5, 23);
  fill("#e4be8a");
  rect(-12, -14, 24, 28, 7);
  fill("#efe2c7");
  circle(2, -18, 22);
  fill("#392b35");
  arc(2, -21, 27, 21, PI, TWO_PI);
  fill("#d88751");
  rect(-13, 15, 11, 12, 3);
  rect(3, 15, 11, 12, 3);
  fill("#f6dda0");
  circle(8, -19, 3);
  pop();

  push();
  translate(x + cos(angle) * 10, y - 6 + sin(angle) * 10);
  rotate(angle);
  noStroke();
  fill(WEAPONS[playerState.weaponIndex].color);
  rect(0, -4, 25, 8, 3);
  fill("#543d44");
  rect(-7, -3, 10, 6, 2);
  pop();
}

function drawEnemy(enemy) {
  const isBoss = enemy.boss;
  const flicker = millis() < enemy.hurtUntil;
  const x = enemy.x;
  const y = enemy.y;
  push();
  translate(x, y);
  scale(enemy.facing, 1);
  noStroke();
  if (isBoss) {
    fill(flicker ? "#fff0cf" : enemy.phase === 1 ? "#693d5a" : "#9c3e55");
    rect(-42, -84, 84, 105, 18);
    fill("#d89b6a");
    triangle(-42, -70, -75, -100, -30, -94);
    triangle(42, -70, 75, -100, 30, -94);
    fill("#ead3ae");
    arc(0, -82, 49, 48, PI, TWO_PI);
    fill("#ed6e7c");
    circle(12, -84, 8);
    fill("#463044");
    rect(-34, 10, 24, 25, 6);
    rect(10, 10, 24, 25, 6);
    fill("#e5b973");
    rect(-55, -29, 21, 16, 5);
    rect(34, -29, 21, 16, 5);
  } else if (enemy.type === "brute") {
    fill(flicker ? "#fff0cf" : "#6e5361");
    rect(-23, -42, 46, 60, 12);
    fill("#9b766f");
    circle(0, -46, 31);
    fill("#e7b379");
    triangle(-13, -58, -22, -73, -4, -62);
    triangle(13, -58, 22, -73, 4, -62);
    fill("#f47b70");
    circle(7, -47, 5);
  } else {
    fill(flicker ? "#fff0cf" : enemy.type === "hexer" ? "#557c78" : "#817061");
    rect(-16, -35, 32, 45, 9);
    fill("#c49b78");
    circle(0, -38, 27);
    fill(enemy.type === "hexer" ? "#a2d8be" : "#d8c29a");
    triangle(-19, -45, 0, -74, 19, -45);
    fill("#e96e70");
    circle(7, -39, 4);
  }
  pop();

  if (!isBoss && enemy.health < enemy.maxHealth) {
    fill("#29232b");
    rect(x - 24, y - enemy.size - 16, 48, 5, 3);
    fill("#e77769");
    rect(x - 24, y - enemy.size - 16, 48 * max(0, enemy.health / enemy.maxHealth), 5, 3);
  }
}

function drawAimMark() {
  if (screenState !== "playing" || mouseX < 0 || mouseX > CANVAS_WIDTH || mouseY < 0 || mouseY > CANVAS_HEIGHT) return;
  noFill();
  stroke(255, 238, 195, 175);
  strokeWeight(1);
  circle(mouseX, mouseY, 15);
  line(mouseX - 10, mouseY, mouseX - 5, mouseY);
  line(mouseX + 5, mouseY, mouseX + 10, mouseY);
  line(mouseX, mouseY - 10, mouseX, mouseY - 5);
  line(mouseX, mouseY + 5, mouseX, mouseY + 10);
  noStroke();
}

function drawTitle() {
  fill(14, 15, 24, 175);
  rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  fill("#f2dfbc");
  textAlign(CENTER, CENTER);
  textSize(58);
  text("ARCANE ASSAULT", CANVAS_WIDTH / 2, 184);
  fill("#e69b67");
  textSize(19);
  text("A run through the Sunken Keep", CANVAS_WIDTH / 2, 232);
  fill("#e7dac2");
  textSize(16);
  text("Clear three rooms, then face the Ashen Regent.", CANVAS_WIDTH / 2, 288);
  text("Move A / D   ·   Jump Space   ·   Aim and fire with the mouse", CANVAS_WIDTH / 2, 326);
  text("Weapons 1 / 2 / 3   ·   Skills Q / W / E", CANVAS_WIDTH / 2, 354);
  drawButton("CLICK OR PRESS ENTER TO BEGIN", CANVAS_WIDTH / 2 - 150, 405, 300, 54, "#d68a5b");
  fill("#b9ae9d");
  textSize(12);
  text("Original fantasy characters and hand-drawn arena", CANVAS_WIDTH / 2, 486);
}

function drawLevelUp() {
  fill(14, 15, 24, 215);
  rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  fill("#f2dfbc");
  textAlign(CENTER, CENTER);
  textSize(38);
  text(`LEVEL ${level}`, CANVAS_WIDTH / 2, 150);
  fill("#d6c6a9");
  textSize(16);
  text("Choose one upgrade", CANVAS_WIDTH / 2, 192);

  for (let index = 0; index < upgradeChoices.length; index++) {
    const cardX = CANVAS_WIDTH / 2 + (index - 1) * 235;
    const upgrade = upgradeChoices[index];
    fill("#332c38");
    stroke("#b87959");
    strokeWeight(2);
    rect(cardX - 100, 270, 200, 160, 8);
    noStroke();
    fill("#e8b779");
    textSize(13);
    text(`UPGRADE ${index + 1}`, cardX, 300);
    fill("#f1e4c9");
    textSize(19);
    text(upgrade.name, cardX, 340);
    fill("#cfc0a7");
    textSize(13);
    text(upgrade.detail, cardX - 85, 380, 170, 42);
  }
  fill("#b9ae9d");
  textSize(13);
  text("Press 1, 2, or 3, or click an upgrade", CANVAS_WIDTH / 2, 472);
}

function drawEndScreen() {
  fill(14, 15, 24, 205);
  rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  fill(screenState === "win" ? "#f2d594" : "#e78275");
  textAlign(CENTER, CENTER);
  textSize(52);
  text(screenState === "win" ? "THE KEEP IS FREE" : "THE KEEP HAS FALLEN", CANVAS_WIDTH / 2, 220);
  fill("#e7dac2");
  textSize(18);
  text(screenState === "win" ? "The Ashen Regent is defeated." : "The Regent's magic overwhelms you.", CANVAS_WIDTH / 2, 278);
  text(`You reached level ${level}`, CANVAS_WIDTH / 2, 316);
  drawButton("CLICK OR PRESS R TO PLAY AGAIN", CANVAS_WIDTH / 2 - 160, 370, 320, 54, "#d68a5b");
}

function drawButton(label, x, y, buttonWidth, buttonHeight, buttonColor) {
  noStroke();
  fill(buttonColor);
  rect(x, y, buttonWidth, buttonHeight, 7);
  fill("#211d25");
  textAlign(CENTER, CENTER);
  textSize(14);
  text(label, x + buttonWidth / 2, y + buttonHeight / 2);
}