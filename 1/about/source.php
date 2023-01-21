<?php 

// use this script from terminal:
// php source.php > index.html
// php source.php ru > ru.html
// php source.php de > de.html

// translate string by key
function t($key)
{
	GLOBAL $translations, $lang;
	
	$ret = '';
	// get string from specified language
	$ret = $translations[$lang][$key];
	if ($ret == '')
	{
		// or from english
		$ret = $translations['en'][$key];
	}
	if ($ret == '')
	{
		// or return key itself
		$ret = $key;
	}
	$ret = stripslashes($ret);

	// replace %X with optional arguments
	$args = func_get_args();
	unset($args[0]);
	if (count($args) > 0) 
	{
		$i=0;
		foreach ($args as $arg)
		{
			$i++;
			$ret = str_replace('%'.$i, $arg, $ret);
		}
	}
	return $ret;
}










$lang = $argv[1];
if ($lang=='')
{
	$lang = 'en';
}

$translations['en'] = require 'translations/en.php';
$translations[$lang] = require 'translations/'.$lang.'.php';


 ?>
 <html>
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8">
	<meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="format-detection" content="telephone=no">

	<title><?= t('slogan') ?></title>

	<!-- 57x57 icon -->
	<link rel="apple-touch-icon-precomposed" href="../icon/png/icon-57x57.png" />
	<!-- 32x32 icon -->
	<link href="../icon/png/icon-32x32.png" rel="icon" type="image/x-icon" />

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
	<link rel="stylesheet" href="css.css">
