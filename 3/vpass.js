/*
vPass: more secure, less painful password management
v. 3.0.2
&copy; 2012-2013 Vlad Gerasimov
vPass website: https://www.vpass.info
Email me: vladstudio@gmail.com

vPass is free to use, modify, re-distribute, as long as link to vPass.info is provided. I am not responsible for any damage you might experience using vPass. Use at your own risk! (But remember — not using vPass may be riskier).

*/


// namespace
var vpass = {};

// Detect environment (browser / safari extension / chrome extension).
vpass.env = {};
vpass.env.safari_ext = (typeof safari != 'undefined' && typeof safari.application != 'undefined');
vpass.env.chrome_ext = (typeof chrome != 'undefined' && typeof chrome.tabs != 'undefined');

// detect GUI (web page with vPass form) or CLI (no web page)
vpass.env.gui = (document.getElementById('vpass_master_password') ? true:false);

/*
Rules for generated password.
*/
vpass.rules = 
{
	// 12 length seems to meet most websites' requirements
	generated_password_length 	: 12,

	// only "safe" symbols are included; f**k you Yandex!
	available_symbols         	: "!#$%&()*,-.",
	
	require_uppercase_letters 	: true,
	require_lowercase_letters 	: true,
	require_digits            	: true,
	require_special_symbols   	: true
};

vpass.custom_rules = {};

vpass.custom_rules["ebay"] = {
	generated_password_length 	: 24
};
vpass.custom_rules["facebook"] = {
	generated_password_length 	: 24
};
vpass.custom_rules["paypal"] = {
	generated_password_length 	: 20
};
vpass.custom_rules["google"] = {
	generated_password_length 	: 24
};
vpass.custom_rules["yahoo"] = {
	generated_password_length 	: 24
};
vpass.custom_rules["payoneer"] = {
	generated_password_length 	: 20
};
vpass.custom_rules["payoneer"] = {
	generated_password_length 	: 18,
	require_special_symbols		: false
}
vpass.custom_rules["att"] = {
	require_special_symbols		: false
}
vpass.custom_rules["ru-board"] = {
	require_special_symbols		: false
}
vpass.custom_rules["gosuslugi"] = {
	generated_password_length 	: 24,
	require_special_symbols		: false
}
vpass.custom_rules["reasoningmind"] = {
	require_special_symbols		: false
}

/* CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(v,p){var d={},u=d.lib={},r=function(){},f=u.Base={extend:function(a){r.prototype=this;var b=new r;a&&b.mixIn(a);b.hasOwnProperty("init")||(b.init=function(){b.$super.init.apply(this,arguments)});b.init.prototype=b;b.$super=this;return b},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var b in a)a.hasOwnProperty(b)&&(this[b]=a[b]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
s=u.WordArray=f.extend({init:function(a,b){a=this.words=a||[];this.sigBytes=b!=p?b:4*a.length},toString:function(a){return(a||y).stringify(this)},concat:function(a){var b=this.words,c=a.words,j=this.sigBytes;a=a.sigBytes;this.clamp();if(j%4)for(var n=0;n<a;n++)b[j+n>>>2]|=(c[n>>>2]>>>24-8*(n%4)&255)<<24-8*((j+n)%4);else if(65535<c.length)for(n=0;n<a;n+=4)b[j+n>>>2]=c[n>>>2];else b.push.apply(b,c);this.sigBytes+=a;return this},clamp:function(){var a=this.words,b=this.sigBytes;a[b>>>2]&=4294967295<<
32-8*(b%4);a.length=v.ceil(b/4)},clone:function(){var a=f.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var b=[],c=0;c<a;c+=4)b.push(4294967296*v.random()|0);return new s.init(b,a)}}),x=d.enc={},y=x.Hex={stringify:function(a){var b=a.words;a=a.sigBytes;for(var c=[],j=0;j<a;j++){var n=b[j>>>2]>>>24-8*(j%4)&255;c.push((n>>>4).toString(16));c.push((n&15).toString(16))}return c.join("")},parse:function(a){for(var b=a.length,c=[],j=0;j<b;j+=2)c[j>>>3]|=parseInt(a.substr(j,
2),16)<<24-4*(j%8);return new s.init(c,b/2)}},e=x.Latin1={stringify:function(a){var b=a.words;a=a.sigBytes;for(var c=[],j=0;j<a;j++)c.push(String.fromCharCode(b[j>>>2]>>>24-8*(j%4)&255));return c.join("")},parse:function(a){for(var b=a.length,c=[],j=0;j<b;j++)c[j>>>2]|=(a.charCodeAt(j)&255)<<24-8*(j%4);return new s.init(c,b)}},q=x.Utf8={stringify:function(a){try{return decodeURIComponent(escape(e.stringify(a)))}catch(b){throw Error("Malformed UTF-8 data");}},parse:function(a){return e.parse(unescape(encodeURIComponent(a)))}},
t=u.BufferedBlockAlgorithm=f.extend({reset:function(){this._data=new s.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=q.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var b=this._data,c=b.words,j=b.sigBytes,n=this.blockSize,e=j/(4*n),e=a?v.ceil(e):v.max((e|0)-this._minBufferSize,0);a=e*n;j=v.min(4*a,j);if(a){for(var f=0;f<a;f+=n)this._doProcessBlock(c,f);f=c.splice(0,a);b.sigBytes-=j}return new s.init(f,j)},clone:function(){var a=f.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});u.Hasher=t.extend({cfg:f.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){t.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,c){return(new a.init(c)).finalize(b)}},_createHmacHelper:function(a){return function(b,c){return(new w.HMAC.init(a,
c)).finalize(b)}}});var w=d.algo={};return d}(Math);
(function(v){var p=CryptoJS,d=p.lib,u=d.Base,r=d.WordArray,p=p.x64={};p.Word=u.extend({init:function(f,s){this.high=f;this.low=s}});p.WordArray=u.extend({init:function(f,s){f=this.words=f||[];this.sigBytes=s!=v?s:8*f.length},toX32:function(){for(var f=this.words,s=f.length,d=[],p=0;p<s;p++){var e=f[p];d.push(e.high);d.push(e.low)}return r.create(d,this.sigBytes)},clone:function(){for(var f=u.clone.call(this),d=f.words=this.words.slice(0),p=d.length,r=0;r<p;r++)d[r]=d[r].clone();return f}})})();
(function(v){for(var p=CryptoJS,d=p.lib,u=d.WordArray,r=d.Hasher,f=p.x64.Word,d=p.algo,s=[],x=[],y=[],e=1,q=0,t=0;24>t;t++){s[e+5*q]=(t+1)*(t+2)/2%64;var w=(2*e+3*q)%5,e=q%5,q=w}for(e=0;5>e;e++)for(q=0;5>q;q++)x[e+5*q]=q+5*((2*e+3*q)%5);e=1;for(q=0;24>q;q++){for(var a=w=t=0;7>a;a++){if(e&1){var b=(1<<a)-1;32>b?w^=1<<b:t^=1<<b-32}e=e&128?e<<1^113:e<<1}y[q]=f.create(t,w)}for(var c=[],e=0;25>e;e++)c[e]=f.create();d=d.SHA3=r.extend({cfg:r.cfg.extend({outputLength:512}),_doReset:function(){for(var a=this._state=
[],b=0;25>b;b++)a[b]=new f.init;this.blockSize=(1600-2*this.cfg.outputLength)/32},_doProcessBlock:function(a,b){for(var e=this._state,f=this.blockSize/2,h=0;h<f;h++){var l=a[b+2*h],m=a[b+2*h+1],l=(l<<8|l>>>24)&16711935|(l<<24|l>>>8)&4278255360,m=(m<<8|m>>>24)&16711935|(m<<24|m>>>8)&4278255360,g=e[h];g.high^=m;g.low^=l}for(f=0;24>f;f++){for(h=0;5>h;h++){for(var d=l=0,k=0;5>k;k++)g=e[h+5*k],l^=g.high,d^=g.low;g=c[h];g.high=l;g.low=d}for(h=0;5>h;h++){g=c[(h+4)%5];l=c[(h+1)%5];m=l.high;k=l.low;l=g.high^
(m<<1|k>>>31);d=g.low^(k<<1|m>>>31);for(k=0;5>k;k++)g=e[h+5*k],g.high^=l,g.low^=d}for(m=1;25>m;m++)g=e[m],h=g.high,g=g.low,k=s[m],32>k?(l=h<<k|g>>>32-k,d=g<<k|h>>>32-k):(l=g<<k-32|h>>>64-k,d=h<<k-32|g>>>64-k),g=c[x[m]],g.high=l,g.low=d;g=c[0];h=e[0];g.high=h.high;g.low=h.low;for(h=0;5>h;h++)for(k=0;5>k;k++)m=h+5*k,g=e[m],l=c[m],m=c[(h+1)%5+5*k],d=c[(h+2)%5+5*k],g.high=l.high^~m.high&d.high,g.low=l.low^~m.low&d.low;g=e[0];h=y[f];g.high^=h.high;g.low^=h.low}},_doFinalize:function(){var a=this._data,
b=a.words,c=8*a.sigBytes,e=32*this.blockSize;b[c>>>5]|=1<<24-c%32;b[(v.ceil((c+1)/e)*e>>>5)-1]|=128;a.sigBytes=4*b.length;this._process();for(var a=this._state,b=this.cfg.outputLength/8,c=b/8,e=[],h=0;h<c;h++){var d=a[h],f=d.high,d=d.low,f=(f<<8|f>>>24)&16711935|(f<<24|f>>>8)&4278255360,d=(d<<8|d>>>24)&16711935|(d<<24|d>>>8)&4278255360;e.push(d);e.push(f)}return new u.init(e,b)},clone:function(){for(var a=r.clone.call(this),b=a._state=this._state.slice(0),c=0;25>c;c++)b[c]=b[c].clone();return a}});
p.SHA3=r._createHelper(d);p.HmacSHA3=r._createHmacHelper(d)})(Math);



if (vpass.env.gui)
{
/* mousetrap v1.3 craig.is/killing/mice */
(function(){function s(a,c,b){a.addEventListener?a.addEventListener(c,b,!1):a.attachEvent("on"+c,b)}function y(a){return"keypress"==a.type?String.fromCharCode(a.which):h[a.which]?h[a.which]:z[a.which]?z[a.which]:String.fromCharCode(a.which).toLowerCase()}function t(a,c){a=a||{};var b=!1,d;for(d in m)a[d]&&m[d]>c?b=!0:m[d]=0;b||(p=!1)}function A(a,c,b,d,g){var f,e,h=[],j=b.type;if(!l[a])return[];"keyup"==j&&u(a)&&(c=[a]);for(f=0;f<l[a].length;++f)if(e=l[a][f],!(e.seq&&m[e.seq]!=e.level)&&j==e.action&&
("keypress"==j&&!b.metaKey&&!b.ctrlKey||c.sort().join(",")===e.modifiers.sort().join(",")))d&&e.combo==g&&l[a].splice(f,1),h.push(e);return h}function v(a,c,b){if(!k.stopCallback(c,c.target||c.srcElement,b)&&!1===a(c,b))c.preventDefault&&c.preventDefault(),c.stopPropagation&&c.stopPropagation(),c.returnValue=!1,c.cancelBubble=!0}function w(a){"number"!==typeof a.which&&(a.which=a.keyCode);var c=y(a);if(c)if("keyup"==a.type&&x==c)x=!1;else{var b=[];a.shiftKey&&b.push("shift");a.altKey&&b.push("alt");
a.ctrlKey&&b.push("ctrl");a.metaKey&&b.push("meta");var b=A(c,b,a),d,g={},f=0,e=!1;for(d=0;d<b.length;++d)b[d].seq?(e=!0,f=Math.max(f,b[d].level),g[b[d].seq]=1,v(b[d].callback,a,b[d].combo)):!e&&!p&&v(b[d].callback,a,b[d].combo);a.type==p&&!u(c)&&t(g,f)}}function u(a){return"shift"==a||"ctrl"==a||"alt"==a||"meta"==a}function B(a,c,b){if(!b){if(!q){q={};for(var d in h)95<d&&112>d||h.hasOwnProperty(d)&&(q[h[d]]=d)}b=q[a]?"keydown":"keypress"}"keypress"==b&&c.length&&(b="keydown");return b}function C(a,
c,b,d,g){r[a+":"+b]=c;a=a.replace(/\s+/g," ");var f=a.split(" "),e,h,j=[];if(1<f.length){var k=a,n=b;m[k]=0;n||(n=B(f[0],[]));a=function(){p=n;++m[k];clearTimeout(D);D=setTimeout(t,1E3)};b=function(a){v(c,a,k);"keyup"!==n&&(x=y(a));setTimeout(t,10)};for(d=0;d<f.length;++d)C(f[d],d<f.length-1?a:b,n,k,d)}else{h="+"===a?["+"]:a.split("+");for(f=0;f<h.length;++f)e=h[f],E[e]&&(e=E[e]),b&&("keypress"!=b&&F[e])&&(e=F[e],j.push("shift")),u(e)&&j.push(e);b=B(e,j,b);l[e]||(l[e]=[]);A(e,j,{type:b},!d,a);l[e][d?
"unshift":"push"]({callback:c,modifiers:j,action:b,seq:d,level:g,combo:a})}}for(var h={8:"backspace",9:"tab",13:"enter",16:"shift",17:"ctrl",18:"alt",20:"capslock",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"ins",46:"del",91:"meta",93:"meta",224:"meta"},z={106:"*",107:"+",109:"-",110:".",111:"/",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},F={"~":"`","!":"1","@":"2","#":"3",$:"4","%":"5","^":"6",
"&":"7","*":"8","(":"9",")":"0",_:"-","+":"=",":":";",'"':"'","<":",",">":".","?":"/","|":"\\"},E={option:"alt",command:"meta","return":"enter",escape:"esc"},q,l={},r={},m={},D,x=!1,p=!1,g=1;20>g;++g)h[111+g]="f"+g;for(g=0;9>=g;++g)h[g+96]=g;s(document,"keypress",w);s(document,"keydown",w);s(document,"keyup",w);var k={bind:function(a,c,b){a=a instanceof Array?a:[a];for(var d=0;d<a.length;++d)C(a[d],c,b);return this},unbind:function(a,c){return k.bind(a,function(){},c)},trigger:function(a,c){if(r[a+
":"+c])r[a+":"+c]();return this},reset:function(){l={};r={};return this},stopCallback:function(a,c){return-1<(" "+c.className+" ").indexOf(" mousetrap ")?!1:"INPUT"==c.tagName||"SELECT"==c.tagName||"TEXTAREA"==c.tagName||c.contentEditable&&"true"==c.contentEditable}};window.Mousetrap=k;"function"===typeof define&&define.amd&&define(k)})();
}



