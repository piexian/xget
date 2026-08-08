/**
 * Xget landing page.
 */

import {
  convertSourceUrl,
  escapeHtml,
  escapeScriptJson,
  getConverterData,
  getPlatformIcon,
  getPlatformIcons,
  getPlatformEntries
} from './platform-data.js';

/**
 * Renders the interactive landing page and URL converter.
 * @param {string} origin Public origin used in generated links.
 * @param {string} nonce CSP nonce for the inline script.
 * @returns {string} Complete HTML document.
 */
export function renderLanding(origin, nonce) {
  const entries = getPlatformEntries();
  const featuredKeys = [
    'gh',
    'gl',
    'npm',
    'pypi',
    'cr-docker',
    'hf',
    'ip-openai',
    'maven',
    'cr-ghcr'
  ];
  /** @type {ReturnType<typeof getPlatformEntries>} */
  const featured = [];
  for (const key of featuredKeys) {
    const entry = entries.find(item => item.key === key);
    if (entry) featured.push(entry);
  }
  const data = escapeScriptJson({ ...getConverterData(), icons: getPlatformIcons() });
  const featuredMarkup = featured
    .map(
      entry =>
        `<li><span class="dot dot-${entry.category}"></span><span class="platform-icon">${getPlatformIcon(entry.key)}</span><span>${escapeHtml(entry.label)}</span><code>${escapeHtml(entry.prefix)}</code></li>`
    )
    .join('');

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="聚合加速站：为开发者资源提供清晰、可靠的 URL 加速入口。">
  <meta name="color-scheme" content="light dark"><title>聚合加速站 | 开发者资源加速</title>
  <style>
    :root{color-scheme:light;--bg:#fff;--surface:#fff;--ink:#0f172a;--muted:#64748b;--line:#e2e8f0;--accent:#3b82f6;--accent-strong:#2563eb;--soft:#f1f5f9;--shadow:0 1px 3px rgba(0,0,0,.1)}
    @media(prefers-color-scheme:dark){:root{color-scheme:dark;--bg:#0f172a;--surface:#1e293b;--ink:#f8fafc;--muted:#94a3b8;--line:#334155;--accent:#60a5fa;--accent-strong:#3b82f6;--soft:#1e293b;--shadow:0 18px 42px rgba(0,0,0,.22)}}
    *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.6 ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}a{color:inherit}button,input{font:inherit}
    .skip{position:absolute;top:-4rem;left:1rem;padding:.5rem;background:var(--ink);color:var(--bg)}.skip:focus{top:1rem}.header{position:sticky;top:0;z-index:2;border-bottom:1px solid var(--line);background:color-mix(in srgb,var(--bg) 90%,transparent);backdrop-filter:blur(14px)}.nav,.shell{width:min(1160px,calc(100% - 40px));margin:auto}.nav{min-height:68px;display:flex;align-items:center;justify-content:space-between;gap:1rem}.brand{display:inline-flex;align-items:center;gap:.65rem;text-decoration:none;font-weight:700}.mark{display:grid;place-items:center;width:32px;height:32px;border:0;border-radius:.5rem;background:linear-gradient(135deg,var(--accent),#60a5fa);color:#fff;font-weight:800}.links{display:flex;align-items:center;gap:.9rem;color:var(--muted);font-size:.9rem}.links a{text-decoration:none}.links a:hover{color:var(--ink)}.lang,.secondary{border:1px solid var(--line);border-radius:.5rem;background:var(--soft);color:var(--ink);padding:.42rem .68rem;cursor:pointer}.lang:hover,.secondary:hover{border-color:var(--accent);color:var(--accent)}
    .hero{padding:clamp(4.5rem,11vw,8rem) 0 4.8rem;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(320px,.95fr);gap:clamp(2.5rem,8vw,7rem);align-items:end}.eyebrow{margin:0 0 1.2rem;color:var(--accent);font-size:.75rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase}h1{margin:0;font-size:clamp(2.7rem,7vw,5.9rem);line-height:.98;letter-spacing:-.055em;text-wrap:balance}.copy{max-width:570px;margin:1.6rem 0 0;color:var(--muted);font-size:1.08rem;text-wrap:pretty}.note{display:flex;gap:.75rem;align-items:center;margin-top:2rem;color:var(--muted);font-size:.86rem}.note:before{content:"";width:34px;height:1px;background:var(--accent)}
    .tool{background:var(--surface);border:1px solid var(--line);border-radius:.75rem;box-shadow:var(--shadow);padding:clamp(1.25rem,3vw,2rem)}.tool-kicker{margin:0 0 .45rem;color:var(--accent);font-size:.78rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase}.tool h2{margin:0;font-size:1.45rem}.tool p{margin:.55rem 0 1.35rem;color:var(--muted);font-size:.92rem}.row{display:flex;gap:.55rem}.input{width:100%;min-width:0;border:1px solid var(--line);border-radius:.5rem;background:var(--bg);color:var(--ink);padding:.76rem .8rem;font:.86rem ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}.input:focus-visible{outline:3px solid color-mix(in srgb,var(--accent) 30%,transparent);border-color:var(--accent)}.primary{min-height:44px;border:1px solid var(--accent);border-radius:.5rem;background:var(--accent);color:#fff;padding:.65rem .95rem;cursor:pointer;font-weight:700;white-space:nowrap}.primary:hover:not(:disabled){background:var(--accent-strong);transform:translateY(-1px)}.primary:disabled{cursor:not-allowed;opacity:.5}.secondary{min-height:44px}.feedback{min-height:1.4rem;margin:.55rem 0 0;color:#b5473a;font-size:.82rem}.result{display:none;margin-top:1.15rem;padding-top:1.15rem;border-top:1px solid var(--line)}.result.show{display:block}.result-label{display:flex;justify-content:space-between;color:var(--muted);font-size:.78rem}.platform{color:var(--accent);font-weight:700}.result-url{display:block;overflow-wrap:anywhere;margin:.45rem 0 .9rem;font:.82rem/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}.actions{display:flex;gap:.55rem}
    .section{padding-bottom:5.7rem}.heading{display:flex;justify-content:space-between;align-items:end;gap:2rem;padding-bottom:1.25rem;border-bottom:1px solid var(--line)}.heading h2{margin:0;font-size:clamp(1.6rem,3vw,2.25rem);letter-spacing:-.04em}.heading p{max-width:470px;margin:0;color:var(--muted);font-size:.95rem}.platforms{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.65rem 1rem;list-style:none;padding:1.5rem 0 0;margin:0}.platforms li{display:grid;grid-template-columns:9px 22px minmax(0,1fr) auto;gap:.6rem;align-items:center;padding:.72rem .8rem;border:1px solid var(--line);border-radius:.5rem;background:var(--soft);box-shadow:var(--shadow)}.platforms code{color:var(--muted);font-size:.74rem}.platform-icon{display:grid;place-items:center;width:22px;height:22px}.platform-icon svg{display:block;width:19px;height:19px}.dot{width:8px;height:8px;border-radius:50%;background:var(--accent)}.dot-package{background:#ca6b3d}.dot-ai{background:#8053a8}.dot-container{background:#2f6f9c}.dot-mirror{background:#ad8a32}
    .more{margin-top:1rem}.footer{padding:1.35rem 0 2.5rem;border-top:1px solid var(--line);color:var(--muted);font-size:.86rem}.footer-inner{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap}.footer-links{display:flex;gap:1rem}.footer-links a{text-underline-offset:3px}.modal{display:none;position:fixed;inset:0;z-index:3;background:rgba(7,14,12,.64);padding:1.25rem}.modal.show{display:grid;place-items:center}.modal-panel{width:min(720px,100%);max-height:min(80dvh,700px);overflow:auto;background:var(--surface);border:1px solid var(--line);padding:1.25rem}.modal-head{display:flex;align-items:center;justify-content:space-between;padding-bottom:.9rem;border-bottom:1px solid var(--line)}.modal-head h2{margin:0;font-size:1.2rem}.close{width:36px;height:36px;border:1px solid var(--line);border-radius:3px;background:transparent;color:var(--ink);cursor:pointer;font-size:1.2rem}.modal-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.5rem;padding-top:1rem}.modal-item{display:flex;align-items:center;gap:.6rem;padding:.6rem .7rem;border-left:3px solid var(--accent);background:var(--bg);font-size:.86rem}.modal-item .platform-icon{flex:0 0 22px}:focus-visible{outline:3px solid color-mix(in srgb,var(--accent) 45%,transparent);outline-offset:2px}@media(max-width:760px){.nav,.shell{width:min(100% - 28px,600px)}.links a:not(.always){display:none}.hero{grid-template-columns:1fr;gap:2.5rem;padding-top:4rem}.platforms{grid-template-columns:repeat(2,minmax(0,1fr))}.heading{display:block}.heading p{margin-top:.7rem}}@media(max-width:480px){.row,.actions{flex-direction:column}.primary,.secondary{width:100%}.platforms,.modal-grid{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition-duration:.01ms!important}}
  </style>
</head>
<body>
  <a class="skip" href="#main">跳转到主要内容</a><header class="header"><nav class="nav" aria-label="Primary navigation"><a class="brand" href="/" aria-label="聚合加速站首页"><span class="mark" aria-hidden="true">X</span><span>聚合加速站</span></a><div class="links"><a class="always" href="/docs" data-i18n="docs">文档</a><a href="https://github.com/xixu-me/Xget" target="_blank" rel="noreferrer" data-i18n="source">源码</a><button class="lang" id="lang" type="button">EN</button></div></nav></header>
  <main id="main"><div class="shell hero"><section aria-labelledby="title"><p class="eyebrow">XGET / DEVELOPER INFRASTRUCTURE</p><h1 id="title">让开发者资源更快抵达。</h1><p class="copy" id="copy">把原始下载地址交给聚合加速站，生成一条稳定、易读的加速地址。覆盖代码托管、包仓库、容器镜像和 AI API。</p><p class="note" id="note">按需转换，保留原始路径。</p></section><section class="tool" aria-labelledby="toolTitle"><p class="tool-kicker">URL / CONVERTER</p><h2 id="toolTitle">生成加速地址</h2><p id="hint">粘贴完整 URL，或输入不带协议的地址。</p><div class="row"><input class="input" id="input" type="url" inputmode="url" autocomplete="url" spellcheck="false" placeholder="github.com/user/repository" aria-describedby="feedback"><button class="primary" id="convert" type="button">转换</button></div><p class="feedback" id="feedback" role="status" aria-live="polite"></p><div class="result" id="result"><div class="result-label"><span id="resultLabel">加速地址</span><span class="platform" id="platform"></span></div><output class="result-url" id="output"></output><div class="actions"><button class="secondary" id="copy" type="button">复制地址</button><button class="secondary" id="open" type="button">打开地址</button></div></div></section></div><section class="shell section" aria-labelledby="platformTitle"><div class="heading"><div><p class="eyebrow">SUPPORTED / ROUTES</p><h2 id="platformTitle">一套入口，覆盖常用基础设施</h2></div><p id="platformCopy">平台清单直接来自当前路由配置。新增或调整上游时，文档和转换器会同步更新。</p></div><ul class="platforms">${featuredMarkup}</ul><button class="secondary more" id="more" type="button"><span id="moreText">查看全部平台</span> <span aria-hidden="true">+</span></button></section></main>
  <footer class="footer"><div class="shell footer-inner"><span>聚合加速站 · Xget</span><div class="footer-links"><a href="/docs" data-i18n="docs">文档</a><a href="https://github.com/xixu-me/Xget/issues" target="_blank" rel="noreferrer" data-i18n="issue">反馈问题</a></div></div></footer><div class="modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><div class="modal-panel"><div class="modal-head"><h2 id="modalTitle">全部支持的平台</h2><button class="close" id="close" type="button" aria-label="关闭">×</button></div><div class="modal-grid" id="grid"></div></div></div>
  <script nonce="${escapeHtml(nonce)}">
    (() => {
      const data = ${data}; const origin = ${escapeScriptJson(origin)}; const convertSourceUrl = ${convertSourceUrl.toString()}; const input = document.getElementById('input'); const convert = document.getElementById('convert'); const feedback = document.getElementById('feedback'); const result = document.getElementById('result'); const output = document.getElementById('output'); const platform = document.getElementById('platform');
      const lang = () => localStorage.getItem('xget-lang') || (navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en');
      const text = { zh: { docs:'文档', source:'源码', issue:'反馈问题', title:'让开发者资源更快抵达。', copy:'把原始下载地址交给聚合加速站，生成一条稳定、易读的加速地址。覆盖代码托管、包仓库、容器镜像和 AI API。', note:'按需转换，保留原始路径。', tool:'生成加速地址', hint:'粘贴完整 URL，或输入不带协议的地址。', placeholder:'github.com/user/repository', ready:'加速地址', copyButton:'复制地址', open:'打开地址', copied:'已复制到剪贴板', invalid:'请输入有效的 HTTP(S) 地址。', unsupported:'暂不支持这个域名。请查看文档中的平台清单。', failed:'复制失败，请手动选择地址。', all:'查看全部平台', close:'关闭' }, en: { docs:'Docs', source:'Source', issue:'Report issue', title:'Move developer resources closer.', copy:'Turn an upstream URL into a stable, readable acceleration link for code hosts, package registries, containers, and AI APIs.', note:'On-demand conversion. The original path is preserved.', tool:'Generate an acceleration link', hint:'Paste a full URL, or enter a host without the scheme.', placeholder:'github.com/user/repository', ready:'Acceleration link', copyButton:'Copy link', open:'Open link', copied:'Copied to clipboard', invalid:'Enter a valid HTTP(S) URL.', unsupported:'That host is not supported yet. Check the platform list in the docs.', failed:'Copy failed. Select the URL manually.', all:'View all platforms', close:'Close' } };
      function applyLanguage(){const value=text[lang()];document.documentElement.lang=lang()==='zh'?'zh-CN':'en';for(const node of document.querySelectorAll('[data-i18n]'))node.textContent=value[node.dataset.i18n];for(const [id,key] of [['title','title'],['copy','copy'],['note','note'],['toolTitle','tool'],['hint','hint'],['resultLabel','ready'],['copy','copyButton'],['open','open'],['moreText','all']])document.getElementById(id).textContent=value[key];input.placeholder=value.placeholder;document.getElementById('lang').textContent=lang()==='zh'?'EN':'中文';document.getElementById('close').setAttribute('aria-label',value.close)}
      function run(){const converted=convertSourceUrl(input.value,origin,data);result.classList.toggle('show',Boolean(converted.url));feedback.textContent=converted.error?text[lang()][converted.error]:'';if(converted.url){output.textContent=converted.url;platform.textContent=converted.label}}convert.addEventListener('click',run);input.addEventListener('keydown',event=>{if(event.key==='Enter')run()});input.addEventListener('input',()=>{convert.disabled=!input.value.trim();feedback.textContent='';result.classList.remove('show')});document.getElementById('copy').addEventListener('click',async()=>{if(!output.textContent)return;try{await navigator.clipboard.writeText(output.textContent);feedback.textContent=text[lang()].copied}catch{feedback.textContent=text[lang()].failed}});document.getElementById('open').addEventListener('click',()=>{if(output.textContent)window.open(output.textContent,'_blank','noopener,noreferrer')});
      const modal=document.getElementById('modal');document.getElementById('more').addEventListener('click',()=>{document.getElementById('grid').innerHTML=data.entries.map(item=>'<div class="modal-item"><span class="platform-icon">'+(data.icons[item.key]||data.icons.default)+'</span><span><strong>'+item.label+'</strong><br><code>'+item.prefix+'</code></span></div>').join('');modal.classList.add('show');document.getElementById('close').focus()});const closeModal=()=>{modal.classList.remove('show');document.getElementById('more').focus()};document.getElementById('close').addEventListener('click',closeModal);modal.addEventListener('click',event=>{if(event.target===modal)closeModal()});document.addEventListener('keydown',event=>{if(event.key==='Escape'&&modal.classList.contains('show'))closeModal()});document.getElementById('lang').addEventListener('click',()=>{localStorage.setItem('xget-lang',lang()==='zh'?'en':'zh');applyLanguage()});convert.disabled=true;applyLanguage()
    })();
  </script>
</body>
</html>`;
}
