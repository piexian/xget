/**
 * Xget documentation page.
 */

import {
  escapeHtml,
  escapeScriptJson,
  getCategoryLabels,
  getPlatformEntries
} from './platform-data.js';

/** @typedef {'code' | 'package' | 'container' | 'ai' | 'mirror'} PlatformCategory */

/** @type {PlatformCategory[]} */
const CATEGORY_ORDER = ['code', 'package', 'container', 'ai', 'mirror'];
/** @type {Record<PlatformCategory, string>} */
const CATEGORY_ZH = {
  code: '代码与文件',
  package: '包管理器',
  container: '容器仓库',
  ai: 'AI API',
  mirror: '系统镜像'
};

/**
 * Creates a copyable command block.
 * @param {string} title Command group title.
 * @param {string} command Command text.
 * @returns {string} Command block markup.
 */
function commandBlock(title, command) {
  return `<div class="command"><div class="command-head"><span>${escapeHtml(title)}</span><button class="copy" type="button" data-zh="复制" data-en="Copy">复制</button></div><pre><code>${escapeHtml(command)}</code></pre></div>`;
}

/**
 * Renders a complete category table from the routing catalog.
 * @param {PlatformCategory} category Platform category.
 * @param {ReturnType<typeof getPlatformEntries>} entries Platform entries.
 * @param {string} origin Public Xget origin.
 * @returns {string} Catalog section markup.
 */
