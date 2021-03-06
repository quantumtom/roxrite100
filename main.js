import jsonFile from './file.json';
import Blazy from 'blazy';

// main.js Start HERE:
(function () {
    let currentImage, totalElements;

    let assetPath = "https://addons.redbull.com/us/phasetwo/dist/";

    let openingByHover = 0;

    let elms = {
        body: document.getElementsByTagName("body")[0],
        imageHolder : document.getElementById('image-holder'),
        videoHolder: document.querySelectorAll("#video-holder"),
        grid: document.querySelector('.grid'),
        overlay: document.querySelector('.overlay'),
        overlayControls: document.querySelector('.overlay-controls'),
        overlayControlsMobile: document.querySelector('.overlay-controls-mobile'),
        aboutOverlay: document.querySelector('.overlay-about'),
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
        btnOpenAbout: document.getElementById('btn-about'),
        aboutMobile: document.getElementById('btn-about-mobile'),
        arrowUp: document.querySelector('.arrow-up'),
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
        afterBar: document.querySelector(".after-bar")
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

    function blazy() {
        window.bLazy = new Blazy({
            error: function(ele, msg){
                if (msg === 'missing'){
                    console.error('Blazy data-src is missing');
                    // data-src is missing
                }
                else if (msg === 'invalid') {
                    console.error('Blazy data-src is invalid');
                    // data-src is invalid
                }
            }
        });
    }

    function openAboutOverlay(e) {
        overlayClose(e);

        elms.body.classList.add('no-scroll');
        elms.overlayCloseAbout.style.opacity = 1;

        for (let i = 0; i < elms.btnOpenAbout.children.length; i++) {
            elms.btnOpenAbout.children[i].removeAttribute('style');
        }

        for (let i = 0; i < elms.aboutAnimation.length; i++) {
            elms.aboutAnimation[i].classList.add('about-animation-' + i);
        }

        // This is the open/close indicator.
        if (elms.btnOpenAbout.classList.toggle("open")) {
            elms.aboutOverlay.classList.add("about-overlay-open");
        } else {
            elms.aboutOverlay.classList.remove("about-overlay-open");
        }

        if (window.history && window.history.pushState) {
            if (elms.btnOpenAbout.classList.contains("open")) {
                history.pushState("", document.title, window.location.pathname + '#about');
            } else {
                history.pushState("", document.title, window.location.pathname);
            }
        }
    }

    function openInfoOverlay(e) {
        let targetNodeName = e.target.nodeName;
        let validTrigger = (targetNodeName == "SPAN" || targetNodeName == "IMG");

        if (isMobile()) {
            openingByHover = 0;
            document.querySelectorAll('.artwork-number').forEach(function(el) {
                el.classList.remove('artwork-number-hover');
            });
        }

        if (validTrigger) {
            if (isMobile()) {
                elms.artContent.classList.remove('slide-content-left');
            }
            elms.btnOpenAbout.classList.add('overlay-open');
            elms.afterBar.classList.remove('after-bar-full');
            elms.overlayInsideTop.classList.remove('overlay-inside-top-padder');
            elms.overlay.removeAttribute("style");
            elms.overlay.classList.add("info-overlay-open");
            elms.overlay.classList.add("info-overlay-open-index");
            elms.afterBar.classList.remove('after-bar-full');
            elms.overlayInsideTop.classList.remove('overlay-inside-top-padder');

            // Remove old image
            let id = e.target.parentNode.dataset.id;

            if (e.target.classList.contains('artwork-number')) {
                getId(id);
            } else if (e.target.classList.contains('artwork-number-span')) {
                getId(id);
            }

        }

        if (!isNaN(window.location.hash) && validTrigger) {
            updateHash();
        }

        // HACK: incase overlay hidden doesnt get removed on transition end
        setTimeout(function() {
            if (elms.overlayMedia.classList.contains('overlay-media-hidden')) {
                elms.overlayMedia.classList.remove('overlay-media-hidden');
            }
        }, 1000);

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

    function overlayClose(e, backButton = true) {
        if (e) {
            e.preventDefault();
        }

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

        elms.btnOpenAbout.classList.remove('overlay-open');
        elms.overlayMedia.classList.add('overlay-media-hidden');

        document.querySelectorAll('.grid-item').forEach(function(el) {
            el.classList.remove('grid-hide');
            el.classList.remove('grid-current-item');
        });

        setTimeout(function() {
            elms.overlay.scrollTop = 0;
            elms.overlay.classList.remove("info-overlay-open-index");
        },1000);

        if (window.history && window.history.pushState && backButton) {
            history.pushState("", document.title, window.location.pathname);
        }
    }

    function getId(id) {
        currentImage = id;

        displayArtworkInfo(id);
        changeImage(id);
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

    // 'id' is coming from the click target data-id attribue's value.
    function displayArtworkInfo(id) {
        let vals = jsonFile[id];
        console.log(id);
        console.dir(vals);

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

            img.onload = function() {
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

        // Grid item clicks
        elms.grid.addEventListener('click', function(e) {
            if (isMobile()) {
                openingByHover = 1;

                currentImage = e.target.parentNode.dataset.id;

                e.target.parentNode.firstElementChild.classList.add('artwork-number-hover');
                e.target.classList.add('artwork-number-hover');
                e.target.parentNode.classList.add('artwork-number-hover');

                updateHash();

            } else {
                // console.log(e.target.parentNode.dataset.id);
                currentImage = e.target.parentNode.dataset.id;
                // console.log(currentImage);
                // console.log(e.target.nodeName);
                // console.log(typeof e.target.nodeName);

                elms.artContent.classList.remove('slide-content-left');

                openInfoOverlay(e);
            }


        }, false);

        // Grid item hovers
        if (!isMobile()) {
            elms.grid.addEventListener("mouseover", function(e) {
                e.stopPropagation();

                if (e.target.nodeName == "IMG") {
                    e.target.parentNode.firstElementChild.classList.add('artwork-number-hover');
                }

                if (e.target.nodeName == "SPAN" && e.target.classList.contains('artwork-number')) {
                    e.target.classList.add('artwork-number-hover');
                }

                if (e.target.nodeName == "SPAN" && e.target.classList.contains('artwork-number-span')) {
                    e.target.parentNode.classList.add('artwork-number-hover');
                }
            });

            elms.grid.addEventListener("mouseout", function(e) {
                e.stopPropagation();

                if (e.target.nodeName == "IMG" ) {
                    e.target.parentNode.firstElementChild.classList.remove('artwork-number-hover');
                }

                if (e.target.nodeName == "SPAN" && e.target.classList.contains('artwork-number')) {
                    e.target.classList.remove('artwork-number-hover');
                }

                if (e.target.nodeName == "SPAN" && e.target.classList.contains('artwork-number-span')) {
                    e.target.parentNode.classList.remove('artwork-number-hover');
                }
            });
        }


        elms.aboutCloseDesktop.addEventListener('click', function(e) {
            elms.afterBar.classList.add('after-bar-full');
            elms.overlayInsideTop.classList.add('overlay-inside-top-padder');
            elms.overlayMedia.classList.add('overlay-media-hidden');

        }, false);

        elms.aboutCloseMobile.addEventListener('click', function(e) {
            elms.afterBar.classList.add('after-bar-full');
            elms.overlayInsideTop.classList.add('overlay-inside-top-padder');
            elms.overlayMedia.classList.add('overlay-media-hidden');

        }, false);

        elms.next.addEventListener("click", nextImage, false);
        elms.previous.addEventListener("click", previousImage, false);

        elms.nextMobile.addEventListener("click", nextImage, false);
        elms.previousMobile.addEventListener("click", previousImage, false);

        // Open the "About" overlay
        elms.btnOpenAbout.addEventListener("click", openAboutOverlay, false);

        // On Content
        elms.artContent.addEventListener(transitionEvent, function(e) {
            if (this.classList.contains("slide-content-left") && elms.overlay.classList.contains('info-overlay-open')) {
                this.classList.remove("slide-content-left");
                // elms.overlayMedia.classList.add('overlay-media-hidden');
                elms.overlayMedia.classList.remove('overlay-media-hidden');
                displayArtworkInfo(currentImage);
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
            elms.aboutOverlay.classList.remove("about-overlay-open");
            elms.btnOpenAbout.classList.remove("open");
            this.style.opacity = 0;

            for (let i = 0; i < elms.aboutAnimation.length; i++) {
                elms.aboutAnimation[i].classList.remove('about-animation-' + i);
            }

            history.pushState("", document.title, window.location.pathname);
        }, false);

        elms.arrowUp.addEventListener('click', function(e) {
            e.preventDefault();
            window.scroll({top: 0, behavior: 'smooth' });
        });

        if (isMobile()) {
            elms.grid.addEventListener(transitionEvent, function(e) {
                if (e.target.nodeName == 'SPAN' && e.target.classList.contains('artwork-number-span') && openingByHover) {
                    setTimeout(function() {
                        // e.target.style.opacity = 0;
                    }, 400);

                    setTimeout(function() {
                        // e.target.style.display = 'none';
                        e.target.parentNode.parentNode.classList.add('grid-current-item');
                        openInfoOverlay(e);
                    }, 800);
                }
            });
        }

        window.addEventListener('scroll', function(e) {
            (window.scrollY > 0) ? elms.arrowUp.classList.remove('opacity-null') : elms.arrowUp.classList.add('opacity-null');
        });
    }

    function checkHash() {
        let hash = window.location.hash;

        // Check for about
        if (!!hash && hash.substring(1) === 'about') {
            elms.aboutOverlay.classList.add("about-overlay-open");
            // elms.btnOpenAbout is the button that opens the overlay
            elms.btnOpenAbout.classList.add("open");

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

                elms.btnOpenAbout.classList.add('overlay-open');

                displayArtworkInfo(currentImage);
                changeImage(currentImage);

                setTimeout(function() {
                    elms.grid.classList.remove('hide');
                    elms.overlayMedia.classList.remove('overlay-media-hidden');
                }, 500);

            }
        } else {
            elms.overlay.classList.remove("info-overlay-open");
            elms.body.classList.remove("overflow");
        }
    }

    function init() {
        let ready = true;

        if (ready) {
            document.querySelector('#cs-wrapper').style.display = "block";

            blazy();

            setTimeout(function() {
                checkHash();
            }, 500);

            setTimeout(function(){
                (window.scrollY > 0) ? elms.arrowUp.classList.remove('opacity-null') : elms.arrowUp.classList.add('opacity-null');
            }, 10);


        }

        if (window.history && window.history.pushState) {
            window.onpopstate = function() {
                checkHash();

                if (window.location.hash === "") {
                    overlayClose();

                    elms.body.classList.remove('no-scroll');
                    elms.aboutOverlay.classList.remove("about-overlay-open");
                    elms.btnOpenAbout.classList.remove("open");
                    elms.overlayCloseAbout.style.opacity = 1;
              }
            };
        }

        window.onfocus = function() {
            blazy();
        };
    }

    init();

    bindEvents();
})();
