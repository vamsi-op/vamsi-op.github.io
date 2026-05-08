/* ============================================
   GAMING + SPACE + FUTURISTIC PORTFOLIO
   Three.js 3D Components + Interactions
   ============================================ */

// ─── PAGE LOADER ───────────────────────────────────
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  setTimeout(() => { loader.classList.add('hidden'); }, 2200);
});

window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
  setTimeout(() => { document.body.style.opacity = '1'; }, 100);
});

// ─── NAV ───────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
  hamburger.classList.remove('active');
  navMenu.classList.remove('active');
}));

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const t = document.querySelector(this.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior:'smooth', block:'start' });
  });
});

window.addEventListener('scroll', () => {
  const nb = document.querySelector('.navbar');
  if (window.scrollY > 80) {
    nb.style.background = 'rgba(2,2,8,0.95)';
    nb.style.borderBottomColor = 'rgba(0,245,255,0.35)';
  } else {
    nb.style.background = 'rgba(2,2,8,0.75)';
    nb.style.borderBottomColor = 'rgba(0,245,255,0.25)';
  }
});

// Active nav highlighting
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(s => { if (scrollY >= s.offsetTop - 200) current = s.id; });
  links.forEach(l => {
    l.classList.remove('active');
    if (l.getAttribute('href') === '#' + current) l.classList.add('active');
  });
});

// ─── SCROLL ANIMATIONS ─────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold:0.1, rootMargin:'0px 0px -50px 0px' });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.glass-card, .section-title').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    observer.observe(el);
  });
});

// ─── KEYBOARD / RESIZE ─────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { hamburger.classList.remove('active'); navMenu.classList.remove('active'); }
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) { hamburger.classList.remove('active'); navMenu.classList.remove('active'); }
});

// ─── THREE.JS: STARFIELD BACKGROUND ────────────────
(function initStarfield() {
  const canvas   = document.getElementById('space-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.z = 500;

  // Stars
  const starCount = 4000;
  const positions = new Float32Array(starCount * 3);
  const colors    = new Float32Array(starCount * 3);
  const sizes     = new Float32Array(starCount);

  const palette = [
    [0.0, 0.96, 1.0],  // cyan
    [0.73, 0.31, 1.0], // purple
    [0.22, 1.0, 0.08], // green
    [1.0,  1.0, 1.0],  // white
    [1.0,  0.9, 0.5],  // gold
  ];

  for (let i = 0; i < starCount; i++) {
    positions[i*3]   = (Math.random() - 0.5) * 2000;
    positions[i*3+1] = (Math.random() - 0.5) * 2000;
    positions[i*3+2] = (Math.random() - 0.5) * 2000;
    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i*3]   = c[0];
    colors[i*3+1] = c[1];
    colors[i*3+2] = c[2];
    sizes[i] = Math.random() * 2.5 + 0.5;
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geom.setAttribute('color',    new THREE.BufferAttribute(colors,    3));
  geom.setAttribute('size',     new THREE.BufferAttribute(sizes,     1));

  const mat = new THREE.PointsMaterial({
    size: 1.8, sizeAttenuation:true,
    vertexColors: true, transparent:true, opacity:0.85
  });

  const stars = new THREE.Points(geom, mat);
  scene.add(stars);

  // Nebula fog blobs
  const nebulaGeo = new THREE.BufferGeometry();
  const nPos = new Float32Array(600 * 3);
  const nCol = new Float32Array(600 * 3);
  for (let i = 0; i < 600; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    const r     = 300 + Math.random() * 400;
    nPos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    nPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    nPos[i*3+2] = r * Math.cos(phi);
    const t     = Math.random();
    nCol[i*3]   = t < 0.5 ? 0.0 : 0.73;
    nCol[i*3+1] = t < 0.5 ? 0.96 : 0.31;
    nCol[i*3+2] = 1.0;
  }
  nebulaGeo.setAttribute('position', new THREE.BufferAttribute(nPos, 3));
  nebulaGeo.setAttribute('color',    new THREE.BufferAttribute(nCol, 3));
  const nebulaMat = new THREE.PointsMaterial({ size:4, vertexColors:true, transparent:true, opacity:0.18 });
  scene.add(new THREE.Points(nebulaGeo, nebulaMat));

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.3;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.3;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    frame++;
    stars.rotation.y += 0.0003;
    stars.rotation.x += 0.0001;
    camera.position.x += (mouseX * 30 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 30 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);
    // Twinkle
    const sArr = geom.attributes.size.array;
    for (let i = 0; i < starCount; i += 20) {
      sArr[i] = 0.5 + Math.abs(Math.sin(frame * 0.02 + i)) * 2;
    }
    geom.attributes.size.needsUpdate = true;
    renderer.render(scene, camera);
  }
  animate();
})();

