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
