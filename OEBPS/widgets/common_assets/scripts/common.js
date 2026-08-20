/* Version 19.1, Date:31 MAR 2022 */
/* Version 19.2, Date:04 APR 2022 */
/*** Disable Right click on image ***/
var allImageElmts = document.querySelectorAll("img");
allImageElmts.forEach(imgelement => {
	imgelement.addEventListener("contextmenu", function (event) {
		event.preventDefault();
		return false;
	});
});
document.addEventListener("contextmenu", function (e) {
	e.preventDefault();
}, false);
/*** End Disable right click ***/

/*** Annotation from Question to top ***/
function annotate_from_frame(elementId) {
	if (elementId.startsWith("#")) {
		elementId = elementId.substring(1, elementId.length);
	}
	const element = document.getElementById(elementId);
	if (element != null) {
		document.location.hash = "#"
		document.location.hash = "#" + elementId;
	}
}
/*** End from_frame Annotation ***/

/*** Annotate within iframe ***/
window.addEventListener("load", function (event) {
	var frameid = document.location.hash;
	/*var logdiv = document.getElementById("logh2")
	if(logdiv!=null){
		logdiv.innerText = frameid;
	}*/
	if (frameid != undefined && frameid != null && frameid != "") {
		if(frameid.indexOf("frameid~~")>0){
			var localhash = frameid.replace("frameid~~","");
			/*if(logdiv!=null){
				logdiv.innerText = frameid + ":NM:" + localhash;
			}*/
			var hashval = localhash.split("~~")[0];
			var qno = localhash.split("~~")[1];
			const element11 = document.querySelector(hashval);
			/*if(logdiv!=null){
				logdiv.innerText = frameid + ":NM:" + localhash + ":NM:" + hashval;
			}*/
			if (element11 != null) {
				//document.location.hash = "#"
				document.location.hash = hashval;
				if (qno != undefined && qno != null && qno != "") {
					element11.contentDocument.querySelector(".nav-link.step[data-id='q-" + qno + "']").click()
				}
			}
		}
	}
});

function getParameterByName(name, url = document.location.href) {
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var allhrefs = document.querySelectorAll("a[itemid][itemref][href]");
allhrefs.forEach(hrefelm => {
	if (typeof window.addEventListener != "undefined") {
		hrefelm.addEventListener("click", handle_frame_target_click, false);
	} else {
		hrefelm.attachEvent("onclick", handle_frame_target_click);
	}
});
function handle_frame_target_click(event) {
	//debugger
	event.preventDefault();
	var frameid = event.target.getAttribute("itemid");
	var questionnumber = event.target.getAttribute("itemref");
	var hreflink = event.target.getAttribute("href");
	if (hreflink.startsWith("#")) {
		const element = document.getElementById(frameid);
		if (element != null) {
			document.location.hash = "#"
			document.location.hash = "#" + frameid;
			if (questionnumber != undefined && questionnumber != null && questionnumber != "") {
				element.contentDocument.querySelector(".nav-link.step[data-id='q-" + questionnumber + "']").click()
			}
		}
	}
	/*
	else {
		var url = document.location.pathname;
		var filename = url.substring(url.lastIndexOf('/') + 1);
		if (filename != "") {
			url = url.replace(filename, hreflink);
			url = url + "?frameid=" + frameid + "&questionnumber=" + questionnumber;
			document.location.href = url;
		}
	}
	*/
}
/*** End within iframe Annotation ***/


var allvideoelemts = document.querySelectorAll("video.hls-video");
      allvideoelemts.forEach(videoelm => {
        //var video = document.getElementById('video');
        var videoSrc = videoelm.src;
        if (Hls.isSupported()) {
          var hls = new Hls({
            debug: true,
          });
          hls.loadSource(videoSrc);
          hls.attachMedia(videoelm);
          hls.on(Hls.Events.MEDIA_ATTACHED, function () {
            videoelm.muted = true;
            //videoelm.play();
          });
        }
        // hls.js is not supported on platforms that do not have Media Source Extensions (MSE) enabled.
        // When the browser has built-in HLS support (check using `canPlayType`), we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video element through the `src` property.
        // This is using the built-in support of the plain video element, without using hls.js.
        else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          videoelm.src = videoSrc;
          videoelm.addEventListener('canplay', function () {
            //videoelm.play();
          });
        }
      });

/*** Announce iframe loading / loaded status to screen readers ***/
(function () {
	var hiddenStatusStyle = "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0;";

	function getOrCreateStatus(holder) {
		var existing = holder.querySelector(".iframe-load-status");
		if (existing) {
			return existing;
		}
		var status = document.createElement("div");
		status.className = "iframe-load-status";
		status.setAttribute("role", "status");
		status.setAttribute("aria-live", "polite");
		status.setAttribute("aria-atomic", "true");
		status.setAttribute("style", hiddenStatusStyle);
		holder.insertBefore(status, holder.firstChild);
		return status;
	}

	function announce(statusEl, message) {
		statusEl.textContent = "";
		window.setTimeout(function () {
			statusEl.textContent = message;
		}, 50);
	}

	function markIframeLoaded(iframe) {
		if (!iframe || iframe.getAttribute("data-load-announced") === "true") {
			return;
		}
		iframe.setAttribute("data-load-announced", "true");
		iframe.setAttribute("aria-busy", "false");
		var holder = iframe.parentNode;
		if (!holder) {
			return;
		}
		announce(getOrCreateStatus(holder), "Content loaded");
	}

	function setupIframeLoadingStatus() {
		var iframes = document.querySelectorAll(".case-study-widget iframe, iframe[src*='Case_widgets']");
		if (!iframes.length) {
			return;
		}
		iframes.forEach(function (iframe) {
			var holder = iframe.parentNode;
			if (!holder) {
				return;
			}
			iframe.setAttribute("aria-busy", "true");
			announce(getOrCreateStatus(holder), "Loading");
			iframe.addEventListener("load", function () {
				window.setTimeout(function () {
					markIframeLoaded(iframe);
				}, 2500);
			});
		});
	}

	window.addEventListener("message", function (event) {
		if (!event.data || event.data.type !== "caseWidgetLoaded") {
			return;
		}
		document.querySelectorAll(".case-study-widget iframe, iframe[src*='Case_widgets']").forEach(function (iframe) {
			if (iframe.contentWindow === event.source) {
				markIframeLoaded(iframe);
			}
		});
	});

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", setupIframeLoadingStatus);
	} else {
		setupIframeLoadingStatus();
	}
})();