/*
Top level domains list - used to strip "brand" part from a URL.
Ccompiled from 
http://www.consortemarketing.com/2012/01/tld-complete-list-top-level-domains-domain-extensions/
*/
vpass.tld = ['local','dev','ac','com.ac','edu.ac','gov.ac','net.ac','mil.ac','org.ac','ad','nom.ad','ae','net.ae','gov.ae','org.ae','mil.ae','sch.ae','ac.ae','pro.ae','name.ae','aero','af','gov.af','edu.af','net.af','com.af','ag','com.ag','org.ag','net.ag','co.ag','nom.ag','ai','off.ai','com.ai','net.ai','org.ai','al','gov.al','edu.al','org.al','com.al','net.al','uniti.al','tirana.al','soros.al','upt.al','inima.al','am','an','com.an','net.an','org.an','edu.an','ao','co.ao','ed.ao','gv.ao','it.ao','og.ao','pb.ao','aq','ar','com.ar','gov.ar','int.ar','mil.ar','net.ar','org.ar','arpa','e164.arpa','in-addr.arpa','iris.arpa','ip6.arpa','uri.arpa','urn.arpa','as','at','gv.at','ac.at','co.at','or.at','priv.at','au','asn.au','com.au','net.au','id.au','org.au','csiro.au','oz.au','info.au','conf.au','act.au','nsw.au','nt.au','qld.au','sa.au','tas.au','vic.au','wa.au','gov.au','and','edu.au','act','nsw','nt','qld','sa','tas','vic','wa','aw','com.aw','ax','az','com.az','net.az','int.az','gov.az','biz.az','org.az','edu.az','mil.az','pp.az','name.az','info.az','ba','bb','com.bb','edu.bb','gov.bb','net.bb','org.bb','bd','com.bd','edu.bd','net.bd','gov.bd','org.bd','mil.bd','be','ac.be','to.be','com.be','co.be','xa.be','ap.be','fgov.be','bf','gov.bf','bg','bh','bi','biz','bj','bm','com.bm','edu.bm','org.bm','gov.bm','net.bm','bn','com.bn','edu.bn','org.bn','net.bn','bo','com.bo','org.bo','net.bo','gov.bo','gob.bo','edu.bo','tv.bo','mil.bo','int.bo','br','agr.br','am.br','art.br','edu.br','com.br','coop.br','esp.br','far.br','fm.br','g12.br','gov.br','imb.br','ind.br','inf.br','mil.br','net.br','org.br','psi.br','rec.br','srv.br','tmp.br','tur.br','tv.br','etc.br','adm.br','adv.br','arq.br','ato.br','bio.br','bmd.br','cim.br','cng.br','cnt.br','ecn.br','eng.br','eti.br','fnd.br','fot.br','fst.br','ggf.br','jor.br','lel.br','mat.br','med.br','mus.br','not.br','ntr.br','odo.br','ppg.br','pro.br','psc.br','qsl.br','slg.br','trd.br','vet.br','zlg.br','dpn.br','nom.br','bs','com.bs','net.bs','org.bs','bt','com.bt','edu.bt','gov.bt','net.bt','org.bt','bv','bw','co.bw','org.bw','by','gov.by','mil.by','bz','ca','ab.ca','bc.ca','mb.ca','nb.ca','nf.ca','nl.ca','ns.ca','nt.ca','nu.ca','on.ca','pe.ca','qc.ca','sk.ca','yk.ca','cat','cc','co.cc','cd','com.cd','net.cd','org.cd','cf','cg','ch','com.ch','net.ch','org.ch','gov.ch','ci','ck','co.ck','cl','cm','cn','ac.cn','com.cn','edu.cn','gov.cn','net.cn','org.cn','ah.cn','bj.cn','cq.cn','fj.cn','gd.cn','gs.cn','gz.cn','gx.cn','ha.cn','hb.cn','he.cn','hi.cn','hl.cn','hn.cn','jl.cn','js.cn','jx.cn','ln.cn','nm.cn','nx.cn','qh.cn','sc.cn','sd.cn','sh.cn','sn.cn','sx.cn','tj.cn','xj.cn','xz.cn','yn.cn','zj.cn','co','com.co','edu.co','org.co','gov.co','mil.co','net.co','nom.co','com','coop','cr','ac.cr','co.cr','ed.cr','fi.cr','go.cr','or.cr','sa.cr','cu','com.cu','edu.cu','org.cu','net.cu','gov.cu','inf.cu','cv','cx','gov.cx','cy','com.cy','biz.cy','info.cy','ltd.cy','pro.cy','net.cy','org.cy','name.cy','tm.cy','ac.cy','ekloges.cy','press.cy','parliament.cy','cz','de','dj','dk','dm','com.dm','net.dm','org.dm','edu.dm','gov.dm','do','edu.do','gov.do','gob.do','com.do','org.do','sld.do','web.do','net.do','mil.do','art.do','dz','com.dz','org.dz','net.dz','gov.dz','edu.dz','asso.dz','pol.dz','art.dz','ec','com.ec','info.ec','net.ec','fin.ec','med.ec','pro.ec','org.ec','edu.ec','gov.ec','mil.ec','edu','ee','com.ee','org.ee','fie.ee','pri.ee','eg','eun.eg','edu.eg','sci.eg','gov.eg','com.eg','org.eg','net.eg','mil.eg','er','es','com.es','nom.es','org.es','gob.es','edu.es','et','com.et','gov.et','org.et','edu.et','net.et','biz.et','name.et','info.et','eu','fi','aland.fi','fj','biz.fj','com.fj','info.fj','name.fj','net.fj','org.fj','pro.fj','ac.fj','gov.fj','mil.fj','school.fj','fk','co.fk','org.fk','gov.fk','ac.fk','nom.fk','net.fk','fm','fo','fr','tm.fr','asso.fr','nom.fr','prd.fr','presse.fr','com.fr','gouv.fr','ga','gb','gd','ge','com.ge','edu.ge','gov.ge','org.ge','mil.ge','net.ge','pvt.ge','gf','gg','co.gg','net.gg','org.gg','gh','com.gh','edu.gh','gov.gh','org.gh','mil.gh','gi','com.gi','ltd.gi','gov.gi','mod.gi','edu.gi','org.gi','gl','gm','gn','com.gn','ac.gn','gov.gn','org.gn','net.gn','gov','"gp','com.gp,','net.gp,','edu.gp,','asso.gp,','or','org.gp"','gq','gr','com.gr','edu.gr','net.gr','org.gr','gov.gr','gs','gt','gu','gw','gy','hk','com.hk','edu.hk','gov.hk','idv.hk','net.hk','org.hk','hm','hn','com.hn','edu.hn','org.hn','net.hn','mil.hn','gob.hn','hr','iz.hr','from.hr','name.hr','com.hr','ht','com.ht','net.ht','firm.ht','shop.ht','info.ht','pro.ht','adult.ht','org.ht','art.ht','pol.ht','rel.ht','asso.ht','perso.ht','coop.ht','med.ht','edu.ht','gouv.ht','hu','co.hu','info.hu','org.hu','priv.hu','sport.hu','tm.hu','2000.hu','agrar.hu','bolt.hu','casino.hu','city.hu','erotica.hu','erotika.hu','film.hu','forum.hu','games.hu','hotel.hu','ingatlan.hu','jogasz.hu','konyvelo.hu','lakas.hu','media.hu','news.hu','reklam.hu','sex.hu','shop.hu','suli.hu','szex.hu','tozsde.hu','utazas.hu','video.hu','id','ac.id','co.id','or.id','go.id','ie','gov.ie','il','ac.il','co.il','org.il','net.il','k12.il','gov.il','muni.il','idf.il','im','co.im','ltd.co.im','plc.co.im','net.im','gov.im','org.im','nic.im','ac.im','in','co.in','firm.in','net.in','org.in','gen.in','ind.in','nic.in','ac.in','edu.in','res.in','gov.in','mil.in','info','int','europa.eu.int','io','iq','ir','ac.ir','co.ir','gov.ir','net.ir','org.ir','sch.ir','is','ac.is','org.is','it','gov.it','pisa.it','pontedera.pisa.it','je','co.je','net.je','org.je','jm','edu.jm','gov.jm','com.jm','net.jm','org.jm','jo','com.jo','org.jo','net.jo','edu.jo','gov.jo','mil.jo','jobs','jp','ac.jp','ad.jp','co.jp','ed.jp','go.jp','gr.jp','lg.jp','ne.jp','or.jp','hokkaido.jp','aomori.jp','iwate.jp','miyagi.jp','akita.jp','yamagata.jp','fukushima.jp','ibaraki.jp','tochigi.jp','gunma.jp','saitama.jp','chiba.jp','tokyo.jp','kanagawa.jp','niigata.jp','toyama.jp','ishikawa.jp','fukui.jp','yamanashi.jp','nagano.jp','gifu.jp','shizuoka.jp','aichi.jp','mie.jp','shiga.jp','kyoto.jp','osaka.jp','hyogo.jp','nara.jp','wakayama.jp','tottori.jp','shimane.jp','okayama.jp','hiroshima.jp','yamaguchi.jp','tokushima.jp','kagawa.jp','ehime.jp','kochi.jp','fukuoka.jp','saga.jp','nagasaki.jp','kumamoto.jp','oita.jp','miyazaki.jp','kagoshima.jp','okinawa.jp','sapporo.jp','sendai.jp','yokohama.jp','kawasaki.jp','nagoya.jp','kobe.jp','kitakyushu.jp','ke','kg','kh','per.kh','com.kh','edu.kh','gov.kh','mil.kh','net.kh','org.kh','ki','km','kn','kr','co.kr.kr','kw','com.kw','edu.kw','gov.kw','net.kw','org.kw','mil.kw','ky','edu.ky','gov.ky','com.ky','org.ky','net.ky','kz','org.kz','edu.kz','net.kz','gov.kz','mil.kz','com.kz','la','lb','net.lb','org.lb','gov.lb','edu.lb','com.lb','lc','com.lc','org.lc','edu.lc','gov.lc','li','com.li','net.li','org.li','gov.li','lk','gov.lk','sch.lk','net.lk','int.lk','com.lk','org.lk','edu.lk','ngo.lk','soc.lk','web.lk','ltd.lk','assn.lk','grp.lk','hotel.lk','lr','com.lr','edu.lr','gov.lr','org.lr','net.lr','ls','org.ls','co.ls','lt','gov.lt','mil.lt','lu','gov.lu','mil.lu','org.lu','net.lu','lv','com.lv','edu.lv','gov.lv','org.lv','mil.lv','id.lv','net.lv','asn.lv','conf.lv','ly','com.ly','net.ly','gov.ly','plc.ly','edu.ly','sch.ly','med.ly','org.ly','id.ly','ma','co.ma','net.ma','gov.ma','org.ma','mc','tm.mc','asso.mc','md','mg','org.mg','nom.mg','gov.mg','prd.mg','tm.mg','com.mg','edu.mg','mil.mg','mh','mil','army.mil','navy.mil','mk','com.mk','org.mk','ml','mm','mn','mo','com.mo','net.mo','org.mo','edu.mo','gov.mo','mobi','weather.mobi','music.mobi','mp','mq','mr','ms','mt','org.mt','com.mt','gov.mt','edu.mt','net.mt','mu','com.mu','co.mu','museum','mv','aero.mv','biz.mv','com.mv','coop.mv','edu.mv','gov.mv','info.mv','int.mv','mil.mv','museum.mv','name.mv','net.mv','org.mv','pro.mv','mw','ac.mw','co.mw','com.mw','coop.mw','edu.mw','gov.mw','int.mw','museum.mw','net.mw','org.mw','mx','com.mx','net.mx','org.mx','edu.mx','gob.mx','my','com.my','net.my','org.my','gov.my','edu.my','mil.my','name.my','mz','na','name','nc','ne','net','nf','ng','edu.ng','com.ng','gov.ng','org.ng','net.ng','ni','gob.ni','com.ni','edu.ni','org.ni','nom.ni','net.ni','nl','no','mil.no','stat.no','kommune.no','herad.no','priv.no','vgs.no','fhs.no','museum.no','fylkesbibl.no','folkebibl.no','idrett.no','np','com.np','org.np','edu.np','net.np','gov.np','mil.np','nr','gov.nr','edu.nr','biz.nr','info.nr','nr','org.nr','com.nr','net.nr','co.nr','nu','nz','ac.nz','co.nz','cri.nz','gen.nz','geek.nz','govt.nz','iwi.nz','maori.nz','mil.nz','net.nz','org.nz','school.nz','om','com.om','co.om','edu.om','ac.com','sch.om','gov.om','net.om','org.om','mil.om','museum.om','biz.om','pro.om','med.om','org','pa','com.pa','ac.pa','sld.pa','gob.pa','edu.pa','org.pa','net.pa','abo.pa','ing.pa','med.pa','nom.pa','pe','com.pe','org.pe','net.pe','edu.pe','mil.pe','gob.pe','nom.pe','pf','com.pf','org.pf','edu.pf','pg','com.pg','net.pg','ph','com.ph','gov.ph','pk','com.pk','net.pk','edu.pk','org.pk','fam.pk','biz.pk','web.pk','gov.pk','gob.pk','gok.pk','gon.pk','gop.pk','gos.pk','pl','com.pl','biz.pl','net.pl','art.pl','edu.pl','org.pl','ngo.pl','gov.pl','info.pl','mil.plæ','waw.pl','warszawa.pl','wroc.pl','wroclaw.pl','krakow.pl','poznan.pl','lodz.pl','gda.pl','gdansk.pl','slupsk.pl','szczecin.pl','lublin.pl','bialystok.pl','olsztyn.pl.torun.pl','pm','pn','pr','biz.pr','com.pr','edu.pr','gov.pr','info.pr','isla.pr','name.pr','net.pr','org.pr','pro.pr','pro','law.pro','med.pro','cpa.pro','ps','edu.ps','gov.ps','sec.ps','plo.ps','com.ps','org.ps','net.ps','pt','com.pt','edu.pt','gov.pt','int.pt','net.pt','nome.pt','org.pt','publ.pt','pw','py','net.py','org.py','gov.py','edu.py','com.py','qa','re','ro','com.ro','org.ro','tm.ro','nt.ro','nom.ro','info.ro','rec.ro','arts.ro','firm.ro','store.ro','www.ro','ru','com.ru','net.ru','org.ru','pp.ru','msk.ru','int.ru','ac.ru','rw','gov.rw','net.rw','edu.rw','ac.rw','com.rw','co.rw','int.rw','mil.rw','gouv.rw','sa','com.sa','edu.sa','sch.sa','med.sa','gov.sa','net.sa','org.sa','pub.sa','sb','com.sb','gov.sb','net.sb','edu.sb','sc','com.sc','gov.sc','net.sc','org.sc','edu.sc','sd','com.sd','net.sd','org.sd','edu.sd','med.sd','tv.sd','gov.sd','info.sd','se','org.se','pp.se','tm.se','brand.se','parti.se','press.se','komforb.se','kommunalforbund.se','komvux.se','lanarb.se','lanbib.se','naturbruksgymn.se','sshn.se','fhv.se','fhsk.se','fh.se','mil.se','ab.se','c.se','d.se','e.se','f.se','g.se','h.se','i.se','k.se','m.se','n.se','o.se','s.se','t.se','u.se','w.se','x.se','y.se','z.se','ac.se','bd.se','sg','com.sg','net.sg','org.sg','gov.sg','edu.sg','per.sg','idn.sg','sh','si','sj','sk','sl','sm','sn','so','sr','rs.sr','st','su','sv','edu.sv','com.sv','gob.sv','org.sv','red.sv','sy','gov.sy','com.sy','net.sy','sz','tc','td','tf','tg','th','ac.th','co.th','in.th','go.th','mi.th','or.th','net.th','tj','ac.tj','biz.tj','com.tj','co.tj','edu.tj','int.tj','name.tj','net.tj','org.tj','web.tj','gov.tj','go.tj','mil.tj','tk','tl','tm','tn','com.tn','intl.tn','gov.tn','org.tn','ind.tn','nat.tn','tourism.tn','info.tn','ens.tn','fin.tn','net.tn','to','gov.to','tp','gov.tp','tr','com.tr','info.tr','biz.tr','net.tr','org.tr','web.tr','gen.tr','av.tr','dr.tr','bbs.tr','name.tr','tel.tr','gov.tr','bel.tr','pol.tr','mil.tr','k12.tr','edu.tr','bel.tr','travel','tt','co.tt','com.tt','org.tt','net.tt','biz.tt','info.tt','pro.tt','name.tt','edu.tt','gov.tt','us.tt','tv','gov.tv','tw','edu.tw','gov.tw','mil.tw','com.tw','net.tw','org.tw','idv.tw','game.tw','ebiz.tw','club.tw','tz','co.tz','ac.tz','go.tz','or.tz','ne.tz','ua','com.ua','gov.ua','net.ua','edu.ua','org.ua','cherkassy.ua','ck.ua','chernigov.ua','cn.ua','chernovtsy.ua','cv.ua','crimea.ua','dnepropetrovsk.ua','dp.ua','donetsk.ua','dn.ua','ivano-frankivsk.ua','if.ua','kharkov.ua','kh.ua','kherson.ua','ks.ua','khmelnitskiy.ua','km.ua','kiev.ua','kv.ua','kirovograd.ua','kr.ua','lugansk.ua','lg.ua','lutsk.ua','lviv.ua','nikolaev.ua','mk.ua','odessa.ua','od.ua','poltava.ua','pl.ua','rovno.ua','rv.ua','sebastopol.ua','sumy.ua','ternopil.ua','te.ua','uzhgorod.ua','vinnica.ua','vn.ua','zaporizhzhe.ua','zp.ua','zhitomir.ua','zt.ua','ug','co.ug','ac.ug','sc.ug','go.ug','ne.ug','or.ug','uk','ac.uk','co.uk','gov.uk','ltd.uk','me.uk','mil.uk','mod.uk','net.uk','nic.uk','nhs.uk','org.uk','plc.uk','police.uk','sch.uk','bl.uk','british-library.uk','icnet.uk','jet.uk','nel.uk','nls.uk','national-library-scotland.uk','parliament.uk','um','us','ak.us','al.us','ar.us','az.us','ca.us','co.us','ct.us','dc.us','de.us','dni.us','fed.us','fl.us','ga.us','hi.us','ia.us','id.us','il.us','in.us','isa.us','kids.us','ks.us','ky.us','la.us','ma.us','md.us','me.us','mi.us','mn.us','mo.us','ms.us','mt.us','nc.us','nd.us','ne.us','nh.us','nj.us','nm.us','nsn.us','nv.us','ny.us','oh.us','ok.us','or.us','pa.us','ri.us','sc.us','sd.us','tn.us','tx.us','ut.us','vt.us','va.us','wa.us','wi.us','wv.us','wy.us','k12.us','pvt.k12.us','cc.us','tec.us','lib.us','state.us','gen.us','uy','edu.uy','gub.uy','org.uy','com.uy','net.uy','mil.uy','uz','va','vatican.va','vc','ve','com.ve','net.ve','org.ve','info.ve','co.ve','web.ve','vg','vi','com.vi','org.vi','edu.vi','gov.vi','vn','com.vn','net.vn','org.vn','edu.vn','gov.vn','int.vn','ac.vn','biz.vn','info.vn','name.vn','pro.vn','health.vn','vu','wf','ws','ye','com.ye','net.ye','yt','yu','ac.yu','co.yu','org.yu','edu.yu','za','ac.za','city.za','co.za','edu.za','gov.za','law.za','mil.za','nom.za','org.za','school.za','alt.za','net.za','ngo.za','tm.za','web.za','zm','co.zm','org.zm','gov.zm','sch.zm','ac.zm','zw','co.zw','org.zw','gov.zw','ac.zw',
	
	// also added
	'me'];

