// ===== 회원가입 =====
// 회원 정보는 브라우저 localStorage('csm_users')에 저장됨
// 마우스 이벤트:
//   1) 입력칸에 마우스를 올리면(mouseover) 아래 도움말 상자에 설명이 나오고, 내리면(mouseout) 원래대로
//   2) 👁 버튼에 마우스를 올리고 있는 동안만 비밀번호가 보임
//   3) 스텝(1·2·3) 동그라미에 마우스를 올리면 단계 설명이 나옴
//   4) 가입 완료 버튼에 마우스를 올리면 글자가 바뀜

const HINT_DEFAULT = '💬 입력칸에 마우스를 올리면 도움말이 나와요.';

let idChecked = false;
let currentStep = 1;

// ----- 아이디 중복확인 -----
function checkDuplicate() {
    const id = document.getElementById('regId').value.trim();
    const msg = document.getElementById('idCheckMsg');
    const btn = document.querySelector('.btn_id_check');

    if (!id || id.length < 4 || id.length > 12) {
        msg.textContent = '아이디는 4~12자 영문/숫자로 입력해주세요.';
        msg.className = 'id_check_msg fail';
        return;
    }

    // localStorage에 저장된 아이디 목록과 비교 + 기본 admin 계정
    const users = JSON.parse(localStorage.getItem('csm_users') || '[]');
    const reserved = ['admin'];
    const allIds = [...reserved, ...users.map(u => u.id)];

    if (allIds.includes(id)) {
        msg.textContent = '❌ 이미 사용 중인 아이디예요.';
        msg.className = 'id_check_msg fail';
        idChecked = false;
        btn.classList.remove('confirmed');
    } else {
        msg.textContent = '✅ 사용 가능한 아이디예요.';
        msg.className = 'id_check_msg ok';
        idChecked = true;
        btn.textContent = '확인완료';
        btn.classList.add('confirmed');
    }
}

function resetIdCheck() {
    idChecked = false;
    const btn = document.querySelector('.btn_id_check');
    const msg = document.getElementById('idCheckMsg');
    btn.textContent = '중복확인';
    btn.classList.remove('confirmed');
    msg.textContent = '';
    msg.className = 'id_check_msg';
}

// ----- 단계 이동 -----
function goStep(step) {
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.classList.remove('show');

    // 유효성 검사
    if (step > currentStep) {
        if (currentStep === 1) {
            const id = document.getElementById('regId').value.trim();
            const pw = document.getElementById('regPw').value;
            const pwCheck = document.getElementById('regPwCheck').value;
            if (!id || id.length < 4 || id.length > 12) return showError('아이디는 4~12자로 입력해주세요.');
            if (!idChecked) return showError('아이디 중복확인을 해주세요.');
            if (!pw || pw.length < 6) return showError('비밀번호는 6자 이상 입력해주세요.');
            if (pw !== pwCheck) return showError('비밀번호가 일치하지 않습니다.');
        }
        if (currentStep === 2) {
            const name = document.getElementById('regName').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            if (!name) return showError('이름을 입력해주세요.');
            if (!email || !email.includes('@')) return showError('올바른 이메일을 입력해주세요.');
        }
    }

    // 카드 전환
    document.getElementById('card' + currentStep).classList.remove('active');
    document.getElementById('card' + step).classList.add('active');

    updateStepBar(step);
    currentStep = step;
    window.scrollTo(0, 0);
}

function updateStepBar(step) {
    for (let i = 1; i <= 3; i++) {
        const circle = document.getElementById('step' + i + '_circle');
        const label = document.getElementById('step' + i + '_label');
        circle.classList.remove('active', 'done');
        label.classList.remove('active');
        if (i < step) { circle.classList.add('done'); circle.textContent = '✓'; }
        else if (i === step) { circle.classList.add('active'); circle.textContent = i; label.classList.add('active'); }
        else { circle.textContent = i; }
    }
    for (let i = 1; i <= 2; i++) {
        const line = document.getElementById('line' + i);
        line.classList.toggle('done', i < step);
    }
}

// ----- 약관 -----
function toggleAll(checkbox) {
    document.getElementById('agreeTerms').checked = checkbox.checked;
    document.getElementById('agreePrivacy').checked = checkbox.checked;
}

