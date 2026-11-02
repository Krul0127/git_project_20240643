// ============================================================
// 로또 번호 생성기
// 버튼을 누르면 1~45 중 겹치지 않는 숫자 6개를 뽑아
// 오름차순으로 정렬한 뒤 공 모양으로 화면에 보여준다.
// ============================================================

// ===== 화면 요소 가져오기 =====

/** 추첨기 전체 (섞이는 연출을 켜고 끌 때 사용) */
const machine = document.querySelector("#machine");
/** 추첨기 안의 유리통 (작은 공들을 넣을 곳) */
const drum = document.querySelector("#drum");
/** 뽑힌 번호 공 6개가 들어갈 영역 */
const result = document.querySelector("#result");
/** "번호 출력 버튼을 눌러 주세요" 안내 문구 */
const placeholder = document.querySelector("#placeholder");
/** 생성 횟수를 보여주는 숫자 */
const countText = document.querySelector("#count");
/** 번호 출력 버튼 */
const drawButton = document.querySelector("#draw-btn");
/** 초기화 버튼 */
const resetButton = document.querySelector("#reset-btn");
/** 지난 번호 기록 목록 */
const historyList = document.querySelector("#history");

// ===== 설정 값 (상수) =====

/** 뽑을 수 있는 가장 작은 숫자 */
const MIN_NUMBER = 1;
/** 뽑을 수 있는 가장 큰 숫자 */
const MAX_NUMBER = 45;
/** 한 번에 뽑는 숫자 개수 */
const PICK_COUNT = 6;
/** 추첨기가 섞이는 시간 (밀리초, 1000 = 1초) */
const MIX_TIME = 1200;
/** 공이 하나씩 나오는 간격 (밀리초) */
const BALL_DELAY = 350;

// ===== 상태 값 (변수) =====

/** 지금까지 번호를 생성한 횟수 */
let drawCount = 0;
/** 연출 중에 실행된 타이머 번호 목록 (초기화할 때 한꺼번에 취소하기 위해 저장) */
let timers = [];

// ============================================================
// 함수
// ============================================================

/**
 * 1~45 사이에서 겹치지 않는 숫자 7개를 뽑아
 * 앞의 6개는 당첨 번호(오름차순), 마지막 1개는 보너스 번호로 돌려준다.
 * - Set은 같은 값을 두 번 넣어도 하나만 저장되는 상자라서 중복을 자동으로 막아준다.
 * - Set에 7개가 찰 때까지 계속 뽑으므로 항상 6개 + 보너스 1개가 나오고,
 *   보너스 번호도 당첨 번호와 절대 겹치지 않는다.
 * @returns {{ numbers: number[], bonus: number }} 예: { numbers: [3, 11, 19, 27, 38, 44], bonus: 7 }
 */
function generateNumbers() {
  const picked = new Set();

  while (picked.size < PICK_COUNT + 1) {
    // Math.random(): 0 이상 1 미만의 랜덤 소수
    // × 45 → 0 이상 45 미만, Math.floor로 소수점 버림 → 0~44, + 1 → 1~45
    const number = Math.floor(Math.random() * MAX_NUMBER) + MIN_NUMBER;
    picked.add(number);
  }

  /** Set을 배열로 바꾼 것 (뽑힌 순서 그대로) */
  const all = [...picked];
  /** 마지막에 뽑힌 숫자를 보너스 번호로 사용 (pop: 배열 맨 끝 값을 꺼냄) */
  const bonus = all.pop();

  // 남은 6개를 작은 숫자부터 큰 숫자 순서(오름차순)로 정렬
  // (a - b)가 음수면 a를 앞에 두는 방식이라 숫자 크기 순으로 정렬된다
  return { numbers: all.sort((a, b) => a - b), bonus };
}

/**
 * 뽑힌 번호가 확인 기준에 맞는지 검사하고 결과를 개발자 도구(F12) 콘솔에 출력한다.
 * - 6개인지, 1~45 범위인지, 중복이 없는지(보너스 포함), 오름차순인지 확인
 * @param {number[]} numbers 검사할 당첨 번호 6개
 * @param {number} bonus 검사할 보너스 번호
 */
