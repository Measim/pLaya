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

    return function(opt) {
        var self = this,
            defaults = {
                expireDays: 10,
                pName: 'pLaya'
            },
            selectors = {
                btnOn: 'btn-on',
                playBtn: 'btn-play',
                selectedLiItem: 'selected',
                pLContainer: 'play-list-container',
                plList: 'play-list',
                liItems: 'list-item',
                audioBtnControlls: 'btn-audio-controls',
                btnStop: 'btn-stop',
                btnNext: 'btn-next',
                btnPrev: 'btn-prev',
                btnPlList: 'btn-pl-list',
                vlmProgressBarWrap: 'vlm-progress-bar-wrap',
                vlmProgressBar: 'vlm-progress-bar',
                vlmProgressBarContainer: 'vlm-progress-bar-container'
            },
            errorMsg = {
                classNotFoundet: ' class not found',
                undefinedClassName: ' class name unscpecified in options',
                typeErrorString: ' is not a string'
            };

        self.pCont = {};
        self.audio = {};

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

        self.toggleBtnState = function(event) {
            var btnToggle = event.currentTarget;

            self.toggleClass(btnToggle, selectors.btnOn);
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
        //to do add for all elems, (could pass one elem)
        self.addClass = function(elem, classToAdd) {
            var elemClassName = elem.getAttribute('class'),
                classArray,
                classToApply;

            classArray = elemClassName.split(' ');
            if ( classArray.length === 1 && classArray[0] === '' ) {
                classArray[0] = classToAdd;
            }
            else {
                if ( classArray.indexOf(classToAdd) === -1 ) {
                    classArray.push(classToAdd);
                }
            }
            classToApply = classArray.join(' ');
            elem.setAttribute('class', classToApply);

            return elem;
        };
        
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

        self.hasClass = function(elem, className) {
            var classAttr = elem.getAttribute('class'),
                classArray = classAttr.split(' ');

            return classArray.indexOf(className) !== -1;
        };

        self.btnOff = function(event) {
            var btn = event.currentTarget;

            self.removeClass(btn, selectors.btnOn);
        };

        self.btnOn = function(event) {
            var btn = event.currentTarget;

            self.addClass(btn, selectors.btnOn);
        };

        self.onBtnPlay = function(event) {
            self.toggleBtnState(event);
            self.toglePlay();
        };

        self.clearListItemsSelection = function(playListItems) {
            self.removeClass(playListItems, selectors.selectedLiItem);
        };

        self.onSelectListItem = function(event) {
            var elem = event.target.parentElement,
                playListItems = self.getPListItems(),
                btnPlay = self.getContainer(self.pCont, selectors.playBtn);

            self.clearListItemsSelection(playListItems);
            self.addClass(elem, selectors.selectedLiItem);
            self.setCurrentTrack(self.getSelectedAudioSrc(elem));
            self.addClass(btnPlay, selectors.btnOn);
            self.playAudio();
        };

        self.onPlayListToggle = function(event) {
            var playList = self.getContainer(self.pCont, selectors.pLContainer);

            self.toggleBtnState(event);
            self.toggleClass(playList, 'hidden');
        };

        self.toglePlay = function() {
            if ( self.audio.paused === true ) {
                self.playAudio();
            }
            else {
                self.pauseAudio();
            }
        };

        self.getSelectedAudioSrc = function(elem) {
            var audioSrc = elem.getAttribute('data-track');

            return audioSrc;
        };

        self.getFirstTrackFromList =  function() {
            var playListItems = self.getPListItems(),
                currentTrack = '';

            if ( playListItems.length ) {
                currentTrack = self.getSelectedAudioSrc(playListItems[0]);
            }

            return currentTrack;
        };

        self.setCurrentTrack = function(audioSrc) {
            self.audio.setAttribute('src', audioSrc);
        };

        self.playAudio = function() {
            var audioSrc;

            audioSrc = self.audio.getAttribute('src');

            if ( audioSrc ) {
                self.audio.play();
            }
            else {
                audioSrc = self.getFirstTrackFromList();
                if ( audioSrc ) {
                    self.setCurrentTrack(audioSrc);
                    self.audio.play();
                }
            }
        };

        self.pauseAudio = function() {
            self.audio.pause();
        };

        self.onStopPlay = function() {
            self.audio.currentTime = 0;
            self.pauseAudio();
        };

        self.setVolume = function(volume) {
            self.audio.volume = volume;
        };

        self.onBtnNext = function() {
            var playListItems = self.getPListItems(),
                selectedIndex = self.getSelectedPItemIndex(playListItems),
                nextItem,
                btnPlay;

            if ( !isNaN(selectedIndex) && playListItems.length > selectedIndex + 1 ) {
                btnPlay = self.getContainer(self.pCont, selectors.playBtn);
                nextItem = playListItems[selectedIndex + 1];
                self.removeClass(playListItems, selectors.selectedLiItem);
                self.addClass(nextItem, selectors.selectedLiItem);
                self.addClass(btnPlay, selectors.btnOn);
                self.setCurrentTrack(self.getSelectedAudioSrc(nextItem));
                self.playAudio();
            }
        };

        self.onBtnPrev = function() {
            var playListItems = self.getPListItems(),
                selectedIndex = self.getSelectedPItemIndex(playListItems),
                prevItem,
                btnPlay;

            if ( !isNaN(selectedIndex) && selectedIndex - 1 >= 0 ) {
                btnPlay = self.getContainer(self.pCont, selectors.playBtn);
                prevItem = playListItems[selectedIndex - 1];
                self.removeClass(playListItems, selectors.selectedLiItem);
                self.addClass(prevItem, selectors.selectedLiItem);
                self.addClass(btnPlay, selectors.btnOn);
                self.setCurrentTrack(self.getSelectedAudioSrc(prevItem));
                self.playAudio();
            }
        };

        self.getSelectedPItemIndex = function(items) {
            var selectedIndex,
                index;

            for ( index = 0; index < items.length; index++ ) {
                if ( self.hasClass(items[index], selectors.selectedLiItem) ) {
                    selectedIndex = index;
                    break;
                }
            }

            return selectedIndex;
        };

        self.getPListItems = function() {
            return self.pCont.querySelectorAll('.' + selectors.liItems);
        };

        self.clearControlls = function() {
            self.removeClass(self.pCont.querySelectorAll('.' + selectors.audioBtnControlls), selectors.btnOn);
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
            var btnStop = self.getContainer(self.pCont, selectors.btnStop),
                btnPlay = self.getContainer(self.pCont, selectors.playBtn),
                btnNext = self.getContainer(self.pCont, selectors.btnNext),
                btnPrev = self.getContainer(self.pCont, selectors.btnPrev),
                btnPlayList = self.getContainer(self.pCont, selectors.btnPlList),
                playList = self.pCont.querySelectorAll('.' + selectors.plList)[0];

            btnStop.addEventListener('mouseup', self.btnOff, true);
            btnStop.addEventListener('mousedown', self.btnOn, true);
            btnStop.addEventListener('mouseup', self.clearControlls , true);
            btnStop.addEventListener('click', self.onStopPlay, true);
            btnPlay.addEventListener('click', self.onBtnPlay, true);
            btnNext.addEventListener('mouseup', self.btnOff, true);
            btnNext.addEventListener('mousedown', self.btnOn, true);
            btnNext.addEventListener('mouseup', self.onBtnNext, true);
            btnPrev.addEventListener('mouseup', self.btnOff, true);
            btnPrev.addEventListener('mousedown', self.btnOn, true);
            btnPrev.addEventListener('mouseup', self.onBtnPrev, true);
            btnPlayList.addEventListener('click', self.onPlayListToggle, true);
            playList.addEventListener('mousedown', self.onSelectListItem, true);
            self.initVolumeBar();
        };

        self.initVolumeBar = function() {
            var pBar = self.getContainer(self.pCont, selectors.vlmProgressBarWrap),
                elem = self.getContainer(self.pCont, selectors.vlmProgressBar),
                volumeWrapper = self.getContainer(self.pCont, selectors.vlmProgressBarContainer);

            elem.style.width = volumeWrapper.clientWidth * self.getCookie(defaults.pName + 'Volume') + 'px';

            pBar.addEventListener('click', function(event) {
                var clientWidth = event.currentTarget.clientWidth,
                    x = clientWidth - (clientWidth - event.offsetX),
                    volume = (x / clientWidth).toFixed(2);

                self.setCookie(defaults.pName + 'Volume', volume, defaults.expireDays);
                elem.style.width = x + 'px';
                self.setVolume(volume);
            }, true);
        };

        self.init = function() {
            self.pCont = self.getContainer();

            self.audio = new Audio();
            self.initControlls();
            console.log(opt.pContainerClassName ? '"' + opt.pContainerClassName + '"' + ': init completed': 'init completed');
        };

        self.init();

    };
}));