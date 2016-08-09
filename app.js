(function (factory) {
        if (typeof define === 'function' && define.amd) {
            // AMD. Register as an anonymous module.
            define(factory);
        } else if (typeof exports === 'object' && typeof module !== 'undefined') {
            // CommonJS. Register as a module
            module.exports = factory();
        } else {
            // Browser globals
            window.Playa = factory();
            window.Playa.bind(Playa);
        }
}(function () {
    // $(document).ready(function($) {
    // // function to load a given css file 
    //     loadCSS = function(href) {
    //         var cssLink = $("<link rel='stylesheet' type='text/css' href='" + href + "'>");
    //         $("head").append(cssLink); 
    //     };  
    // // load the css file 
    //     loadCSS(Config.DOMAIN_URL + "external/js/lib/owo-drange-picker/date-range.css");

    // });

    return function(opt) {
        var self = this,
            defaults = {
                expireDays: 10
            },
            errorMsg = {
                classNotFoundet: ' class not found',
                undefinedClassName: ' class name unscpecified in options',
                typeErrorString: ' is not a string'
            };

        self.pCont = {};

        function forEach(arr, callback, thisArg) {
            var arrValue,
                index = 0,
                arrLen,
                output = [];

            arrLen = arr.length;

            while ( index < arrLen ) {
                if ( index in arr ) {
                    arrValue = arr[index];
                    output.push(callback.call(thisArg, arrValue, index, arr));
                }

                index++;
            }

            return output;
        }

        self.toggleState = function(event) {
            var btnToggle = event.currentTarget;

                console.error(self.toggleClass(btnToggle, 'btnPressed'));
        };

        self.toggleClass = function(elem, className) {
            var classAttr = elem.getAttribute('class'),
                classToApply,
                classArray;

            classAttr = self.fixNullClass(elem, classAttr);

            if ( classAttr.indexOf(className) === -1 ) {
                self.addClass(elem, className);
            }
            else {
                self.removeClass(elem, className);
            }

            return elem;
        };

        self.addClass = function(elem, classToAdd) {
            var elemClassName = elem.getAttribute('class'),
                classArray,
                classToApply;

            classArray = elemClassName.split(' ');
            if ( classArray.length === 1 && classArray[0] === '' ) {
                classArray[0] = classToAdd;
            }
            else {
                classArray.push(classToAdd);
            }
            classToApply = classArray.join(' ');
            elem.setAttribute('class', classToApply);

            return elem;
        };

        //to do remove from all elems, (could pass one elem)
        self.removeClass = function(elem, classToRemove) {
            var classAttr,
                classArray,
                classToApply;

            function removeClass(elem, classArray, classToRemove) {
                var indexOfMatch;

                indexOfMatch = classArray.indexOf(classToRemove);
                if ( indexOfMatch !== -1 ) {
                    classArray.splice(indexOfMatch, indexOfMatch);
                    classToApply = classArray.join(' ');
                }

                elem.setAttribute('class', classToApply);
            }

            if ( !elem.length ) {
                classAttr = elem.getAttribute('class');
                classArray = classAttr.split(' ');
                classToApply = classAttr;

                removeClass(elem, classArray, classToRemove);
            }
            else {
                forEach(elem, function(el) {
                    classAttr = el.getAttribute('class');
                    classArray = classAttr.split(' ');
                    classToApply = classAttr;

                    removeClass(el, classArray, classToRemove);
                });
            }

            return elem;
        };

        self.btnOff = function(event) {
            var btn = event.currentTarget;

            self.removeClass(btn, 'btnPressed');
        };

        self.btnOn = function(event) {
            var btn = event.currentTarget;

            self.addClass(btn, 'btnPressed');
        };

        self.clearControlls = function(event) {
            var controllsClassName = 'btn-audio-controls'; // fix it - move to 1 plase on init

            self.removeClass(self.pCont.querySelectorAll('.' + controllsClassName), 'btnPressed');
        };

        self.fixNullClass = function(elem, classAttr) {
            if ( !classAttr ) {
                elem.setAttribute('class', '');
            }

            return elem.getAttribute('class');
        };

        self.getContainer = function(container, className) {
            var pContainerClassName = className,
                elem;

            if ( !pContainerClassName ) {
                if ( opt && opt.pContainerClassName ) {
                    pContainerClassName = opt.pContainerClassName;
                }
                else throw errorMsg.undefinedClassName;
            }

            if ( typeof pContainerClassName !== 'string' ) {
                throw new TypeError(pContainerClassName + errorMsg.typeErrorString);
            }
            
            if ( container ) {
                elem = container.querySelectorAll('.' + pContainerClassName)[0];//only first matching
            }
            else {
                elem = document.getElementsByClassName(pContainerClassName)[0];//only first matching
            }

            if ( !elem ) {
                throw '"' + pContainerClassName + '"' + errorMsg.classNotFoundet;
            }
            return elem;
        };

        // self.setEventListeners = function(elem) {
        //     var elems,
        //         controllsClassName = 'btn-audio-controls'; // fix hardcode

        //     elems = self.pCont.querySelectorAll('.' + controllsClassName);
        //     elems[0].addEventListener('click', self.toggleState, true);
        //     elems[1].addEventListener('click', self.toggleState, true);
        // };
        self.setCookie = function(property, value, exdays) {
            var today = new Date(),
                expires,
                expireDays = exdays || defaults.expireDays;

            today.setTime(today.getTime() + (expireDays * 24 * 60 * 60 * 1000));
            expires = 'expires=' + today.toUTCString();
            document.cookie = property + '=' + value + '; ' + expires;
        };

        self.getCookie = function(cname) {
            var name = cname + '=',
                ca = document.cookie.split(';');

            for ( var i = 0; i < ca.length; i++ ) {
                var c = ca[i];
                while ( c.charAt(0) == ' ' ) {
                    c = c.substring(1);
                }
                if ( c.indexOf(name) === 0 ) {
                    return c.substring(name.length, c.length);
                }
            }
            return '';
        };

        self.initControlls = function() {
            var btnStop = self.getContainer(self.pCont, 'btn-stop'),
                btnPlay = self.getContainer(self.pCont, 'btn-play'),
                btnNext = self.getContainer(self.pCont, 'btn-next'),
                btnPrev = self.getContainer(self.pCont, 'btn-prev');

            btnStop.addEventListener('mouseup', self.btnOff , true);
            btnStop.addEventListener('mousedown', self.btnOn , true);
            btnStop.addEventListener('mouseup', self.clearControlls , true);

            btnPlay.addEventListener('click', self.toggleState, true);

            btnNext.addEventListener('mouseup', self.btnOff , true);
            btnNext.addEventListener('mousedown', self.btnOn , true);

            btnPrev.addEventListener('mouseup', self.btnOff , true);
            btnPrev.addEventListener('mousedown', self.btnOn , true);
            self.initVolumeBar();
// stop, prev, next, play, playlist, volume controll
// stop , remove pressed state from all controlls ( mouse down pressed, mouse up not pressed)
        };

        self.initVolumeBar = function() {
            var pBar = self.getContainer(self.pCont, 'clickable'),
                elem = self.getContainer(self.pCont, 'progress'),
                volumeWrapper = self.getContainer(self.pCont, 'display');

            elem.style.width = volumeWrapper.clientWidth * self.getCookie('pLayaVolume') + 'px';
            pBar.addEventListener('click', function(event) {
                var clientWidth = event.currentTarget.clientWidth,
                    x = clientWidth - (clientWidth - event.offsetX),
                    volume = (x / clientWidth).toFixed(2);

                self.setCookie('pLayaVolume', volume, defaults.expireDays);
                elem.style.width = x + 'px';
            }, true);
        };

        self.init = function() {
            self.pCont = self.getContainer();

            // self.setEventListeners();
            self.initControlls();
            console.log(opt.pContainerClassName ? '"' + opt.pContainerClassName + '"' + ': init completed': 'init completed');
        };

        self.init();

    };
}));