function checkNumbers(numbers, bonus) {
  /** 당첨 번호 + 보너스 번호 7개를 한꺼번에 검사하기 위한 배열 */
  const all = [...numbers, bonus];
  const isSix = numbers.length === PICK_COUNT;
  const inRange = all.every((n) => n >= MIN_NUMBER && n <= MAX_NUMBER);
  const noDuplicate = new Set(all).size === all.length;
  const isSorted = numbers.every((n, i) => i === 0 || numbers[i - 1] < n);

  console.log(`[검사] ${numbers.join(", ")} + 보너스 ${bonus} → 6개: ${isSix}, 1~45 범위: ${inRange}, 중복 없음: ${noDuplicate}, 오름차순: ${isSorted}`);
}

/**
 * 번호에 맞는 공 색 구간 이름을 돌려준다.
 * 1~10 → range-1(노랑), 11~20 → range-2(파랑), 21~30 → range-3(빨강),
 * 31~40 → range-4(회색), 41~45 → range-5(초록)
 * @param {number} number 공에 적힌 번호
 * @returns {string} CSS 클래스 이름
 */
function getRangeClass(number) {
  // 예: 23 → (23 - 1) / 10 = 2.2 → 버림 2 → + 1 → range-3
  return `range-${Math.floor((number - 1) / 10) + 1}`;
}

/**
 * 번호가 적힌 공 요소 하나를 만들어서 돌려준다. (화면에 붙이는 건 호출한 쪽에서 함)
 * @param {number} number 공에 적을 번호
 * @returns {HTMLSpanElement} 공 모양 요소
 */
function createBall(number) {
  const ball = document.createElement("span");
  ball.className = `ball ${getRangeClass(number)}`;
  ball.textContent = number;
  return ball;
}

/**
 * 번호 공 하나를 만들어서 결과 영역에 추가한다.
 * @param {number} number 공에 적을 번호
 * @param {boolean} isBonus true면 보너스 공 (앞에 "+" 표시를 붙이고, 공 위에 "보너스" 글자를 따로 표시)
 */
function addBall(number, isBonus = false) {
  const ball = createBall(number);

  if (!isBonus) {
    result.append(ball);
    return;
  }

  /** 당첨 번호와 보너스 번호 사이의 "+" 기호 */
  const plus = document.createElement("span");
  plus.className = "plus";
  plus.textContent = "+";

  /** "보너스" 글자와 공을 위아래로 묶는 상자 (글자가 공 위에 겹치지 않게) */
  const wrap = document.createElement("span");
  wrap.className = "bonus-wrap";
  const label = document.createElement("span");
  label.className = "bonus-label";
  label.textContent = "보너스";
  wrap.append(label, ball);

  result.append(plus, wrap);
}

// ===== 추첨통 안의 작은 공 (물리 연출) =====

/** 작은 공의 반지름 (px). CSS의 .mini-ball 크기(22px)의 절반 */
const MINI_R = 11;
/** 중력: 매 프레임마다 아래로 더해지는 속도 */
const GRAVITY = 0.35;
/** 벽에 부딪혔을 때 튕겨 나가는 정도 (1이면 그대로, 0이면 안 튕김) */
const BOUNCE = 0.75;
/** 추첨통 안의 작은 공 목록. 각 공은 { x, y, vx, vy, el } (위치, 속도, 화면 요소) */
let miniBalls = [];

/**
 * 추첨기 유리통 안에 번호가 적힌 작은 공들을 채운다. (처음 한 번만 실행)
 */
function fillDrum() {
  /** 작은 공에 쓸 색 (번호 공 색과 같은 5가지, 번호 구간 순서대로) */
  const colors = ["#e0a800", "#1f7fd1", "#d93a3a", "#6f7380", "#2fa34d"];
  /** 유리통 안쪽 지름 (테두리 제외) */
  const size = drum.clientWidth;

  for (let i = 0; i < 16; i++) {
    /** 작은 공에 적을 번호 (1~45 중 랜덤) */
    const number = Math.floor(Math.random() * MAX_NUMBER) + MIN_NUMBER;
    const el = document.createElement("span");
    el.className = "mini-ball";
    el.textContent = number;
    // backgroundColor만 바꿔야 CSS에 있는 광택(background-image)이 유지됨
    el.style.backgroundColor = colors[Math.floor((number - 1) / 10)];
    drum.append(el);

    // 처음에는 통 아래쪽에 흩어져 있게 배치
    miniBalls.push({
      x: size / 2 + (Math.random() - 0.5) * 80,
      y: size * 0.7 + Math.random() * 20,
      vx: 0,
      vy: 0,
      el,
    });
  }
}

