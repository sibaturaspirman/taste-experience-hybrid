const fs = require("fs");
const path = "index.html";
let s = fs.readFileSync(path, "utf8");

function rep(old, neu, label) {
  const n = s.split(old).length - 1;
  if (n !== 1) throw new Error(label + ": expected 1 match, got " + n);
  s = s.replace(old, neu);
}

rep(
  `.qrbox{left:104.5px;top:358.4px;width:876.8px;height:880.2px}
/* margin putih = proporsi versi yang disetujui klien (42.5px untuk QR 565px = 7.5%) -> QR 712.5px, margin 53.75px */
.qr{left:183.75px;top:438.45px;width:712.5px;height:712.5px}
.qrfail{left:183.75px;top:758.7px;width:712.5px}`,
  `.qrbox{left:320.8px;top:388.4px;width:438.4px;height:440.1px}
/* QR 50% (356.25px); kotak putih ikut setengah */
.qr{left:361.875px;top:430.35px;width:356.25px;height:356.25px}
.qrfail{left:183.75px;top:758.7px;width:712.5px;text-align:center}
a.cta.qr-dl{text-decoration:none;display:block;color:inherit}
a.cta.qr-dl[hidden]{display:none!important;pointer-events:none;opacity:0}`,
  "qr css"
);

rep(
  `    <h1 class="abs ttl shadowed" style="left:0;top:0;width:1080px;height:1px" aria-label="Taste Experience">
      <span class="gt" data-text="TASTE" style="left:174.2px;top:75.0px">TASTE</span>
      <span class="gt" data-text="EXPERIENCE" style="left:275.4px;top:177.0px">EXPERIENCE</span>
    </h1>
    <div class="flipB"><img class="abs qrbox jit" alt="" src="`,
  `    <h1 class="abs ttl shadowed" style="left:0;top:0;width:1080px;height:1px" aria-label="Taste Experience">
      <span class="gt" data-text="TASTE" style="left:174.2px;top:75.0px">TASTE</span>
      <span class="gt" data-text="EXPERIENCE" style="left:275.4px;top:177.0px">EXPERIENCE</span>
    </h1>
    <a class="cta sm qr-dl rise" id="qrDl" href="#" target="_blank" rel="noopener noreferrer" hidden style="top:288px" aria-hidden="true"><img alt="" src="`,
  "qr html start"
);

// qrfail width for 50% qr
rep(
  `.qrfail{left:183.75px;top:758.7px;width:712.5px;text-align:center}
a.cta.qr-dl{text-decoration:none;display:block;color:inherit}`,
  `.qrfail{left:361.875px;top:620px;width:356.25px;text-align:center}
a.cta.qr-dl{text-decoration:none;display:block;color:inherit}`,
  "qrfail css"
);

rep(
  `  var qb=$("#qr");if(qb)qb.innerHTML="";var qf=$("#qrfail");if(qf){qf.hidden=true;qf.textContent=QR_FAIL_MSG}`,
  `  var qb=$("#qr");if(qb)qb.innerHTML="";var qf=$("#qrfail");if(qf){qf.hidden=true;qf.textContent=QR_FAIL_MSG}
  setQrDownloadUrl(null)`,
  "reset download"
);

rep(
  `function drawQRTarget(target){
  var box=$("#qr"),fail=$("#qrfail");box.innerHTML="";
  if(typeof window.qrcode!=="function"){fail.textContent=QR_FAIL_MSG;fail.hidden=false;return}
  try{var q=qrcode(0,"M");q.addData(target);q.make();
    var n=q.getModuleCount(),d="";for(var r=0;r<n;r++)for(var c=0;c<n;c++)if(q.isDark(r,c))d+="M"+c+" "+r+"h1v1h-1z";
    box.innerHTML='<svg viewBox="0 0 '+n+' '+n+'" shape-rendering="crispEdges" aria-hidden="true"><path fill="#000" d="'+d+'"/></svg>';
    fail.hidden=true;
  }catch(err){fail.textContent=QR_FAIL_MSG;fail.hidden=false}
}`,
  `function setQrDownloadUrl(url){
  var a=$("#qrDl");if(!a)return;
  if(url){a.href=url;a.hidden=false;a.removeAttribute("aria-hidden")}
  else{a.href="#";a.hidden=true;a.setAttribute("aria-hidden","true")}
}
function drawQRTarget(target){
  var box=$("#qr"),fail=$("#qrfail");box.innerHTML="";
  if(typeof window.qrcode!=="function"){fail.textContent=QR_FAIL_MSG;fail.hidden=false;setQrDownloadUrl(null);return}
  try{var q=qrcode(0,"M");q.addData(target);q.make();
    var n=q.getModuleCount(),d="";for(var r=0;r<n;r++)for(var c=0;c<n;c++)if(q.isDark(r,c))d+="M"+c+" "+r+"h1v1h-1z";
    box.innerHTML='<svg viewBox="0 0 '+n+' '+n+'" shape-rendering="crispEdges" aria-hidden="true"><path fill="#000" d="'+d+'"/></svg>';
    fail.hidden=true;setQrDownloadUrl(target);
  }catch(err){fail.textContent=QR_FAIL_MSG;fail.hidden=false;setQrDownloadUrl(null)}
}`,
  "drawQR"
);

rep(
  `  fail.textContent="Preparing your QR code…";fail.hidden=false;
  qrUploadCtrl=new AbortController();`,
  `  fail.textContent="Preparing your QR code…";fail.hidden=false;setQrDownloadUrl(null);
  qrUploadCtrl=new AbortController();`,
  "prepareQR loading"
);

// Download button reuses btn image — close the <a> after btn src on QR screen only (first after qrDl)
const marker = 'id="qrDl" href="#" target="_blank" rel="noopener noreferrer" hidden style="top:288px" aria-hidden="true"><img alt="" src="';
const i0 = s.indexOf(marker);
if (i0 < 0) throw new Error("qrDl marker not found");
const j0 = s.indexOf('"></div>', i0);
if (j0 < 0) throw new Error("qrDl close not found");
// Find the btn img close and add </a> before flipB's inner structure — actually we broke HTML by replacing into img src
// Re-read: we replaced flipB opening with qrDl + img src= same as qrbox - WRONG

console.error("Need manual HTML fix - patch may have broken structure");
process.exit(1);