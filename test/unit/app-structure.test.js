import { afterEach, describe, expect, it, vi } from 'vitest';

import { createRequestContext } from '../../src/app/request-context.js';
import { PLATFORM_CATALOG } from '../../src/config/platform-catalog.js';
import { normalizeEffectivePath, resolveTarget } from '../../src/routing/resolve-target.js';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('Application structure', () => {
  it('builds a shared request context for protocol-aware routing', () => {
    const request = new Request('https://example.com/ip/openai/v1/chat/completions', {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://app.example.com',
        'Access-Control-Request-Method': 'POST'
      }
    });

    const context = createRequestContext(request, {
      ALLOWED_METHODS: 'GET,HEAD,POST'
    });

    expect(context.isAI).toBe(true);
    expect(context.isCorsPreflight).toBe(true);
    expect(context.config.SECURITY.ALLOWED_METHODS).toContain('POST');
  });

  it('normalizes Docker host-style paths before resolving upstream targets', () => {
    const url = new URL('https://example.com/v2/cr/ghcr/xixu-me/xget/manifests/latest');
    const normalized = normalizeEffectivePath(url, true);

    expect('effectivePath' in normalized).toBe(true);
    if ('effectivePath' in normalized) {
      expect(normalized.effectivePath).toBe('/cr/ghcr/v2/xixu-me/xget/manifests/latest');

      const target = resolveTarget(url, normalized.effectivePath, PLATFORM_CATALOG);
      expect('response' in target).toBe(false);
      if (!('response' in target)) {
        expect(target.platform).toBe('cr-ghcr');
        expect(target.targetUrl).toBe('https://ghcr.io/v2/xixu-me/xget/manifests/latest');
      }
    }
  });
});