function catalogSection(category, entries, origin) {
  const rows = entries
    .filter(entry => entry.category === category)
    .map(
      entry =>
        `<tr class="catalog-row" data-search="${escapeHtml(`${entry.label} ${entry.key} ${entry.host} ${entry.prefix}`.toLowerCase())}"><td><strong>${escapeHtml(entry.label)}</strong><small>${escapeHtml(entry.key)}</small></td><td><code>${escapeHtml(entry.prefix)}</code></td><td><code>https://${escapeHtml(entry.host)}${escapeHtml(entry.basePath)}</code></td><td><code>${escapeHtml(origin)}${escapeHtml(entry.prefix)}</code></td></tr>`
    )
    .join('');

  return `<section class="catalog-group" data-category="${category}" aria-labelledby="catalog-${category}"><div class="group-title"><h3 id="catalog-${category}">${escapeHtml(CATEGORY_ZH[category])}<span>${escapeHtml(getCategoryLabels()[category])}</span></h3><span class="count">${entries.filter(entry => entry.category === category).length}</span></div><div class="table-wrap"><table><thead><tr><th data-zh="平台" data-en="Platform">平台</th><th data-zh="路由前缀" data-en="Route prefix">路由前缀</th><th data-zh="上游入口" data-en="Upstream base">上游入口</th><th data-zh="本站入口" data-en="Xget base">本站入口</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
}

/**
 * Renders the route catalog and usage documentation.
 * @param {string} origin Public origin used in command examples.
 * @param {string} nonce CSP nonce for the inline script.
 * @returns {string} Complete HTML document.
 */
export function renderDocs(origin, nonce) {
  const { origin: publicOrigin, host } = new URL(origin);
  const entries = getPlatformEntries();
  const categoryLabels = getCategoryLabels();
  const catalog = CATEGORY_ORDER.map(category =>
    catalogSection(category, entries, publicOrigin)
  ).join('');
  const categoryOptions = CATEGORY_ORDER.map(
    category =>
      `<option value="${category}" data-zh="${escapeHtml(CATEGORY_ZH[category])}" data-en="${escapeHtml(categoryLabels[category])}">${escapeHtml(CATEGORY_ZH[category])}</option>`
  ).join('');

  const gitCommands = commandBlock(
    'Git / GitHub / GitLab',
    `git clone ${publicOrigin}/gh/microsoft/vscode.git\ngit clone ${publicOrigin}/gl/gitlab-org/gitlab.git\ncurl -L ${publicOrigin}/gh/microsoft/vscode/archive/refs/heads/main.zip`
  );
  const modelCommands = commandBlock(
    'Hugging Face',
    `curl -L ${publicOrigin}/hf/openai/whisper-large-v3/resolve/main/config.json\nGIT_LFS_SKIP_SMUDGE=1 git clone ${publicOrigin}/hf/openai/whisper-large-v3`
  );
  const packageCommands = [
    commandBlock(
      'npm / Bun',
      `npm config set registry ${publicOrigin}/npm/\n# bunfig.toml\n[install]\nregistry = "${publicOrigin}/npm/"`
    ),
    commandBlock(
      'pip / PyPI',
      `pip install -i ${publicOrigin}/pypi/simple/ requests\npip config set global.index-url ${publicOrigin}/pypi/simple/`
    ),
    commandBlock(
      'Go modules / Maven',
      `export GOPROXY=${publicOrigin}/golang/,direct\n# Maven settings.xml mirror URL\n${publicOrigin}/maven/maven2`
    ),
    commandBlock(
      'Homebrew',
      `export HOMEBREW_API_DOMAIN=${publicOrigin}/homebrew/api\nexport HOMEBREW_BOTTLE_DOMAIN=${publicOrigin}/homebrew/bottles\nexport HOMEBREW_BREW_GIT_REMOTE=${publicOrigin}/homebrew/brew.git\nexport HOMEBREW_CORE_GIT_REMOTE=${publicOrigin}/homebrew/homebrew-core.git`
    )
  ].join('');
  const containerCommands = commandBlock(
    'Docker / Podman',
    `docker pull ${host}/cr/docker/library/nginx:latest\ndocker pull ${host}/cr/ghcr/xixu-me/xget:latest\npodman pull ${host}/cr/quay/prometheus/prometheus:latest`
  );
  const registryCommands = commandBlock(
    'OCI Registry API',
    `curl ${publicOrigin}/cr/docker/v2/library/nginx/manifests/latest\ncurl ${publicOrigin}/cr/ghcr/v2/xixu-me/xget/manifests/latest`
  );
  const aiCommands = [
    commandBlock(
      'OpenAI compatible',
      `curl ${publicOrigin}/ip/openai/v1/models \\\n  -H "Authorization: Bearer $OPENAI_API_KEY"\n\nexport OPENAI_BASE_URL=${publicOrigin}/ip/openai/v1`
    ),
    commandBlock(
      'Anthropic / Gemini',
      `export ANTHROPIC_BASE_URL=${publicOrigin}/ip/anthropic\ncurl "${publicOrigin}/ip/gemini/v1beta/models?key=$GEMINI_API_KEY"`
    )
  ].join('');
  const mirrorCommands = [
    commandBlock(
      'APT',
      `deb ${publicOrigin}/debian/debian bookworm main\ndeb ${publicOrigin}/ubuntu/ubuntu noble main universe`
    ),
    commandBlock(
      'Fedora / Arch',
      `curl -L ${publicOrigin}/fedora/releases/40/Everything/x86_64/os/repodata/repomd.xml\ncurl -L ${publicOrigin}/arch/core/os/x86_64/core.db`
    ),
    commandBlock(
      'arXiv / F-Droid / Jenkins',
      `curl -L ${publicOrigin}/arxiv/pdf/2301.07041.pdf\ncurl -L ${publicOrigin}/fdroid/repo/index-v2.json\ncurl -L ${publicOrigin}/jenkins/update-center.json`
    )
  ].join('');

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="聚合加速站完整使用文档：URL 转换规则、包管理器配置、容器镜像、AI API、系统镜像和全部平台前缀。">
  <meta name="color-scheme" content="light dark"><title>使用文档 | 聚合加速站</title>
  <style>
    :root{color-scheme:light;--bg:#f6f7f5;--surface:#fff;--ink:#17201d;--muted:#61706a;--line:#d9dfdb;--accent:#0c7562;--accent-strong:#075b4c;--soft:#e1f1ed;--code:#101715;--code-ink:#edf4f0}
    @media(prefers-color-scheme:dark){:root{color-scheme:dark;--bg:#101715;--surface:#17201d;--ink:#edf4f0;--muted:#aab9b2;--line:#2c3934;--accent:#5bd4bb;--accent-strong:#91e3d0;--soft:#193a33;--code:#090d0c;--code-ink:#edf4f0}}
    *{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:90px}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.65 ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}a{color:inherit}button,input,select{font:inherit}.shell{width:min(1200px,calc(100% - 40px));margin:auto}.skip{position:absolute;top:-4rem;left:1rem;padding:.5rem;background:var(--ink);color:var(--bg);z-index:5}.skip:focus{top:1rem}.header{position:sticky;top:0;z-index:4;border-bottom:1px solid var(--line);background:color-mix(in srgb,var(--bg) 92%,transparent);backdrop-filter:blur(14px)}.nav{min-height:68px;display:flex;align-items:center;justify-content:space-between;gap:1rem}.brand{display:inline-flex;align-items:center;gap:.65rem;text-decoration:none;font-weight:750}.mark{display:grid;place-items:center;width:32px;height:32px;border:1px solid var(--accent);color:var(--accent);font-weight:850}.links{display:flex;align-items:center;gap:1rem;color:var(--muted);font-size:.9rem}.links a{text-decoration:none}.links a:hover{color:var(--ink)}.lang,.copy,.filter,.search{border:1px solid var(--line);border-radius:3px;background:var(--surface);color:var(--ink)}.lang,.copy{cursor:pointer}.lang{padding:.42rem .68rem}.lang:hover,.copy:hover{border-color:var(--accent);color:var(--accent)}
    .intro{padding:5.4rem 0 3.8rem;border-bottom:1px solid var(--line)}.eyebrow{margin:0 0 1rem;color:var(--accent);font-size:.74rem;font-weight:750;letter-spacing:.14em;text-transform:uppercase}.intro h1{max-width:900px;margin:0;font-size:clamp(2.6rem,6vw,5rem);line-height:1;letter-spacing:-.045em;text-wrap:balance}.intro-copy{max-width:720px;margin:1.35rem 0 0;color:var(--muted);font-size:1.08rem}.stats{display:flex;gap:2rem;margin-top:2rem}.stat strong{display:block;font-size:1.5rem}.stat span{color:var(--muted);font-size:.8rem}.layout{display:grid;grid-template-columns:210px minmax(0,1fr);gap:clamp(2rem,6vw,5rem);align-items:start}.toc{position:sticky;top:92px;padding:2.4rem 0}.toc strong{display:block;margin-bottom:.8rem;font-size:.75rem;color:var(--muted);letter-spacing:.12em;text-transform:uppercase}.toc a{display:block;padding:.35rem 0;color:var(--muted);text-decoration:none}.toc a:hover{color:var(--accent)}.content{min-width:0}.doc-section{padding:3.8rem 0;border-bottom:1px solid var(--line)}.section-heading{display:grid;grid-template-columns:minmax(0,.7fr) minmax(260px,1fr);gap:2rem;margin-bottom:2rem}.section-heading h2{margin:0;font-size:clamp(1.6rem,3vw,2.25rem);letter-spacing:-.03em}.section-heading p{margin:.25rem 0 0;color:var(--muted)}.anatomy{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border:1px solid var(--line)}.anatomy div{padding:1.1rem;border-right:1px solid var(--line)}.anatomy div:last-child{border:0}.anatomy small{display:block;color:var(--muted)}.anatomy code{display:block;margin-top:.35rem;color:var(--accent);overflow-wrap:anywhere}.rules{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line)}.rule{min-width:0;background:var(--bg);padding:1rem}.rule strong{display:block;margin-bottom:.45rem}.rule code{display:block;color:var(--muted);font-size:.78rem;overflow-wrap:anywhere}.rule .arrow{color:var(--accent);padding:.2rem 0}.commands{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}.command{min-width:0;border:1px solid var(--line);background:var(--surface)}.command-head{height:42px;display:flex;align-items:center;justify-content:space-between;padding:0 .7rem 0 1rem;border-bottom:1px solid var(--line);font-size:.8rem;color:var(--muted)}.copy{padding:.28rem .58rem;font-size:.75rem}.command pre{min-height:126px;margin:0;padding:1rem;overflow:auto;background:var(--code);color:var(--code-ink);font:12.5px/1.65 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}.command code{font:inherit}.callout{margin-top:1rem;padding:1rem 1.1rem;border-left:3px solid var(--accent);background:var(--soft);color:var(--muted)}
    .catalog-tools{display:grid;grid-template-columns:1fr 190px;gap:.7rem;margin-bottom:1.5rem}.search,.filter{width:100%;padding:.7rem .8rem}.search:focus,.filter:focus{outline:3px solid color-mix(in srgb,var(--accent) 28%,transparent);border-color:var(--accent)}.catalog-group{margin-top:2.4rem}.catalog-group[hidden]{display:none}.group-title{display:flex;align-items:end;justify-content:space-between;margin-bottom:.7rem}.group-title h3{margin:0;font-size:1.2rem}.group-title h3 span{margin-left:.65rem;color:var(--muted);font-size:.76rem;font-weight:500}.count{color:var(--muted);font-variant-numeric:tabular-nums}.table-wrap{overflow-x:auto;border-top:1px solid var(--ink)}table{width:100%;border-collapse:collapse;min-width:760px;text-align:left}th,td{padding:.75rem .7rem;border-bottom:1px solid var(--line);vertical-align:top}th{color:var(--muted);font-size:.72rem;text-transform:uppercase}td{font-size:.83rem}td strong,td small{display:block}td small{color:var(--muted)}td code{font:12px/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;overflow-wrap:anywhere}.empty{display:none;padding:2rem;border:1px solid var(--line);color:var(--muted);text-align:center}.footer{padding:1.4rem 0 2.5rem;color:var(--muted);font-size:.85rem}.footer-inner{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap}.footer-links{display:flex;gap:1rem}:focus-visible{outline:3px solid color-mix(in srgb,var(--accent) 45%,transparent);outline-offset:2px}
    @media(max-width:820px){.shell{width:min(100% - 28px,680px)}.layout{grid-template-columns:1fr}.toc{position:static;display:flex;gap:.5rem;overflow:auto;padding:1.2rem 0;border-bottom:1px solid var(--line)}.toc strong{display:none}.toc a{white-space:nowrap;padding:.35rem .6rem;border:1px solid var(--line)}.section-heading{grid-template-columns:1fr;gap:.6rem}.anatomy{grid-template-columns:1fr}.anatomy div{border-right:0;border-bottom:1px solid var(--line)}.rules,.commands{grid-template-columns:1fr}.intro{padding-top:4rem}.links a.source{display:none}}@media(max-width:520px){.catalog-tools{grid-template-columns:1fr}.stats{gap:1rem}.stat strong{font-size:1.25rem}.command pre{font-size:11.5px}}
    @media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}
  </style>
