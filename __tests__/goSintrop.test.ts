import { extractCommands, nodeCommand, pickReleaseAsset } from '../src/utils/goSintrop';

const assets = [
  'go-sintrop-alltools-linux-v1.0.1.zip',
  'go-sintrop-linux-v1.0.1.zip',
  'go-sintrop-linux-v1.0.1.zip.sha256',
  'go-sintrop-osx-v1.0.1.zip',
  'go-sintrop-win64-v1.0.1.zip',
].map(name => ({ name, browser_download_url: `https://example/${name}` }));

describe('pickReleaseAsset', () => {
  it('picks the geth-only zip for each system, never the checksum or alltools bundle', () => {
    expect(pickReleaseAsset(assets, 'ubuntu')?.name).toBe('go-sintrop-linux-v1.0.1.zip');
    expect(pickReleaseAsset(assets, 'macos')?.name).toBe('go-sintrop-osx-v1.0.1.zip');
    expect(pickReleaseAsset(assets, 'windows')?.name).toBe('go-sintrop-win64-v1.0.1.zip');
  });

  it('returns undefined when the release has no file for the system', () => {
    expect(pickReleaseAsset([], 'ubuntu')).toBeUndefined();
  });
});

describe('nodeCommand', () => {
  const address = '0xD5268a415832843E05C0e3979f7294F3F5E4C933';

  it('uses the official flags with the reward address', () => {
    const command = nodeCommand('ubuntu', address);
    expect(command.startsWith('./geth --identity Sintrop')).toBe(true);
    expect(command).toContain('--networkid 250225');
    expect(command).toContain(`--miner.etherbase=${address} console`);
  });

  it('calls geth.exe on Windows', () => {
    expect(nodeCommand('windows', address).startsWith('.\\geth.exe ')).toBe(true);
  });

  it('keeps the placeholder address when none is given', () => {
    expect(nodeCommand('macos', '')).toContain('--miner.etherbase=0x0000000000000000000000000000000000000000');
  });
});

describe('extractCommands', () => {
  it('lifts the Gatekeeper quarantine only on macOS', () => {
    expect(extractCommands('macos', 'go-sintrop-osx-v1.0.1.zip')).toContain('xattr -d com.apple.quarantine geth');
    expect(extractCommands('ubuntu', 'go-sintrop-linux-v1.0.1.zip')).not.toContain('xattr -d com.apple.quarantine geth');
    expect(extractCommands('windows', 'go-sintrop-win64-v1.0.1.zip')).toEqual([]);
  });
});