/**
 * 작은 공들의 움직임을 한 프레임만큼 계산하고 화면에 반영한다.
 * - 평소: 중력 때문에 통 바닥에 가만히 쌓여 있음
 * - 섞는 중: 실제 추첨기처럼 아래에서 바람이 불어 공이 위로 튀어 오름
 * 매 프레임 자기 자신을 다시 예약해서 계속 반복된다.
 */
function updateDrum() {
  /** 유리통 중심 좌표 (가로·세로가 같으므로 하나로 사용) */
  const center = drum.clientWidth / 2;
  /** 공의 중심이 갈 수 있는 최대 거리 (통 반지름 - 공 반지름) */
  const limit = center - MINI_R;
  /** 지금 섞는 중인지 여부 */
  const mixing = machine.classList.contains("mixing");

  miniBalls.forEach((ball) => {
    ball.vy += GRAVITY;

    // 섞는 중이면 통 아래쪽에 있는 공에 위로 부는 바람 + 좌우로 흔드는 힘을 줌
    if (mixing && ball.y > center * 0.8) {
      ball.vy -= 0.9 + Math.random() * 0.9;
      ball.vx += (Math.random() - 0.5) * 1.6;
    }

    // 공기 저항: 속도를 조금씩 줄여서 너무 빨라지지 않게 함
    ball.vx *= 0.99;
    ball.vy *= 0.99;
    ball.x += ball.vx;
    ball.y += ball.vy;

    // 둥근 벽에 닿았는지 검사: 중심에서 공까지 거리가 limit보다 크면 벽 밖으로 나간 것
    const dx = ball.x - center;
    const dy = ball.y - center;
    const dist = Math.hypot(dx, dy);
    if (dist > limit) {
      // nx, ny: 중심에서 공 쪽을 가리키는 길이 1짜리 방향 (벽의 수직 방향)
      const nx = dx / dist;
      const ny = dy / dist;
      // 공을 벽 안쪽으로 다시 밀어 넣음
      ball.x = center + nx * limit;
      ball.y = center + ny * limit;
      // 벽 쪽으로 향하던 속도만 반대로 뒤집어서 튕겨 나가게 함
      const dot = ball.vx * nx + ball.vy * ny;
      if (dot > 0) {
        ball.vx -= (1 + BOUNCE) * dot * nx;
        ball.vy -= (1 + BOUNCE) * dot * ny;
      }
    }
  });

  // 공끼리 부딪힘: 겹친 두 공을 서로 밀어내고, 부딪힌 방향의 속도를 맞바꿈
  for (let i = 0; i < miniBalls.length; i++) {
    for (let j = i + 1; j < miniBalls.length; j++) {
      const a = miniBalls[i];
      const b = miniBalls[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy) || 0.01;
      const overlap = MINI_R * 2 - dist;
      if (overlap <= 0) continue; // 안 겹쳤으면 통과

      const nx = dx / dist;
      const ny = dy / dist;
      // 겹친 만큼 반씩 나눠서 서로 반대쪽으로 밀어냄
      a.x -= nx * overlap / 2;
      a.y -= ny * overlap / 2;
      b.x += nx * overlap / 2;
      b.y += ny * overlap / 2;

      // 서로 다가오는 중일 때만 부딪힌 방향의 속도를 교환 (무게가 같은 공의 충돌)
      const relative = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
      if (relative > 0) {
        a.vx -= relative * nx * 0.9;
        a.vy -= relative * ny * 0.9;
        b.vx += relative * nx * 0.9;
        b.vy += relative * ny * 0.9;
      }
    }
  }

  // 계산한 위치를 화면에 반영 (공의 왼쪽 위 꼭짓점 기준이라 반지름만큼 빼줌)
  miniBalls.forEach((ball) => {
    ball.el.style.transform = `translate(${ball.x - MINI_R}px, ${ball.y - MINI_R}px)`;
  });

  requestAnimationFrame(updateDrum);
}

