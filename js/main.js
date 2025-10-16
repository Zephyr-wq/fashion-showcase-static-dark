// Main client-side JS: loader, theme toggle, particles, GSAP, Three.js simple scene, newsletter
document.addEventListener('DOMContentLoaded', () => {
  // Loader
  const loader = document.getElementById('page-loader');
  setTimeout(()=>{ loader.style.opacity = 0; setTimeout(()=>loader.remove(),600); }, 2400);

  // Theme toggle (dark luxury / softer light)
  const themeBtn = document.getElementById('theme-toggle');
  const body = document.body;
  themeBtn.addEventListener('click', () => {
    const current = body.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', next);
    if(next === 'light') {
      body.classList.remove('dark-theme');
      body.style.background = 'linear-gradient(180deg,#f7f3ef,#efe6d6)';
      themeBtn.textContent = '☀️';
    } else {
      body.classList.add('dark-theme');
      body.style.background = 'linear-gradient(180deg,#050505,#0b0b0b)';
      themeBtn.textContent = '🌙';
    }
  });

  // Floating particles
  const particlesRoot = document.getElementById('particles');
  for(let i=0;i<36;i++){
    const el = document.createElement('div');
    const size = Math.random()*60 + 10;
    el.style.width = el.style.height = size + 'px';
    el.style.left = Math.random()*100 + '%';
    el.style.top = Math.random()*100 + '%';
    el.style.opacity = 0.05 + Math.random()*0.18;
    particlesRoot.appendChild(el);
    // animate with GSAP
    gsap.to(el, { y: -300 - Math.random()*800, x: `+=${Math.random()*80-40}`, duration: 12 + Math.random()*20, repeat:-1, ease:'sine.inOut', delay: Math.random()*5 });
  }

  // GSAP reveal for hero and pills
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('#hero-title', { y: 60, opacity:0, duration:1.2, ease:'power3.out' });
  gsap.from('.reveal-pill', { x: 180, stagger:0.12, duration:1.2, ease:'power3.out', scrollTrigger:{ trigger: '#reveal-row', start:'top 90%' } });

  // Collections hover glow
  document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mouseenter', ()=> gsap.to(card, { scale:1.02, boxShadow: '0 30px 80px rgba(201,168,79,0.12)', duration:0.4 }));
    card.addEventListener('mouseleave', ()=> gsap.to(card, { scale:1, boxShadow: '0 12px 40px rgba(2,6,23,0.6)', duration:0.4 }));
  });

  // Newsletter form
  const form = document.getElementById('newsletter');
  const msg = document.getElementById('news-msg');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const mail = document.getElementById('email').value;
    if(!mail || !mail.includes('@')){ msg.textContent = 'Please enter a valid email.'; return; }
    msg.textContent = 'Thanks — you are on the list.';
    form.reset();
  });

  // Simple Three.js scene in #three-container
  (function(){ 
    const container = document.getElementById('three-container');
    const width = container.clientWidth, height = container.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
    camera.position.set(0,0,3.2);
    const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Mesh
    const geom = new THREE.TorusKnotGeometry(0.6,0.18,220,36);
    const mat = new THREE.MeshStandardMaterial({ color:0x121212, metalness:0.95, roughness:0.25 });
    const mesh = new THREE.Mesh(geom, mat);
    scene.add(mesh);
    // lights
    const dir = new THREE.DirectionalLight(0xfff1d6, 0.9);
    dir.position.set(5,5,5); scene.add(dir);
    const amb = new THREE.AmbientLight(0xffffff, 0.35); scene.add(amb);

    function onResize(){ const w=container.clientWidth, h=container.clientHeight; renderer.setSize(w,h); camera.aspect=w/h; camera.updateProjectionMatrix(); }
    window.addEventListener('resize', onResize);

    // orbit-like auto-rotate + subtle mouse parallax
    let mouseX=0, mouseY=0;
    window.addEventListener('mousemove',(e)=>{ mouseX = (e.clientX - window.innerWidth/2) / window.innerWidth; mouseY = (e.clientY - window.innerHeight/2) / window.innerHeight; });

    function animate(){ requestAnimationFrame(animate); mesh.rotation.y += 0.008; mesh.rotation.x += 0.002; mesh.position.x += (mouseX*0.5 - mesh.position.x)*0.05; mesh.position.y += (-mouseY*0.5 - mesh.position.y)*0.05; renderer.render(scene,camera); }
    animate();
  })();

});
