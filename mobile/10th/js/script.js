const display = document.getElementById('display'); // 숫자를 보여줄 화면 요소
const expression = document.getElementById('expression'); // 입력 중인 식을 보여줄 요소
const buttons = document.getElementById('buttons'); // 모든 버튼을 감싸는 요소
const operatorSymbols = { '+': '+', '-': '−', '*': '×', '/': '÷' }; // 화면에 보여줄 연산자 모양

let currentNumber = '0'; // 지금 입력 중인 숫자
let previousNumber = null; // 연산자 앞에 입력한 숫자
let operator = null; // 선택한 연산자 (+, -, *, /)
let isNewInput = false; // 다음 숫자를 새로 입력해야 하는지 여부

// 화면에 현재 숫자를 보여주는 함수
function updateDisplay() { // 함수 시작
  display.textContent = currentNumber; // 화면 글자를 현재 숫자로 바꿈
  expression.textContent = operator ? previousNumber + ' ' + operatorSymbols[operator] : ''; // 연산자를 골랐으면 "3 +"처럼 식 표시
} // 함수 끝

const koreanNumbers = ['영', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구']; // 0~9를 읽는 한글 발음
const operatorNames = { '+': '더하기', '-': '빼기', '*': '곱하기', '/': '나누기' }; // 연산자를 읽는 한글 발음

// 글자를 한국어 음성으로 읽어주는 함수 (브라우저 기본 기능 speechSynthesis 사용)
function speak(text) { // 읽을 글자를 받음
  const speech = new SpeechSynthesisUtterance(text); // 읽을 글자 만들기
  speech.lang = 'ko-KR'; // 한국어 목소리로 설정
  speechSynthesis.cancel(); // 빠르게 누를 때 이전 소리를 끊음
  speechSynthesis.speak(speech); // 소리 내기
} // 함수 끝

// 숫자 버튼을 누르면 숫자를 이어 붙이는 함수
function inputNumber(number) { // 누른 숫자를 받음
  speak(koreanNumbers[number]); // 누른 숫자 소리 내기 (1 → 일)
  if (isNewInput || currentNumber === '0') { // 새로 입력하거나 화면이 0이면
    currentNumber = number; // 누른 숫자로 바꿈
    isNewInput = false; // 이제부터는 이어 붙임
  } else { // 입력 중이면
    currentNumber += number; // 뒤에 숫자를 붙임
  } // 조건 끝
} // 함수 끝

// 두 숫자를 연산자에 맞게 계산하는 함수
function calculate(first, second, operator) { // 앞 숫자, 뒤 숫자, 연산자를 받음
  if (operator === '+') return first + second; // 더하기
  if (operator === '-') return first - second; // 빼기
  if (operator === '*') return first * second; // 곱하기
  if (second === 0) return '오류'; // 0으로 나누면 오류
  return first / second; // 나누기
} // 함수 끝

// = 버튼을 누르면 결과를 화면 숫자로 바꾸는 함수
function showResult() { // 함수 시작
  if (operator === null) return; // 연산자가 없으면 아무것도 안 함
  const result = calculate(previousNumber, Number(currentNumber), operator); // 계산 실행
  currentNumber = result === '오류' ? result : String(Number(result.toFixed(10))); // 소수 오차를 정리해 저장
  previousNumber = null; // 앞 숫자 비움
  operator = null; // 연산자 비움
  isNewInput = true; // 다음 숫자는 새로 입력
  speak(currentNumber); // 계산 결과 소리 내기 (42 → 사십이)
} // 함수 끝

// 사칙연산 버튼을 누르면 연산자를 기억하는 함수
function chooseOperator(nextOperator) { // 누른 연산자를 받음
  if (operator && !isNewInput) showResult(); // 이전 계산이 남아 있으면 먼저 계산
  previousNumber = Number(currentNumber); // 지금 숫자를 앞 숫자로 저장
  operator = nextOperator; // 연산자 저장
  isNewInput = true; // 다음 숫자는 새로 입력
  speak(operatorNames[nextOperator]); // 연산자 소리 내기 (+ → 더하기)
} // 함수 끝

// C 버튼을 누르면 모든 값을 처음으로 되돌리는 함수
function clearAll() { // 함수 시작
  currentNumber = '0'; // 화면 숫자를 0으로
  previousNumber = null; // 앞 숫자 비움
  operator = null; // 연산자 비움
  isNewInput = false; // 입력 상태 초기화
  speak('지우기'); // C 버튼 소리 내기
} // 함수 끝

// 버튼 클릭을 한 곳에서 받아 알맞은 함수로 보내는 함수
function handleClick(event) { // 클릭 정보를 받음
  const button = event.target.closest('button'); // 누른 버튼 찾기
  if (!button) return; // 버튼이 아니면 무시
  if (currentNumber === '오류') clearAll(); // 오류 상태면 먼저 초기화
  const { action, value } = button.dataset; // 버튼의 종류와 값 꺼내기
  if (action === 'number') inputNumber(value); // 숫자 버튼
  if (action === 'operator') chooseOperator(value); // 사칙연산 버튼
  if (action === 'equals') showResult(); // = 버튼
  if (action === 'clear') clearAll(); // C 버튼
  updateDisplay(); // 바뀐 숫자를 화면에 표시
} // 함수 끝

buttons.addEventListener('click', handleClick); // 버튼 묶음에 클릭 이벤트 연결
