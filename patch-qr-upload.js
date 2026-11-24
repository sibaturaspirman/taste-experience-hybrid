const fs = require("fs");
const path = "index.html";
let s = fs.readFileSync(path, "utf8");

function rep(old, neu, label) {
  const n = s.split(old).length - 1;
  if (n !== 1) throw new Error(label + ": expected 1 match, got " + n);
  s = s.replace(old, neu);
}

rep(
  `    <label for="qrBase">Link untuk QR</label>
    <input id="qrBase" type="url" inputmode="url" placeholder="https://claude.ai/artifact/V1n5tL2W7786e7jNh5SNvi">
    <p class="help">Link halaman ini yang bisa dibuka di HP pengunjung. Hasilnya ditambahkan otomatis di akhir link (#fresh, #bold atau #creamy).</p>`,
  `    <label for="uploadEp">Upload API (endpoint)</label>
    <input id="uploadEp" type="url" inputmode="url" placeholder="https://photo-ai-iims.zirolu.id/v1/taufest">
    <label for="uploadAuth">Upload Authorization</label>
    <input id="uploadAuth" type="text" autocomplete="off" spellcheck="false" placeholder="client_id:secret">
    <p class="help">Kartu hasil di-upload ke API; QR berisi URL publik dari field <code>file</code> di respons JSON.</p>`,
  "admin upload fields"
);

rep(
  `  return{matrix:m,qrBase:typeof c.qrBase==="string"?c.qrBase:"",idle:typeof c.idle==="number"?c.idle:45,rotate:(c.rotate===90||c.rotate===270)?c.rotate:0}}`,
  `  return{matrix:m,uploadEndpoint:typeof c.uploadEndpoint==="string"?c.uploadEndpoint:"",uploadAuth:typeof c.uploadAuth==="string"?c.uploadAuth:"",idle:typeof c.idle==="number"?c.idle:45,rotate:(c.rotate===90||c.rotate===270)?c.rotate:0}}`,
  "loadCfg"
);

rep(
  `  renderQR();go("result");runLoader(resultKey);`,
  `  go("result");runLoader(resultKey);`,
  "showResult"
);

rep(
  `function reset(){answers=[null,null,null];resultKey=null;
  $$(".opt").forEach(function(o){o.classList.remove("sel","dim");o.setAttribute("aria-checked","false")});
  $$("[data-next]").forEach(function(b){b.disabled=true});}`,
  `function reset(){answers=[null,null,null];resultKey=null;
  if(qrUploadCtrl){try{qrUploadCtrl.abort()}catch(e){}qrUploadCtrl=null}
  var qb=$("#qr");if(qb)qb.innerHTML="";var qf=$("#qrfail");if(qf){qf.hidden=true;qf.textContent=QR_FAIL_MSG}
  $$(".opt").forEach(function(o){o.classList.remove("sel","dim");o.setAttribute("aria-checked","false")});
  $$("[data-next]").forEach(function(b){b.disabled=true});}`,
  "reset"
);

rep(
  `  if(name==="start")startAttract();
  var f=next.querySelector(".opt.sel")||next.querySelector(".cta:not([disabled])");`,
  `  if(name==="start")startAttract();
  if(name==="qr")prepareQR();
  var f=next.querySelector(".opt.sel")||next.querySelector(".cta:not([disabled])");`,
  "go qr"
);

rep(
  `function flipToQR(){
  flipping=true;`,
  `function flipToQR(){
  prepareQR();
  flipping=true;`,
  "flipToQR"
);

const qrBlock = `/* ---------- QR ---------- */
var DEFAULT_QR_BASE="https://claude.ai/artifact/V1n5tL2W7786e7jNh5SNvi";
function qrBase(){var b=(cfg.qrBase||"").trim();if(!b)b=DEFAULT_QR_BASE;return b.split("#")[0]}
function renderQR(){
  var box=$("#qr"),fail=$("#qrfail");box.innerHTML="";
  if(typeof window.qrcode!=="function"){fail.hidden=false;return}
  fail.hidden=true;
  try{var q=qrcode(0,"M");q.addData(qrBase()+"#"+resultKey);q.make();
    var n=q.getModuleCount(),d="";for(var r=0;r<n;r++)for(var c=0;c<n;c++)if(q.isDark(r,c))d+="M"+c+" "+r+"h1v1h-1z";
    box.innerHTML='<svg viewBox="0 0 '+n+' '+n+'" shape-rendering="crispEdges" aria-hidden="true"><path fill="#000" d="'+d+'"/></svg>';
  }catch(err){fail.hidden=false}
}`;

