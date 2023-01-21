

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Block TEA (xxtea) Tiny Encryption Algorithm implementation in JavaScript                      */
/*     (c) Chris Veness 2002-2012: www.movable-type.co.uk/tea-block.html                          */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Algorithm: David Wheeler & Roger Needham, Cambridge University Computer Lab                   */
/*             http://www.cl.cam.ac.uk/ftp/papers/djw-rmn/djw-rmn-tea.html (1994)                 */
/*             http://www.cl.cam.ac.uk/ftp/users/djw3/xtea.ps (1997)                              */
/*             http://www.cl.cam.ac.uk/ftp/users/djw3/xxtea.ps (1998)                             */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var Tea = {};  // Tea namespace

/*
 * encrypt text using Corrected Block TEA (xxtea) algorithm
 *
 * @param {string} plaintext String to be encrypted (multi-byte safe)
 * @param {string} password  Password to be used for encryption (1st 16 chars)
 * @returns {string} encrypted text
 */
Tea.encrypt = function(plaintext, password) {
		if (plaintext.length == 0) return('');  // nothing to encrypt
		
		// convert string to array of longs after converting any multi-byte chars to UTF-8
		var v = Tea.strToLongs(Utf8.encode(plaintext));
		if (v.length <= 1) v[1] = 0;  // algorithm doesn't work for n<2 so fudge by adding a null
		// simply convert first 16 chars of password as key
		var k = Tea.strToLongs(Utf8.encode(password).slice(0,16));  
		var n = v.length;
		
		// ---- <TEA coding> ---- 
		
		var z = v[n-1], y = v[0], delta = 0x9E3779B9;
		var mx, e, q = Math.floor(6 + 52/n), sum = 0;
		
		while (q-- > 0) {  // 6 + 52/n operations gives between 6 & 32 mixes on each word
				sum += delta;
				e = sum>>>2 & 3;
				for (var p = 0; p < n; p++) {
						y = v[(p+1)%n];
						mx = (z>>>5 ^ y<<2) + (y>>>3 ^ z<<4) ^ (sum^y) + (k[p&3 ^ e] ^ z);
						z = v[p] += mx;
				}
		}
		
		// ---- </TEA> ----
		
		var ciphertext = Tea.longsToStr(v);
		
		return Base64.encode(ciphertext);
}

/*
 * decrypt text using Corrected Block TEA (xxtea) algorithm
 *
 * @param {string} ciphertext String to be decrypted
 * @param {string} password   Password to be used for decryption (1st 16 chars)
 * @returns {string} decrypted text
 */
