/**
 * Xget - High-performance acceleration engine for developer resources
 * Copyright (C) Xi Xu
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import { PLATFORM_CATALOG } from '../config/platform-catalog.js';

/** @type {Record<string, string>} */
const LABELS = {
  gh: 'GitHub',
  gist: 'GitHub Gist',
  gl: 'GitLab',
  gitea: 'Gitea',
  codeberg: 'Codeberg',
  sf: 'SourceForge',
  aosp: 'AOSP',
  hf: 'Hugging Face',
  civitai: 'Civitai',
  npm: 'npm',
  pypi: 'PyPI',
  'pypi-files': 'PyPI files',
  conda: 'Conda',
  'conda-community': 'Conda community',
  maven: 'Maven Central',
  apache: 'Apache downloads',
  gradle: 'Gradle plugins',
  homebrew: 'Homebrew',
  'homebrew-api': 'Homebrew API',
  'homebrew-bottles': 'Homebrew bottles',
  rubygems: 'RubyGems',
  cran: 'CRAN',
  cpan: 'CPAN',
  ctan: 'CTAN',
  golang: 'Go modules',
  nuget: 'NuGet',
  crates: 'crates.io',
  packagist: 'Packagist',
  flathub: 'Flathub',
  debian: 'Debian',
  ubuntu: 'Ubuntu',
  fedora: 'Fedora',
  rocky: 'Rocky Linux',
  opensuse: 'openSUSE',
  arch: 'Arch Linux',
  arxiv: 'arXiv',
  fdroid: 'F-Droid',
  jenkins: 'Jenkins',
  'cr-docker': 'Docker Hub',
  'cr-quay': 'Quay.io',
  'cr-gcr': 'Google Container Registry',
  'cr-mcr': 'Microsoft Container Registry',
  'cr-ecr': 'Amazon ECR',
  'cr-ghcr': 'GitHub Container Registry',
  'cr-gitlab': 'GitLab Registry',
  'cr-redhat': 'Red Hat Registry',
  'cr-oracle': 'Oracle Registry',
  'cr-cloudsmith': 'Cloudsmith',
  'cr-digitalocean': 'DigitalOcean Registry',
  'cr-vmware': 'VMware Registry',
  'cr-k8s': 'Kubernetes Registry',
  'cr-heroku': 'Heroku Registry',
  'cr-suse': 'SUSE Registry',
  'cr-opensuse': 'openSUSE Registry',
  'cr-gitpod': 'Gitpod Registry',
  'ip-openai': 'OpenAI',
  'ip-vertexai': 'Vertex AI',
  'ip-mistralai': 'Mistral AI',
  'ip-xai': 'xAI',
  'ip-githubmodels': 'GitHub Models',
  'ip-nvidiaapi': 'NVIDIA API',
  'ip-huggingface': 'Hugging Face Inference',
  'ip-voyageai': 'Voyage AI',
  'ip-falai': 'Fal AI',
  'ip-openrouter': 'OpenRouter',
  'ip-featherlessai': 'Featherless AI'
};

/**
 * Inline brand marks used by the original landing page. These are static
 * strings, kept here so the current catalog-driven layout can still render
 * the original SVG identity without adding a third-party asset dependency.
 * @type {Record<string, string>}
 */