/*
vpass.apply_custom_rules
If custom rules exist for provided domain, apply them.
*/
vpass.apply_custom_rules = function(domain)
{
	for (var i in vpass.custom_rules)
	{
		if (i == domain)
		{
			for (var rule in vpass.custom_rules[domain])
			{
				vpass.rules[rule] = vpass.custom_rules[domain][rule];
			}
		}
	}
}


/*
vpass.encrypt
- take a text string as an input
- encrypt it with SHA3
- encrypt again with custom simple function
- cut (or grow) to required length
*/
vpass.encrypt = function(input_string, required_length) {

	// prepare all available letters, digits, symbols
	var symbols = ('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' + vpass.rules.available_symbols);
	
	// convert into array
	symbols = symbols.split("");

	// cache lengths
	var symbols_length = symbols.length;
	var input_string_length = input_string.length;
	
	// input_string is required
	if (input_string == "") {
		return "";
	}

	// encrypt input_string with SHA3
	input_string = CryptoJS.SHA3(input_string).toString();
	
	// Default value for required_length
	required_length = required_length || input_string_length;

	// Calculate the offset of the first character.
	for(var last = 0, i = 0; i < input_string_length; i++) {
		last = (input_string.charCodeAt(i) + 31 * last) % 59;
	}


	// Grow input_string if it's shorter than required length
	while(input_string_length < required_length) {
		input_string += input_string;
		input_string_length += input_string_length;
	}
	input_string = input_string.slice(0, required_length);

	// Generate the encrypted string.
	for(var ret = "", i = 0; i < required_length; i++) {
		ret += symbols[last = (i + last + input_string.charCodeAt(i)) % symbols_length];
	}
	return ret;
};



