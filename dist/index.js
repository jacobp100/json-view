!function(){"use strict";var n={};n.slicedToArray=function(){function n(n,e){var t=[],r=!0,a=!1,s=void 0;try{for(var u,i=n[Symbol.iterator]();!(r=(u=i.next()).done)&&(t.push(u.value),!e||t.length!==e);r=!0);}catch(o){a=!0,s=o}finally{try{!r&&i["return"]&&i["return"]()}finally{if(a)throw s}}return t}return function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return n(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}();var e=/^[\s\n\t]+/,t=/^"(?:\\\\|\\"|[^"])*"/,r=/^-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[Ee][+-]?[0-9]+)?/,a=/^null/,s=/^(?:true|false)/,u=/^\[/,i=/^\]/,o=/^\{/,l=/^\}/,c=/^\:/,f=/^,/,d=[["string",t],["number",r],["boolean",s],["null",a]],m=function(n,e){return['Unexpected token: "'+n[0]+'"',n,e]},v=function(n){return n.substring(1)},p=function(n,e){return n.substring(e.length)},g=function(n){return n.replace(e,"")},h=function(e,t,r){return function(a){for(var s=a,u=!1,i=[],o=function(n){return{type:e,value:i,isComplete:n}};;){if(s=g(s),!s)return["Unexpected end of input","",o(!1)];if(r.test(s))return u&&i.length>0||!u&&0===i.length?[null,v(s),o(!0)]:m(s,o(!1));if(u){if(!f.test(s))return m(s,o(!1));s=v(s),u=!1}else{var l=t(s),c=n.slicedToArray(l,3),d=c[0],p=c[1],h=c[2];if(s=p,u=!0,h&&i.push(h),d)return[d,p,o(!1)]}}}},y=function(e){var r=e,a=e.match(t);if(!a)return["Expected a key",e];var s=JSON.parse(a[0]);if(r=p(e,a[0]),r=g(r),!c.test(r))return m(r);r=v(r),r=g(r);var u=b(r),i=n.slicedToArray(u,3),o=i[0],l=i[1],f=i[2];return f?[o,l,[s,f]]:[o,l,null]},b=function(e){var t=g(e),r=d.reduce(function(e,r){var a=n.slicedToArray(r,2),s=a[0],u=a[1];if(e)return e;var i=t.match(u);return i?{type:s,match:i[0],value:JSON.parse(i[0])}:null},null);if(r){var a=r.match;return[null,p(t,a),r]}return u.test(t)?E(v(t)):o.test(t)?T(v(t)):m(t)},T=h("object",y,l),E=h("array",b,i),x=function(n,e){var t=n.length-e.length,r=n.substring(0,t),a=r.split("\n").length,s=a>1?r.length-r.lastIndexOf("\n")-1:r.length;return{offset:t,line:a,column:s}},j=function(e){var t=b(e),r=n.slicedToArray(t,3),a=r[0],s=r[1],u=r[2],i=s;s=g(s);var o=a||!s;o||(a=m(s[0]),u=void 0);var l=a?{message:a,remainingText:s,location:x(e,i)}:null;return{error:l,value:u}},A=function(n,e){var t=null;return function(){clearTimeout(t),t=setTimeout(n,e)}},w='<span class="value">',L="</span>",I='<span class="separator">,</span>'+L+w,S='<span class="array"><a class="start">[</a>',B='<span class="end">]</span></span>',k='<span class="object"><a class="start">{</a>',O='<span class="end">}</span></span>',C="</span>",N=function(n,e){return'<span class="contents">'+n+'</span><span class="collapse">'+e+"</span>"},R=function(n){return'<span class="key">"'+n+'"</span><span class="colon">: </span>'},H=function(e){var t=n.slicedToArray(e,2),r=t[0],a=t[1];return R(r)+M(a)},J={number:function(n){return'<span class="number">'+n+"</span>"},string:function(n){return'<span class="string">'+n+"</span>"},"boolean":function(n){return'<span class="boolean">'+n+"</span>"},"null":function(n){return'<span class="null">'+n+"</span>"},array:function(n,e,t){var r=w+e.map(M).join(I)+L,a=e.length?N(r,e.length):"";return S+a+(t?B:C)},object:function(n,e,t){var r=w+e.map(H).join(I)+L,a=e.length?N(r,"&hellip;"):"";return k+a+(t?O:C)}},M=function(n){return J[n.type](n.match,n.value,n.isComplete)},U=function(n){var e=n.json;return e?M(e):""},W=function(n){var e=n.message,t=n.location;return e?'<a class="error" data-offset='+t.offset+">"+e+"</a>":""},X=function(n){var e=n.remainingText;return e?'<div class="remaining-text">'+e+"</div>":""},$=function(n){var e=n.json,t=n.message,r=n.location,a=n.remainingText;return W({message:t,location:r})+U({json:e})+X({remainingText:a})},q=document.getElementById("textarea"),z=document.getElementById("output"),D=document.getElementById("divider");document.getElementById("error");q.addEventListener("input",A(function(){var n=q.value;if(n.match(/^\s*$/))return void(z.innerHTML="");var e=j(n),t=e.error,r=e.value,a=t?t.message:null,s=t?t.location:null,u=t?t.remainingText:null;z.innerHTML=$({json:r,message:a,location:s,remainingText:u})},200));var F=function(n){var e=D.getBoundingClientRect(),t=e.width,r=(n.clientX-t/2)/document.body.clientWidth*100;q.style.width=r+"%",z.style.width=100-r+"%",window.getSelection().removeAllRanges()};D.addEventListener("mousedown",function(){document.addEventListener("mousemove",F)}),document.addEventListener("mouseup",function(){document.removeEventListener("mousemove",F)}),document.addEventListener("click",function(n){var e=n.target;if(e.matches("a.start"))e.parentElement.classList.toggle("hidden");else if(e.matches("a.error")){var t=Number(e.getAttribute("data-offset"));q.setSelectionRange(t,t)}})}();