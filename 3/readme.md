## vPass is a web-based generator of secure passwords.

* You really should have different passwords for web sites.
* Remembering unique password for each web site is impossible.
* Password managers are usually restricted to one platform.

vPass takes your master password (f.e. `my_password`) and, optionally, current domain (f.e. `http://accounts.google.com` converts into `google`) and generates 12-letter mix of letters, numbers and symbols (f.e. `0EQu$MwEm?Qt`). [Watch 30 seconds video demo](http://www.youtube.com/watch?v=Wv8fapdiPCY).

Now you can create unique secure password for any website, and you only have to remember one master password.

**Your master password never leaves your device.** vPass is 100% client-side, pure Javascript, no data is sent to server. It's just a webpage, so it works on Windows, Mac OS X, Linux, Android, iOS, Windows Phone, webOS, and any future OS too.

* [View in browser](https://www.vpass.info/3/vpass.html)
* [Download Google Chrome extension](https://chrome.google.com/webstore/detail/vpass-3/pehjnflghgdahphhhgnidfhinhffckii)
* [Download Safari extension](https://www.vpass.info/3/e-safari/vpass.safariextz)
* [Download Opera extension](https://www.vpass.info/3/e-opera/vpass.oex)
* [Download Firefox extension](https://www.vpass.info/3/e-firefox/vpass.xpi)
* [Source code @ Github](https://github.com/vladstudio/vpass2)

**Bookmarklet**  
Drag this link → <a href="javascript:(function()
{ window.open('https://www.vpass.info?'+document.URL, 'vPass') })();">vPass</a> ← into your browser's bookmarks bar (below address bar). You might need to turn it  on from Bookmarks menu. *Not for mobile browsers.*

**Use on iPhone/iPad**  
Open [vPass](https://www.vpass.info/3/vpass.html) in your mobile browser, tap "Share" button, tap "Add to Home screen".

**Use on Android**  
Open [vPass](https://www.vpass.info/3/vpass.html) in your mobile browser, add it  to bookmarks, open bookmarks, tap and hold vpass.info, tap "Add to Home screen".

**Download and self-host**  
Download vPass for backup, even if you do not plan to use it locally. Right-click and save as: [vpass.zip](https://www.vpass.info/3/vpass.zip).

----

Experimental - mobile bookmarklet → <a href="#javascript:(function()
{ window.open('https://www.vpass.info?'+document.URL, 'vPass') })();">vPass</a> ←


----

* When you use a browser extension or a bookmarklet, "domain" is pre-filled from a currently opened URL.
* Type your master password and hit `Enter` to generate unique password.
* Hit `Ctrl(Cmd,Alt) + Enter` to show/hide master password (to avoid typos).
* Chrome and Safari extensions will fill an input field on your web page automatically, if you focus on it before opening vPass.

----
**Why use vPass, not LastPass/KeePass/1Password/RoboForm/etc?**  
I tried them all, honestly. LastPass was the best, but still far from perfect. vPass is not perfect too - it reflects my vision. I encourage you to give it  a try.

**Why bother with secure passwords at all?**  

* [Lifehacker - How I’d Hack Your Weak Passwords](http://lifehacker.com/5505400/how-id-hack-your-weak-passwords)
* [Weak Passwords = Hacker Heaven](http://www.enterprisewizard.com/blog/weak-passwords-hacker-heaven/)
* [The top 10 passwords from the Yahoo hack: Is yours one of them?](http://www.zdnet.com/the-top-10-passwords-from-the-yahoo-hack-is-yours-one-of-them-7000000815/)

**How safe is vPass?**  
It's as safe as your master password. And because vPass is not so popular, no one will guess you use it.

**How do  I come up with strong master password?**  

* [Tips for creating a strong password](http://windows.microsoft.com/en-us/windows-vista/Tips-for-creating-a-strong-password)
* [10 Tips for Creating Secure Passwords](http://www.productivity501.com/10-tips-for-creating-secure-passwords/253/)
* [Lifehacker - Use This Infographic to Pick a Good, Strong Password](http://lifehacker.com/5876541/use-this-infographic-to-pick-a-good-strong-password)
* [Google - Choosing a smart password](http://support.google.com/accounts/bin/answer.py?hl=en&answer=32040)

**What happens if vPass.info is down?**  
You should save [a local copy of vPass](https://www.vpass.info/3/vpass.zip) right now, just in case. As for the server, there are no access logs, and as  I mentioned, no data is transmitted from you.

----
I am Vlad Gerasimov. You can find out more about me  at [Vladstudio.com](http://www.vladstudio.com/).  
Please send your comments, compliments and complaints to [vladstudio@gmail.com](mailto:vladstudio@gmail.com).

vPass has been inspired by [SuperGenPass](http://supergenpass.com/).

----

*For users who need to keep using vPass v.1, it's here - <https://www.vpass.info/1/>. I recommend switching to v.3 although it means changing all your password (which is actually a good idea from time to time). The v.1 generator did not validate for including most required types of characters (lowercase, uppercase, digits, special), which caused problems on some sites.*