/*
vpass.validate
Validate generated password against vpass.rules
*/
vpass.validate = function(input_string)
{

	// avoid consecutive characters
	if ( vpass.rules.no_consecutive_characters && /(.)\1/.test(input_string)) { alert(input_string); return false; }

	// at least 1 upper case letter
	if ( vpass.rules.require_uppercase_letters && ! /[A-Z]/.test(input_string)) { return false; }
	if ( ! vpass.rules.require_uppercase_letters && /[A-Z]/.test(input_string)) { return false; }

	// at least 1 lower case letter
	if ( vpass.rules.require_lowercase_letters && ! /[a-z]/.test(input_string)) { return false; }
	if ( ! vpass.rules.require_lowercase_letters && /[a-z]/.test(input_string)) { return false; }

	// at least 1 digit
	if ( vpass.rules.require_digits && ! /\d/.test(input_string)) { return false; }
	if ( ! vpass.rules.require_digits && /\d/.test(input_string)) { return false; }

	// at least 1 special symbol
	var regex_symbols = new RegExp( "\\" + vpass.rules.available_symbols.split("").join("|\\") );
	if ( vpass.rules.require_special_symbols && ! regex_symbols.test(input_string)) { return false; }
	if ( ! vpass.rules.require_special_symbols && regex_symbols.test(input_string)) { return false; }

	return true;
};



