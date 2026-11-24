const fs = require("fs");
const path = "index.html";
let s = fs.readFileSync(path, "utf8");

const oldCss = `#vp{position:relative;width:100%;height:100%;overflow:hidden}`;
const newCss = `#vp{position:relative;width:100vw;height:100vh;height:100dvh;max-width:none;overflow:hidden}`;
if ((s.split(oldCss).length - 1) !== 1) throw new Error("vp CSS match count !== 1");
s = s.replace(oldCss, newCss);

const oldFit = `  var ph=w<=820&&h>w,vis=1080,sh=1920;
  if(ph){scale=Math.min(w/900,h/1920);vis=Math.min(1080,w/scale);sh=Math.max(1920,h/scale)}else scale=Math.min(w/1080,h/1920);`;
const newFit = `  var ph=h>w,vis=1080,sh=1920;
  if(ph){scale=w/1080;vis=1080;sh=Math.max(1920,h/scale)}else scale=Math.min(w/1080,h/1920);`;
if ((s.split(oldFit).length - 1) !== 1) throw new Error("fit() match count !== 1");
s = s.replace(oldFit, newFit);

if (s.includes("\x08")) throw new Error("backspace in file");

fs.writeFileSync(path, s);
console.log("patched ok");