function checkAll() {
    const terms = document.getElementById('agreeTerms').checked;
    const privacy = document.getElementById('agreePrivacy').checked;
    document.getElementById('agreeAll').checked = terms && privacy;
}

// ----- 가입 완료 -----
function doRegister() {
    const agreeTerms = document.getElementById('agreeTerms').checked;
    const agreePrivacy = document.getElementById('agreePrivacy').checked;
    if (!agreeTerms || !agreePrivacy) return showError('필수 약관에 모두 동의해주세요.');

    const users = JSON.parse(localStorage.getItem('csm_users') || '[]');
    users.push({
        id: document.getElementById('regId').value.trim(),
        pw: document.getElementById('regPw').value,
        name: document.getElementById('regName').value.trim(),
        email: document.getElementById('regEmail').value.trim()
    });
    localStorage.setItem('csm_users', JSON.stringify(users));

    const successMsg = document.getElementById('successMsg');
    successMsg.textContent = '🎉 회원가입 완료! 로그인 페이지로 이동합니다.';
    successMsg.classList.add('show');
    setTimeout(() => location.href = 'login.html', 2000);
}

function showError(msg) {
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.textContent = msg;
    errorMsg.classList.add('show');
    window.scrollTo(0, 0);
}

// ===== 마우스 이벤트 연결 =====
window.addEventListener('DOMContentLoaded', function () {
    const hintBox = document.getElementById('hintBox');
    hintBox.innerHTML = HINT_DEFAULT;

    // 도움말 상자 색 켜기/끄기
    function hintOn(text) {
        hintBox.innerHTML = text;
        hintBox.style.borderColor = '#e67e22';
        hintBox.style.backgroundColor = '#1f1a15';
        hintBox.style.color = '#f0a35e';
    }
    function hintOff() {
        hintBox.innerHTML = HINT_DEFAULT;
        hintBox.style.borderColor = '';
        hintBox.style.backgroundColor = '';
        hintBox.style.color = '';
    }

    // 1) 입력칸 도움말 + 테두리/배경 색: data-hint 속성이 있는 입력칸 모두
    document.querySelectorAll('[data-hint]').forEach(function (input) {
        input.addEventListener('mouseover', function () {
            hintOn('💡 ' + input.getAttribute('data-hint'));
            input.style.borderColor = '#e67e22';
            input.style.backgroundColor = '#2f2720';
        });
        input.addEventListener('mouseout', function () {
            hintOff();
            input.style.borderColor = '';
            input.style.backgroundColor = '';
        });
    });

    // 2) 👁 버튼에 마우스를 올리는 동안만 비밀번호 보이기 (보이는 동안 글자색 주황)
    document.querySelectorAll('.pw_peek').forEach(function (btn) {
        const input = document.getElementById(btn.getAttribute('data-target'));
        btn.addEventListener('mouseover', function () {
            input.type = 'text';
            input.style.color = '#e67e22';
            btn.innerHTML = '🙈';
        });
        btn.addEventListener('mouseout', function () {
            input.type = 'password';
            input.style.color = '';
            btn.innerHTML = '👁';
        });
    });

    // 3) 스텝 동그라미 설명
    const stepInfo = {
        1: '1단계: 아이디와 비밀번호를 정해요.',
        2: '2단계: 이름, 이메일 같은 개인 정보를 입력해요.',
        3: '3단계: 약관에 동의하면 가입 완료!'
    };
    [1, 2, 3].forEach(function (i) {
        const circle = document.getElementById('step' + i + '_circle');
        circle.addEventListener('mouseover', function () {
            hintOn('🧭 ' + stepInfo[i]);
            circle.style.boxShadow = '0 0 0 4px rgba(230,126,34,0.35)';
        });
        circle.addEventListener('mouseout', function () {
            hintOff();
            circle.style.boxShadow = '';
        });
    });

    // 4) 가입 완료 버튼 글자 + 색 바꾸기
    const doneBtn = document.getElementById('doneBtn');
    doneBtn.addEventListener('mouseover', function () {
        doneBtn.innerHTML = '🚀 지금 가입하기!';
        doneBtn.style.backgroundColor = '#27ae60';
    });
    doneBtn.addEventListener('mouseout', function () {
        doneBtn.innerHTML = '🎉 가입 완료';
        doneBtn.style.backgroundColor = '';
    });
});