/*
vpass.encrypt_and_validate
Encrypt input string, concatenate, recurse until it validates against the vpass.rules.
*/
vpass.encrypt_and_validate = function(input_string, required_length)
{
	do 
	{
		var encrypted = vpass.encrypt(input_string, required_length);
		input_string += '.';
	} while (!vpass.validate(encrypted));
	return encrypted;
};


/*
vpass.toggle
Toggle input field type: password (***) / plain text (qwe)
*/
vpass.toggle = function(e)
{
	if (!vpass.env.gui) return false;

	var mode = document.getElementById('vpass_master_password').getAttribute('type') == 'password' ? 'text':'password';
	document.getElementById('vpass_master_password').setAttribute('type', mode);
	document.getElementById('vpass_master_password').focus();
	if (e.preventDefault) {
        e.preventDefault();
    }
	return false;
};


/*
vpass.parse_domain
Convert full domain name or URL - "http://www.google.co.uk" -
into "brand" (second level domain) - "google"
*/
vpass.parse_domain = function(s)
{
	// lowercase
	s = s.toLowerCase();

	// do not process if not URL
	if (!s.match(/^(.*):\/\/(.*)$/))
	{
		return s;
	}

	// do not process if IP
	if (s.match(/(?:[0-9]{1,3}\.){3}[0-9]{1,3}/))
	{
		return s.match(/(?:[0-9]{1,3}\.){3}[0-9]{1,3}/);
	}

	// get hostname
	var l = document.createElement("a");
	l.href = s;
	var r = l.hostname;
	var r_length = r.length;
	var matches = [];

	// find all TLDs that matches the end of string
	// f.e. .uk, .co.uk
	for (var i=0, l=vpass.tld.length; i < l; i++)
	{   
		var maybe = r.substr(-1 - vpass.tld[i].length);
		if( maybe === '.'+vpass.tld[i] )
		{
			matches.push(vpass.tld[i]);
		}
	}

	// do not process if no matches
	if (matches.length==0)
	{
		return s;
	}

	// find longest matches and remove it
	var longest = matches.reduce(function (a, b) { return a.length > b.length ? a : b; });
	r = r.slice(0, (r_length - longest.length - 1));

	// return domain name without subdomains
	return r.split('.').slice(-1)[0];
};