</head>
<body>
  <a class="skip" href="#main" data-zh="跳转到主要内容" data-en="Skip to content">跳转到主要内容</a>
  <header class="header"><nav class="shell nav" aria-label="Primary navigation"><a class="brand" href="/"><span class="mark" aria-hidden="true">X</span><span>聚合加速站</span></a><div class="links"><a href="/" data-zh="首页" data-en="Home">首页</a><a class="source" href="https://github.com/xixu-me/Xget" target="_blank" rel="noreferrer" data-zh="源码" data-en="Source">源码</a><button class="lang" id="lang" type="button">EN</button></div></nav></header>
  <main id="main" class="shell">
    <section class="intro"><p class="eyebrow">XGET / COMPLETE REFERENCE</p><h1 data-zh="从一个 URL，到完整的开发工具链。" data-en="One URL pattern for the whole developer toolchain.">从一个 URL，到完整的开发工具链。</h1><p class="intro-copy" data-zh="这里列出当前后端实际支持的全部路由，并给出可直接使用的下载、包管理器、容器与 API 配置。" data-en="Every route below comes from the active backend catalog, with ready-to-use download, package manager, container, and API examples.">这里列出当前后端实际支持的全部路由，并给出可直接使用的下载、包管理器、容器与 API 配置。</p><div class="stats"><div class="stat"><strong>${entries.length}</strong><span data-zh="平台路由" data-en="platform routes">平台路由</span></div><div class="stat"><strong>${CATEGORY_ORDER.length}</strong><span data-zh="使用场景" data-en="workflows">使用场景</span></div><div class="stat"><strong>HTTP(S)</strong><span data-zh="原始协议" data-en="source protocols">原始协议</span></div></div></section>
    <div class="layout">
      <nav class="toc" aria-label="Documentation sections"><strong>CONTENTS</strong><a href="#quick" data-zh="快速开始" data-en="Quick start">快速开始</a><a href="#rules" data-zh="转换规则" data-en="URL rules">转换规则</a><a href="#code" data-zh="代码与文件" data-en="Code & files">代码与文件</a><a href="#packages" data-zh="包管理器" data-en="Packages">包管理器</a><a href="#containers" data-zh="容器" data-en="Containers">容器</a><a href="#ai" data-zh="AI API" data-en="AI APIs">AI API</a><a href="#mirrors" data-zh="系统镜像" data-en="Mirrors">系统镜像</a><a href="#catalog" data-zh="全部平台" data-en="Full catalog">全部平台</a></nav>
      <div class="content">
        <section class="doc-section" id="quick"><div class="section-heading"><h2 data-zh="快速开始" data-en="Quick start">快速开始</h2><p data-zh="把本站域名和平台前缀放在原始资源路径之前。首页转换器会自动处理需要改写路径的特殊来源。" data-en="Place this origin and the platform prefix before the resource path. The homepage converter handles sources that need special path rewriting.">把本站域名和平台前缀放在原始资源路径之前。首页转换器会自动处理需要改写路径的特殊来源。</p></div><div class="anatomy"><div><small data-zh="本站域名" data-en="Xget origin">本站域名</small><code>${escapeHtml(publicOrigin)}</code></div><div><small data-zh="平台前缀" data-en="Platform prefix">平台前缀</small><code>/gh/</code></div><div><small data-zh="原始资源路径" data-en="Resource path">原始资源路径</small><code>owner/repository/...</code></div></div><div class="commands" style="margin-top:1rem">${commandBlock('GitHub release', `${publicOrigin}/gh/microsoft/vscode/archive/refs/heads/main.zip`)}${commandBlock('npm package', `${publicOrigin}/npm/react/-/react-18.2.0.tgz`)}</div></section>
        <section class="doc-section" id="rules"><div class="section-heading"><h2 data-zh="转换规则" data-en="URL conversion rules">转换规则</h2><p data-zh="大多数地址保留原始路径；以下来源需要去除基础目录、识别页面格式，或按路径分流。查询参数与片段会保留。" data-en="Most URLs preserve their path. These sources need a base path removed, a page format recognized, or path-sensitive routing. Query strings and fragments are retained.">大多数地址保留原始路径；以下来源需要去除基础目录、识别页面格式，或按路径分流。查询参数与片段会保留。</p></div><div class="rules"><div class="rule"><strong>GitHub Raw</strong><code>raw.githubusercontent.com/owner/repo/ref/file</code><div class="arrow">↓</div><code>${escapeHtml(publicOrigin)}/gh/owner/repo/raw/ref/file</code></div><div class="rule"><strong>Homebrew API</strong><code>formulae.brew.sh/api/formula/git.json</code><div class="arrow">↓</div><code>${escapeHtml(publicOrigin)}/homebrew/api/formula/git.json</code></div><div class="rule"><strong>Homebrew Bottles</strong><code>ghcr.io/v2/homebrew/core/...</code><div class="arrow">↓</div><code>${escapeHtml(publicOrigin)}/homebrew/bottles/v2/homebrew/core/...</code></div><div class="rule"><strong>npm package page</strong><code>npmjs.com/package/name/v/1.0.0</code><div class="arrow">↓</div><code>${escapeHtml(publicOrigin)}/npm/name/1.0.0</code></div><div class="rule"><strong>Docker Hub page</strong><code>hub.docker.com/_/nginx</code><div class="arrow">↓</div><code>${escapeHtml(publicOrigin)}/cr/docker/v2/nginx/manifests/latest</code></div><div class="rule"><strong>Fedora mirror</strong><code>dl.fedoraproject.org/pub/fedora/linux/...</code><div class="arrow">↓</div><code>${escapeHtml(publicOrigin)}/fedora/pub/fedora/linux/...</code></div></div><div class="callout" data-zh="转换器只接受无账号密码、无自定义端口的 HTTP(S) 地址。容器 Registry API 的 /v2/ 是协议路径，会被保留。" data-en="The converter accepts HTTP(S) URLs without embedded credentials or custom ports. The container Registry API /v2/ segment is part of the protocol and is preserved.">转换器只接受无账号密码、无自定义端口的 HTTP(S) 地址。容器 Registry API 的 /v2/ 是协议路径，会被保留。</div></section>
        <section class="doc-section" id="code"><div class="section-heading"><h2 data-zh="代码与文件" data-en="Code and files">代码与文件</h2><p data-zh="Git 可直接使用加速地址；归档、Release、Raw 文件和模型仓库保持原有路径结构。" data-en="Git can use accelerated URLs directly. Archives, releases, raw files, and model repositories keep their familiar path structure.">Git 可直接使用加速地址；归档、Release、Raw 文件和模型仓库保持原有路径结构。</p></div><div class="commands">${gitCommands}${modelCommands}</div></section>
        <section class="doc-section" id="packages"><div class="section-heading"><h2 data-zh="包管理器" data-en="Package managers">包管理器</h2><p data-zh="支持一次性命令和持久配置。这里覆盖常用生态；RubyGems、Conda、NuGet、CPAN、CTAN 等前缀见完整平台表。" data-en="Use one-off commands or persistent configuration. Common ecosystems are shown here; see the catalog for RubyGems, Conda, NuGet, CPAN, CTAN, and more.">支持一次性命令和持久配置。这里覆盖常用生态；RubyGems、Conda、NuGet、CPAN、CTAN 等前缀见完整平台表。</p></div><div class="commands">${packageCommands}</div></section>
        <section class="doc-section" id="containers"><div class="section-heading"><h2 data-zh="容器镜像" data-en="Container registries">容器镜像</h2><p data-zh="直接拉取时使用 /cr/{registry}/；Registry API 请求必须保留 /v2/。认证挑战和令牌交换由后端代理处理。" data-en="Use /cr/{registry}/ for direct pulls and preserve /v2/ for Registry API calls. The backend proxies authentication challenges and token exchange.">直接拉取时使用 /cr/{registry}/；Registry API 请求必须保留 /v2/。认证挑战和令牌交换由后端代理处理。</p></div><div class="commands">${containerCommands}${registryCommands}</div></section>
        <section class="doc-section" id="ai"><div class="section-heading"><h2 data-zh="AI API" data-en="AI APIs">AI API</h2><p data-zh="把 SDK 的 Base URL 指向 /ip/{provider}，其余路径、查询参数、请求体和认证头保持不变。不要把真实密钥写进 URL。" data-en="Point the SDK base URL at /ip/{provider}; keep paths, query parameters, request bodies, and authentication headers unchanged. Never put real secrets in a URL.">把 SDK 的 Base URL 指向 /ip/{provider}，其余路径、查询参数、请求体和认证头保持不变。不要把真实密钥写进 URL。</p></div><div class="commands">${aiCommands}</div></section>
        <section class="doc-section" id="mirrors"><div class="section-heading"><h2 data-zh="系统镜像与专用资源" data-en="System mirrors and specialized resources">系统镜像与专用资源</h2><p data-zh="发行版仓库可放入软件源配置；arXiv、F-Droid、Jenkins 等资源使用各自的固定前缀。" data-en="Distribution mirrors can be used in repository configuration. arXiv, F-Droid, Jenkins, and similar resources use their dedicated prefixes.">发行版仓库可放入软件源配置；arXiv、F-Droid、Jenkins 等资源使用各自的固定前缀。</p></div><div class="commands">${mirrorCommands}</div></section>
        <section class="doc-section" id="catalog"><div class="section-heading"><h2 data-zh="全部支持的平台" data-en="Complete platform catalog">全部支持的平台</h2><p data-zh="清单由当前后端路由配置实时生成。可按名称、域名或前缀搜索，也可按类别筛选。" data-en="This catalog is generated from the active backend routes. Search by name, host, or prefix, or filter by category.">清单由当前后端路由配置实时生成。可按名称、域名或前缀搜索，也可按类别筛选。</p></div><div class="catalog-tools"><input class="search" id="search" type="search" autocomplete="off" placeholder="搜索平台、域名或前缀" aria-label="搜索平台"><select class="filter" id="filter" aria-label="筛选类别"><option value="all" data-zh="全部类别" data-en="All categories">全部类别</option>${categoryOptions}</select></div><div id="catalogGroups">${catalog}</div><p class="empty" id="empty" data-zh="没有匹配的平台。" data-en="No matching platforms.">没有匹配的平台。</p></section>
      </div>
    </div>
  </main>
  <footer class="footer"><div class="shell footer-inner"><span>聚合加速站 · Xget</span><div class="footer-links"><a href="/" data-zh="首页" data-en="Home">首页</a><a href="https://github.com/xixu-me/Xget/issues" target="_blank" rel="noreferrer" data-zh="反馈问题" data-en="Report issue">反馈问题</a></div></div></footer>
  <script nonce="${escapeHtml(nonce)}">
    (()=>{const categoryLabels=${escapeScriptJson({ zh: CATEGORY_ZH, en: categoryLabels })};const language=()=>localStorage.getItem('xget-lang')||(navigator.language.toLowerCase().startsWith('zh')?'zh':'en');const applyLanguage=()=>{const current=language();document.documentElement.lang=current==='zh'?'zh-CN':'en';for(const node of document.querySelectorAll('[data-zh]'))node.textContent=node.dataset[current];for(const option of document.querySelectorAll('#filter option[value]:not([value="all"])'))option.textContent=categoryLabels[current][option.value];const search=document.getElementById('search');search.placeholder=current==='zh'?'搜索平台、域名或前缀':'Search platform, host, or prefix';search.setAttribute('aria-label',search.placeholder);document.getElementById('lang').textContent=current==='zh'?'EN':'中文'};const filterCatalog=()=>{const query=document.getElementById('search').value.trim().toLowerCase();const category=document.getElementById('filter').value;let visibleTotal=0;for(const group of document.querySelectorAll('.catalog-group')){let groupCount=0;for(const row of group.querySelectorAll('.catalog-row')){const visible=(category==='all'||group.dataset.category===category)&&(!query||row.dataset.search.includes(query));row.hidden=!visible;if(visible)groupCount++}group.hidden=groupCount===0;visibleTotal+=groupCount}document.getElementById('empty').style.display=visibleTotal?'none':'block'};document.getElementById('lang').addEventListener('click',()=>{localStorage.setItem('xget-lang',language()==='zh'?'en':'zh');applyLanguage()});document.getElementById('search').addEventListener('input',filterCatalog);document.getElementById('filter').addEventListener('change',filterCatalog);document.querySelectorAll('.copy').forEach(button=>button.addEventListener('click',async()=>{const code=button.closest('.command').querySelector('code').textContent;try{await navigator.clipboard.writeText(code)}catch{return}const original=button.textContent;button.textContent=language()==='zh'?'已复制':'Copied';setTimeout(()=>{button.textContent=original},1400)}));applyLanguage();filterCatalog()})();
  </script>
</body>
</html>`;
}
