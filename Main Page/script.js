/*! Lenis Smooth Scroll v1.1.18 | https://github.com/darkroomengineering/lenis */
;(function(){function t(t,i,e){return Math.max(t,Math.min(i,e))}var i=class{isRunning=!1;value=0;from=0;to=0;currentTime=0;lerp;duration;easing;onUpdate;advance(i){if(!this.isRunning)return;let e=!1;if(this.duration&&this.easing){this.currentTime+=i;const s=t(0,this.currentTime/this.duration,1);e=s>=1;const o=e?1:this.easing(s);this.value=this.from+(this.to-this.from)*o}else this.lerp?(this.value=function(t,i,e,s){return function(t,i,e){return(1-e)*t+e*i}(t,i,1-Math.exp(-e*s))}(this.value,this.to,60*this.lerp,i),Math.round(this.value)===this.to&&(this.value=this.to,e=!0)):(this.value=this.to,e=!0);e&&this.stop(),this.onUpdate?.(this.value,e)}stop(){this.isRunning=!1}fromTo(t,i,{lerp:e,duration:s,easing:o,onStart:n,onUpdate:r}){this.from=this.value=t,this.to=i,this.lerp=e,this.duration=s,this.easing=o,this.currentTime=0,this.isRunning=!0,n?.(),this.onUpdate=r}};var e=class{constructor(t,i,{autoResize:e=!0,debounce:s=250}={}){this.wrapper=t,this.content=i,e&&(this.debouncedResize=function(t,i){let e;return function(...s){let o=this;clearTimeout(e),e=setTimeout((()=>{e=void 0,t.apply(o,s)}),i)}}(this.resize,s),this.wrapper instanceof Window?window.addEventListener("resize",this.debouncedResize,!1):(this.wrapperResizeObserver=new ResizeObserver(this.debouncedResize),this.wrapperResizeObserver.observe(this.wrapper)),this.contentResizeObserver=new ResizeObserver(this.debouncedResize),this.contentResizeObserver.observe(this.content)),this.resize()}width=0;height=0;scrollHeight=0;scrollWidth=0;debouncedResize;wrapperResizeObserver;contentResizeObserver;destroy(){this.wrapperResizeObserver?.disconnect(),this.contentResizeObserver?.disconnect(),this.wrapper===window&&this.debouncedResize&&window.removeEventListener("resize",this.debouncedResize,!1)}resize=()=>{this.onWrapperResize(),this.onContentResize()};onWrapperResize=()=>{this.wrapper instanceof Window?(this.width=window.innerWidth,this.height=window.innerHeight):(this.width=this.wrapper.clientWidth,this.height=this.wrapper.clientHeight)};onContentResize=()=>{this.wrapper instanceof Window?(this.scrollHeight=this.content.scrollHeight,this.scrollWidth=this.content.scrollWidth):(this.scrollHeight=this.wrapper.scrollHeight,this.scrollWidth=this.wrapper.scrollWidth)};get limit(){return{x:this.scrollWidth-this.width,y:this.scrollHeight-this.height}}},s=class{events={};emit(t,...i){let e=this.events[t]||[];for(let t=0,s=e.length;t<s;t++)e[t]?.(...i)}on(t,i){return this.events[t]?.push(i)||(this.events[t]=[i]),()=>{this.events[t]=this.events[t]?.filter((t=>i!==t))}}off(t,i){this.events[t]=this.events[t]?.filter((t=>i!==t))}destroy(){this.events={}}},o=100/6,n={passive:!1},r=class{constructor(t,i={wheelMultiplier:1,touchMultiplier:1}){this.element=t,this.options=i,window.addEventListener("resize",this.onWindowResize,!1),this.onWindowResize(),this.element.addEventListener("wheel",this.onWheel,n),this.element.addEventListener("touchstart",this.onTouchStart,n),this.element.addEventListener("touchmove",this.onTouchMove,n),this.element.addEventListener("touchend",this.onTouchEnd,n)}touchStart={x:0,y:0};lastDelta={x:0,y:0};window={width:0,height:0};emitter=new s;on(t,i){return this.emitter.on(t,i)}destroy(){this.emitter.destroy(),window.removeEventListener("resize",this.onWindowResize,!1),this.element.removeEventListener("wheel",this.onWheel,n),this.element.removeEventListener("touchstart",this.onTouchStart,n),this.element.removeEventListener("touchmove",this.onTouchMove,n),this.element.removeEventListener("touchend",this.onTouchEnd,n)}onTouchStart=t=>{const{clientX:i,clientY:e}=t.targetTouches?t.targetTouches[0]:t;this.touchStart.x=i,this.touchStart.y=e,this.lastDelta={x:0,y:0},this.emitter.emit("scroll",{deltaX:0,deltaY:0,event:t})};onTouchMove=t=>{const{clientX:i,clientY:e}=t.targetTouches?t.targetTouches[0]:t,s=-(i-this.touchStart.x)*this.options.touchMultiplier,o=-(e-this.touchStart.y)*this.options.touchMultiplier;this.touchStart.x=i,this.touchStart.y=e,this.lastDelta={x:s,y:o},this.emitter.emit("scroll",{deltaX:s,deltaY:o,event:t})};onTouchEnd=t=>{this.emitter.emit("scroll",{deltaX:this.lastDelta.x,deltaY:this.lastDelta.y,event:t})};onWheel=t=>{let{deltaX:i,deltaY:e,deltaMode:s}=t;i*=1===s?o:2===s?this.window.width:1,e*=1===s?o:2===s?this.window.height:1,i*=this.options.wheelMultiplier,e*=this.options.wheelMultiplier,this.emitter.emit("scroll",{deltaX:i,deltaY:e,event:t})};onWindowResize=()=>{this.window={width:window.innerWidth,height:window.innerHeight}}},Lenis=class{_isScrolling=!1;_isStopped=!1;_isLocked=!1;_preventNextNativeScrollEvent=!1;_resetVelocityTimeout=null;__rafID=null;isTouching;time=0;userData={};lastVelocity=0;velocity=0;direction=0;options;targetScroll;animatedScroll;animate=new i;emitter=new s;dimensions;virtualScroll;constructor({wrapper:t=window,content:i=document.documentElement,eventsTarget:s=t,smoothWheel:o=!0,syncTouch:n=!1,syncTouchLerp:l=.075,touchInertiaMultiplier:h=35,duration:a,easing:c=t=>Math.min(1,1.001-Math.pow(2,-10*t)),lerp:p=.1,infinite:d=!1,orientation:u="vertical",gestureOrientation:m="vertical",touchMultiplier:v=1,wheelMultiplier:S=1,autoResize:w=!0,prevent:g,virtualScroll:f,overscroll:y=!0,autoRaf:E=!1,anchors:T=!1,__experimental__naiveDimensions:z=!1}={}){window.lenisVersion="1.1.20",t&&t!==document.documentElement||(t=window),this.options={wrapper:t,content:i,eventsTarget:s,smoothWheel:o,syncTouch:n,syncTouchLerp:l,touchInertiaMultiplier:h,duration:a,easing:c,lerp:p,infinite:d,gestureOrientation:m,orientation:u,touchMultiplier:v,wheelMultiplier:S,autoResize:w,prevent:g,virtualScroll:f,overscroll:y,autoRaf:E,anchors:T,__experimental__naiveDimensions:z},this.dimensions=new e(t,i,{autoResize:w}),this.updateClassName(),this.targetScroll=this.animatedScroll=this.actualScroll,this.options.wrapper.addEventListener("scroll",this.onNativeScroll,!1),this.options.wrapper.addEventListener("scrollend",this.onScrollEnd,{capture:!0}),this.options.anchors&&this.options.wrapper===window&&this.options.wrapper.addEventListener("click",this.onClick,!1),this.options.wrapper.addEventListener("pointerdown",this.onPointerDown,!1),this.virtualScroll=new r(s,{touchMultiplier:v,wheelMultiplier:S}),this.virtualScroll.on("scroll",this.onVirtualScroll),this.options.autoRaf&&(this.__rafID=requestAnimationFrame(this.raf))}destroy(){this.emitter.destroy(),this.options.wrapper.removeEventListener("scroll",this.onNativeScroll,!1),this.options.wrapper.removeEventListener("scrollend",this.onScrollEnd,{capture:!0}),this.options.wrapper.removeEventListener("pointerdown",this.onPointerDown,!1),this.options.anchors&&this.options.wrapper===window&&this.options.wrapper.removeEventListener("click",this.onClick,!1),this.virtualScroll.destroy(),this.dimensions.destroy(),this.cleanUpClassName(),this.__rafID&&cancelAnimationFrame(this.__rafID)}on(t,i){return this.emitter.on(t,i)}off(t,i){return this.emitter.off(t,i)}onScrollEnd=t=>{t instanceof CustomEvent||"smooth"!==this.isScrolling&&!1!==this.isScrolling||t.stopPropagation()};dispatchScrollendEvent=()=>{this.options.wrapper.dispatchEvent(new CustomEvent("scrollend",{bubbles:this.options.wrapper===window,detail:{lenisScrollEnd:!0}}))};setScroll(t){this.isHorizontal?this.options.wrapper.scrollTo({left:t,behavior:"instant"}):this.options.wrapper.scrollTo({top:t,behavior:"instant"})}onClick=t=>{const i=t.composedPath().find((t=>t instanceof HTMLAnchorElement&&t.getAttribute("href")?.startsWith("#")));if(i){const t=i.getAttribute("href");if(t){const i="object"==typeof this.options.anchors&&this.options.anchors?this.options.anchors:void 0;this.scrollTo(t,i)}}};onPointerDown=t=>{1===t.button&&this.reset()};onVirtualScroll=t=>{if("function"==typeof this.options.virtualScroll&&!1===this.options.virtualScroll(t))return;const{deltaX:i,deltaY:e,event:s}=t;if(this.emitter.emit("virtual-scroll",{deltaX:i,deltaY:e,event:s}),s.ctrlKey)return;if(s.lenisStopPropagation)return;const o=s.type.includes("touch"),n=s.type.includes("wheel");this.isTouching="touchstart"===s.type||"touchmove"===s.type;const r=0===i&&0===e;if(this.options.syncTouch&&o&&"touchstart"===s.type&&r&&!this.isStopped&&!this.isLocked)return void this.reset();const l="vertical"===this.options.gestureOrientation&&0===e||"horizontal"===this.options.gestureOrientation&&0===i;if(r||l)return;let h=s.composedPath();h=h.slice(0,h.indexOf(this.rootElement));const a=this.options.prevent;if(h.find((t=>t instanceof HTMLElement&&("function"==typeof a&&a?.(t)||t.hasAttribute?.("data-lenis-prevent")||o&&t.hasAttribute?.("data-lenis-prevent-touch")||n&&t.hasAttribute?.("data-lenis-prevent-wheel")))))return;if(this.isStopped||this.isLocked)return void s.preventDefault();if(!(this.options.syncTouch&&o||this.options.smoothWheel&&n))return this.isScrolling="native",this.animate.stop(),void(s.lenisStopPropagation=!0);let c=e;"both"===this.options.gestureOrientation?c=Math.abs(e)>Math.abs(i)?e:i:"horizontal"===this.options.gestureOrientation&&(c=i),(!this.options.overscroll||this.options.infinite||this.options.wrapper!==window&&(this.animatedScroll>0&&this.animatedScroll<this.limit||0===this.animatedScroll&&e>0||this.animatedScroll===this.limit&&e<0))&&(s.lenisStopPropagation=!0),s.preventDefault();const p=o&&this.options.syncTouch,d=o&&"touchend"===s.type&&Math.abs(c)>5;d&&(c=this.velocity*this.options.touchInertiaMultiplier),this.scrollTo(this.targetScroll+c,{programmatic:!1,...p?{lerp:d?this.options.syncTouchLerp:1}:{lerp:this.options.lerp,duration:this.options.duration,easing:this.options.easing}})};resize(){this.dimensions.resize(),this.animatedScroll=this.targetScroll=this.actualScroll,this.emit()}emit(){this.emitter.emit("scroll",this)}onNativeScroll=()=>{if(null!==this._resetVelocityTimeout&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this._preventNextNativeScrollEvent)this._preventNextNativeScrollEvent=!1;else if(!1===this.isScrolling||"native"===this.isScrolling){const t=this.animatedScroll;this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity,this.velocity=this.animatedScroll-t,this.direction=Math.sign(this.animatedScroll-t),this.isStopped||(this.isScrolling="native"),this.emit(),0!==this.velocity&&(this._resetVelocityTimeout=setTimeout((()=>{this.lastVelocity=this.velocity,this.velocity=0,this.isScrolling=!1,this.emit()}),400))}};reset(){this.isLocked=!1,this.isScrolling=!1,this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity=0,this.animate.stop()}start(){this.isStopped&&(this.reset(),this.isStopped=!1)}stop(){this.isStopped||(this.reset(),this.isStopped=!0)}raf=t=>{const i=t-(this.time||t);this.time=t,this.animate.advance(.001*i),this.options.autoRaf&&(this.__rafID=requestAnimationFrame(this.raf))};scrollTo(i,{offset:e=0,immediate:s=!1,lock:o=!1,duration:n=this.options.duration,easing:r=this.options.easing,lerp:l=this.options.lerp,onStart:h,onComplete:a,force:c=!1,programmatic:p=!0,userData:d}={}){if(!this.isStopped&&!this.isLocked||c){if("string"==typeof i&&["top","left","start"].includes(i))i=0;else if("string"==typeof i&&["bottom","right","end"].includes(i))i=this.limit;else{let t;if("string"==typeof i?t=document.querySelector(i):i instanceof HTMLElement&&i?.nodeType&&(t=i),t){if(this.options.wrapper!==window){const t=this.rootElement.getBoundingClientRect();e-=this.isHorizontal?t.left:t.top}const s=t.getBoundingClientRect();i=(this.isHorizontal?s.left:s.top)+this.animatedScroll}}if("number"==typeof i){if(i+=e,i=Math.round(i),this.options.infinite?p&&(this.targetScroll=this.animatedScroll=this.scroll):i=t(0,i,this.limit),i===this.targetScroll)return h?.(this),void a?.(this);if(this.userData=d??{},s)return this.animatedScroll=this.targetScroll=i,this.setScroll(this.scroll),this.reset(),this.preventNextNativeScrollEvent(),this.emit(),a?.(this),this.userData={},void requestAnimationFrame((()=>{this.dispatchScrollendEvent()}));p||(this.targetScroll=i),this.animate.fromTo(this.animatedScroll,i,{duration:n,easing:r,lerp:l,onStart:()=>{o&&(this.isLocked=!0),this.isScrolling="smooth",h?.(this)},onUpdate:(t,i)=>{this.isScrolling="smooth",this.lastVelocity=this.velocity,this.velocity=t-this.animatedScroll,this.direction=Math.sign(this.velocity),this.animatedScroll=t,this.setScroll(this.scroll),p&&(this.targetScroll=t),i||this.emit(),i&&(this.reset(),this.emit(),a?.(this),this.userData={},requestAnimationFrame((()=>{this.dispatchScrollendEvent()})),this.preventNextNativeScrollEvent())}})}}}preventNextNativeScrollEvent(){this._preventNextNativeScrollEvent=!0,requestAnimationFrame((()=>{this._preventNextNativeScrollEvent=!1}))}get rootElement(){return this.options.wrapper===window?document.documentElement:this.options.wrapper}get limit(){return this.options.__experimental__naiveDimensions?this.isHorizontal?this.rootElement.scrollWidth-this.rootElement.clientWidth:this.rootElement.scrollHeight-this.rootElement.clientHeight:this.dimensions.limit[this.isHorizontal?"x":"y"]}get isHorizontal(){return"horizontal"===this.options.orientation}get actualScroll(){const t=this.options.wrapper;return this.isHorizontal?t.scrollX??t.scrollLeft:t.scrollY??t.scrollTop}get scroll(){return this.options.infinite?(t=this.animatedScroll,i=this.limit,(t%i+i)%i):this.animatedScroll;var t,i}get progress(){return 0===this.limit?1:this.scroll/this.limit}get isScrolling(){return this._isScrolling}set isScrolling(t){this._isScrolling!==t&&(this._isScrolling=t,this.updateClassName())}get isStopped(){return this._isStopped}set isStopped(t){this._isStopped!==t&&(this._isStopped=t,this.updateClassName())}get isLocked(){return this._isLocked}set isLocked(t){this._isLocked!==t&&(this._isLocked=t,this.updateClassName())}get isSmooth(){return"smooth"===this.isScrolling}get className(){let t="lenis";return this.isStopped&&(t+=" lenis-stopped"),this.isLocked&&(t+=" lenis-locked"),this.isScrolling&&(t+=" lenis-scrolling"),"smooth"===this.isScrolling&&(t+=" lenis-smooth"),t}updateClassName(){this.cleanUpClassName(),this.rootElement.className=`${this.rootElement.className} ${this.className}`.trim()}cleanUpClassName(){this.rootElement.className=this.rootElement.className.replace(/lenis(-\w+)?/g,"").trim()}};globalThis.Lenis=Lenis,globalThis.Lenis.prototype=Lenis.prototype;})();