/*
vpass.generate
- take 2 strings: entered master password, domain
- return generated password
*/
vpass.generate = function(pass, domain)
{
	var input_string = pass + domain;
	if(input_string == "") {
		return false;
	}
	vpass.apply_custom_rules(domain);
	return vpass.encrypt_and_validate(input_string, vpass.rules.generated_password_length);
};


vpass.submitHandler = function(event)
{
	if (!vpass.env.gui) return false;

	var pass=document.getElementById('vpass_master_password');
	var domain=document.getElementById('vpass_domain');
	var result=document.getElementById('vpass_generated_password');
	var generated_password = vpass.generate(pass.value, domain.value);

	pass.className = 'hide';
	domain.className = 'hide';
	result.className = '';
	result.value = generated_password;
	result.focus();
	result.select();
	Mousetrap.unbind('enter');
	if (event.preventDefault) {
        event.preventDefault();
    }

    // if run from chrome extension - fill focused input on current page
	if (vpass.env.chrome_ext)
	{
		chrome.tabs.executeScript(null,
		{code:"if (typeof document.activeElement.value != 'undefined') {document.activeElement.value = '"+generated_password+"'}"});
	}

	// if run from safari extension - send password to injected script
	if (vpass.env.safari_ext)
	{
		safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("vpassFill", generated_password);
	}

	return false;
}



