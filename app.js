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

        self.getContainer = function(className) {
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
            
            elem = document.getElementsByClassName(pContainerClassName)[0];//only first matching

            if ( !elem ) {
                throw '"' + pContainerClassName + '"' + errorMsg.classNotFoundet;
            }
            return elem;
        };

        self.setEventListeners = function(elem) {
            var elems,
                controllsClassName = 'btn-audio-controls'; // fix hardcode

            elems = self.pCont.querySelectorAll('.' + controllsClassName);
            elems[0].addEventListener('click', self.toggleState, true);
            elems[1].addEventListener('click', self.toggleState, true);
        };

        self.initControlls = function() {
            var btnStop = self.getContainer('btn-stop'),
                btnPlay = self.getContainer('btn-play'),
                btnNext = self.getContainer('btn-next'),
                btnPrev = self.getContainer('btn-prev');

            btnStop.addEventListener('mouseup', self.btnOff , true);
            btnStop.addEventListener('mousedown', self.btnOn , true);
            btnStop.addEventListener('mouseup', self.clearControlls , true);

            btnPlay.addEventListener('click', self.toggleState, true);

            btnNext.addEventListener('mouseup', self.btnOff , true);
            btnNext.addEventListener('mousedown', self.btnOn , true);
            
            btnPrev.addEventListener('mouseup', self.btnOff , true);
            btnPrev.addEventListener('mousedown', self.btnOn , true);
// stop, prev, next, play, playlist, volume controll
// stop , remove pressed state from all controlls ( mouse down pressed, mouse up not pressed)
        };

        self.init = function() {
            self.pCont = self.getContainer();

            // self.setEventListeners();
            self.initControlls();
            console.log(opt.msg ? opt.msg : 'init completed');
        };

        self.init();

    };
}));