const qrBlockNew = `/* ---------- QR (upload foto → URL publik di QR, NRG-Lite API) ---------- */
var DEFAULT_UPLOAD_ENDPOINT="https://photo-ai-iims.zirolu.id/v1/taufest";
var DEFAULT_UPLOAD_AUTH="de2e0cc3-65da-48a4-8473-484f29386d61:xZC8Zo4DAWR5Yh6Lrq4QE3aaRYJl9lss";
var QR_FAIL_MSG="QR code could not be generated. Please check the device’s internet connection.";
var UPLOAD_CACHE_PREFIX="te_qr_photo_url_";
var QR_SESSION_COUNTER="te_qr_session_counter";
var QR_SESSION_CURRENT="te_qr_session_current";
var qrUploadCtrl=null,qrUploadGen=0;
function uploadSettings(){return{
  endpoint:(cfg.uploadEndpoint||"").trim()||DEFAULT_UPLOAD_ENDPOINT,
  auth:(cfg.uploadAuth||"").trim()||DEFAULT_UPLOAD_AUTH
}}
function qrSessionNum(){var n=0;try{var ex=sessionStorage.getItem(QR_SESSION_CURRENT);if(ex){n=parseInt(ex,10);if(n>0)return n}}catch(e){}
  try{var raw=localStorage.getItem(QR_SESSION_COUNTER);var cur=raw?parseInt(raw,10):0;n=(cur>0?cur:0)+1;localStorage.setItem(QR_SESSION_COUNTER,String(n))}catch(e){n=Date.now()}
  try{sessionStorage.setItem(QR_SESSION_CURRENT,String(n))}catch(e){}return n}
function drawQRTarget(target){
  var box=$("#qr"),fail=$("#qrfail");box.innerHTML="";
  if(typeof window.qrcode!=="function"){fail.textContent=QR_FAIL_MSG;fail.hidden=false;return}
  try{var q=qrcode(0,"M");q.addData(target);q.make();
    var n=q.getModuleCount(),d="";for(var r=0;r<n;r++)for(var c=0;c<n;c++)if(q.isDark(r,c))d+="M"+c+" "+r+"h1v1h-1z";
    box.innerHTML='<svg viewBox="0 0 '+n+' '+n+'" shape-rendering="crispEdges" aria-hidden="true"><path fill="#000" d="'+d+'"/></svg>';
    fail.hidden=true;
  }catch(err){fail.textContent=QR_FAIL_MSG;fail.hidden=false}
}
function uploadResultBlob(blob,signal){
  var u=uploadSettings(),session=qrSessionNum();
  var body=new FormData();
  body.append("name","Taste Exp Hybrid "+session);
  body.append("phone","1");
  body.append("file",blob,"taste-experience-"+(resultKey||"result")+"-"+session+".jpg");
  return fetch(u.endpoint,{method:"POST",body:body,headers:{Authorization:u.auth,Accept:"application/json"},signal:signal})
    .then(function(res){if(!res.ok)throw new Error("Upload gagal (HTTP "+res.status+")");return res.json()})
    .then(function(json){if(!json||typeof json.file!=="string")throw new Error("Respon upload tidak valid");return json.file});
}
function prepareQR(){
  if(!resultKey||mode!=="kiosk")return;
  var fail=$("#qrfail"),cacheKey=UPLOAD_CACHE_PREFIX+resultKey,gen=++qrUploadGen;
  if(qrUploadCtrl){try{qrUploadCtrl.abort()}catch(e){}qrUploadCtrl=null}
  if(typeof window.qrcode!=="function"){fail.textContent=QR_FAIL_MSG;fail.hidden=false;return}
  try{var cached=sessionStorage.getItem(cacheKey);if(cached){drawQRTarget(cached);return}}catch(e){}
  if(typeof navigator!=="undefined"&&navigator.onLine===false){fail.textContent=QR_FAIL_MSG;fail.hidden=false;return}
  fail.textContent="Preparing your QR code…";fail.hidden=false;
  qrUploadCtrl=new AbortController();
  composeResult(resultKey).then(function(blob){
    if(gen!==qrUploadGen)return;return uploadResultBlob(blob,qrUploadCtrl.signal)
  }).then(function(url){
    if(!url||gen!==qrUploadGen)return;
    try{sessionStorage.setItem(cacheKey,url)}catch(e){}
    drawQRTarget(url);
  }).catch(function(err){
    if(gen!==qrUploadGen||(err&&err.name==="AbortError"))return;
    fail.textContent=QR_FAIL_MSG;fail.hidden=false;
  }).then(function(){if(gen===qrUploadGen)qrUploadCtrl=null});
}
function renderQR(){prepareQR()}`;

rep(qrBlock, qrBlockNew, "qr block");

rep(
  `  $("#mx").innerHTML=rows;$("#qrBase").value=cfg.qrBase||"";$("#idle").value=cfg.idle;$("#rot").value=String(cfg.rotate||0);$("#admMsg").textContent="";`,
  `  $("#mx").innerHTML=rows;$("#uploadEp").value=cfg.uploadEndpoint||"";$("#uploadAuth").value=cfg.uploadAuth||"";$("#idle").value=cfg.idle;$("#rot").value=String(cfg.rotate||0);$("#admMsg").textContent="";`,
  "openAdmin"
);

rep(
  `  cfg.qrBase=$("#qrBase").value.trim();var iv=parseInt($("#idle").value,10);cfg.idle=isNaN(iv)?45:Math.max(0,Math.min(600,iv));
  cfg.rotate=+$("#rot").value||0;fit();
  $("#admMsg").textContent=saveCfg()?"Tersimpan.":"Tersimpan untuk sesi ini saja (penyimpanan perangkat tidak tersedia).";
  if(resultKey)renderQR();`,
  `  cfg.uploadEndpoint=$("#uploadEp").value.trim();cfg.uploadAuth=$("#uploadAuth").value.trim();var iv=parseInt($("#idle").value,10);cfg.idle=isNaN(iv)?45:Math.max(0,Math.min(600,iv));
  cfg.rotate=+$("#rot").value||0;fit();
  $("#admMsg").textContent=saveCfg()?"Tersimpan.":"Tersimpan untuk sesi ini saja (penyimpanan perangkat tidak tersedia).";
  if(resultKey)prepareQR();`,
  "admSave"
);

rep(
  `setResult:function(k){resultKey=k;buildCard($("#kcard"),k);Fluid.mount($("#rin"));Fluid.setResult(k);renderQR();}`,
  `setResult:function(k){resultKey=k;buildCard($("#kcard"),k);Fluid.mount($("#rin"));Fluid.setResult(k);prepareQR();}`,
  "__te"
);

if (s.includes("\x08")) throw new Error("backspace in file");
fs.writeFileSync(path, s);
console.log("qr upload patch ok");