const PLATFORM_ICONS = {
  gh: '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>',
  gl: '<svg viewBox="0 0 24 24" fill="#fc6d26" aria-hidden="true"><path d="M4.845.904c-.435 0-.82.28-.955.692C2.639 5.449 1.246 9.728.07 13.335a1.437 1.437 0 00.522 1.607l11.071 8.045c.2.145.472.144.67-.004l11.073-8.04a1.436 1.436 0 00.522-1.61c-1.285-3.942-2.683-8.256-3.817-11.746a1.004 1.004 0 00-.957-.684h-.001c-.576 0-1.076.381-1.236.935l-2.38 7.312H8.465L6.085 1.84a1.29 1.29 0 00-1.24-.936z"/></svg>',
  npm: '<svg viewBox="0 0 24 24" fill="#cb3837" aria-hidden="true"><path d="M0 7.334v8.666h9.334V24h5.332v-8h5.334v-8.666z"/></svg>',
  pypi: '<svg viewBox="0 0 24 24" fill="#3775a9" aria-hidden="true"><path d="M12.042 0c-1.753 0-3.312.448-4.676 1.344-1.364.896-2.428 2.14-3.192 3.732-.764 1.592-1.146 3.4-1.146 5.424 0 2.024.382 3.832 1.146 5.424.764 1.592 1.828 2.836 3.192 3.732 1.364.896 2.923 1.344 4.676 1.344 1.753 0 3.312-.448 4.676-1.344 1.364-.896 2.428-2.14 3.192-3.732.764-1.592 1.146-3.4 1.146-5.424 0-2.024-.382-3.832-1.146-5.424-.764-1.592-1.828-2.836-3.192-3.732C15.354.448 13.795 0 12.042 0zm0 2.4c1.168 0 2.208.3 3.12.9.912.6 1.62 1.428 2.124 2.484.504 1.056.756 2.268.756 3.636 0 1.368-.252 2.58-.756 3.636-.504 1.056-1.212 1.884-2.124 2.484-.912.6-1.952.9-3.12.9-1.168 0-2.208-.3-3.12-.9-.912-.6-1.62-1.428-2.124-2.484-.504-1.056-.756-2.268-.756-3.636 0-1.368.252-2.58.756-3.636.504-1.056 1.212-1.884 2.124-2.484.912-.6 1.952-.9 3.12-.9z"/></svg>',
  'cr-docker':
    '<svg viewBox="0 0 24 24" fill="#2496ed" aria-hidden="true"><path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.186m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.186.186 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.084.185.185.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.185.185v1.888c0 .102.084.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288z"/></svg>',
  'cr-ghcr':
    '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>',
  maven:
    '<svg viewBox="0 0 24 24" fill="#c71a36" aria-hidden="true"><path d="M12 0L1.605 6v12L12 24l10.395-6V6L12 0zm6.792 16.464l-6.792 3.92-6.792-3.92V7.536l6.792-3.92 6.792 3.92v8.928z"/></svg>',
  crates:
    '<svg viewBox="0 0 24 24" fill="#dea584" aria-hidden="true"><path d="M23.834 8.101a13.912 13.912 0 01-13.643 11.72 10.105 10.105 0 01-1.994-.12 6.111 6.111 0 01-5.082-5.761 5.934 5.934 0 011.752-4.564 5.015 5.015 0 01-.267-1.79 6.678 6.678 0 01.267-1.79 6.678 6.678 0 012.684-3.49 6.678 6.678 0 014.27-1.486 6.678 6.678 0 014.27 1.486 6.678 6.678 0 012.684 3.49c.18.587.267 1.19.267 1.79a5.015 5.015 0 01-.267 1.79 5.934 5.934 0 011.752 4.564 6.111 6.111 0 01-5.082 5.761 10.105 10.105 0 01-1.994.12 13.912 13.912 0 0013.643-11.72z"/></svg>',
  golang:
    '<svg viewBox="0 0 24 24" fill="#00add8" aria-hidden="true"><path d="M1.811 10.231c-.047 0-.058-.023-.035-.059l.246-.315c.023-.035.081-.058.128-.058h4.172c.046 0 .058.035.035.07l-.199.303c-.023.036-.082.07-.117.07zM.047 11.306c-.047 0-.059-.023-.035-.058l.245-.316c.023-.035.082-.058.129-.058h5.328c.047 0 .07.035.058.07l-.093.28c-.012.047-.058.07-.105.07zm2.828 1.075c-.047-.047-.059-.035-.035-.07l.163-.292c.023-.035.07-.07.117-.07h2.337c.047 0 .07.035.07.082l-.023.28c0 .047-.047.082-.082.082zm12.129-2.36c-.736.187-1.239.327-1.963.514-.176.046-.187.058-.34-.117-.174-.199-.303-.327-.548-.444-.737-.362-1.45-.257-2.115.175-.795.514-1.204 1.274-1.192 2.22.011.935.654 1.706 1.577 1.835.795.105 1.46-.175 1.987-.77.105-.13.198-.27.315-.434H10.47c-.245 0-.304-.152-.222-.35.152-.362.432-.97.596-1.274a.315.315 0 01.292-.187h4.253c-.023.316-.023.631-.07.947a4.983 4.983 0 01-.958 2.29c-.841 1.11-1.94 1.8-3.33 1.986-1.145.152-2.209-.07-3.143-.77-.865-.655-1.356-1.52-1.484-2.595-.152-1.274.222-2.419.993-3.424.83-1.086 1.928-1.776 3.272-2.02 1.098-.2 2.15-.07 3.096.571.62.41 1.063.97 1.356 1.648.07.105.023.164-.117.2z"/></svg>',
  nuget:
    '<svg viewBox="0 0 24 24" fill="#004880" aria-hidden="true"><path d="M12 0L1.75 6v12L12 24l10.25-6V6zm0 2.25L19.5 6.5v11L12 21.75 4.5 17.5v-11z"/></svg>',
  rubygems:
    '<svg viewBox="0 0 24 24" fill="#e9573f" aria-hidden="true"><path d="M8.277 14.976L5.654 24l10.855-6.262-8.232-2.762zm15.655-4.513L21.478 0H2.522L0 10.463l12 4.024 11.932-4.024z"/></svg>',
  conda:
    '<svg viewBox="0 0 24 24" fill="#43b02a" aria-hidden="true"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"/></svg>',
  hf: '<svg viewBox="0 0 24 24" fill="#ffcc00" aria-hidden="true"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4a2 2 0 110 4 2 2 0 010-4zm-4 6h8v2H8v-2zm0 4h8v2H8v-2z"/></svg>',
  'ip-openai':
    '<svg viewBox="0 0 24 24" fill="#10a37f" aria-hidden="true"><path d="M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 0012 0a6.065 6.065 0 00-5.256 3.011 6.046 6.046 0 00-6.51 2.9 5.985 5.985 0 00-.516 4.91 6.046 6.046 0 00.516 4.91 6.046 6.046 0 006.51 2.9A6.065 6.065 0 0012 24a6.065 6.065 0 005.256-3.011 6.046 6.046 0 006.51-2.9 5.985 5.985 0 00.516-4.91z"/></svg>'
};