/**
 * Rozzaq — Graphic Designer Portfolio
 * Script for Dynamic Navbar Scroll & Custom Cursor
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. LENIS SMOOTH MOMENTUM SCROLL (ELIMINATES MOUSE WHEEL NOTCH JUTTER)
    // ==========================================
    let lenis = null;

    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.15,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Silky exponential ease-out
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 1.5,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // ==========================================
    // 1. NAVBAR SCROLL LOGIC
    // ==========================================
    const navWrapper = document.querySelector('.nav-wrapper');

    function updateNavbar() {
        if (!navWrapper) return;

        // When scrolled past 30px, switch from floating card (Image 1) to full-width top bar (Image 2)
        if (window.scrollY > 30) {
            navWrapper.classList.add('scrolled');
        } else {
            navWrapper.classList.remove('scrolled');
        }
    }

    // Run on initial load to set correct navbar state
    updateNavbar();

    // Listen for window scroll with passive option for smooth performance
    window.addEventListener('scroll', updateNavbar, { passive: true });


    // ==========================================
    // 2. CUSTOM CURSOR LOGIC
    // ==========================================
    const cursor = document.getElementById('cursor');

    // Check if user is using a mouse/fine pointer device (desktop/laptop)
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;

    if (cursor && isFinePointer) {
        document.body.classList.add('has-custom-cursor');

        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;
        let isCursorActive = false;

        // Smooth Lerp loop for buttery-smooth cursor animation (optimized)
        function renderCursor() {
            const dx = targetX - currentX;
            const dy = targetY - currentY;

            // Only update DOM if cursor is actually moving
            if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
                currentX += dx * 0.35;
                currentY += dy * 0.35;
                cursor.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0) translate(-50%, -50%)`;
            }

            requestAnimationFrame(renderCursor);
        }
        requestAnimationFrame(renderCursor);

        // Update target coordinates on mouse move
        window.addEventListener('mousemove', (e) => {
            targetX = e.clientX;
            targetY = e.clientY;

            if (!isCursorActive) {
                isCursorActive = true;
                cursor.classList.add('active');
            }
        });

        // Hide custom cursor when mouse leaves browser window
        document.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            isCursorActive = false;
        });

        // Show custom cursor when mouse enters browser window
        document.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            isCursorActive = true;
        });

        // Add hover effects for interactive elements (links, buttons, logos)
        const addHoverEvents = (element) => {
            element.addEventListener('mouseenter', () => cursor.classList.add('hover-link'));
            element.addEventListener('mouseleave', () => cursor.classList.remove('hover-link'));
        };

        // Attach events to static interactive elements
        document.querySelectorAll('a, button, input, textarea, select, .logo, .mobile-toggle').forEach(addHoverEvents);

        // Global Event Delegation for dynamic or dynamically styled interactive elements
        document.addEventListener('mouseover', (e) => {
            const interactive = e.target.closest('a, button, input, textarea, select, .logo, .mobile-toggle, [role="button"]');
            if (interactive) {
                cursor.classList.add('hover-link');
            }
        });

        document.addEventListener('mouseout', (e) => {
            const interactive = e.target.closest('a, button, input, textarea, select, .logo, .mobile-toggle, [role="button"]');
            if (interactive) {
                cursor.classList.remove('hover-link');
            }
        });
    } else if (cursor) {
        // Hide custom cursor element on touch devices (mobiles/tablets)
        cursor.style.display = 'none';
    }

    // ==========================================
    // 3. SEAMLESS JS MARQUEE (PURE JS, NO HTML DUPLICATES)
    // ==========================================
    const marqueeTrack = document.querySelector('.marquee-track');
    const marqueeSourceSet = document.querySelector('.marquee-set');

    if (marqueeTrack && marqueeSourceSet) {
        const SPEED = 1.2; // px per frame — adjust to taste
        let currentPos = 0;
        let isPaused = false;
        let rafId = null;
        let setWidth = 0;

        // Pause on hover
        marqueeTrack.addEventListener('mouseenter', () => isPaused = true);
        marqueeTrack.addEventListener('mouseleave', () => isPaused = false);

        function buildMarquee() {
            // Remove any clones from a previous build (safe re-init)
            marqueeTrack.querySelectorAll('.marquee-set[data-clone]').forEach(el => el.remove());

            // Measure 1 original set width
            setWidth = marqueeSourceSet.offsetWidth;

            if (setWidth === 0) return; // images not loaded yet — will retry via load event

            // How many extra clones do we need to fill the screen seamlessly?
            // We need at least enough copies so the total track width >= 2 × viewport width
            const viewportW = window.innerWidth;
            const totalNeeded = Math.ceil((viewportW * 2) / setWidth) + 2;

            for (let i = 0; i < totalNeeded; i++) {
                const clone = marqueeSourceSet.cloneNode(true);
                clone.removeAttribute('id');
                clone.setAttribute('data-clone', 'true');
                marqueeTrack.appendChild(clone);
            }

            // Reset position
            currentPos = 0;
            marqueeTrack.style.transform = `translate3d(0px, 0, 0)`;

            // Kick off animation (cancel any previous loop first)
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(tick);
        }

        function tick() {
            if (!isPaused) {
                currentPos -= SPEED;

                // When we've scrolled exactly one full set width to the left,
                // jump back by that amount — imperceptible to the eye.
                if (Math.abs(currentPos) >= setWidth) {
                    currentPos += setWidth;
                }

                marqueeTrack.style.transform = `translate3d(${currentPos}px, 0, 0)`;
            }
            rafId = requestAnimationFrame(tick);
        }

        // Build after all images are fully loaded for accurate offsetWidth
        if (document.readyState === 'complete') {
            buildMarquee();
        } else {
            window.addEventListener('load', buildMarquee);
        }

        // Rebuild on resize so clone count stays correct
        window.addEventListener('resize', () => {
            buildMarquee();
        }, { passive: true });
    }

    // ==========================================
    // 4. PROJECT GALLERY "VIEW" MAGNETIC BADGE (CENTER SHIFT)
    // ==========================================
    const imgBoxes = document.querySelectorAll('.project-img-box');

    if (imgBoxes.length > 0 && isFinePointer) {
        imgBoxes.forEach((box) => {
            let badge = box.querySelector('.project-view-badge');
            if (!badge) {
                badge = document.createElement('div');
                badge.className = 'project-view-badge';
                badge.innerHTML = '<span>View</span>';
                box.appendChild(badge);
            }

            const inner = badge.querySelector('span, i') || badge.firstElementChild;

            let targetX = 0;
            let targetY = 0;
            let currentX = 0;
            let currentY = 0;
            let currentScale = 0;
            let targetScale = 0;
            let isHovered = false;
            let rafId = null;

            // Maximum pixel shift from center in response to cursor position
            const maxShift = 30;

            function animate() {
                // Smooth Lerp physics for magnetic trailing
                currentX += (targetX - currentX) * 0.16;
                currentY += (targetY - currentY) * 0.16;
                currentScale += (targetScale - currentScale) * 0.22;

                badge.style.transform = `translate(calc(-50% + ${currentX.toFixed(2)}px), calc(-50% + ${currentY.toFixed(2)}px)) scale(${currentScale.toFixed(3)})`;
                if (inner) {
                    inner.style.transform = `translate3d(${(currentX * 0.35).toFixed(2)}px, ${(currentY * 0.35).toFixed(2)}px, 0)`;
                }

                if (isHovered || currentScale > 0.01) {
                    rafId = requestAnimationFrame(animate);
                } else {
                    badge.style.opacity = '0';
                    currentScale = 0;
                    currentX = 0;
                    currentY = 0;
                    badge.style.transform = `translate(-50%, -50%) scale(0)`;
                    if (inner) inner.style.transform = `translate3d(0, 0, 0)`;
                    rafId = null;
                }
            }

            box.addEventListener('mouseenter', (e) => {
                const rect = box.getBoundingClientRect();
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                targetX = ((mouseX - centerX) / (centerX || 1)) * maxShift;
                targetY = ((mouseY - centerY) / (centerY || 1)) * maxShift;
                targetScale = 1;
                isHovered = true;
                badge.style.opacity = '1';

                if (!rafId) {
                    rafId = requestAnimationFrame(animate);
                }
            });

            box.addEventListener('mousemove', (e) => {
                const rect = box.getBoundingClientRect();
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                targetX = ((mouseX - centerX) / (centerX || 1)) * maxShift;
                targetY = ((mouseY - centerY) / (centerY || 1)) * maxShift;
            });

            box.addEventListener('mouseleave', () => {
                targetX = 0;
                targetY = 0;
                targetScale = 0;
                isHovered = false;
            });
        });
    }


    // ==========================================
    // 5. GALLERY ENTRANCE ANIMATIONS
    // ==========================================

    const row1Cards = document.querySelectorAll('.project-card.row-1');
    const row2Cards = document.querySelectorAll('.project-card.row-2');

    const STAGGER = [0.05, 0.18, 0.31]; // seconds per card position

    // Apply stagger delay to each card based on its index within the row group
    [...row1Cards, ...row2Cards].forEach((card, i) => {
        const posInRow = i % 3;
        card.style.setProperty('--card-delay', `${STAGGER[posInRow]}s`);
    });

    // --- Row 1: reveal together with hero-line animation ---
    // hero-line-inner uses 0.85s animation + 0.15s delay for 2nd line
    // We fire row-1 cards after ~0.2s so they flow in alongside the hero text
    if (row1Cards.length > 0) {
        setTimeout(() => {
            row1Cards.forEach(card => card.classList.add('card-visible'));
        }, 200);
    }

    // --- Row 2: reveal on scroll via IntersectionObserver ---
    const actionContainer = document.querySelector('.portfolio-action-container');

    if (row2Cards.length > 0) {
        const row2Observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Reveal all row-2 cards when the group enters view
                    row2Cards.forEach(card => card.classList.add('card-visible'));
                    // Reveal the action button after the last card (delay handled by CSS)
                    if (actionContainer) actionContainer.classList.add('action-visible');
                    // Stop observing after first trigger
                    row2Cards.forEach(card => row2Observer.unobserve(card));
                }
            });
        }, {
            // Trigger when at least 15% of the first row-2 card is visible
            threshold: 0.15,
            rootMargin: '0px 0px -60px 0px'
        });

        // Observe only the first row-2 card as the trigger sentinel
        row2Observer.observe(row2Cards[0]);
    }

    // ==========================================
    // 6. SERVICES SECTION SCROLL ANIMATION
    // ==========================================
    const servicesSection = document.querySelector('#working-on');
    const servicesListItems = document.querySelectorAll('.services-list li');

    if (servicesSection) {
        // Set stagger delay on each list item
        servicesListItems.forEach((li, i) => {
            li.style.setProperty('--li-delay', `${0.1 + i * 0.08}s`);
        });

        const servicesObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    servicesSection.classList.add('services-section-visible');
                    // After entrance completes, strip the delay so hover transitions are snappy
                    setTimeout(() => {
                        servicesListItems.forEach(li => li.style.removeProperty('--li-delay'));
                    }, 1000);
                    servicesObserver.unobserve(servicesSection);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -60px 0px'
        });

        servicesObserver.observe(servicesSection);
    }

    // ==========================================
    // 7. ABOUT SECTION SCROLL ANIMATION
    // ==========================================
    const aboutSection = document.querySelector('#about');
    const floatingBoxes = document.querySelectorAll('.floating-box');

    if (aboutSection) {
        // Stagger floating-box entrance (slide from right, one by one)
        floatingBoxes.forEach((box, i) => {
            box.style.setProperty('--fb-delay', `${0.05 + i * 0.1}s`);
        });

        const aboutObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    aboutSection.classList.add('about-section-visible');
                    // Clean up stagger delays after entrance completes
                    setTimeout(() => {
                        floatingBoxes.forEach(box => box.style.removeProperty('--fb-delay'));
                    }, 1200);
                    aboutObserver.unobserve(aboutSection);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -60px 0px'
        });

        aboutObserver.observe(aboutSection);
    }

    // ==========================================
    // 8. FOOTER SECTION SCROLL ANIMATION
    // ==========================================
    const footerSection = document.querySelector('#footer');

    if (footerSection) {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    footerSection.classList.add('footer-section-visible');
                    footerObserver.unobserve(footerSection);
                }
            });
        }, {
            // Use lower threshold since footer may only partially enter viewport
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        footerObserver.observe(footerSection);
    }

    // ==========================================
    // 9. TYPEWRITER EFFECT (HERO TEXT)
    // ==========================================
    const typewriterElement = document.querySelector('.typewriter-text');
    if (typewriterElement) {
        const phrases = [
            'graphic designer.',
            'web designer.',
            'advertising designer.',
            'illustrator.'
        ];

        let phraseIndex = 0;
        let charIndex = phrases[0].length;
        let isDeleting = false;
        const typingSpeed = 85;
        const deletingSpeed = 45;
        const pauseEnd = 2000;
        const pauseStart = 400;

        function typeTick() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                charIndex--;
                typewriterElement.textContent = currentPhrase.substring(0, charIndex);
            } else {
                charIndex++;
                typewriterElement.textContent = currentPhrase.substring(0, charIndex);
            }

            let nextDelay = isDeleting ? deletingSpeed : typingSpeed;

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                nextDelay = pauseEnd;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                nextDelay = pauseStart;
            }

            setTimeout(typeTick, nextDelay);
        }

        // Start typing loop after initial pause
        setTimeout(() => {
            isDeleting = true;
            typeTick();
        }, pauseEnd);
    }

    // ==========================================
    // 10. MOBILE MENU DRAWER INTERACTION
    // ==========================================
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileDrawer = document.getElementById('mobileMenuDrawer');
    const mobileOverlay = document.getElementById('mobileMenuOverlay');
    const mobileClose = document.getElementById('mobileMenuClose');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    function openMobileMenu() {
        if (!mobileDrawer || !mobileOverlay) return;
        mobileDrawer.classList.add('active');
        mobileOverlay.classList.add('active');
        mobileDrawer.setAttribute('aria-hidden', 'false');
        mobileOverlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('mobile-menu-open');
        if (lenis) lenis.stop();
    }

    function closeMobileMenu() {
        if (!mobileDrawer || !mobileOverlay) return;
        mobileDrawer.classList.remove('active');
        mobileOverlay.classList.remove('active');
        mobileDrawer.setAttribute('aria-hidden', 'true');
        mobileOverlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('mobile-menu-open');
        if (lenis) lenis.start();
    }

    if (mobileToggle) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (mobileDrawer && mobileDrawer.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    if (mobileClose) {
        mobileClose.addEventListener('click', closeMobileMenu);
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileMenu);
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('active')) {
            closeMobileMenu();
        }
    });


    // ==========================================
    // 11. SMOOTH ANCHOR LINK SCROLLING
    // ==========================================
    // Menjaga agar klik tautan anchor tetap smooth via Lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    if (lenis) {
                        lenis.scrollTo(targetElement, { offset: -20, duration: 1.2 });
                    } else {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
        });
    });

});
