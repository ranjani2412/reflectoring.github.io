$( document ).ready(function() {

    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }

    function showAdPopup(){
      let cookie = getCookie("launchdarkly");
      if(cookie == null){
         $.fn.cornerpopup({
            delay: 30000,
            variant: 10,
            slide: 1,
            iconColor: "#000000",
            header: "",
            width: "624px",
            content: "<a href=\"https://launchdarkly.com/?utm_source=reflectoring&utm_medium=display&utm_campaign=aodm&utm_content=ebook_oreilly_efm\"><img width=\"600\" alt=\"LaunchDarkly\" src=\"/assets/img/launchdarkly/2022_popout.jpg\"/></a>",
            afterPopup: function() {
              setCookie("launchdarkly", "true", 7);
            }
         });
      }
    }

    function showCookieConsentPopup(){
      let cookie = getCookie("cookieconsent");
      if(cookie == null){
        $.fn.cornerpopup({
            variant: 10,
            slide: 1,
            iconColor: "#000000",
            header: "",
            width: "300px",
            content: "By browsing this site you agree to our and our partners' use of cookies to process your data. For more information please check out the <a href=\"/privacy\">Privacy Policy</a>.",
            afterPopup: function() {
              setCookie("cookieconsent", "true", 9999);
              showAdPopup();
            }
        });
      } else {
        showAdPopup();
      }
    }

    showCookieConsentPopup();

});
