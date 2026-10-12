// ===== 헤더 오른쪽 프로필 드롭다운 메뉴 =====
// 마우스를 올리면(mouseover) 열리고, 메뉴 밖으로 나가면(mouseout) 닫힘.
// 휴대폰처럼 마우스가 없으면 프로필을 눌러서(click) 열고 닫음. 메뉴 바깥을 누르거나 Esc를 눌러도 닫힘.
// 메뉴 항목에 마우스를 올리면 색이 바뀌고, data-swap 으로 한글 ↔ 영어도 바뀜 (js/hover.js).

window.addEventListener('DOMContentLoaded', function () {
    const profile = document.querySelector('.header_profile');
    if (!profile) return;

    const user = sessionStorage.getItem('isLoggedIn') === 'true' ? sessionStorage.getItem('userName') : null;

    // ----- 메뉴 항목 (로그인 여부에 따라 다름) -----
    const items = [
        { text: '👤 자기소개', swap: '👤 About Me', href: 'profile.html' },
        { text: '💼 프로젝트', swap: '💼 Projects', href: 'exam01.html#projects' },
        { text: '📋 게시판', swap: '📋 Board', href: 'board.html' },
        { text: '🐙 GitHub', swap: '🐙 깃허브', href: 'https://github.com/Krul0127', newTab: true },
        'divider'
    ];
    if (user) {
        items.push({ text: '🚪 로그아웃', swap: '🚪 Logout', action: logout });
    } else {
        items.push({ text: '🔑 로그인', swap: '🔑 Login', href: 'login.html' });
        items.push({ text: '📝 회원가입', swap: '📝 Sign Up', href: 'register.html' });
    }

    // ----- 버튼 모양: 사람 아이콘 + 글자(로그인하면 아이디) -----
    profile.innerHTML =
        '<svg class="profile_icon" viewBox="0 0 24 24" aria-hidden="true">' +
        '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5z"/></svg>';
    const label = document.createElement('span');
    label.className = 'profile_label';
    label.textContent = user ? user : '메뉴';
    if (!user) label.setAttribute('data-swap', 'Menu');   // 마우스를 올리면 메뉴 → Menu
    profile.appendChild(label);

    // ----- 메뉴 만들기 -----
    const menu = document.createElement('div');
    menu.className = 'dropdown_menu';
    menu.id = 'profileMenu';

    const head = document.createElement('div');
    head.className = 'dropdown_head';
    const name = document.createElement('b');
    name.textContent = user ? '👋 ' + user + '님' : '👋 반가워요!';
    head.appendChild(name);
    head.appendChild(document.createTextNode(user ? '로그인 중이에요' : '로그인하면 게시판에 글을 쓸 수 있어요'));
    menu.appendChild(head);

    items.forEach(function (item) {
        if (item === 'divider') {
            const line = document.createElement('div');
            line.className = 'dropdown_divider';
            menu.appendChild(line);
            return;
        }
        const a = document.createElement('a');
        a.className = 'dropdown_item';
        a.textContent = item.text;
        a.setAttribute('data-swap', item.swap);
        a.href = item.href || '#';
        if (item.newTab) {
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
        }
        if (item.action) {
            a.addEventListener('click', function (e) {
                e.preventDefault();
                item.action();
            });
        }
        // 항목에 마우스를 올리면 배경색 + 글자색 바뀜
        a.addEventListener('mouseover', function () {
            a.style.backgroundColor = '#2b2116';
            a.style.color = '#e67e22';
        });
        a.addEventListener('mouseout', function () {
            a.style.backgroundColor = '';
            a.style.color = '';
        });
        menu.appendChild(a);
    });

    profile.appendChild(menu);
    profile.setAttribute('role', 'button');
    profile.setAttribute('tabindex', '0');
    profile.setAttribute('aria-haspopup', 'true');
    profile.setAttribute('aria-expanded', 'false');
    profile.setAttribute('aria-label', '프로필 메뉴');

    // ----- 열기 / 닫기 -----
    let closeTimer = null;

    function openMenu() {
        clearTimeout(closeTimer);
        menu.classList.add('open');
        profile.classList.add('open');
        profile.setAttribute('aria-expanded', 'true');
    }
    function closeMenu() {
        menu.classList.remove('open');
        profile.classList.remove('open');
        profile.setAttribute('aria-expanded', 'false');
    }

    // 마우스를 올리면 열림
    profile.addEventListener('mouseover', openMenu);

    // 프로필+메뉴 밖으로 나가면 살짝 기다렸다가 닫힘 (실수로 스친 경우 대비)
    profile.addEventListener('mouseout', function (e) {
        if (profile.contains(e.relatedTarget)) return;
        closeTimer = setTimeout(closeMenu, 200);
    });

    // 누르면 열기/닫기 (휴대폰, 키보드)
    profile.addEventListener('click', function (e) {
        if (menu.contains(e.target)) return;      // 메뉴 항목 클릭은 링크로 이동
        menu.classList.contains('open') ? closeMenu() : openMenu();
    });
    profile.addEventListener('keydown', function (e) {
        if (e.target === profile && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            menu.classList.contains('open') ? closeMenu() : openMenu();
        }
    });

    // 바깥을 누르거나 Esc 누르면 닫힘
    document.addEventListener('click', function (e) {
        if (!profile.contains(e.target)) closeMenu();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMenu();
    });

    function logout() {
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('userName');
        location.reload();
    }
});
