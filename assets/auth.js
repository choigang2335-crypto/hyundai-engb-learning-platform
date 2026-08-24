/* ============================================================
   로그인/회원가입 공용 스크립트 — 모든 페이지에서 공유
   ============================================================ */
function authEsc(s) { return (s || '').replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[m])); }

const AUTH_ERR = {
  'auth/email-already-in-use': '이미 가입된 이메일이에요. 로그인을 눌러주세요.',
  'auth/invalid-email': '이메일 형식이 올바르지 않아요.',
  'auth/weak-password': '비밀번호는 6자 이상이어야 해요.',
  'auth/wrong-password': '비밀번호가 올바르지 않아요.',
  'auth/user-not-found': '가입되지 않은 이메일이에요. 회원가입을 눌러주세요.',
  'auth/invalid-credential': '이메일 또는 비밀번호가 올바르지 않아요.',
  'auth/popup-closed-by-user': 'Google 로그인 창이 닫혔어요.'
};

const AuthApp = {
  mode: 'login',

  buildModal() {
    if (document.getElementById('authModal')) return;
    const back = document.createElement('div');
    back.className = 'modal-back';
    back.id = 'authModal';
    back.innerHTML = `
      <div class="modal" style="max-width:420px">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <h3 id="authTitle">로그인</h3>
          <button class="iconbtn" onclick="AuthApp.closeModal()" style="font-size:22px">✕</button>
        </div>
        <div class="seg" style="margin-top:16px">
          <label><input type="radio" name="authMode" value="login" checked onchange="AuthApp.setMode('login')"><span>로그인</span></label>
          <label><input type="radio" name="authMode" value="signup" onchange="AuthApp.setMode('signup')"><span>회원가입</span></label>
        </div>
        <div class="field" id="authNameField" style="display:none">
          <label>이름/직급</label>
          <input id="authName" placeholder="예: 김대리">
        </div>
        <div class="field">
          <label>이메일</label>
          <input id="authEmail" type="email" placeholder="you@company.com">
        </div>
        <div class="field">
          <label>비밀번호</label>
          <input id="authPassword" type="password" placeholder="6자 이상" onkeydown="if(event.key==='Enter')AuthApp.submit()">
        </div>
        <button class="btn btn-vibe" id="authSubmitBtn" style="width:100%;justify-content:center;margin-top:18px" onclick="AuthApp.submit()">로그인</button>
        <div style="display:flex;align-items:center;gap:10px;margin:18px 0;color:var(--muted);font-size:12.5px">
          <div style="flex:1;height:1px;background:var(--line-2)"></div>또는<div style="flex:1;height:1px;background:var(--line-2)"></div>
        </div>
        <button class="btn btn-ghost" style="width:100%;justify-content:center" onclick="AuthApp.google()">Google 계정으로 계속하기</button>
      </div>`;
    document.body.appendChild(back);
    back.addEventListener('click', e => { if (e.target.id === 'authModal') AuthApp.closeModal(); });
  },

  openModal(mode) {
    this.buildModal();
    this.setMode(mode || 'login');
    document.getElementById('authModal').classList.add('open');
  },
  closeModal() {
    const m = document.getElementById('authModal');
    if (m) m.classList.remove('open');
  },
  setMode(mode) {
    this.mode = mode;
    document.querySelectorAll('input[name="authMode"]').forEach(r => r.checked = (r.value === mode));
    document.getElementById('authNameField').style.display = (mode === 'signup') ? '' : 'none';
    document.getElementById('authTitle').textContent = (mode === 'signup') ? '회원가입' : '로그인';
    document.getElementById('authSubmitBtn').textContent = (mode === 'signup') ? '가입하고 시작하기' : '로그인';
  },

  submit() {
    const email = document.getElementById('authEmail').value.trim();
    const pw = document.getElementById('authPassword').value;
    const name = document.getElementById('authName').value.trim();
    if (!email || !pw) { toast('이메일과 비밀번호를 입력해주세요'); return; }

    if (this.mode === 'signup') {
      auth.createUserWithEmailAndPassword(email, pw)
        .then(cred => cred.user.updateProfile({ displayName: name || email.split('@')[0] }))
        .then(() => { this.closeModal(); toast('가입 완료! 환영합니다 🎉'); })
        .catch(e => toast(AUTH_ERR[e.code] || e.message));
    } else {
      auth.signInWithEmailAndPassword(email, pw)
        .then(() => { this.closeModal(); toast('로그인했습니다'); })
        .catch(e => toast(AUTH_ERR[e.code] || e.message));
    }
  },

  google() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
      .then(() => { this.closeModal(); toast('로그인했습니다'); })
      .catch(e => toast(AUTH_ERR[e.code] || e.message));
  },

  logout() {
    auth.signOut().then(() => toast('로그아웃했습니다'));
  },

  // 로그인이 필요한 동작 전에 호출: 로그인 상태면 true, 아니면 모달을 띄우고 false
  requireLogin(msg) {
    if (auth.currentUser) return true;
    toast(msg || '로그인이 필요해요');
    this.openModal('login');
    return false;
  },

  renderNav(user) {
    document.querySelectorAll('.auth-area').forEach(area => {
      if (user) {
        area.innerHTML = `
          <span class="auth-name">${authEsc(user.displayName || user.email)}님</span>
          <button class="btn btn-ghost btn-sm" onclick="AuthApp.logout()">로그아웃</button>`;
      } else {
        area.innerHTML = `<button class="btn btn-ghost btn-sm" onclick="AuthApp.openModal('login')">로그인</button>`;
      }
    });
  }
};

auth.onAuthStateChanged(user => AuthApp.renderNav(user));
