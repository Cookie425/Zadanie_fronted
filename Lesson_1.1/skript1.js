class GalleryCenterOnScroll{
  constructor(rootSelector){
    this.root = document.querySelector(rootSelector);
    this.track = this.root.querySelector('.slides');
    this.slides = Array.from(this.track.children);
    this.caption = this.root.querySelector('.house-text');
    this.captionP = this.caption.querySelector('p');
    this.leftLetter = this.root.querySelector('.side-letter.left');
    this.rightLetter = this.root.querySelector('.side-letter.right');
    this.count = this.slides.length;
    this.texts = [
      "Свет мягко разливается по полу. Воздух тихий, почти неподвижный — как утро у воды.",
      "Архитектура, гармонично вписанная в природный ландшафт. Пространство для жизни и творчества.",
      "Современный дизайн, традиционное качество. Дом, где каждая деталь продумана до мелочей."
    ];
    this.active = Math.floor(this.count/2);
    this.init();
    this.attach();
    requestAnimationFrame(()=> this.centerActive(true));
  }

  init(){
    this.slides.forEach((s,i)=>{ s.classList.remove('active'); s.dataset.index = i });
    this.setActive(this.active, true);
  }

  setActive(index, instant){
    index = Math.max(0, Math.min(index, this.count-1));
    if(this.active === index && !instant) return;
    this.slides.forEach(s=>s.classList.remove('active'));
    this.slides[index].classList.add('active');
    this.active = index;
    this.captionP.textContent = this.texts[index] || "";
    this.positionExtras();
    if(!instant) this.centerActive();
  }

  centerActive(instant){
    const active = this.slides[this.active];
    const galleryWidth = this.track.clientWidth;
    const slideCenter = active.offsetLeft + active.offsetWidth/2;
    const scrollLeft = Math.max(0, Math.round(slideCenter - galleryWidth/2));
    this.track.scrollTo({left: scrollLeft, behavior: instant ? 'auto' : 'smooth'});
    setTimeout(()=> this.positionExtras(), instant ? 40 : 300);
  }

  positionExtras(){
    const trackRect = this.track.getBoundingClientRect();
    const activeRect = this.slides[this.active].getBoundingClientRect();
    const captionWidth = Math.min(activeRect.width, this.track.clientWidth - 24);
    this.caption.style.width = captionWidth + 'px';
    this.caption.style.left = (activeRect.left - trackRect.left) + 'px';
    this.caption.style.top = (activeRect.top - trackRect.top + activeRect.height + parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--text-gap'))) + 'px';
    const leftIdx = Math.max(0, this.active - 1);
    const rightIdx = Math.min(this.count - 1, this.active + 1);
    const leftRect = this.slides[leftIdx].getBoundingClientRect();
    const rightRect = this.slides[rightIdx].getBoundingClientRect();
    const leftX = (leftRect.left - trackRect.left) + leftRect.width/2;
    const rightX = (rightRect.left - trackRect.left) + rightRect.width/2;
    const bottomOffset =  - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--letter-size'))/6);
    this.leftLetter.style.left = leftX + 'px';
    this.leftLetter.style.bottom = (24 + bottomOffset) + 'px';
    this.rightLetter.style.left = rightX + 'px';
    this.rightLetter.style.bottom = (24 + bottomOffset) + 'px';
  }

  attach(){
    this.track.addEventListener('click', (e)=>{
      const slide = e.target.closest('.slide');
      if(!slide) return;
      const idx = Number(slide.dataset.index);
      this.setActive(idx);
    });
    this.leftLetter.addEventListener('click', ()=> this.setActive(Math.max(0, this.active - 1)));
    this.rightLetter.addEventListener('click', ()=> this.setActive(Math.min(this.count - 1, this.active + 1)));
    let t;
    this.track.addEventListener('scroll', ()=>{
      clearTimeout(t);
      t = setTimeout(()=> this.onScrollEnd(), 120);
      this.positionExtras();
    }, {passive:true});
    window.addEventListener('resize', ()=> {
      this.centerActive(true);
      this.positionExtras();
    });
  }

  onScrollEnd(){
    const scrollLeft = this.track.scrollLeft;
    const centerPoint = scrollLeft + this.track.clientWidth/2;
    let closest = 0;
    let minDist = Infinity;
    this.slides.forEach((s,i)=>{
      const c = s.offsetLeft + s.offsetWidth/2;
      const dist = Math.abs(centerPoint - c);
      if(dist < minDist){ minDist = dist; closest = i; }
    });
    this.setActive(closest);
  }
}

document.addEventListener('DOMContentLoaded', ()=> new GalleryCenterOnScroll('.gallery-wrap .slides').constructor ? null : new GalleryCenterOnScroll('.gallery-wrap .slides'));