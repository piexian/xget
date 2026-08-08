import { describe, expect, it } from 'vitest';
import {
  convertSourceUrl,
  getConverterData,
  getPlatformEntries
} from '../../src/views/platform-data.js';

const ORIGIN = 'https://xget.example';
const DATA = getConverterData();

/**
 * Converts a test URL using the shared converter data.
 * @param {string} input Test URL.
 */
function convert(/** @type {string} */ input) {
  return convertSourceUrl(input, ORIGIN, DATA);
}

describe('landing page URL converter', () => {
  it.each([
    [
      'github.com/microsoft/vscode/archive/refs/heads/main.zip?download=1',
      'https://xget.example/gh/microsoft/vscode/archive/refs/heads/main.zip?download=1'
    ],
    [
      'https://registry.npmjs.org/react/-/react-18.2.0.tgz',
      'https://xget.example/npm/react/-/react-18.2.0.tgz'
    ],
    [
      'https://repo.maven.apache.org/maven2/org/junit/junit/4.13.2/junit-4.13.2.jar',
      'https://xget.example/maven/maven2/org/junit/junit/4.13.2/junit-4.13.2.jar'
    ],
    [
      'https://dl.fedoraproject.org/pub/fedora/linux/releases/40/Everything/x86_64/os/',
      'https://xget.example/fedora/pub/fedora/linux/releases/40/Everything/x86_64/os/'
    ]
  ])('converts canonical and unambiguous alias URLs: %s', (input, expected) => {
    expect(convert(input)).toMatchObject({ url: expected });
  });

  it('rewrites GitHub raw hosts to GitHub raw routes', () => {
    expect(
      convert('https://raw.githubusercontent.com/microsoft/vscode/main/README.md#top')
    ).toEqual({
      url: 'https://xget.example/gh/microsoft/vscode/raw/main/README.md#top',
      label: 'GitHub',
      key: 'gh'
    });
  });

  it('routes every Homebrew URL family to its distinct prefix', () => {
    expect(
      convert('https://github.com/Homebrew/homebrew-core/raw/HEAD/Formula/g/git.rb')
    ).toMatchObject({
      url: 'https://xget.example/homebrew/homebrew-core/raw/HEAD/Formula/g/git.rb',
      key: 'homebrew'
    });
    expect(
      convert('https://raw.githubusercontent.com/Homebrew/homebrew-core/HEAD/Formula/g/git.rb')
    ).toMatchObject({
      url: 'https://xget.example/homebrew/homebrew-core/raw/HEAD/Formula/g/git.rb',
      key: 'homebrew'
    });
    expect(convert('https://formulae.brew.sh/api/formula/git.json')).toMatchObject({
      url: 'https://xget.example/homebrew/api/formula/git.json',
      key: 'homebrew-api'
    });
    expect(convert('https://ghcr.io/v2/homebrew/core/git/manifests/2.39.0')).toMatchObject({
      url: 'https://xget.example/homebrew/bottles/v2/homebrew/core/git/manifests/2.39.0',
      key: 'homebrew-bottles'
    });
  });

  it('keeps OCI /v2 paths and distinguishes general GHCR traffic', () => {
    expect(convert('https://registry-1.docker.io/v2/library/nginx/manifests/latest')).toMatchObject(
      {
        url: 'https://xget.example/cr/docker/v2/library/nginx/manifests/latest',
        key: 'cr-docker'
      }
    );
    expect(convert('https://ghcr.io/v2/xixu-me/xget/manifests/latest')).toMatchObject({
      url: 'https://xget.example/cr/ghcr/v2/xixu-me/xget/manifests/latest',
      key: 'cr-ghcr'
    });
  });

  it('turns package and image detail pages into usable API routes', () => {
    expect(convert('https://www.npmjs.com/package/@scope/name/v/1.2.3')).toMatchObject({
      url: 'https://xget.example/npm/@scope/name/1.2.3',
      key: 'npm'
    });
    expect(convert('https://hub.docker.com/_/nginx')).toMatchObject({
      url: 'https://xget.example/cr/docker/v2/nginx/manifests/latest',
      key: 'cr-docker'
    });
    expect(convert('docker.io/library/redis:7')).toMatchObject({
      url: 'https://xget.example/cr/docker/v2/library/redis/manifests/7',
      key: 'cr-docker'
    });
  });

  it.each([
    ['', 'invalid'],
    ['not a url', 'invalid'],
    ['ftp://github.com/user/repo', 'invalid'],
    ['https://user:secret@github.com/user/repo', 'invalid'],
    ['https://github.com:8443/user/repo', 'invalid'],
    ['https://example.com/file.zip', 'unsupported'],
    ['https://www.npmjs.com/search?q=vue', 'unsupported'],
    ['https://raw.githubusercontent.com/user/repo/main', 'unsupported']
  ])('rejects unsafe or unsupported input: %s', (input, error) => {
    expect(convert(input)).toEqual({ error });
  });

  it('has a conversion route for every canonical catalog host', () => {
    const exceptions = new Set(['homebrew', 'homebrew-api', 'homebrew-bottles']);
    for (const entry of getPlatformEntries()) {
      if (exceptions.has(entry.key)) continue;
      expect(DATA.hosts[entry.host]).toBeDefined();
      expect(convert(`https://${entry.host}${entry.basePath}/resource`)).toMatchObject({
        key: entry.key
      });
    }
  });
});