vpass.reload = function()
{
	window.location.reload();
}




///////////////////////////////////////////////////////
// Initialize GUI settings


if (vpass.env.gui)
{
	// Keyboard shortcuts
	Mousetrap.bind('enter', function(e){vpass.submitHandler(e);});
	Mousetrap.bind('esc', function(e){ vpass.reload(); });
	Mousetrap.bind(['ctrl+enter', 'command+enter', 'alt+enter', 'f1'], function(e){vpass.toggle(e);});
	setTimeout(function(){ document.getElementById('vpass_master_password').focus(); }, 24);

	// Preload "url" from query string
	// https://www.vpass.info/3/?http://www.google.com (url = google)
	vpass.url = window.location.search.substring(1);
	if (vpass.url.length)
	{
		document.getElementById('vpass_domain').value = vpass.parse_domain(vpass.url);
	}

	// if run from chrome extension - preload "vpass.url" from selected tab
	if (vpass.env.chrome_ext)
	{
		chrome.tabs.getSelected(null, function(tab) {
			document.getElementById('vpass_domain').value = vpass.parse_domain(tab.url);
		});

	}

	// if run from safari extension - preload "url" from selected tab
	if (vpass.env.safari_ext)
	{
		safari.application.addEventListener("popover", function()
		{
			vpass.url = safari.application.activeBrowserWindow.activeTab.url;
			document.getElementById('vpass_domain').value = vpass.parse_domain(vpass.url);
		});

		// ugly hack to make external link work in safari extension
		document.getElementById('icon_link').onclick = function()
		{ 
			var nwin = safari.application.openBrowserWindow();
			nwin.activeTab.url = document.getElementById('icon_link').href;
		};

		// force-reload safari extension when closed
		window.onblur = function() {
			vpass.reload();
		};
	}




	// update app cache
	// Check if a new cache is available on page load.
	if (typeof window.applicationCache != 'undefined')
	{
		window.addEventListener('load', function(e) {

			window.applicationCache.addEventListener('updateready', function(e) {
				if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
					// Browser downloaded a new app cache.
					// Swap it in and reload the page to get the new hotness.
					window.applicationCache.swapCache();
					vpass.reload();
				} else {
					// Manifest didn't change. Nothing new to server.
				}
			}, false);

		}, false);
	}


}