/** @type {Record<string, string>} */
const ICON_ALIASES = {
  gist: 'gh',
  'pypi-files': 'pypi',
  'conda-community': 'conda',
  'ip-githubmodels': 'gh',
  'ip-huggingface': 'hf',
  'cr-gitlab': 'gl'
};

const FALLBACK_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M8 12h8M12 8v8"/></svg>';

/**
 * Creates a compact, deterministic mark for platforms without a bundled
 * brand path. The generated SVG stays readable at catalog icon sizes and
 * avoids network requests for third-party assets.
 * @param {string} key Platform catalog key.
 * @returns {string} Inline SVG markup.
 */
function createMonogramIcon(key) {
  const label = LABELS[key] || key.replace(/^(ip|cr)-/, '').replace(/-/g, ' ');
  const words = label.match(/[a-z\d]+/gi) || ['?'];
  const initials =
    words.length === 1
      ? words[0].slice(0, 2).toUpperCase()
      : `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  const hue = Array.from(key).reduce(
    (hash, character) => (hash * 31 + character.charCodeAt(0)) % 360,
    0
  );

  return `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="1" y="1" width="22" height="22" rx="5" fill="hsl(${hue} 58% 38%)"/><text x="12" y="12.5" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="8" font-weight="700">${initials}</text></svg>`;
}

/**
 * Returns the static SVG mark for a platform key.
 * @param {string} key Platform catalog key.
 * @returns {string} Inline SVG markup.
 */
export function getPlatformIcon(key) {
  const alias = ICON_ALIASES[key];
  return PLATFORM_ICONS[key] || (alias && PLATFORM_ICONS[alias]) || createMonogramIcon(key);
}

/**
 * Returns all SVG marks for safe embedding in the landing page.
 * @returns {Record<string, string>} Inline SVG marks.
 */
export function getPlatformIcons() {
  return {
    ...Object.fromEntries(Object.keys(PLATFORM_CATALOG).map(key => [key, getPlatformIcon(key)])),
    default: FALLBACK_ICON
  };
}

/** @type {Record<string, string>} */
const CATEGORY_LABELS = {
  code: 'Code and files',
  package: 'Package registries',
  mirror: 'System mirrors',
  ai: 'AI APIs',
  container: 'Container registries'
};

/**
 * Categorizes a platform for the public catalog.
 * @param {string} key Platform catalog key.
 * @returns {string} Catalog category.
 */
function categoryForKey(key) {
  if (key.startsWith('ip-')) return 'ai';
  if (key.startsWith('cr-')) return 'container';
  if (['debian', 'ubuntu', 'fedora', 'rocky', 'opensuse', 'arch'].includes(key)) return 'mirror';
  if (
    [
      'npm',
      'pypi',
      'pypi-files',
      'conda',
      'conda-community',
      'maven',
      'apache',
      'gradle',
      'homebrew',
      'homebrew-api',
      'homebrew-bottles',
      'rubygems',
      'cran',
      'cpan',
      'ctan',
      'golang',
      'nuget',
      'crates',
      'packagist',
      'flathub'
    ].includes(key)
  )
    return 'package';
  return 'code';
}

/**
 * Creates a readable fallback label for an unknown platform key.
 * @param {string} key Platform catalog key.
 * @returns {string} Human-readable platform label.
 */
function humanizeKey(key) {
  return key
    .replace(/^(ip|cr)-/, '')
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/**
 * Returns public metadata derived from the request routing catalog.
 * @returns {Array<{key: string, label: string, host: string, basePath: string, prefix: string, category: string}>} Platform entries.
 */
export function getPlatformEntries() {
  return Object.entries(PLATFORM_CATALOG).map(([key, baseUrl]) => {
    const upstream = new URL(baseUrl);
    return {
      key,
      label: LABELS[key] || humanizeKey(key),
      host: upstream.hostname,
      basePath: upstream.pathname === '/' ? '' : upstream.pathname.replace(/\/$/, ''),
      prefix: `/${key.replace(/-/g, '/')}/`,
      category: categoryForKey(key)
    };
  });
}

/**
 * Builds the data-only host lookup shared by the browser and unit tests.
 * `kind` selects the few source formats that are not a direct path mapping.
 * @returns {Record<string, {key?: string, stripPath?: string, kind?: string}>} Host conversion rules.
 */
export function getConverterHosts() {
  /** @type {Record<string, {key?: string, stripPath?: string, kind?: string}>} */
  const hosts = {};
  for (const entry of getPlatformEntries()) {
    if (!entry.key.startsWith('homebrew')) {
      hosts[entry.host] = { key: entry.key, stripPath: entry.basePath || undefined };
    }
  }

  Object.assign(hosts, {
    'raw.githubusercontent.com': { kind: 'github-raw' },
    'formulae.brew.sh': { key: 'homebrew-api', stripPath: '/api' },
    'www.npmjs.com': { kind: 'npm-page' },
    'npmjs.com': { kind: 'npm-page' },
    'registry.npmjs.com': { key: 'npm' },
    'pypi.python.org': { key: 'pypi' },
    'files.pythonhosted.org': { key: 'pypi-files' },
    'repo.maven.apache.org': { key: 'maven' },
    'dl.fedoraproject.org': { key: 'fedora' },
    'index.docker.io': { key: 'cr-docker' },
    'docker.io': { kind: 'docker-image' },
    'hub.docker.com': { kind: 'docker-hub-page' }
  });
  return hosts;
}

/**
 * Returns all serializable data required by the URL converter.
 * @returns {{entries: ReturnType<typeof getPlatformEntries>, hosts: ReturnType<typeof getConverterHosts>}} Converter data.
 */
export function getConverterData() {
  return { entries: getPlatformEntries(), hosts: getConverterHosts() };
}

/**
 * Converts a supported upstream URL into an Xget URL.
 * The implementation is self-contained so the same function can run in the
 * generated browser page without maintaining a second conversion algorithm.
 * @param {string} raw User-provided upstream URL.
 * @param {string} origin Public Xget origin.
 * @param {{entries: ReturnType<typeof getPlatformEntries>, hosts: ReturnType<typeof getConverterHosts>}} data Converter metadata.
 * @returns {{url: string, label: string, key: string} | {error: 'invalid' | 'unsupported'}} Conversion result.
 */
export function convertSourceUrl(raw, origin, data) {
  const value = String(raw || '').trim();
  if (!value) return { error: 'invalid' };

  let parsed;
  try {
    const inputUrl = value.startsWith('//')
      ? `https:${value}`
      : /^[a-z][a-z\d+.-]*:\/\//i.test(value)
        ? value
        : `https://${value}`;
    parsed = new URL(inputUrl);
  } catch {
    return { error: 'invalid' };
  }

  if (
    !['http:', 'https:'].includes(parsed.protocol) ||
    parsed.username ||
    parsed.password ||
    parsed.port
  ) {
    return { error: 'invalid' };
  }

  const host = parsed.hostname.toLowerCase();
  const route = data.hosts[host];
  if (!route) return { error: 'unsupported' };

  let key = route.key || '';
  let path = parsed.pathname || '/';

  if (route.kind === 'github-raw') {
    const parts = path.split('/').filter(Boolean);
    if (parts.length < 4) return { error: 'unsupported' };
    const [owner, repository, reference, ...fileParts] = parts;
    if (owner.toLowerCase() === 'homebrew') {
      key = 'homebrew';
      path = `/${repository}/raw/${reference}/${fileParts.join('/')}`;
    } else {
      key = 'gh';
      path = `/${owner}/${repository}/raw/${reference}/${fileParts.join('/')}`;
    }
  } else if (route.kind === 'npm-page') {
    if (!path.startsWith('/package/')) return { error: 'unsupported' };
    const parts = path.slice('/package/'.length).split('/').filter(Boolean);
    const versionMarker = parts.indexOf('v');
    if (versionMarker > 0 && parts[versionMarker + 1]) parts.splice(versionMarker, 1);
    if (!parts.length) return { error: 'unsupported' };
    key = 'npm';
    path = `/${parts.join('/')}`;
  } else if (route.kind === 'docker-image' || route.kind === 'docker-hub-page') {
    let imagePath = path.replace(/^\/+/, '');
    if (route.kind === 'docker-hub-page') {
      if (imagePath.startsWith('_/')) imagePath = imagePath.slice(2);
      else if (imagePath.startsWith('r/')) imagePath = imagePath.slice(2);
      else return { error: 'unsupported' };
    }
    const imageParts = imagePath.split('/').filter(Boolean);
    if (!imageParts.length) return { error: 'unsupported' };
    const finalPart = imageParts.pop() || '';
    const separator = finalPart.lastIndexOf(':');
    const imageName = separator > 0 ? finalPart.slice(0, separator) : finalPart;
    const tag = separator > 0 ? finalPart.slice(separator + 1) : 'latest';
    if (!imageName || !tag) return { error: 'unsupported' };
    imageParts.push(imageName);
    key = 'cr-docker';
    path = `/v2/${imageParts.join('/')}/manifests/${tag}`;
  } else {
    if (host === 'github.com' && /^\/Homebrew(?:\/|$)/i.test(path)) {
      key = 'homebrew';
      path = path.replace(/^\/Homebrew/i, '') || '/';
    } else if (host === 'ghcr.io' && /^\/v2\/homebrew(?:\/|$)/i.test(path)) {
      key = 'homebrew-bottles';
    } else if (
      route.stripPath &&
      (path === route.stripPath || path.startsWith(`${route.stripPath}/`))
    ) {
      path = path.slice(route.stripPath.length) || '/';
    }
  }

  const entry = data.entries.find(item => item.key === key);
  if (!entry || path === '/') return { error: 'unsupported' };

  let publicOrigin;
  try {
    publicOrigin = new URL(origin).origin;
  } catch {
    return { error: 'invalid' };
  }

  const prefix = entry.prefix.replace(/\/$/, '');
  return {
    url: `${publicOrigin}${prefix}${path}${parsed.search}${parsed.hash}`,
    label: entry.label,
    key
  };
}

/**
 * Returns the localized labels used by the documentation filters.
 * @returns {Record<string, string>} Labels for catalog categories.
 */
export function getCategoryLabels() {
  return CATEGORY_LABELS;
}

/**
 * Escapes text before embedding it in HTML markup.
 * @param {unknown} value Value to escape.
 * @returns {string} HTML-safe text.
 */
export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Escapes JSON before embedding it in an inline script.
 * @param {unknown} value Value to serialize.
 * @returns {string} Script-safe JSON.
 */
export function escapeScriptJson(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