/**
 * 결과 영역의 공을 모두 지우고 안내 문구만 남긴다.
 */
function clearBalls() {
  result.replaceChildren(placeholder);
  placeholder.hidden = false;
}

/**
 * [번호 출력] 버튼을 눌렀을 때 실행된다.
 * 1) 번호를 뽑고  2) 추첨기를 섞는 연출을 보여준 뒤
 * 3) 공을 하나씩 화면에 띄우고  4) 생성 횟수와 기록을 갱신한다.
 */
function drawLotto() {
  /** 이번에 뽑힌 당첨 번호 6개(오름차순, numbers)와 보너스 번호 1개(bonus) */
  const { numbers, bonus } = generateNumbers();
  checkNumbers(numbers, bonus);

  // 연출이 끝나기 전에 또 누르지 못하게 버튼 잠금
  drawButton.disabled = true;

  // 이전 결과를 지우고, 안내 문구도 숨김
  clearBalls();
  placeholder.hidden = true;

  // 생성 횟수 +1
  drawCount++;
  countText.textContent = drawCount;

  // 추첨기 섞기 시작
  machine.classList.add("mixing");

  // MIX_TIME만큼 섞은 다음 공을 하나씩 내보냄
  timers.push(setTimeout(() => {
    machine.classList.remove("mixing");

    numbers.forEach((number, index) => {
      // index번째 공은 BALL_DELAY × index 만큼 기다렸다가 나옴 → 하나씩 순서대로 등장
      timers.push(setTimeout(() => addBall(number), BALL_DELAY * index));
    });

    // 6개가 다 나온 뒤 조금 더 기다렸다가 보너스 공 등장
    timers.push(setTimeout(() => addBall(bonus, true), BALL_DELAY * (PICK_COUNT + 1)));

    // 보너스 공까지 나오면 버튼을 다시 풀고 기록에 추가
    timers.push(setTimeout(() => {
      drawButton.disabled = false;
      const item = document.createElement("li");
      item.textContent = `${numbers.join(", ")} + 보너스 ${bonus}`;
      historyList.prepend(item); // 최신 기록이 맨 위로
    }, BALL_DELAY * (PICK_COUNT + 2)));
  }, MIX_TIME));
}

/**
 * [초기화] 버튼을 눌렀을 때 실행된다.
 * 진행 중인 연출을 멈추고, 공, 생성 횟수, 기록을 모두 처음 상태로 되돌린다.
 */
function resetLotto() {
  // 예약된 타이머를 모두 취소 (연출 도중 초기화해도 공이 다시 나오지 않게)
  timers.forEach(clearTimeout);
  timers = [];

  machine.classList.remove("mixing");
  clearBalls();

  drawCount = 0;
  countText.textContent = drawCount;
  historyList.replaceChildren();
  drawButton.disabled = false;
}

// ============================================================
// 실제 당첨번호 (lotto-data.js의 LOTTO_HISTORY 사용)
// ============================================================

/** 지난 회차 선택 상자 */
const drawSelect = document.querySelector("#draw-select");
/** 선택한 회차의 추첨 날짜를 보여주는 곳 */
const drawDate = document.querySelector("#draw-date");
/** 선택한 회차의 당첨번호 공이 들어갈 곳 */
const drawBalls = document.querySelector("#draw-balls");
/** 많이 나온 번호 순위 목록 */
const statsList = document.querySelector("#stats");
/** 통계 기간 안내 문구 */
const statsRange = document.querySelector("#stats-range");
/** 순위표에 보여줄 등수 (공동 순위가 있으면 더 많이 보일 수 있음) */
const TOP_RANK = 10;

/**
 * 회차 번호로 추첨 날짜를 계산한다.
 * 로또는 매주 토요일에 한 번씩 추첨하므로, 최신 회차 날짜에서 (차이 × 7일)을 빼면 된다.
 * @param {number} drawNo 회차 번호
 * @returns {string} 예: "2026-10-31"
 */
