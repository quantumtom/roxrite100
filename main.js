import jsonFile from './file.json';
import Blazy from './scripts/blazy.js';
import ColorThief from './scripts/color-thief.js';

// main.js Start HERE:
(function() {
    let msnry;
    let gridSize, gridLayout, currentSizer; //gridParentWidth
    let buttonCounter = 2;
    let currentLayout;
    let currentParentWidth;
    let allImages = [];
    let currentImage, totalElements;
    let emptyPixel = "data:image/png;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
    // let endPoint = "https://gist.githubusercontent.com/VedadM/c9dea86a3dd331f63456fd65a13f86a4/raw/b803c11f93e320f09d281fa863d3d25f70dd09a9/file.json";
    let endPoint = "file.json";

    let assetPath = "https://addons.redbull.com/us/phasetwo/dist/";

    let openingByHover = 0;

    let scrollSpeeds = [8,10,8,10];

    //For Swipping:
    let touchstartX = 0,
        touchstartY = 0,
        touchendX = 0,
        touchendY = 0;

    // let hashTrue = false;

    let elms = {
        body: document.getElementsByTagName("body")[0],
        imageHolder : document.getElementById('image-holder'),
        videoHolder: document.querySelectorAll("#video-holder"),
        grid: document.querySelector('.grid'),
        // gridItems: document.querySelector('.grid-items'),
        overlay: document.querySelector('.overlay'),
        overlayControls: document.querySelector('.overlay-controls'),
        overlayControlsMobile: document.querySelector('.overlay-controls-mobile'),
        overlayAbout: document.querySelector('.overlay-about'),
        overlayMedia: document.querySelector('.overlay-media'),
        overlayInsideTop: document.querySelector('.overlay-inside-top'),
        loader: document.getElementById('loader'),
        wrapper: document.querySelector('.wrapper'),
        overlayClose: document.getElementById('overlay-close'),
        overlayCloseAbout: document.querySelector('.btn-about-close'),
        aboutAnimation: document.querySelectorAll('.about-animate-initial'),
        previous: document.getElementById('btn-previous'),
        next: document.getElementById('btn-next'),
        previousMobile: document.getElementById('btn-previous-mobile'),
        nextMobile: document.getElementById('btn-next-mobile'),
        about: document.getElementById('btn-about'),
        aboutMobile: document.getElementById('btn-about-mobile'),
        arrowUp: document.querySelector('.arrow-up'),
        // aboutDesktop: document.getElementById('btn-about-desktop'),
        aboutCloseDesktop: document.querySelector('.btn-overlay-close-desktop'),
        aboutCloseMobile: document.querySelector('.btn-overlay-close-mobile'),
        aboutClose: document.querySelector('.btn-about-close'),
        linkHome: document.getElementById('link-home'),
        artContent: document.querySelector('.artwork-content'),
        artworkId: document.getElementById('artwork-id'),
        artworkYear: document.getElementById('artwork-year'),
        artworkTitle: document.getElementById('artwork-title'),
        artworkDescription: document.getElementById('artwork-description'),
        artworkArtist: document.getElementById('artwork-artist'),
        artworkArtistSite: document.getElementById('artwork-artist-site'),
        artworkPost: document.getElementById('artwork-original-post'),
        // facebookArtistShare: document.getElementById('fb-social'),
        // twitterArtistShare: document.getElementById('tw-social'),
        afterBar: document.querySelector(".after-bar")
    };

    let overlayPosition = {
        w: 0,
        h: 0,
        left: 0,
        top: 0
    };

    gridSize = (isMobile()) ? 2 : 5;
    currentSizer = (isMobile()) ? "sizer-0" : "sizer-2";

    // Helpers
    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            let context = this, args = arguments;
            let later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            let callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    function isMobile() {
        return /(iPhone|iPod|android|ios|iPad|windowsphone|tablet)/i.test(navigator.userAgent);
    }

    function whichTransitionEvent(){
        let t;

        let el = document.createElement("fakeelement");

        let transitions = {
            'transition':'transitionend',
            'OTransition':'oTransitionEnd',
            'MozTransition':'transitionend',
            'WebkitTransition':'webkitTransitionEnd'
        };

        for(t in transitions){
            if( el.style[t] !== undefined ){
                return transitions[t];
            }
        }
    }

    function loadJSON(callback) {

        let xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', endPoint, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                callback(xobj.responseText);
            }
        };
        xobj.send(null);
    }

    function addDesktopGrid() {
        // Inital Row

        for (let i = 0; i < 4; i++) {
            let el = document.createElement("div");
            el.className = 'col-' + i + ' grid-item-3' ;
            el.dataset.scrollspeed = scrollSpeeds[i];
            elms.grid.appendChild(el);
        }

        for (let i = 0; i < jsonFile.length; i++) {
            let colDecider = i % 4;

            let el = document.createElement("div");
            el.className = 'grid-item';
            el.dataset.type = jsonFile[i].type;
            el.dataset.id = i;
            el.dataset.current = jsonFile[i].id;

            // console.log(jsonFile[i], jsonFile[i].id);

            let artworkNumber = document.createElement("span");
            artworkNumber.className = "artwork-number";

            let id = jsonFile[i].id;
            if (id < 10) {
                id = "0" + id;
            }

            let hoverSpanNumber = document.createElement("span");
            hoverSpanNumber.className = "artwork-number-span";
            hoverSpanNumber.innerHTML = id;

            artworkNumber.appendChild(hoverSpanNumber);
            el.appendChild(artworkNumber);

            let img = document.createElement("img");
            img.className = "b-lazy animate js-hover-image";
            img.src = emptyPixel;
            img.dataset.src = assetPath + jsonFile[i].gridsrc;

            img.addEventListener( "load", function() {
                el.appendChild(img);

            }());

            document.querySelector('.col-' + colDecider).appendChild(el);
        }

        moveIt(document.querySelectorAll('[data-scrollspeed]'));
    }

    function moveIt(selector){
        let instances = [];

        let arrayirize = Array.from(selector);

        arrayirize.forEach(function(el){
            instances.push(new moveItItem(el));
        });

        window.addEventListener('scroll', function(){
            let scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

            instances.forEach(function(inst){
                inst.update(scrollTop);
            });
        }, {passive: false});
    }

    let moveItItem = function(el){
        this.el = el;
        this.speed = parseInt(this.el.getAttribute('data-scrollspeed'));
    };

    moveItItem.prototype.update = function(scrollTop){
        if ( scrollTop + window.innerHeight <= document.body.clientHeight + 99) {
            this.el.style.transform = 'translateY(' +  -(scrollTop / this.speed) + 'px)';
        } /* else {
            this.el.style.transform = 'translateY(0px)';
        }*/
    };

    function addMobileGrid() {
        // Inital Row

        for (let i = 0; i < jsonFile.length; i++) {
            let el = document.createElement("div");
            el.className = 'grid-item-0';
            el.dataset.type = jsonFile[i].type;
            el.dataset.id = i;
            el.dataset.current = jsonFile[i].id;

            let artworkNumber = document.createElement("span");
            artworkNumber.className = "artwork-number";

            let id = jsonFile[i].id;
            if (id < 10) {
                id = "0" + id;
            }

            let hoverSpanNumber = document.createElement("span");
            hoverSpanNumber.className = "artwork-number-span";
            hoverSpanNumber.innerHTML = id;

            artworkNumber.appendChild(hoverSpanNumber);
            el.appendChild(artworkNumber);

            let img = document.createElement("img");
            img.className = "b-lazy animate js-hover-image";
            img.src = emptyPixel;
            img.dataset.src = assetPath + jsonFile[i].gridsrc;

            img.addEventListener( "load", function() {
                el.appendChild(img);
            }());

            elms.grid.appendChild(el);
        }
    }

    function resizeGridElement() {
        currentLayout = document.querySelector(".grid").children[1].classList[0];
        currentParentWidth = document.querySelectorAll("[class*='grid-width']")[0].classList[2];

        document.querySelectorAll("[class^='grid-item']").forEach(function(el) {
            el.className = el.className.replace( currentLayout , 'grid-item-' + buttonCounter );
        });

        document.querySelectorAll("[class^='sizer']")[0].className = 'sizer-' + buttonCounter;
        document.querySelectorAll("[class*='grid-width']")[0].className = document.querySelectorAll("[class*='grid-width']")[0].className.replace(currentParentWidth,'grid-width-' + buttonCounter);

        msnry.layout();
    }

    function blazy() {
        window.bLazy = new Blazy({
            container: '.img-container',
            success: function(element){
                setTimeout(function() {
                    let colorThief = new ColorThief();

                    element.dataset.dominant = 'rgb(' + colorThief.getColor(element) + ')';
                },50);
            }
        });
    }

    function overlayAbout(e) {
        e.preventDefault();
        overlayClose(e);

        elms.body.classList.add('no-scroll');
        elms.overlayCloseAbout.style.opacity = 1;

        for (let i = 0; i < elms.about.children.length; i++) {
            elms.about.children[i].removeAttribute('style');
        }

        for (let i = 0; i < elms.aboutAnimation.length; i++) {
            elms.aboutAnimation[i].classList.add('about-animation-' + i);
        }

        (elms.about.classList.toggle("open")) ? elms.overlayAbout.classList.add("about-overlay-open") : elms.overlayAbout.classList.remove("about-overlay-open");

        if (window.history && window.history.pushState) {
            if (elms.about.classList.contains("open")) {
                history.pushState("", document.title, window.location.pathname + '#about');
            } else {
                history.pushState("", document.title, window.location.pathname);
            }
        }
    }

    function overlayOpen(e) {
        // e.preventDefault();

        if (isMobile()) {
            openingByHover = 0;
            document.querySelectorAll('.artwork-number').forEach(function(el) {
                el.classList.remove('artwork-number-hover');
            });
        }

        if (e.target.nodeName == "IMG" || e.target.nodeName == "SPAN") {
            if (isMobile()) {
                elms.artContent.classList.remove('slide-content-left');
            }
            elms.about.classList.add('overlay-open');
            elms.afterBar.classList.remove('after-bar-full');
            elms.overlayInsideTop.classList.remove('overlay-inside-top-padder');
        }

        if (e.target && e.target.nodeName == "IMG" || e.target.nodeName == "SPAN") {
            elms.overlay.removeAttribute("style");
            elms.overlay.classList.add("info-overlay-open");
            elms.overlay.classList.add("info-overlay-open-index");
            elms.afterBar.classList.remove('after-bar-full');
            elms.overlayInsideTop.classList.remove('overlay-inside-top-padder');

            if (e.target.classList.contains('artwork-number')) {
                getId(e.target);
            } else if (e.target.classList.contains('artwork-number-span')) {
                getId(e.target.parentNode);
            }

        }

        if (!isNaN(window.location.hash) && (e.target.nodeName == "IMG" || e.target.nodeName == "SPAN")) {
            updateHash();
        }

        // HACK: incase overlay hidden doesnt get removed on transition end
        setTimeout(function() {
            if (elms.overlayMedia.classList.contains('overlay-media-hidden')) {
                elms.overlayMedia.classList.remove('overlay-media-hidden');
            }
        }, 1000);

        // elms.overlayMedia.classList.remove('overlay-media-hidden');
        windowWidthCheck();
    }

    function windowWidthCheck() {
        if (window.innerWidth < 762) {
            let temp = elms.afterBar.style.backgroundColor.replace(/[a-zA-Z()]/g,"").split(',');
            if (parseInt(temp[0]) < 140 && parseInt(temp[1]) < 140 && parseInt(temp[2]) < 140) {
                arrowColorSwitch("white");
            } else {
                arrowColorSwitch("black");
            }
        } else {
            arrowColorSwitch("black");
        }
    }

    function arrowColorSwitch(color) {

        for (let i = 0; i < elms.aboutCloseMobile.children.length; i++) {
            elms.aboutCloseMobile.children[i].style.backgroundColor = color;
        }

        for (let i = 0; i < elms.overlayControls.getElementsByTagName('SPAN').length; i++) {
            if (elms.overlayControls.getElementsByTagName('SPAN')[i].className == 'js-span-bgcolor') {
                elms.overlayControls.getElementsByTagName('SPAN')[i].style.backgroundColor = color;
            }

            if (elms.overlayControls.getElementsByTagName('SPAN')[i].className == 'js-span-border') {
                elms.overlayControls.getElementsByTagName('SPAN')[i].style.border = 'solid ' + color;
                elms.overlayControls.getElementsByTagName('SPAN')[i].style.borderWidth = '0 2px 2px 0';
            }
        }

        for (let i = 0; i < elms.overlayControlsMobile.getElementsByTagName('SPAN').length; i++) {
            if (elms.overlayControlsMobile.getElementsByTagName('SPAN')[i].className == 'js-span-border') {
                elms.overlayControlsMobile.getElementsByTagName('SPAN')[i].style.border = 'solid ' + color;
                elms.overlayControlsMobile.getElementsByTagName('SPAN')[i].style.borderWidth = '0 2px 2px 0';
            }
        }
    }

    function overlayClose(e) {
        e.preventDefault();

        elms.body.classList.remove('no-scroll');

        while (elms.videoHolder[0].firstChild) elms.videoHolder[0].removeChild(elms.videoHolder[0].firstChild);

        document.querySelectorAll(".artwork-number-span").forEach(function(el){
            el.removeAttribute('style');
        });

        elms.overlay.classList.remove("info-overlay-open");
        elms.body.classList.remove("overflow");

        elms.artContent.classList.add('slide-content-left');
        elms.afterBar.classList.add('after-bar-full');
        elms.afterBar.style.backgroundColor = "rgb(191, 191, 191)";
        elms.overlayInsideTop.classList.remove('overlay-inside-top-padder');
        elms.wrapper.classList.add('opacity-zero');

        elms.about.classList.remove('overlay-open');
        elms.overlayMedia.classList.add('overlay-media-hidden');

        document.querySelectorAll('.grid-item').forEach(function(el) {
            el.classList.remove('grid-hide');
            el.classList.remove('grid-current-item');
        });

        setTimeout(function() {
            elms.overlay.scrollTop = 0;
            elms.overlay.classList.remove("info-overlay-open-index");
        },1000)

        if (window.history && window.history.pushState) {
            history.pushState("", document.title, window.location.pathname);
        }
    }

    function getId(el) {
        // Remove old image
        let id = el.parentNode.getAttribute("data-id");
        let color = el.nextSibling.getAttribute("data-dominant");

        currentImage = id;

        displayArtworkInfo(id,color);
        changeImage(id, color);
    }

    function nextImage(e) {
        e.preventDefault();

        if (currentImage >= totalElements - 1) {
            currentImage = -1;
        }

        currentImage++;

        updateHash();

        elms.artContent.classList.add("slide-content-left"); /* Side Scroll added */
        elms.afterBar.classList.add("arrow-click"); /* Side Scroll added */
        elms.afterBar.classList.add("after-bar-full"); /* Side Scroll added */
        elms.overlayInsideTop.classList.add('overlay-inside-top-padder'); /* Side Scroll added */
        elms.overlayMedia.classList.add('overlay-media-hidden'); /* Side Scroll added */
    }

    function previousImage(e) {
        e.preventDefault();

        if (currentImage < 1) {
            currentImage = totalElements;
        }

        currentImage--;

        updateHash();

        elms.artContent.classList.add("slide-content-left"); /* Side Scroll added */
        elms.afterBar.classList.add("arrow-click"); /* Side Scroll added */
        elms.afterBar.classList.add("after-bar-full"); /* Side Scroll added */
        elms.overlayInsideTop.classList.add('overlay-inside-top-padder'); /* Side Scroll added */
        elms.overlayMedia.classList.add('overlay-media-hidden'); /* Side Scroll added */
    }

    function updateHash() {
        if (window.history && window.history.pushState) {
            history.pushState("", document.title, window.location.pathname + '#' + jsonFile[currentImage].id);
        }
    }

    function displayArtworkInfo(id, color) {
        let vals = jsonFile[id];

        // elms.loader.style.display = 'block';
        elms.loader.style.visibility = 'hidden';

        elms.artworkId.innerHTML = '#' + (parseInt(vals.id));
        elms.artworkYear.innerHTML = vals.year;
        elms.artworkTitle.innerHTML = vals.name;
        elms.artworkDescription.innerHTML = vals.description;

        elms.artworkArtist.innerHTML = vals.artist;
        (vals.artist == "") ? elms.artworkArtist.style.display = "none" : elms.artworkArtist.style.display = "block";

        (vals.original == "") ? elms.artworkPost.style.display = "none" : elms.artworkPost.style.display = "block";
        elms.artworkPost.href = vals.original;

        elms.artworkArtistSite.href = vals.artisturl;
        (vals.artisturl == "") ? elms.artworkArtistSite.style.display = "none" : elms.artworkArtistSite.style.display = "block";

        elms.afterBar.style.backgroundColor = color;
        // elms.afterBar.style.boxShadow = "0px 4px 5px 0px " + color;

        // elms.instagramArtistShare.href = vals.social.ig;
        // elms.twitterArtistShare.href = vals.social.tw;

        // (vals.social.ig == "") ? elms.instagramArtistShare.parentNode.style.display = "none" : elms.instagramArtistShare.parentNode.style.display = "inline-block";
        // (vals.social.tw == "") ? elms.twitterArtistShare.parentNode.style.display = "none" : elms.twitterArtistShare.parentNode.style.display = "inline-block";
    }

    function changeImage(id) {
        let vals = jsonFile[id];

        while (elms.imageHolder.lastChild && elms.imageHolder.lastChild.nodeName == "IMG") {
            elms.imageHolder.removeChild(elms.imageHolder.lastChild);
        }

        while (elms.videoHolder[0].firstChild) elms.videoHolder[0].removeChild(elms.videoHolder[0].firstChild);

        if (vals.type == "image") {
            elms.imageHolder.style.display = "block";
            elms.videoHolder[0].style.display = "none";

            let img = document.createElement("img");
            img.src = assetPath + vals.src;

            console.log('Binding to img.onload.');

            img.onload = function() {
                console.log('img.onload called');
                elms.loader.style.visibility = 'hidden';
                document.getElementById("image-holder").appendChild(img);
            };
        } else {
            elms.imageHolder.style.display = "none";
            elms.videoHolder[0].style.display = "block";

            setTimeout(function() {
                setUpVideo(vals);
            }, 500);
        }
    }

    function setUpVideo(data) {
        for (let i = 0; i < elms.videoHolder.length; i++) {
            let source = "https://img.youtube.com/vi/" + data.video + "/sddefault.jpg";

            let image = new Image();
            image.src = source;
            image.addEventListener( "load", function() {
                elms.videoHolder[ i ].appendChild( image );
            }( i ) );

            let iframe = document.createElement( "iframe" );

            iframe.setAttribute( "allowfullscreen", "true" );
            iframe.setAttribute( "frameborder", "0" );
            iframe.setAttribute( "src", "https://www.youtube.com/embed/"+ data.video +"?autoplay=1&rel=0&showinfo=0&controls=0&modestbranding=1" );

            elms.videoHolder[i].innerHTML = "";
            elms.videoHolder[i].appendChild( iframe );
        }
    }

    function bindEvents() {
        let transitionEvent = whichTransitionEvent();

        elms.grid.addEventListener("click", function(e) {
            if (!isMobile()) {
                currentImage = parseInt(e.target.parentNode.getAttribute('data-id'));

                elms.artContent.classList.remove('slide-content-left');

                if (e.target.nodeName == "IMG" || e.target.nodeName == "SPAN" ) {
                    // document.querySelectorAll('.grid-item').forEach(function(el) {
                    //  el.classList.add('grid-hide');
                    // });
                    if (e.target.nodeName == "IMG" ) {
                        elms.afterBar.style.backgroundColor = e.target.getAttribute('data-dominant');
                    }

                    if (e.target.nodeName == "SPAN" && e.target.classList.contains('artwork-number')) {
                        elms.afterBar.style.backgroundColor = e.target.parentNode.childNodes[1].getAttribute('data-dominant');
                    }

                    if (e.target.nodeName == "SPAN" && e.target.classList.contains('artwork-number-span')) {
                        elms.afterBar.style.backgroundColor = e.target.parentNode.nextSibling.getAttribute('data-dominant');
                    }

                    e.target.parentNode.classList.add('grid-current-item');

                    overlayOpen(e);
                }
            } else {
                openingByHover = 1;

                currentImage = parseInt(e.target.parentNode.getAttribute('data-id'));

                if (e.target.nodeName == "IMG" ) {
                    elms.afterBar.style.backgroundColor = e.target.getAttribute('data-dominant');
                    e.target.previousSibling.classList.add('artwork-number-hover');
                    e.target.previousSibling.style.backgroundColor = e.target.getAttribute('data-dominant');
                }

                if (e.target.nodeName == "SPAN" && e.target.classList.contains('artwork-number')) {
                    e.target.classList.add('artwork-number-hover');
                    e.target.style.backgroundColor = e.target.nextSibling.getAttribute('data-dominant');
                }

                if (e.target.nodeName == "SPAN" && e.target.classList.contains('artwork-number-span')) {
                    e.target.parentNode.classList.add('artwork-number-hover');
                    e.target.parentNode.style.backgroundColor = e.target.parentNode.nextSibling.getAttribute('data-dominant');
                }
            }

        }, false);

        if (!isMobile()) {
            elms.grid.addEventListener("mouseover", function(e) {
                e.stopPropagation();
                // e.target.previousSibling.lastChild.removeAttribute('style');

                if (e.target.nodeName == "IMG") {
                    e.target.previousSibling.firstChild.style.display = 'inline-block';
                    e.target.previousSibling.classList.add('artwork-number-hover');
                    e.target.previousSibling.style.backgroundColor = e.target.getAttribute('data-dominant');
                }

                if (e.target.nodeName == "SPAN" && e.target.classList.contains('artwork-number')) {
                    // e.target.style.opacity = 1;
                    e.target.classList.add('artwork-number-hover');
                    e.target.firstChild.style.opacity = 1;
                    // e.target.nextSibling.classList.add('hoveroony');
                    e.target.style.backgroundColor = e.target.nextSibling.getAttribute('data-dominant');
                }

                if (e.target.nodeName == "SPAN" && e.target.classList.contains('artwork-number-span')) {
                    e.target.style.opacity = 1;
                    e.target.parentNode.classList.add('artwork-number-hover');
                    e.target.style.display = 'inline-block';
                }
            });

            elms.grid.addEventListener("mouseout", function(e) {
                e.stopPropagation();
                if (e.target.nodeName == "IMG" ) {
                    // e.target.previousSibling.firstChild.style.opacity = 0;
                    e.target.previousSibling.classList.remove('artwork-number-hover');
                    // e.target.previousSibling.firstChild.style.display = 'none';
                }

                if (e.target.nodeName == "SPAN" && e.target.classList.contains('artwork-number')) {
                    e.target.firstChild.style.opacity = 0;
                    e.target.firstChild.style.display = "none";
                    e.target.classList.remove('artwork-number-hover');
                    // document.querySelector('.artwork-number-span').style.display = 'none';
                    // e.target.nextSibling.classList.remove('hoveroony');
                }

                if (e.target.nodeName == "SPAN" && e.target.classList.contains('artwork-number-span')) {
                    e.target.parentNode.classList.remove('artwork-number-hover');
                }
            });
        }


        // elms.overlayClose.addEventListener('click', overlayClose, false);
        elms.aboutCloseDesktop.addEventListener('click', function(e) {
            // overlayClose(e);
            elms.afterBar.classList.add('after-bar-full');
            elms.overlayInsideTop.classList.add('overlay-inside-top-padder');
            elms.overlayMedia.classList.add('overlay-media-hidden');

        }, false);

        elms.aboutCloseMobile.addEventListener('click', function(e) {
            // overlayClose(e);
            elms.afterBar.classList.add('after-bar-full');
            elms.overlayInsideTop.classList.add('overlay-inside-top-padder');
            elms.overlayMedia.classList.add('overlay-media-hidden');

        }, false);

        elms.next.addEventListener("click", nextImage, false);
        elms.previous.addEventListener("click", previousImage, false);

        elms.nextMobile.addEventListener("click", nextImage, false);
        elms.previousMobile.addEventListener("click", previousImage, false);

        elms.about.addEventListener("click", overlayAbout, false);

        // On Content
        elms.artContent.addEventListener(transitionEvent, function(e) {
            if (this.classList.contains("slide-content-left") && elms.overlay.classList.contains('info-overlay-open')) {
                this.classList.remove("slide-content-left");
                // elms.overlayMedia.classList.add('overlay-media-hidden');
                elms.overlayMedia.classList.remove('overlay-media-hidden');
                displayArtworkInfo(currentImage, document.querySelectorAll("[data-id='"+ currentImage +"']")[0].lastChild.getAttribute("data-dominant"));
                changeImage(currentImage);
            }
        }, false);

        elms.overlay.addEventListener(transitionEvent, function(e) {
            if (e.propertyName == 'opacity' && this.classList.contains('info-overlay-open') && !elms.afterBar.classList.contains('after-bar-full')) {
                elms.body.classList.add('no-scroll');
                elms.afterBar.classList.remove('after-bar-full');
                elms.overlay.scrollTop = 0;
            }
        }, false);

        elms.afterBar.addEventListener(transitionEvent, function(e) {
            windowWidthCheck();
            if (elms.overlay.classList.contains("info-overlay-open") && e.propertyName == 'background-color' && !this.classList.contains('after-bar-full')) {
                // elms.overlayMedia.classList.remove('overlay-media-hidden');
                elms.wrapper.classList.remove('opacity-zero');
                elms.overlay.classList.remove('js-hash-call');
                if (!isMobile()) {
                    elms.artContent.classList.remove('slide-content-left');
                }

                elms.afterBar.style.backgroundColor = document.querySelectorAll("[data-id='"+ currentImage +"']")[0].lastChild.getAttribute("data-dominant");
            }

            if (elms.overlay.classList.contains("info-overlay-open") && this.classList.contains('after-bar-full') && !elms.overlay.classList.contains('js-hash-call') && !this.classList.contains('arrow-click')) { /* Side Scroll added  just !this.classList.contains('arrow-click')*/
                // elms.overlay.classList.remove("info-overlay-open");
                overlayClose(e);
            }

            if (this.classList.contains('arrow-click')) { /* Side Scroll added */
                elms.afterBar.classList.remove("arrow-click"); /* Side Scroll added */
                elms.afterBar.classList.remove("after-bar-full"); /* Side Scroll added */
                // elms.overlayMedia.classList.remove('overlay-media-hidden'); /* Side Scroll added */
                elms.overlayInsideTop.classList.remove('overlay-inside-top-padder'); /* Side Scroll added */
                elms.afterBar.style.backgroundColor = document.querySelectorAll("[data-id='"+ currentImage +"']")[0].lastChild.getAttribute("data-dominant");
                // changeImage(currentImage);
            }

        }, false);

        document.addEventListener('keydown', function(e) {
            let keyCode = e.keyCode;

            if (elms.overlay.classList.contains("info-overlay-open")) {
                // Left Arrow Click
                if (keyCode == 37) {
                    previousImage(e);
                }

                // Right Arrow Click
                if (keyCode == 39) {
                    nextImage(e);
                }
            }
        }, false);

        elms.overlayCloseAbout.addEventListener('click', function() {
            elms.body.classList.remove('no-scroll');
            elms.overlayAbout.classList.remove("about-overlay-open");
            elms.about.classList.remove("open");
            this.style.opacity = 0;

            for (let i = 0; i < elms.aboutAnimation.length; i++) {
                elms.aboutAnimation[i].classList.remove('about-animation-' + i);
            }

            history.pushState("", document.title, window.location.pathname);
        }, false);

        elms.overlayMedia.addEventListener('touchstart', function(e) {
            touchstartX = e.changedTouches[0].screenX;
            touchstartY = e.changedTouches[0].screenY;
        }, false);

        elms.overlayMedia.addEventListener('touchend', function(e) {
            touchendX = e.changedTouches[0].screenX;
            touchendY = e.changedTouches[0].screenY;
            touchGesture(e);
        }, false);

        elms.arrowUp.addEventListener('click', function(e) {
            e.preventDefault();
            window.scroll({top: 0, behavior: 'smooth' });
        });

        if (isMobile()) {
            elms.grid.addEventListener(transitionEvent, function(e) {
                if (e.target.nodeName == 'SPAN' && e.target.classList.contains('artwork-number-span') && openingByHover) {
                    setTimeout(function() {
                        e.target.style.opacity = 0;
                    }, 400);

                    setTimeout(function() {
                        e.target.style.display = 'none';
                        e.target.parentNode.parentNode.classList.add('grid-current-item');
                        overlayOpen(e);
                    }, 800);
                }
            });
        }

        window.addEventListener('scroll', function(e) {
            (window.scrollY > 0) ? elms.arrowUp.classList.remove('opacity-null') : elms.arrowUp.classList.add('opacity-null');
        });
    }

    function touchGesture(e) {
        let threshold = touchendX - touchstartX;

        if (threshold > 60) {
            previousImage(e);
        }

        if (threshold < -60) {
            nextImage(e);
        }
    }

    function checkHash() {
        let hash = window.location.hash;

        // Check for about
        if (!!hash && hash.substring(1) === 'about') {
            elms.overlayAbout.classList.add("about-overlay-open");
            elms.about.classList.add("open");

            elms.body.classList.add('no-scroll');
            elms.overlayCloseAbout.style.opacity = 1;

            for (let i = 0; i < elms.aboutAnimation.length; i++) {
                elms.aboutAnimation[i].classList.add('about-animation-' + i);
            }
        }

        // Check for individual elements
        if (!!hash && !!parseInt(hash.substring(1))) {
            if (hash.substring(1) > 0 && hash.substring(1) <= 100) {
                elms.grid.classList.add('hide');
                elms.body.classList.add('no-scroll');

                elms.overlay.removeAttribute("style");
                elms.overlay.classList.add("info-overlay-open");
                elms.overlay.classList.add("js-hash-call");
                elms.overlay.classList.add("info-overlay-open-index");
                elms.overlayMedia.classList.add('overlay-media-hidden');
                elms.artContent.classList.remove('slide-content-left');
                elms.afterBar.classList.remove('after-bar-full');

                let id = jsonFile.findIndex(function(el) {
                    return el.id === parseInt(hash.substring(1));
                });

                currentImage = id;

                elms.about.classList.add('overlay-open');

                displayArtworkInfo(currentImage, document.querySelectorAll("[data-id='"+ currentImage +"']")[0].lastChild.getAttribute("data-dominant"));
                changeImage(currentImage, "rgb(191, 191, 191)");

                setTimeout(function() {
                    let color = document.querySelectorAll("[data-id='"+ currentImage +"']")[0].lastChild.getAttribute("data-dominant");
                    elms.afterBar.style.backgroundColor = color;
                    // elms.afterBar.style.boxShadow = "0px 4px 5px 0px " + color;
                    elms.grid.classList.remove('hide');
                    elms.overlayMedia.classList.remove('overlay-media-hidden');
                }, 500);

            }
        } else {
            elms.overlay.classList.remove("info-overlay-open");
            elms.body.classList.remove("overflow");
        }
    }

    function testing(i) {
        // console.log(i);
    }

    function preLoad(arr) {
        for (let i = 0; i < arr.length; i++) {
            let img = new Image();
            img.onload = testing(arr[i]);
            img.src = assetPath + arr[i];

            // document.getElementById('hidden').appendChild(img);
        }

        return true;
    }

    function init() {

        loadJSON(function(response) {
            // Parse JSON string into object
            // jsonFile = JSON.parse(response);

            jsonFile.sort(function (a, b) {
                return parseInt(a.id) - parseInt(b.id);
            });

            totalElements = jsonFile.length;

            jsonFile.forEach(function(el) {
                allImages.push(el.src);
            });

            let ready = preLoad(allImages);

            if(ready) {

                document.querySelector(".content").style.display = "block";
                if (isMobile() || window.innerWidth < 500) {
                    addMobileGrid();
                } else {
                    addDesktopGrid();
                }

                blazy();

                setTimeout(function() {
                    checkHash();
                },500);

                setTimeout(function(){
                    (window.scrollY > 0) ? elms.arrowUp.classList.remove('opacity-null') : elms.arrowUp.classList.add('opacity-null');
                }, 10);


            }
        });

        bindEvents();
        if (window.history && window.history.pushState) {
            window.onpopstate = function(e) {
                checkHash();
            }
        }

        window.onfocus = function() {
            blazy();
        }
    }

    init();
})();