Tea.decrypt = function(ciphertext, password) {
		if (ciphertext.length == 0) return('');
		var v = Tea.strToLongs(Base64.decode(ciphertext));
		var k = Tea.strToLongs(Utf8.encode(password).slice(0,16)); 
		var n = v.length;
		
		// ---- <TEA decoding> ---- 
		
		var z = v[n-1], y = v[0], delta = 0x9E3779B9;
		var mx, e, q = Math.floor(6 + 52/n), sum = q*delta;

		while (sum != 0) {
				e = sum>>>2 & 3;
				for (var p = n-1; p >= 0; p--) {
						z = v[p>0 ? p-1 : n-1];
						mx = (z>>>5 ^ y<<2) + (y>>>3 ^ z<<4) ^ (sum^y) + (k[p&3 ^ e] ^ z);
						y = v[p] -= mx;
				}
				sum -= delta;
		}
		
		// ---- </TEA> ---- 
		
		var plaintext = Tea.longsToStr(v);

		// strip trailing null chars resulting from filling 4-char blocks:
		plaintext = plaintext.replace(/\0+$/,'');

		return Utf8.decode(plaintext);
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

// supporting functions

Tea.strToLongs = function(s) {  // convert string to array of longs, each containing 4 chars
		// note chars must be within ISO-8859-1 (with Unicode code-point < 256) to fit 4/long
		var l = new Array(Math.ceil(s.length/4));
		for (var i=0; i<l.length; i++) {
				// note little-endian encoding - endianness is irrelevant as long as 
				// it is the same in longsToStr() 
				l[i] = s.charCodeAt(i*4) + (s.charCodeAt(i*4+1)<<8) + 
							 (s.charCodeAt(i*4+2)<<16) + (s.charCodeAt(i*4+3)<<24);
		}
		return l;  // note running off the end of the string generates nulls since 
}              // bitwise operators treat NaN as 0

Tea.longsToStr = function(l) {  // convert array of longs back to string
		var a = new Array(l.length);
		for (var i=0; i<l.length; i++) {
				a[i] = String.fromCharCode(l[i] & 0xFF, l[i]>>>8 & 0xFF, 
																	 l[i]>>>16 & 0xFF, l[i]>>>24 & 0xFF);
		}
		return a.join('');  // use Array.join() rather than repeated string appends for efficiency in IE
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Base64 class: Base 64 encoding / decoding (c) Chris Veness 2002-2012                          */
/*    note: depends on Utf8 class                                                                 */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var Base64 = {};  // Base64 namespace

Base64.code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Encode string into Base64, as defined by RFC 4648 [http://tools.ietf.org/html/rfc4648]
 * (instance method extending String object). As per RFC 4648, no newlines are added.
 *
 * @param {String} str The string to be encoded as base-64
 * @param {Boolean} [utf8encode=false] Flag to indicate whether str is Unicode string to be encoded 
 *   to UTF8 before conversion to base64; otherwise string is assumed to be 8-bit characters
 * @returns {String} Base64-encoded string
 */ 
Base64.encode = function(str, utf8encode) {  // http://tools.ietf.org/html/rfc4648
	utf8encode =  (typeof utf8encode == 'undefined') ? false : utf8encode;
	var o1, o2, o3, bits, h1, h2, h3, h4, e=[], pad = '', c, plain, coded;
	var b64 = Base64.code;
	 
	plain = utf8encode ? Utf8.encode(str) : str;
	
	c = plain.length % 3;  // pad string to length of multiple of 3
	if (c > 0) { while (c++ < 3) { pad += '='; plain += '\0'; } }
	// note: doing padding here saves us doing special-case packing for trailing 1 or 2 chars
	 
	for (c=0; c<plain.length; c+=3) {  // pack three octets into four hexets
		o1 = plain.charCodeAt(c);
		o2 = plain.charCodeAt(c+1);
		o3 = plain.charCodeAt(c+2);
			
		bits = o1<<16 | o2<<8 | o3;
			
		h1 = bits>>18 & 0x3f;
		h2 = bits>>12 & 0x3f;
		h3 = bits>>6 & 0x3f;
		h4 = bits & 0x3f;

		// use hextets to index into code string
		e[c/3] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
	}
	coded = e.join('');  // join() is far faster than repeated string concatenation in IE
	
	// replace 'A's from padded nulls with '='s
	coded = coded.slice(0, coded.length-pad.length) + pad;
	 
	return coded;
}

/**
 * Decode string from Base64, as defined by RFC 4648 [http://tools.ietf.org/html/rfc4648]
 * (instance method extending String object). As per RFC 4648, newlines are not catered for.
 *
 * @param {String} str The string to be decoded from base-64
 * @param {Boolean} [utf8decode=false] Flag to indicate whether str is Unicode string to be decoded 
 *   from UTF8 after conversion from base64
 * @returns {String} decoded string
 */ 
Base64.decode = function(str, utf8decode) {
	utf8decode =  (typeof utf8decode == 'undefined') ? false : utf8decode;
	var o1, o2, o3, h1, h2, h3, h4, bits, d=[], plain, coded;
	var b64 = Base64.code;

	coded = utf8decode ? Utf8.decode(str) : str;
	
	
	for (var c=0; c<coded.length; c+=4) {  // unpack four hexets into three octets
		h1 = b64.indexOf(coded.charAt(c));
		h2 = b64.indexOf(coded.charAt(c+1));
		h3 = b64.indexOf(coded.charAt(c+2));
		h4 = b64.indexOf(coded.charAt(c+3));
			
		bits = h1<<18 | h2<<12 | h3<<6 | h4;
			
		o1 = bits>>>16 & 0xff;
		o2 = bits>>>8 & 0xff;
		o3 = bits & 0xff;
		
		d[c/4] = String.fromCharCode(o1, o2, o3);
		// check for padding
		if (h4 == 0x40) d[c/4] = String.fromCharCode(o1, o2);
		if (h3 == 0x40) d[c/4] = String.fromCharCode(o1);
	}
	plain = d.join('');  // join() is far faster than repeated string concatenation in IE
	 
	return utf8decode ? Utf8.decode(plain) : plain; 
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Utf8 class: encode / decode between multi-byte Unicode characters and UTF-8 multiple          */
/*              single-byte character encoding (c) Chris Veness 2002-2012                         */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var Utf8 = {};  // Utf8 namespace

/**
 * Encode multi-byte Unicode string into utf-8 multiple single-byte characters 
 * (BMP / basic multilingual plane only)
 *
 * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
 *
 * @param {String} strUni Unicode string to be encoded as UTF-8
 * @returns {String} encoded string
 */
Utf8.encode = function(strUni) {
	// use regular expressions & String.replace callback function for better efficiency 
	// than procedural approaches
	var strUtf = strUni.replace(
			/[\u0080-\u07ff]/g,  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
			function(c) { 
				var cc = c.charCodeAt(0);
				return String.fromCharCode(0xc0 | cc>>6, 0x80 | cc&0x3f); }
		);
	strUtf = strUtf.replace(
			/[\u0800-\uffff]/g,  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
			function(c) { 
				var cc = c.charCodeAt(0); 
				return String.fromCharCode(0xe0 | cc>>12, 0x80 | cc>>6&0x3F, 0x80 | cc&0x3f); }
		);
	return strUtf;
}

/**
 * Decode utf-8 encoded string back into multi-byte Unicode characters
 *
 * @param {String} strUtf UTF-8 string to be decoded back to Unicode
 * @returns {String} decoded string
 */
Utf8.decode = function(strUtf) {
	// note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
	var strUni = strUtf.replace(
			/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,  // 3-byte chars
			function(c) {  // (note parentheses for precence)
				var cc = ((c.charCodeAt(0)&0x0f)<<12) | ((c.charCodeAt(1)&0x3f)<<6) | ( c.charCodeAt(2)&0x3f); 
				return String.fromCharCode(cc); }
		);
	strUni = strUni.replace(
			/[\u00c0-\u00df][\u0080-\u00bf]/g,                 // 2-byte chars
			function(c) {  // (note parentheses for precence)
				var cc = (c.charCodeAt(0)&0x1f)<<6 | c.charCodeAt(1)&0x3f;
				return String.fromCharCode(cc); }
		);
	return strUni;
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
	








/**
* Cookie functions
* http://code.google.com/p/hunbook/wiki/JavaScriptCookieSnippets
*/




	cookie = {
		create: function(name, value, days) {
			if (days) {
				var date = new Date();
				date.setTime(date.getTime() + (days*24*60*60*1000));
				var expires = "; expires=" + date.toGMTString();
			}
			else var expires = "";
			document.cookie = name + "=" + encodeURI(value) + expires + "; "; //path=/; domain=jsgears.com";
		},
	 
		read: function(name) {
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for(var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') c = c.substring(1, c.length);
				if (c.indexOf(nameEQ) == 0) return decodeURI(c.substring(nameEQ.length, c.length));
			}
			return null;
		},
	 
		erase: function(name) {
			cookie.create(name, "", -1);
		}
	}



	/**
	* getDomain(s)
	* Extracts "valuable" part of domain name from URL.
	* Removes subdomains (www.) as well as top level domain (.com)
	* example: getDomain('http://www.google.com') = 'google'
	*/
	getDomain = function (s)
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

		// remove known tlds
		// list compiled from 
		// http://www.consortemarketing.com/2012/01/tld-complete-list-top-level-domains-domain-extensions/
		var tld = ['local','dev','ac','com.ac','edu.ac','gov.ac','net.ac','mil.ac','org.ac','ad','nom.ad','ae','net.ae','gov.ae','org.ae','mil.ae','sch.ae','ac.ae','pro.ae','name.ae','aero','af','gov.af','edu.af','net.af','com.af','ag','com.ag','org.ag','net.ag','co.ag','nom.ag','ai','off.ai','com.ai','net.ai','org.ai','al','gov.al','edu.al','org.al','com.al','net.al','uniti.al','tirana.al','soros.al','upt.al','inima.al','am','an','com.an','net.an','org.an','edu.an','ao','co.ao','ed.ao','gv.ao','it.ao','og.ao','pb.ao','aq','ar','com.ar','gov.ar','int.ar','mil.ar','net.ar','org.ar','arpa','e164.arpa','in-addr.arpa','iris.arpa','ip6.arpa','uri.arpa','urn.arpa','as','at','gv.at','ac.at','co.at','or.at','priv.at','au','asn.au','com.au','net.au','id.au','org.au','csiro.au','oz.au','info.au','conf.au','act.au','nsw.au','nt.au','qld.au','sa.au','tas.au','vic.au','wa.au','gov.au','and','edu.au','act','nsw','nt','qld','sa','tas','vic','wa','aw','com.aw','ax','az','com.az','net.az','int.az','gov.az','biz.az','org.az','edu.az','mil.az','pp.az','name.az','info.az','ba','bb','com.bb','edu.bb','gov.bb','net.bb','org.bb','bd','com.bd','edu.bd','net.bd','gov.bd','org.bd','mil.bd','be','ac.be','to.be','com.be','co.be','xa.be','ap.be','fgov.be','bf','gov.bf','bg','bh','bi','biz','bj','bm','com.bm','edu.bm','org.bm','gov.bm','net.bm','bn','com.bn','edu.bn','org.bn','net.bn','bo','com.bo','org.bo','net.bo','gov.bo','gob.bo','edu.bo','tv.bo','mil.bo','int.bo','br','agr.br','am.br','art.br','edu.br','com.br','coop.br','esp.br','far.br','fm.br','g12.br','gov.br','imb.br','ind.br','inf.br','mil.br','net.br','org.br','psi.br','rec.br','srv.br','tmp.br','tur.br','tv.br','etc.br','adm.br','adv.br','arq.br','ato.br','bio.br','bmd.br','cim.br','cng.br','cnt.br','ecn.br','eng.br','eti.br','fnd.br','fot.br','fst.br','ggf.br','jor.br','lel.br','mat.br','med.br','mus.br','not.br','ntr.br','odo.br','ppg.br','pro.br','psc.br','qsl.br','slg.br','trd.br','vet.br','zlg.br','dpn.br','nom.br','bs','com.bs','net.bs','org.bs','bt','com.bt','edu.bt','gov.bt','net.bt','org.bt','bv','bw','co.bw','org.bw','by','gov.by','mil.by','bz','ca','ab.ca','bc.ca','mb.ca','nb.ca','nf.ca','nl.ca','ns.ca','nt.ca','nu.ca','on.ca','pe.ca','qc.ca','sk.ca','yk.ca','cat','cc','co.cc','cd','com.cd','net.cd','org.cd','cf','cg','ch','com.ch','net.ch','org.ch','gov.ch','ci','ck','co.ck','cl','cm','cn','ac.cn','com.cn','edu.cn','gov.cn','net.cn','org.cn','ah.cn','bj.cn','cq.cn','fj.cn','gd.cn','gs.cn','gz.cn','gx.cn','ha.cn','hb.cn','he.cn','hi.cn','hl.cn','hn.cn','jl.cn','js.cn','jx.cn','ln.cn','nm.cn','nx.cn','qh.cn','sc.cn','sd.cn','sh.cn','sn.cn','sx.cn','tj.cn','xj.cn','xz.cn','yn.cn','zj.cn','co','com.co','edu.co','org.co','gov.co','mil.co','net.co','nom.co','com','coop','cr','ac.cr','co.cr','ed.cr','fi.cr','go.cr','or.cr','sa.cr','cu','com.cu','edu.cu','org.cu','net.cu','gov.cu','inf.cu','cv','cx','gov.cx','cy','com.cy','biz.cy','info.cy','ltd.cy','pro.cy','net.cy','org.cy','name.cy','tm.cy','ac.cy','ekloges.cy','press.cy','parliament.cy','cz','de','dj','dk','dm','com.dm','net.dm','org.dm','edu.dm','gov.dm','do','edu.do','gov.do','gob.do','com.do','org.do','sld.do','web.do','net.do','mil.do','art.do','dz','com.dz','org.dz','net.dz','gov.dz','edu.dz','asso.dz','pol.dz','art.dz','ec','com.ec','info.ec','net.ec','fin.ec','med.ec','pro.ec','org.ec','edu.ec','gov.ec','mil.ec','edu','ee','com.ee','org.ee','fie.ee','pri.ee','eg','eun.eg','edu.eg','sci.eg','gov.eg','com.eg','org.eg','net.eg','mil.eg','er','es','com.es','nom.es','org.es','gob.es','edu.es','et','com.et','gov.et','org.et','edu.et','net.et','biz.et','name.et','info.et','eu','fi','aland.fi','fj','biz.fj','com.fj','info.fj','name.fj','net.fj','org.fj','pro.fj','ac.fj','gov.fj','mil.fj','school.fj','fk','co.fk','org.fk','gov.fk','ac.fk','nom.fk','net.fk','fm','fo','fr','tm.fr','asso.fr','nom.fr','prd.fr','presse.fr','com.fr','gouv.fr','ga','gb','gd','ge','com.ge','edu.ge','gov.ge','org.ge','mil.ge','net.ge','pvt.ge','gf','gg','co.gg','net.gg','org.gg','gh','com.gh','edu.gh','gov.gh','org.gh','mil.gh','gi','com.gi','ltd.gi','gov.gi','mod.gi','edu.gi','org.gi','gl','gm','gn','com.gn','ac.gn','gov.gn','org.gn','net.gn','gov','"gp','com.gp,','net.gp,','edu.gp,','asso.gp,','or','org.gp"','gq','gr','com.gr','edu.gr','net.gr','org.gr','gov.gr','gs','gt','gu','gw','gy','hk','com.hk','edu.hk','gov.hk','idv.hk','net.hk','org.hk','hm','hn','com.hn','edu.hn','org.hn','net.hn','mil.hn','gob.hn','hr','iz.hr','from.hr','name.hr','com.hr','ht','com.ht','net.ht','firm.ht','shop.ht','info.ht','pro.ht','adult.ht','org.ht','art.ht','pol.ht','rel.ht','asso.ht','perso.ht','coop.ht','med.ht','edu.ht','gouv.ht','hu','co.hu','info.hu','org.hu','priv.hu','sport.hu','tm.hu','2000.hu','agrar.hu','bolt.hu','casino.hu','city.hu','erotica.hu','erotika.hu','film.hu','forum.hu','games.hu','hotel.hu','ingatlan.hu','jogasz.hu','konyvelo.hu','lakas.hu','media.hu','news.hu','reklam.hu','sex.hu','shop.hu','suli.hu','szex.hu','tozsde.hu','utazas.hu','video.hu','id','ac.id','co.id','or.id','go.id','ie','gov.ie','il','ac.il','co.il','org.il','net.il','k12.il','gov.il','muni.il','idf.il','im','co.im','ltd.co.im','plc.co.im','net.im','gov.im','org.im','nic.im','ac.im','in','co.in','firm.in','net.in','org.in','gen.in','ind.in','nic.in','ac.in','edu.in','res.in','gov.in','mil.in','info','int','europa.eu.int','io','iq','ir','ac.ir','co.ir','gov.ir','net.ir','org.ir','sch.ir','is','ac.is','org.is','it','gov.it','pisa.it','pontedera.pisa.it','je','co.je','net.je','org.je','jm','edu.jm','gov.jm','com.jm','net.jm','org.jm','jo','com.jo','org.jo','net.jo','edu.jo','gov.jo','mil.jo','jobs','jp','ac.jp','ad.jp','co.jp','ed.jp','go.jp','gr.jp','lg.jp','ne.jp','or.jp','hokkaido.jp','aomori.jp','iwate.jp','miyagi.jp','akita.jp','yamagata.jp','fukushima.jp','ibaraki.jp','tochigi.jp','gunma.jp','saitama.jp','chiba.jp','tokyo.jp','kanagawa.jp','niigata.jp','toyama.jp','ishikawa.jp','fukui.jp','yamanashi.jp','nagano.jp','gifu.jp','shizuoka.jp','aichi.jp','mie.jp','shiga.jp','kyoto.jp','osaka.jp','hyogo.jp','nara.jp','wakayama.jp','tottori.jp','shimane.jp','okayama.jp','hiroshima.jp','yamaguchi.jp','tokushima.jp','kagawa.jp','ehime.jp','kochi.jp','fukuoka.jp','saga.jp','nagasaki.jp','kumamoto.jp','oita.jp','miyazaki.jp','kagoshima.jp','okinawa.jp','sapporo.jp','sendai.jp','yokohama.jp','kawasaki.jp','nagoya.jp','kobe.jp','kitakyushu.jp','ke','kg','kh','per.kh','com.kh','edu.kh','gov.kh','mil.kh','net.kh','org.kh','ki','km','kn','kr','co.kr.kr','kw','com.kw','edu.kw','gov.kw','net.kw','org.kw','mil.kw','ky','edu.ky','gov.ky','com.ky','org.ky','net.ky','kz','org.kz','edu.kz','net.kz','gov.kz','mil.kz','com.kz','la','lb','net.lb','org.lb','gov.lb','edu.lb','com.lb','lc','com.lc','org.lc','edu.lc','gov.lc','li','com.li','net.li','org.li','gov.li','lk','gov.lk','sch.lk','net.lk','int.lk','com.lk','org.lk','edu.lk','ngo.lk','soc.lk','web.lk','ltd.lk','assn.lk','grp.lk','hotel.lk','lr','com.lr','edu.lr','gov.lr','org.lr','net.lr','ls','org.ls','co.ls','lt','gov.lt','mil.lt','lu','gov.lu','mil.lu','org.lu','net.lu','lv','com.lv','edu.lv','gov.lv','org.lv','mil.lv','id.lv','net.lv','asn.lv','conf.lv','ly','com.ly','net.ly','gov.ly','plc.ly','edu.ly','sch.ly','med.ly','org.ly','id.ly','ma','co.ma','net.ma','gov.ma','org.ma','mc','tm.mc','asso.mc','md','mg','org.mg','nom.mg','gov.mg','prd.mg','tm.mg','com.mg','edu.mg','mil.mg','mh','mil','army.mil','navy.mil','mk','com.mk','org.mk','ml','mm','mn','mo','com.mo','net.mo','org.mo','edu.mo','gov.mo','mobi','weather.mobi','music.mobi','mp','mq','mr','ms','mt','org.mt','com.mt','gov.mt','edu.mt','net.mt','mu','com.mu','co.mu','museum','mv','aero.mv','biz.mv','com.mv','coop.mv','edu.mv','gov.mv','info.mv','int.mv','mil.mv','museum.mv','name.mv','net.mv','org.mv','pro.mv','mw','ac.mw','co.mw','com.mw','coop.mw','edu.mw','gov.mw','int.mw','museum.mw','net.mw','org.mw','mx','com.mx','net.mx','org.mx','edu.mx','gob.mx','my','com.my','net.my','org.my','gov.my','edu.my','mil.my','name.my','mz','na','name','nc','ne','net','nf','ng','edu.ng','com.ng','gov.ng','org.ng','net.ng','ni','gob.ni','com.ni','edu.ni','org.ni','nom.ni','net.ni','nl','no','mil.no','stat.no','kommune.no','herad.no','priv.no','vgs.no','fhs.no','museum.no','fylkesbibl.no','folkebibl.no','idrett.no','np','com.np','org.np','edu.np','net.np','gov.np','mil.np','nr','gov.nr','edu.nr','biz.nr','info.nr','nr','org.nr','com.nr','net.nr','co.nr','nu','nz','ac.nz','co.nz','cri.nz','gen.nz','geek.nz','govt.nz','iwi.nz','maori.nz','mil.nz','net.nz','org.nz','school.nz','om','com.om','co.om','edu.om','ac.com','sch.om','gov.om','net.om','org.om','mil.om','museum.om','biz.om','pro.om','med.om','org','pa','com.pa','ac.pa','sld.pa','gob.pa','edu.pa','org.pa','net.pa','abo.pa','ing.pa','med.pa','nom.pa','pe','com.pe','org.pe','net.pe','edu.pe','mil.pe','gob.pe','nom.pe','pf','com.pf','org.pf','edu.pf','pg','com.pg','net.pg','ph','com.ph','gov.ph','pk','com.pk','net.pk','edu.pk','org.pk','fam.pk','biz.pk','web.pk','gov.pk','gob.pk','gok.pk','gon.pk','gop.pk','gos.pk','pl','com.pl','biz.pl','net.pl','art.pl','edu.pl','org.pl','ngo.pl','gov.pl','info.pl','mil.plæ','waw.pl','warszawa.pl','wroc.pl','wroclaw.pl','krakow.pl','poznan.pl','lodz.pl','gda.pl','gdansk.pl','slupsk.pl','szczecin.pl','lublin.pl','bialystok.pl','olsztyn.pl.torun.pl','pm','pn','pr','biz.pr','com.pr','edu.pr','gov.pr','info.pr','isla.pr','name.pr','net.pr','org.pr','pro.pr','pro','law.pro','med.pro','cpa.pro','ps','edu.ps','gov.ps','sec.ps','plo.ps','com.ps','org.ps','net.ps','pt','com.pt','edu.pt','gov.pt','int.pt','net.pt','nome.pt','org.pt','publ.pt','pw','py','net.py','org.py','gov.py','edu.py','com.py','qa','re','ro','com.ro','org.ro','tm.ro','nt.ro','nom.ro','info.ro','rec.ro','arts.ro','firm.ro','store.ro','www.ro','ru','com.ru','net.ru','org.ru','pp.ru','msk.ru','int.ru','ac.ru','rw','gov.rw','net.rw','edu.rw','ac.rw','com.rw','co.rw','int.rw','mil.rw','gouv.rw','sa','com.sa','edu.sa','sch.sa','med.sa','gov.sa','net.sa','org.sa','pub.sa','sb','com.sb','gov.sb','net.sb','edu.sb','sc','com.sc','gov.sc','net.sc','org.sc','edu.sc','sd','com.sd','net.sd','org.sd','edu.sd','med.sd','tv.sd','gov.sd','info.sd','se','org.se','pp.se','tm.se','brand.se','parti.se','press.se','komforb.se','kommunalforbund.se','komvux.se','lanarb.se','lanbib.se','naturbruksgymn.se','sshn.se','fhv.se','fhsk.se','fh.se','mil.se','ab.se','c.se','d.se','e.se','f.se','g.se','h.se','i.se','k.se','m.se','n.se','o.se','s.se','t.se','u.se','w.se','x.se','y.se','z.se','ac.se','bd.se','sg','com.sg','net.sg','org.sg','gov.sg','edu.sg','per.sg','idn.sg','sh','si','sj','sk','sl','sm','sn','so','sr','rs.sr','st','su','sv','edu.sv','com.sv','gob.sv','org.sv','red.sv','sy','gov.sy','com.sy','net.sy','sz','tc','td','tf','tg','th','ac.th','co.th','in.th','go.th','mi.th','or.th','net.th','tj','ac.tj','biz.tj','com.tj','co.tj','edu.tj','int.tj','name.tj','net.tj','org.tj','web.tj','gov.tj','go.tj','mil.tj','tk','tl','tm','tn','com.tn','intl.tn','gov.tn','org.tn','ind.tn','nat.tn','tourism.tn','info.tn','ens.tn','fin.tn','net.tn','to','gov.to','tp','gov.tp','tr','com.tr','info.tr','biz.tr','net.tr','org.tr','web.tr','gen.tr','av.tr','dr.tr','bbs.tr','name.tr','tel.tr','gov.tr','bel.tr','pol.tr','mil.tr','k12.tr','edu.tr','bel.tr','travel','tt','co.tt','com.tt','org.tt','net.tt','biz.tt','info.tt','pro.tt','name.tt','edu.tt','gov.tt','us.tt','tv','gov.tv','tw','edu.tw','gov.tw','mil.tw','com.tw','net.tw','org.tw','idv.tw','game.tw','ebiz.tw','club.tw','tz','co.tz','ac.tz','go.tz','or.tz','ne.tz','ua','com.ua','gov.ua','net.ua','edu.ua','org.ua','cherkassy.ua','ck.ua','chernigov.ua','cn.ua','chernovtsy.ua','cv.ua','crimea.ua','dnepropetrovsk.ua','dp.ua','donetsk.ua','dn.ua','ivano-frankivsk.ua','if.ua','kharkov.ua','kh.ua','kherson.ua','ks.ua','khmelnitskiy.ua','km.ua','kiev.ua','kv.ua','kirovograd.ua','kr.ua','lugansk.ua','lg.ua','lutsk.ua','lviv.ua','nikolaev.ua','mk.ua','odessa.ua','od.ua','poltava.ua','pl.ua','rovno.ua','rv.ua','sebastopol.ua','sumy.ua','ternopil.ua','te.ua','uzhgorod.ua','vinnica.ua','vn.ua','zaporizhzhe.ua','zp.ua','zhitomir.ua','zt.ua','ug','co.ug','ac.ug','sc.ug','go.ug','ne.ug','or.ug','uk','ac.uk','co.uk','gov.uk','ltd.uk','me.uk','mil.uk','mod.uk','net.uk','nic.uk','nhs.uk','org.uk','plc.uk','police.uk','sch.uk','bl.uk','british-library.uk','icnet.uk','jet.uk','nel.uk','nls.uk','national-library-scotland.uk','parliament.uk','um','us','ak.us','al.us','ar.us','az.us','ca.us','co.us','ct.us','dc.us','de.us','dni.us','fed.us','fl.us','ga.us','hi.us','ia.us','id.us','il.us','in.us','isa.us','kids.us','ks.us','ky.us','la.us','ma.us','md.us','me.us','mi.us','mn.us','mo.us','ms.us','mt.us','nc.us','nd.us','ne.us','nh.us','nj.us','nm.us','nsn.us','nv.us','ny.us','oh.us','ok.us','or.us','pa.us','ri.us','sc.us','sd.us','tn.us','tx.us','ut.us','vt.us','va.us','wa.us','wi.us','wv.us','wy.us','k12.us','pvt.k12.us','cc.us','tec.us','lib.us','state.us','gen.us','uy','edu.uy','gub.uy','org.uy','com.uy','net.uy','mil.uy','uz','va','vatican.va','vc','ve','com.ve','net.ve','org.ve','info.ve','co.ve','web.ve','vg','vi','com.vi','org.vi','edu.vi','gov.vi','vn','com.vn','net.vn','org.vn','edu.vn','gov.vn','int.vn','ac.vn','biz.vn','info.vn','name.vn','pro.vn','health.vn','vu','wf','ws','ye','com.ye','net.ye','yt','yu','ac.yu','co.yu','org.yu','edu.yu','za','ac.za','city.za','co.za','edu.za','gov.za','law.za','mil.za','nom.za','org.za','school.za','alt.za','net.za','ngo.za','tm.za','web.za','zm','co.zm','org.zm','gov.zm','sch.zm','ac.zm','zw','co.zw','org.zw','gov.zw','ac.zw','me'];
		var r_length = r.length;

		var matches = [];

		// find all TLDs that matches the end of string
		// f.e. .uk, .co.uk
		for (var i=0, l=tld.length; i < l; i++)
		{   
			var maybe = r.substr(-1 - tld[i].length);
			if( maybe === '.'+tld[i] )
			{
				matches.push(tld[i]);
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

		}
	




	/**
	* generatePassword: form submit handler
	* Reads form values and generates password using TEA encryption functions
	* 
	*/
	generatePassword = function(e) 
	{
			if (e.preventDefault) e.preventDefault();

		// read pass & length from inputs
		var pass=document.getElementById('pass').value;
		var len=parseInt(document.getElementById('len').value) || 12;
		
		// read & parse domain
		var domain=getDomain(document.getElementById('domain').value);
		document.getElementById('domain').value=domain;

		// clear password input
		document.getElementById('pass').value='';
		
		var encrypted = pass+domain;

		// 10x tea encryption
		for (var i=1; i<10; i++)
		{
			encrypted = Tea.encrypt(encrypted, encrypted);
		}     
		// apply length
		encrypted = encrypted.slice(0, len);
		document.getElementById('result').value = encrypted;
		document.getElementById('result').focus();
		document.getElementById('result').select();


		// if run from chrome extension - fill focused input on current page
		if (typeof chrome != 'undefined' && typeof chrome.tabs != 'undefined')
		{
			chrome.tabs.executeScript(null,
			{code:"if (typeof document.activeElement.value != 'undefined') {document.activeElement.value = '"+encrypted+"'}"});
		}


		// if run from safari extension - send password to injected script
		if (typeof safari != 'undefined' && typeof safari.application != 'undefined')
		{
			safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("vpassFill", encrypted);
		}


		// save length
		cookie.create('len', len, 365);

		return false;
	}


	// attach "generatePassword" function to for submit event
	form = document.getElementById('form');
	try {
			form.addEventListener("submit", generatePassword, false);
	} catch(e) {
			form.attachEvent("onsubmit", generatePassword); //Internet Explorer 8-
	}


	// preload "url" from query string
	// f.e. https://www.vpass.info/1/?http://www.google.com (url = google)
	url = window.location.search.substring(1);
	if (url.length)
	{
		document.getElementById('domain').value = getDomain(url);
	}

	// if run from chrome extension - preload "url" from selected tab
	if (typeof chrome != 'undefined' && typeof chrome.tabs != 'undefined')
	{
		chrome.tabs.getSelected(null, function(tab) {
			document.getElementById('domain').value = getDomain(tab.url);
		});

	}

	// if run from safari extension - preload "url" from selected tab
	if (typeof safari != 'undefined' && typeof safari.application != 'undefined')
	{
		safari.application.addEventListener("popover", function(){
			url = safari.application.activeBrowserWindow.activeTab.url;
			document.getElementById('domain').value = getDomain(url);
		}, true);
	}

	// preload "len" from cookie
	if (cookie.read("len"))
	{
		document.getElementById('len').value = cookie.read("len");
	}

	// toggle(id): show or hide DOM element "id"
	function toggle(id)
	{
		var el = document.getElementById(id);
		el.style.display = (el.style.display != 'none' ? 'none' : '' );
		return false;
	}

	
	// toggle password visibility
	function toggle_password_visibility()
	{
		var mode = document.getElementById('pass').getAttribute('type') == 'password' ? 'text':'password';
		document.getElementById('pass').setAttribute('type', mode);
		document.getElementById('t_master_password_show_hide').innerHTML = (mode == 'password' ? tr[lang].t_show : tr[lang].t_hide);
		document.getElementById('pass').focus();
	}


	// links
	document.getElementById('t_what_why').onclick = function(){ window.location="https://www.vpass.info/1/about/"; };
	document.getElementById('lang_box_link').onclick = function(){ toggle('lang_box'); };
	document.getElementById('lang_en_link').onclick = function(){ setLang('en'); };
	document.getElementById('lang_ru_link').onclick = function(){ setLang('ru'); };
	document.getElementById('lang_de_link').onclick = function(){ setLang('de'); };
	document.getElementById('t_master_password_show_hide').onclick = function(){ toggle_password_visibility(); };


	// ugly hack to make external link work in safari extension
	if (typeof safari != 'undefined' && typeof safari.application != 'undefined')
	{
		document.getElementById('t_what_why').onclick = function()
				{ 
						var newTab = safari.self.browserWindow.openTab(); 
						newTab.url = document.getElementById('t_what_why').href;
				};
	}

	/**
	* translations
	*
	* setLang: replace text on webpage with translations
	*/
	function setLang(l)
	{
		document.getElementById("t_master_password").innerHTML = tr[l].t_master_password;
		document.getElementById("t_master_password_show_hide").innerHTML = tr[l].t_show;
		document.getElementById("t_domain_username").innerHTML = tr[l].t_domain_username;
		document.getElementById("t_length").innerHTML = tr[l].t_length;
		document.getElementById("t_what_why").innerHTML = tr[l].t_what_why;
		document.getElementById("lang_box").style.display = 'none';
		cookie.create('lang', l, 365);
		return false;
	}

	// read language from cookie (default = en)
	var lang = 'en';
	if (cookie.read("lang"))
	{
		lang = cookie.read("lang");
	}


	// translations
	var tr = {};
	tr.en = {
	"t_master_password" : "master password",
	"t_domain_username" : "domain or&nbsp;username",
	"t_length" : "Length",
	"t_what_why" : "What is&nbsp;vPass and why use it?",
	"t_show" : "show",
	"t_hide" : "hide"
	};
	tr.ru = {
	"t_master_password" : "мастер-пароль",
	"t_domain_username" : "домен или имя",
	"t_length" : "Длина",
	"t_what_why" : "Что такое vPass?",
	"t_show" : "показать",
	"t_hide" : "спрятать"
	};
	tr.de = {
	"t_master_password" : "master-passwort",
	"t_domain_username" : "domain oder benutzername",
	"t_length" : "Länge",
	"t_what_why" : "Was ist vpass und warum sollte man es&nbsp;nutzen?",
	"t_show" : "anzeigen",
	"t_hide" : "verbergen"
	};
	// apply translations
	if (lang != 'en')
	{
		setLang(lang);
	}



	// set form focus @ "pass" input field
	document.getElementById('pass').focus();



	// fix safari extension - reload window on blur
	if (typeof safari != 'undefined' && typeof safari.application != 'undefined')
	{
		window.onblur = function() {
			window.location.reload();
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
					window.location.reload();
				} else {
					// Manifest didn't change. Nothing new to server.
				}
			}, false);

		}, false);
	}