function getDrawDate(drawNo) {
  /** 최신 회차 번호 (목록 맨 앞) */
  const latestNo = LOTTO_HISTORY[0][0];
  const date = new Date(`${LATEST_DRAW_DATE}T00:00:00`);
  date.setDate(date.getDate() - (latestNo - drawNo) * 7);
  // toISOString은 세계 표준시 기준이라 날짜가 하루 밀릴 수 있어서 직접 조립
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * 선택한 회차의 당첨번호 6개와 보너스 번호를 공 모양으로 보여준다.
 * @param {number} index LOTTO_HISTORY 안에서의 위치 (0이면 최신 회차)
 */
function showDraw(index) {
  /** [회차, 번호1~6, 보너스] 형태의 한 회차 데이터 */
  const [drawNo, ...rest] = LOTTO_HISTORY[index];
  /** 당첨번호 6개 */
  const numbers = rest.slice(0, PICK_COUNT);
  /** 보너스 번호 */
  const bonus = rest[PICK_COUNT];

  drawDate.textContent = `${drawNo}회 · ${getDrawDate(drawNo)} 추첨`;
  drawBalls.replaceChildren(...numbers.map(createBall));

  const plus = document.createElement("span");
  plus.className = "plus";
  plus.textContent = "+";
  drawBalls.append(plus, createBall(bonus));
}

/**
 * 지난 회차 선택 상자에 100개 회차를 채우고, 고르면 해당 회차를 보여주도록 연결한다.
 */
function setupDrawSelect() {
  LOTTO_HISTORY.forEach(([drawNo], index) => {
    // new Option(보이는 글자, 값)
    drawSelect.append(new Option(`${drawNo}회`, index));
  });
  drawSelect.addEventListener("change", () => showDraw(Number(drawSelect.value)));
  showDraw(0); // 처음에는 가장 최근 회차를 보여줌
}

/**
 * 최근 100회 동안 번호마다 몇 번 나왔는지 세어서, 많이 나온 순서로 순위표를 만든다.
 * - 보너스 번호는 세지 않음 (당첨번호 6개만)
 * - 횟수가 같으면 같은 등수 (예: 3위가 두 개면 다음은 5위)
 */
function renderStats() {
  /** counts[번호] = 나온 횟수. 0번 칸은 쓰지 않으므로 46칸을 만듦 */
  const counts = new Array(MAX_NUMBER + 1).fill(0);
  LOTTO_HISTORY.forEach((draw) => {
    draw.slice(1, PICK_COUNT + 1).forEach((number) => counts[number]++);
  });

  /** [번호, 횟수] 목록을 횟수가 많은 순으로 (같으면 번호가 작은 순으로) 정렬 */
  const ranking = counts
    .map((count, number) => [number, count])
    .slice(1) // 0번 칸 제외
    .sort((a, b) => b[1] - a[1] || a[0] - b[0]);

  /** 1위의 횟수 (막대 길이를 비율로 계산할 때 기준) */
  const maxCount = ranking[0][1];
  const first = LOTTO_HISTORY[LOTTO_HISTORY.length - 1][0];
  const last = LOTTO_HISTORY[0][0];
  statsRange.textContent = `${first}회 ~ ${last}회 (${LOTTO_HISTORY.length}회, 보너스 번호 제외)`;

  ranking.forEach(([number, count], index) => {
    // 공동 순위: 앞 번호와 횟수가 같으면 앞 번호의 등수를 그대로 사용
    const rank = ranking.findIndex((item) => item[1] === count) + 1;
    if (rank > TOP_RANK) return;

    const item = document.createElement("li");
    if (rank <= 3) item.classList.add("top");
    item.innerHTML = `
      <span class="rank">${rank}위</span>
      <span class="bar"><span style="width: ${(count / maxCount) * 100}%"></span></span>
      <span class="times">${count}회</span>
    `;
    item.insertBefore(createBall(number), item.querySelector(".bar"));
    statsList.append(item);
  });
}

// ============================================================
// 실행
// ============================================================

setupDrawSelect(); // 지난 회차 당첨번호 표시
renderStats();     // 최근 100회 통계 표시

fillDrum();   // 추첨기에 작은 공 채우기
updateDrum(); // 작은 공 움직임 시작

// 버튼을 클릭하면 각 함수가 실행되도록 연결
drawButton.addEventListener("click", drawLotto);
resetButton.addEventListener("click", resetLotto);
