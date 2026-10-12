// ===== 마우스를 올리면 한글 ↔ 영어 바꾸기 (모든 페이지 공통) =====
// 사용법
//   글자 바꾸기:        <button data-swap="Search">검색</button>
//   안내 문구 바꾸기:   <input placeholder="검색어 입력" data-swap-placeholder="Search keyword">
//   글자가 바뀌는 버튼: data-swap="auto" → 아래 SWAP_WORDS 사전에서 찾아서 바꿈 (로그인/로그아웃 등)
// 마우스를 올리면(mouseover) 글자가 바뀌고 색도 주황색으로, 내리면(mouseout) 원래대로.
// document 하나에 이벤트를 걸어서, 나중에 자바스크립트로 만든 버튼(프로젝트 카드 등)도 동작함.

const SWAP_WORDS = {
    '로그인': 'Login',
    '로그아웃': 'Logout',
    '중복확인': 'Check ID',
    '확인완료': 'Checked'
};
const SWAP_COLOR = '#e67e22';

// 배경이 투명한 요소만 글자색을 바꿈 (주황 버튼에 주황 글자면 안 보이니까)
function hasNoBackground(el) {
    const bg = getComputedStyle(el).backgroundColor;
    return bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent';
}

function swapWord(el) {
    const swap = el.getAttribute('data-swap');
    if (swap !== 'auto') return swap;
    const text = el.textContent.trim();
    for (const ko in SWAP_WORDS) {
        if (text === ko) return SWAP_WORDS[ko];
    }
    return null;
}

// 버튼이면 글자 길이에 맞춰 크기가 부드럽게 늘어나고 줄어듦
function isButton(el) {
    return el.tagName === 'BUTTON' || el.classList.contains('btn');
}

function changeText(el, text) {
    if (!isButton(el)) {
        el.textContent = text;
        return;
    }
    clearTimeout(el.sizeTimer);
    // 크기가 바뀌는 동안 글자가 줄바꿈되어 세로로 쌓이지 않게 한 줄로 고정
    el.style.whiteSpace = 'nowrap';
    el.style.overflow = 'hidden';
    const before = el.offsetWidth;          // 바뀌기 전 너비
    el.style.transition = 'none';
    el.style.width = '';
    el.textContent = text;
    const after = el.offsetWidth;           // 바뀐 글자에 맞는 너비 (한 줄 기준)
    el.style.width = before + 'px';
    el.offsetWidth;                         // 브라우저가 현재 너비를 먼저 그리게 함
    el.style.transition = 'width 0.2s ease';
    el.style.width = after + 'px';
    // 애니메이션이 끝나면 고정했던 것들을 풀어줌
    el.sizeTimer = setTimeout(function () {
        el.style.transition = '';
        el.style.width = '';
        el.style.whiteSpace = '';
        el.style.overflow = '';
    }, 250);
}

document.addEventListener('mouseover', function (e) {
    // 1) 글자
    const el = e.target.closest('[data-swap]');
    if (el && !el.contains(e.relatedTarget)) {
        const newText = swapWord(el);
        if (newText !== null) {
            el.setAttribute('data-original', el.textContent);
            el.setAttribute('data-swapped', newText);
            changeText(el, newText);
            if (hasNoBackground(el)) el.style.color = SWAP_COLOR;
        }
    }

    // 2) 입력칸 안내 문구
    const input = e.target.closest('[data-swap-placeholder]');
    if (input && !input.contains(e.relatedTarget)) {
        input.setAttribute('data-original-placeholder', input.placeholder);
        input.placeholder = input.getAttribute('data-swap-placeholder');
    }
});

document.addEventListener('mouseout', function (e) {
    const el = e.target.closest('[data-swap]');
    if (el && !el.contains(e.relatedTarget) && el.hasAttribute('data-original')) {
        // 마우스를 올린 사이에 클릭으로 글자가 바뀌었으면(예: 중복확인 → 확인완료) 그 글자를 그대로 둠
        if (el.textContent === el.getAttribute('data-swapped')) {
            changeText(el, el.getAttribute('data-original'));
        }
        el.removeAttribute('data-original');
        el.removeAttribute('data-swapped');
        el.style.color = '';
    }

    const input = e.target.closest('[data-swap-placeholder]');
    if (input && !input.contains(e.relatedTarget) && input.hasAttribute('data-original-placeholder')) {
        input.placeholder = input.getAttribute('data-original-placeholder');
        input.removeAttribute('data-original-placeholder');
    }
});
