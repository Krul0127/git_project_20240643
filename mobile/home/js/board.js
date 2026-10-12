// ===== 게시판 =====
// 글은 브라우저 localStorage('csm_board')에 저장됨
// 마우스 이벤트: 글 목록 줄에 마우스를 올리면(mouseover) 미리보기, 내리면(mouseout) 원래대로

const BOARD_KEY = 'csm_board';
const PREVIEW_DEFAULT = '👆 글 제목에 마우스를 올리면 여기에 미리보기가 나와요!';

// 처음 열었을 때 보여줄 기본 글
const DEFAULT_POSTS = [
    { id: 2, title: '포트폴리오 사이트를 열었습니다', content: '수업에서 만든 웹·안드로이드 과제를 정리한 포트폴리오입니다.\n프로젝트 메뉴에서 결과물을 확인해 보세요!', author: 'admin', date: '2026.10.12', views: 0 },
    { id: 1, title: '게시판 이용 안내', content: '로그인하면 누구나 글을 쓸 수 있어요.\n내가 쓴 글은 직접 삭제할 수 있습니다.', author: 'admin', date: '2026.10.12', views: 0 }
];

// ----- 로그인 정보 -----
function getUser() {
    return sessionStorage.getItem('isLoggedIn') === 'true' ? sessionStorage.getItem('userName') : null;
}

// ----- 저장/불러오기 -----
function loadPosts() {
    try {
        const raw = localStorage.getItem(BOARD_KEY);
        if (raw === null) {
            localStorage.setItem(BOARD_KEY, JSON.stringify(DEFAULT_POSTS));
            return DEFAULT_POSTS.slice();
        }
        return JSON.parse(raw);
    } catch (e) {
        return [];
    }
}

function savePosts(posts) {
    try {
        localStorage.setItem(BOARD_KEY, JSON.stringify(posts));
    } catch (e) { /* 저장 불가 */ }
}

function today() {
    const d = new Date();
    return d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0');
}

// ----- 글 목록 그리기 -----
function renderList() {
    const posts = loadPosts();
    const tbody = document.getElementById('postList');
    const preview = document.getElementById('preview');
    tbody.innerHTML = '';
    document.getElementById('postCount').textContent = posts.length;

    if (posts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="board_empty">아직 글이 없어요. 첫 글을 남겨보세요!</td></tr>';
        return;
    }

    posts.forEach(function (post, index) {
        const tr = document.createElement('tr');
        tr.className = 'board_row';
        tr.innerHTML = '<td class="col_no"></td><td class="col_title"></td><td class="col_author"></td><td class="col_date"></td><td class="col_views"></td>';
        tr.querySelector('.col_no').textContent = posts.length - index;
        tr.querySelector('.col_title').textContent = post.title;
        tr.querySelector('.col_author').textContent = post.author;
        tr.querySelector('.col_date').textContent = post.date;
        tr.querySelector('.col_views').textContent = post.views;

        const titleCell = tr.querySelector('.col_title');

        // 마우스를 올리면: 줄 색 + 제목 색 바뀜, 미리보기 표시
        tr.addEventListener('mouseover', function () {
            tr.style.backgroundColor = '#2b2116';
            titleCell.style.color = '#e67e22';
            preview.innerHTML = '<b></b><span></span>';
            preview.querySelector('b').textContent = '📄 ' + post.title;
            preview.querySelector('span').textContent = post.content.length > 80 ? post.content.slice(0, 80) + '…' : post.content;
            preview.style.borderColor = '#e67e22';
            preview.style.backgroundColor = '#1f1a15';
            preview.style.color = '#ddd';
        });

        // 마우스가 나가면: 색, 미리보기 원래대로
        tr.addEventListener('mouseout', function () {
            tr.style.backgroundColor = '';
            titleCell.style.color = '';
            preview.innerHTML = PREVIEW_DEFAULT;
            preview.style.borderColor = '';
            preview.style.backgroundColor = '';
            preview.style.color = '';
        });

        // 클릭하면: 글 보기
        tr.addEventListener('click', function () {
            openPost(post.id);
        });

        tbody.appendChild(tr);
    });
}

// ----- 글 보기 -----
function openPost(id) {
    const posts = loadPosts();
    const post = posts.find(function (p) { return p.id === id; });
    if (!post) return;

    post.views++;
    savePosts(posts);

    document.getElementById('viewTitle').textContent = post.title;
    document.getElementById('viewMeta').textContent = post.author + ' · ' + post.date + ' · 조회 ' + post.views;
    document.getElementById('viewContent').textContent = post.content;

    // 내가 쓴 글이거나 admin이면 삭제 버튼 보이기
    const user = getUser();
    const delBtn = document.getElementById('deleteBtn');
    delBtn.style.display = (user && (user === post.author || user === 'admin')) ? 'inline-block' : 'none';
    delBtn.onclick = function () { deletePost(id); };

    showView('view');
    renderList();
}

function deletePost(id) {
    if (!confirm('이 글을 삭제할까요?')) return;
    const posts = loadPosts().filter(function (p) { return p.id !== id; });
    savePosts(posts);
    showView('list');
    renderList();
}

// ----- 글쓰기 -----
function openWrite() {
    if (!getUser()) {
        alert('로그인 후 글을 쓸 수 있어요!');
        location.href = 'login.html';
        return;
    }
    document.getElementById('writeTitle').value = '';
    document.getElementById('writeContent').value = '';
    showView('write');
    document.getElementById('writeTitle').focus();
}

function submitPost() {
    const title = document.getElementById('writeTitle').value.trim();
    const content = document.getElementById('writeContent').value.trim();
    if (!title) { alert('제목을 입력해주세요.'); return; }
    if (!content) { alert('내용을 입력해주세요.'); return; }

    const posts = loadPosts();
    posts.unshift({ id: Date.now(), title: title, content: content, author: getUser(), date: today(), views: 0 });
    savePosts(posts);
    showView('list');
    renderList();
}

// 목록 / 글보기 / 글쓰기 화면 전환
function showView(name) {
    document.getElementById('listView').style.display = name === 'list' ? 'block' : 'none';
    document.getElementById('postView').style.display = name === 'view' ? 'block' : 'none';
    document.getElementById('writeView').style.display = name === 'write' ? 'block' : 'none';
    window.scrollTo(0, 0);
}

// ----- 시작 -----
window.addEventListener('DOMContentLoaded', function () {
    const writeBtn = document.getElementById('writeBtn');
    const user = getUser();

    // 글쓰기 버튼에 마우스를 올리면 글자 + 색이 바뀜 (로그인: 초록, 비로그인: 빨강)
    writeBtn.addEventListener('mouseover', function () {
        writeBtn.innerHTML = user ? '✏️ ' + user + '님, 글쓰기!' : '🔒 로그인 필요';
        writeBtn.style.backgroundColor = user ? '#27ae60' : '#c0392b';
    });
    writeBtn.addEventListener('mouseout', function () {
        writeBtn.innerHTML = '✏️ 글쓰기';
        writeBtn.style.backgroundColor = '';
    });

    document.getElementById('preview').innerHTML = PREVIEW_DEFAULT;
    renderList();
});
