System.register(["./index-legacy-a78c1db6.js","./index2-legacy-7c701679.js"],(function(e,t){"use strict";var n,r,i;return{setters:[e=>{n=e.i,r=e.a},e=>{i=e.createGesture}],execute:function(){
/*!
       * (C) Ionic http://ionicframework.com - MIT License
       */
e("createSwipeBackGesture",((e,t,s,c,a)=>{const o=e.ownerDocument.defaultView;let u=n(e);const l=e=>u?-e.deltaX:e.deltaX;return i({el:e,gestureName:"goback-swipe",gesturePriority:40,threshold:10,canStart:r=>(u=n(e),(e=>{const{startX:t}=e;return u?t>=o.innerWidth-50:t<=50})(r)&&t()),onStart:s,onMove:e=>{const t=l(e)/o.innerWidth;c(t)},onEnd:e=>{const t=l(e),n=o.innerWidth,i=t/n,s=(e=>u?-e.velocityX:e.velocityX)(e),c=s>=0&&(s>.2||t>n/2),d=(c?1-i:i)*n;let h=0;if(d>5){const e=d/Math.abs(s);h=Math.min(e,540)}a(c,i<=0?.01:r(0,i,.9999),h)}})}))}}}));