</head>
<body>
	<div id="container">
		<br>
		<p class="center"><a href="https://www.vpass.info/"><img src="../icon/png/icon-57x57.png" height="57" width="57" alt="vPass logo"></a></p>
		<h2 class="center"><?= t('slogan') ?></h2>

		<p class="center light">
			<a href="https://www.vpass.info/about/">English</a>
			&middot;
			<a href="https://www.vpass.info/about/ru.html">Русский</a>
			&middot;
			<a href="https://www.vpass.info/about/de.html">Deutsch</a>
		</p>

		<ul id="menu">
			<li><a href="#what" class="nav selected"><?= t('nav_what') ?></a></li>
			<li><a href="#why"><?= t('nav_why') ?></a></li>
			<li><a href="#how"><?= t('nav_how') ?></a></li>
			<li><a href="#use"><?= t('nav_use') ?></a></li>
			<li><a href="#get"><?= t('nav_get') ?></a></li>
			<li><a href="#faq"><?= t('nav_faq') ?></a></li>
			<li><a href="#misc"><?= t('nav_misc') ?></a></li>

		</ul>

		<div id="content">


			<div id="what" class="section">
				<h3><?= t('nav_what') ?></h3>	

				<p class="video-container"><iframe width="480" height="360" src="https://www.youtube.com/embed/FGwDFb6Y2zY" frameborder="0" allowfullscreen></iframe></p>

				<p><?= t('what_webapp') ?></p>

				<ul>
					<li><?= t('what_pain1') ?></li>
					<li><?= t('what_pain2') ?></li>
					<li><?= t('what_pain3') ?></li>
				</ul>

				<p>
					<?= t('what_sgp', '<a href="http://supergenpass.com/faq/">', '</a>') ?>
				</p>

				<p class="inline_nav">
					<a href="#why"><?= t('nav_why') ?> &rarr;</a>
				</p>
			</div><!-- /what -->


			<div id="why" class="section hide">
				<h3><?= t('nav_why') ?></h3>
				<ul>
					<li><p>
						<b><?= t('why_one1') ?></b><br>
						<?= t('why_one2', '<a href="#how" class="nav">', '</a>') ?>
					</p></li>
					<li><p>
						<b><?= t('why_secure1') ?></b><br>
						<?= t('why_secure2') ?>
					</p></li>
					<li><p>
						<b><?= t('why_key1') ?></b><br>
						<?= t('why_key2') ?>
					</p></li>
					<li><p>
						<b><?= t('why_client1') ?></b><br>
						<?= t('why_client2', '<a href="#get" class="nav">', '</a>') ?>
					</p></li>
					<li><p>
						<b><?= t('why_web1') ?></b><br>
						<?= t('why_web2') ?>
					</p></li>
					<li><p>
						<b><?= t('why_any1') ?></b><br>
						<?= t('why_any2') ?>
					</p></li>
				</ul>

				<p class="inline_nav">
					<a href="#what">&larr; <?= t('nav_what') ?></a>
					&nbsp;&middot;&nbsp;
					<a href="#how"><?= t('nav_how') ?> &rarr;</a>
				</p>

			</div><!-- /why -->




			<div id="how" class="section hide">
				<h3><?= t('nav_how') ?></h3>
	
				<p><?= t('how_param') ?></p>
	
				<p><?= t('how_convert') ?></p>

				<p class="inline_nav">
					<a href="#why">&larr; <?= t('nav_why') ?></a>
					&nbsp;&middot;&nbsp;
					<a href="#use"><?= t('nav_use') ?> &rarr;</a>
				</p>
			</div><!-- /how -->


			<div id="use" class="section hide">
				<h3><?= t('nav_use') ?></h3>

				<ul>
					<li><?= t('use_memo') ?></li>
					<li><?= t('use_signup') ?></li>
					<li><?= t('use_signin') ?></li>
				</ul>
				<p><?= t('use_existing') ?></p>
				<p><?= t('use_length') ?></p>

				<p class="inline_nav">
					<a href="#how">&larr; <?= t('nav_how') ?></a>
					&nbsp;&middot;&nbsp;
					<a href="#get"><?= t('nav_get') ?> &rarr;</a>
				</p>

			</div>



			<div id="get" class="section hide">
				<h3><?= t('nav_get') ?></h3>
				<ul>
					<li><p>
						<a href="https://www.vpass.info/"><b><?= t('get_view') ?></b></a>
					</p></li>
					<li><p>
						<a href="https://chrome.google.com/webstore/detail/vpass/abadcojegfgglajifpanpaccmmiefoid"><b><?= t('get_chrome') ?></b></a>						
					</p></li>
					<li><p>
						<a href="https://www.vpass.info/safari-extension/vpass.safariextz"><b><?= t('get_safari') ?></b></a>
					</p></li>
					<li><p>
						<a href="https://www.vpass.info/opera-extension/vpass.oex"><b><?= t('get_opera') ?></b></a>
					</p></li>
					<li><p>
						<b><?= t('get_bookm') ?></b><br>
						<?= t('get_bookm_howto', "&rarr; <a href=\"javascript:(function(){ window.open('https://www.vpass.info?'+document.URL, 'vPass') })();\">vPass</a> &larr;") ?>
					</p></li>
					<li><p>
						<b><?= t('get_ios') ?></b><br>
						<?= t('get_ios_howto', '<a href="https://www.vpass.info">', '</a>') ?>
					</p></li>
					<li><p>
						<b><?= t('get_android') ?></b><br>
						<?= t('get_android_howto', '<a href="https://www.vpass.info">', '</a>') ?>
					</p></li>
					<li><p>
						<b><?= t('get_selfhost') ?></b><br>
						<?= t('get_selfhost_howto', '<a href="https://www.vpass.info/vpass.zip">vpass.zip</a>') ?>
					</p></li>
				</ul>

				<p class="inline_nav">
					<a href="#use">&larr; <?= t('nav_use') ?></a>
					&nbsp;&middot;&nbsp;
					<a href="#faq"><?= t('nav_faq') ?> &rarr;</a>
				</p>

			</div><!-- /get -->




			<div id="faq" class="section hide">
				<h3><?= t('nav_faq') ?></h3>
				<ul>
					<li><p>
						<b><?= t('faq_whynot_q') ?></b><br>
						<?= t('faq_whynot_a') ?>
					</p></li>
	
					<li><p>
						<b><?= t('faq_bother_q') ?></b><br>
						<ul>
							<li><a href="http://lifehacker.com/5505400/how-id-hack-your-weak-passwords">Lifehacker - How I’d Hack Your Weak Passwords</a></li>
							<li><a href="http://www.enterprisewizard.com/blog/weak-passwords-hacker-heaven/">Weak Passwords = Hacker Heaven</a></li>
							<li><a href="http://www.zdnet.com/the-top-10-passwords-from-the-yahoo-hack-is-yours-one-of-them-7000000815/">The top 10 passwords from the Yahoo hack: Is yours one of them?</a></li>
						</ul>
					</p></li>
					<li><p>
						<b><?= t('faq_safe_q') ?></b><br>
						<?= t('faq_safe_a') ?>
					</p></li>
					<li><p>
						<b><?= t('faq_web_q') ?></b><br>
						<?= t('faq_web_a', '<a href="#get" class="nav">', '</a>') ?>
					</p></li>
					<li><p>
						<b><?= t('faq_sub_q') ?></b><br>
						<?= t('faq_sub_a') ?>
					</p></li>
					<li><p>
						<b><?= t('faq_master_q') ?></b><br>
						<ul>
							<li><a href="http://windows.microsoft.com/en-us/windows-vista/Tips-for-creating-a-strong-password">Tips for creating a strong password</a></li>
							<li><a href="http://www.productivity501.com/10-tips-for-creating-secure-passwords/253/">10 Tips for Creating Secure Passwords</a></li>
							<li><a href="http://lifehacker.com/5876541/use-this-infographic-to-pick-a-good-strong-password">Lifehacker - Use This Infographic to Pick a Good, Strong Password</a></li>
							<li><a href="http://support.google.com/accounts/bin/answer.py?hl=en&answer=32040">Google - Choosing a smart password</a></li>
						</ul>
					</p></li>
					<li><p>
						<b><?= t('faq_down_q') ?></b><br>
						<?= t('faq_down_a', '<a href="#get" class="nav">', '</a>') ?>
					</p></li>		
				</ul>

				<p class="inline_nav">
					<a href="#get">&larr; <?= t('nav_get') ?></a>
					&nbsp;&middot;&nbsp;
					<a href="#misc"><?= t('nav_misc') ?> &rarr;</a>
				</p>

			</div>



			<div id="misc" class="section hide">
				<ul>
					<li><p>
						<b><?= t('misc_terms') ?></b><br>
						<?= t('misc_terms_text') ?>
					</p></li>
					<li><p>
						<b><?= t('misc_feedback') ?></b><br>
						<?= t('misc_userecho', '<a href="https://www.vpass.userecho.com/">', '</a>') ?>
					</p></li>
					<li><p>
						<b><?= t('misc_contact') ?></b><br>
						<?= t('misc_email', '<a href="mailto:vladstudio@gmail.com">vladstudio@gmail.com</a>') ?>
					</p></li>
					<li><p>
						<b><?= t('misc_translate') ?></b><br>
						<?= t('misc_translate_text', '<a href="http://www.s25n.com/account/signup/VHBe4soedpAz9S18AurKnoUZdMLEla0R">', '</a>') ?>
					</li>
					<li><p>
						<b><?= t('misc_ack') ?></b><br>
						<?= t('misc_ack_text', '<a href="http://supergenpass.com">', '</a>', '<a href="http://www.movable-type.co.uk">', '</a>') ?>
					</p></li>
					<li><p>
						<b><?= t('misc_about') ?></b><br>
						<?= t('misc_vlad', '<a href="http://www.vladstudio.com">', '</a>') ?>
					</p></li>
				</ul>

				<p class="inline_nav">
					<a href="#faq">&larr; <?= t('nav_faq') ?></a>
				</p>

			</div><!-- /misc -->

			<hr>
			<p class="center">
				<form action="https://www.vsender.info/subscribe/" target="_blank">
					<p><label for="vsender_email"><?= t('your-email') ?> <input type="text" name="email" id="vsender_email"></label></p>
					<p><input type="submit" value="<?= t('subscribe') ?>"></p>
					<input type="hidden" name="sublist_token" value="oLjJypJFhE4DNp8crawbmjfFQ1dPdcdsNm2bCBHK6BeJRcM9d9bpjgW08ZFc2JuF">
				</form>
			</p>
		</div><!-- /content -->


</div><!-- /container -->

<script type="text/javascript" src="js.js"></script>
</body>
</html>