// ─── THREE.JS: HERO 3D OBJECT ──────────────────────
(function initHeroObject() {
  const canvas   = document.getElementById('hero-object-canvas');
  if (!canvas) return;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const W = canvas.parentElement.clientWidth  || 500;
  const H = canvas.parentElement.clientHeight || 500;
  renderer.setSize(W, H);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
  camera.position.z = 4;

  // Main icosahedron (wireframe)
  const icoGeo = new THREE.IcosahedronGeometry(1.4, 1);
  const icoMat = new THREE.MeshBasicMaterial({
    color: 0x00f5ff, wireframe:true, transparent:true, opacity:0.5
  });
  const ico = new THREE.Mesh(icoGeo, icoMat);
  scene.add(ico);

  // Inner solid icosahedron
  const innerGeo = new THREE.IcosahedronGeometry(1.1, 0);
  const innerMat = new THREE.MeshPhongMaterial({
    color:0x050520, emissive:0x0a0535,
    transparent:true, opacity:0.9,
    shininess:80
  });
  const inner = new THREE.Mesh(innerGeo, innerMat);
  scene.add(inner);

  // Outer ring torus
  const torusGeo = new THREE.TorusGeometry(2, 0.015, 8, 120);
  const torusMat = new THREE.MeshBasicMaterial({ color:0xb94fff, transparent:true, opacity:0.7 });
  const torus1   = new THREE.Mesh(torusGeo, torusMat);
  torus1.rotation.x = Math.PI / 3;
  scene.add(torus1);

  const torusGeo2 = new THREE.TorusGeometry(2.3, 0.012, 8, 120);
  const torusMat2 = new THREE.MeshBasicMaterial({ color:0x00f5ff, transparent:true, opacity:0.4 });
  const torus2    = new THREE.Mesh(torusGeo2, torusMat2);
  torus2.rotation.x = -Math.PI / 5;
  torus2.rotation.z = Math.PI / 4;
  scene.add(torus2);

  // Orbiting particles
  const orbitCount = 80;
  const orbitGeo   = new THREE.BufferGeometry();
  const orbitPos   = new Float32Array(orbitCount * 3);
  for (let i = 0; i < orbitCount; i++) {
    const angle = (i / orbitCount) * Math.PI * 2;
    const r     = 1.8 + (Math.random() - 0.5) * 0.6;
    orbitPos[i*3]   = Math.cos(angle) * r;
    orbitPos[i*3+1] = (Math.random() - 0.5) * 0.5;
    orbitPos[i*3+2] = Math.sin(angle) * r;
  }
  orbitGeo.setAttribute('position', new THREE.BufferAttribute(orbitPos, 3));
  const orbitMat = new THREE.PointsMaterial({ color:0x00f5ff, size:0.06, transparent:true, opacity:0.9 });
  const orbit    = new THREE.Points(orbitGeo, orbitMat);
  scene.add(orbit);

  // Lights
  scene.add(new THREE.AmbientLight(0x101030, 2));
  const pLight1 = new THREE.PointLight(0x00f5ff, 3, 10);
  pLight1.position.set(3, 3, 3);
  scene.add(pLight1);
  const pLight2 = new THREE.PointLight(0xb94fff, 2, 10);
  pLight2.position.set(-3, -2, -3);
  scene.add(pLight2);

  // Mouse interaction
  let mX = 0, mY = 0;
  document.addEventListener('mousemove', e => {
    mX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('resize', () => {
    const nW = canvas.parentElement.clientWidth  || 500;
    const nH = canvas.parentElement.clientHeight || 500;
    camera.aspect = nW / nH;
    camera.updateProjectionMatrix();
    renderer.setSize(nW, nH);
  });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.008;
    ico.rotation.x  = t * 0.4;
    ico.rotation.y  = t * 0.6;
    inner.rotation.x = -t * 0.3;
    inner.rotation.y = t * 0.5;
    torus1.rotation.y = t * 0.8;
    torus2.rotation.z = -t * 0.6;
    orbit.rotation.y  = t * 1.2;

    // Mouse-driven tilt
    ico.rotation.x   += mY * 0.05;
    ico.rotation.y   += mX * 0.05;

    // Pulsate inner emissive
    const pulse = (Math.sin(t * 2) + 1) * 0.5;
    innerMat.emissive.setRGB(0.04, 0.02 + pulse * 0.1, 0.15 + pulse * 0.1);

    // Light orbit
    pLight1.position.x = Math.sin(t) * 4;
    pLight1.position.z = Math.cos(t) * 4;
    pLight2.position.x = Math.sin(t + Math.PI) * 3;
    pLight2.position.z = Math.cos(t + Math.PI) * 3;

    renderer.render(scene, camera);
  }
  animate();
})();

// ─── TYPING ANIMATION (hero subtitle) ──────────────
function typeWriter(el, text, speed=60) {
  el.textContent = '';
  let i = 0;
  function type() {
    if (i < text.length) { el.textContent += text[i++]; setTimeout(type, speed); }
  }
  type();
}
window.addEventListener('load', () => {
  const sub = document.getElementById('hero-subtitle');
  if (sub) {
    const txt = sub.textContent;
    setTimeout(() => typeWriter(sub, txt, 55), 2400);
    sub.textContent = '';
  }
});

// ─── PROJECT CARDS 3D TILT ─────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const r  = this.getBoundingClientRect();
      const x  = e.clientX - r.left, y = e.clientY - r.top;
      const rX = (y - r.height/2) / 12;
      const rY = (r.width/2 - x) / 12;
      this.style.transform = `perspective(800px) rotateX(${rX}deg) rotateY(${rY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
});

// ─── SKILL TAG GLOW ────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() { this.style.transform = 'translateY(-3px) scale(1.07)'; });
    tag.addEventListener('mouseleave', function() { this.style.transform = '';  });
  });
});

// ─── CURSOR TRAIL ──────────────────────────────────
document.addEventListener('mousemove', e => {
  if (window.innerWidth <= 768) return;
  const tr = document.createElement('div');
  const colors = ['#00f5ff','#b94fff','#39ff14'];
  const color  = colors[Math.floor(Math.random() * colors.length)];
  tr.style.cssText = `
    position:fixed; width:5px; height:5px;
    background:${color}; border-radius:50%;
    pointer-events:none; z-index:9997;
    left:${e.clientX-2}px; top:${e.clientY-2}px;
    box-shadow:0 0 8px ${color};
    animation:trailFade 0.7s ease-out forwards;
  `;
  document.body.appendChild(tr);
  setTimeout(() => tr.remove(), 700);
});
const trailStyle = document.createElement('style');
trailStyle.textContent = '@keyframes trailFade { 0%{opacity:1;transform:scale(1)} 100%{opacity:0;transform:scale(0.1)} }';
document.head.appendChild(trailStyle);

// ─── EMAILJS CONFIG ────────────────────────────────
const EMAILJS_SERVICE_ID  = 'service_a6x1m68';
const EMAILJS_TEMPLATE_ID = 'template_119gwji';
const EMAILJS_PUBLIC_KEY  = 'jYysUsaYkJZ1jI_Qn';
(function() { if (typeof emailjs !== 'undefined') emailjs.init(EMAILJS_PUBLIC_KEY); })();

// Form validation helper
function validateField(field, errorEl, rules) {
  const v = field.value.trim();
  let ok = true, msg = '';
  if (rules.required && !v)                              { ok=false; msg=`${field.placeholder} is required.`; }
  else if (rules.minLength && v.length < rules.minLength){ ok=false; msg=`Min ${rules.minLength} characters.`; }
  else if (rules.maxLength && v.length > rules.maxLength){ ok=false; msg=`Max ${rules.maxLength} characters.`; }
  else if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { ok=false; msg='Enter a valid email.'; }
  field.classList.toggle('error',  !ok);
  field.classList.toggle('success', ok);
  errorEl.textContent = msg;
  errorEl.classList.toggle('show', !ok);
  return ok;
}

function showNotification(message, type='info') {
  const n = document.createElement('div');
  const colors = { success:'#39ff14', error:'#ff2d78', info:'#00f5ff' };
  const c = colors[type] || '#00f5ff';
  n.style.cssText = `
    position:fixed; top:90px; right:20px; z-index:10000;
    background:rgba(5,5,20,0.95); border:1px solid ${c};
    border-radius:8px; padding:1rem 1.5rem; color:#fff;
    font-family:'Exo 2',sans-serif; font-size:0.9rem;
    box-shadow:0 0 20px ${c}40; max-width:300px;
    transform:translateX(120%); transition:transform 0.4s cubic-bezier(0.4,0,0.2,1);
  `;
  n.innerHTML = `<span style="color:${c};margin-right:8px;">◈</span>${message}`;
  document.body.appendChild(n);
  setTimeout(() => { n.style.transform = 'translateX(0)'; }, 50);
  setTimeout(() => { n.style.transform = 'translateX(120%)'; setTimeout(()=>n.remove(), 400); }, 5000);
}

// Contact form submit
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const fields = {
    name:    { field: document.getElementById('input-name'),    error: document.getElementById('name-error'),    rules:{ required:true, minLength:2, maxLength:50 } },
    email:   { field: document.getElementById('input-email'),   error: document.getElementById('email-error'),   rules:{ required:true, email:true } },
    subject: { field: document.getElementById('input-subject'), error: document.getElementById('subject-error'), rules:{ required:true, minLength:3, maxLength:100 } },
    message: { field: document.getElementById('input-message'), error: document.getElementById('message-error'), rules:{ required:true, minLength:10, maxLength:1000 } }
  };

  Object.values(fields).forEach(({field, error, rules}) => {
    if (!field) return;
    field.addEventListener('blur',  () => validateField(field, error, rules));
    field.addEventListener('input', () => { if (field.classList.contains('error')) validateField(field, error, rules); });
  });

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    let valid = true;
    Object.values(fields).forEach(({field, error, rules}) => { if (field && !validateField(field, error, rules)) valid=false; });
    if (!valid) { showNotification('Please fix the errors above.', 'error'); return; }
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Transmitting...';
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_name:  fields.name.field.value,
      from_email: fields.email.field.value,
      subject:    fields.subject.field.value,
      message:    fields.message.field.value
    }).then(() => {
      showNotification('Message transmitted successfully!', 'success');
      contactForm.reset();
    }).catch(() => {
      showNotification('Transmission failed. Please try again.', 'error');
    }).finally(() => { btn.disabled=false; btn.innerHTML=orig; });
  });
}
