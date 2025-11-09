English | [中文](https://github.com/RavenHogWarts/obsidian-next-toc/blob/master/README-zh.md)

# Next TOC
Floating panel displaying the current document's reading progress, table of contents, and navigation aids.

[![GitHub stars](https://img.shields.io/github/stars/RavenHogWarts/obsidian-next-toc?style=flat&label=Stars)](https://github.com/RavenHogWarts/obsidian-next-toc/stargazers)
[![Total Downloads](https://img.shields.io/github/downloads/RavenHogWarts/obsidian-next-toc/total?style=flat&label=Total%20Downloads)](https://github.com/RavenHogWarts/obsidian-next-toc/releases)
[![Latest Downloads](https://img.shields.io/github/downloads/RavenHogWarts/obsidian-next-toc/latest/total?style=flat&label=Latest%20Downloads)](https://github.com/RavenHogWarts/obsidian-next-toc/releases/latest)
[![GitHub License](https://img.shields.io/github/license/RavenHogWarts/obsidian-next-toc?style=flat&label=License)](https://github.com/RavenHogWarts/obsidian-next-toc/blob/master/LICENSE)
[![GitHub Issues](https://img.shields.io/github/issues/RavenHogWarts/obsidian-next-toc?style=flat&label=Issues)](https://github.com/RavenHogWarts/obsidian-next-toc/issues)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/RavenHogWarts/obsidian-next-toc?style=flat&label=Last%20Commit)](https://github.com/RavenHogWarts/obsidian-next-toc/commits/master)

## Installation
### Community plugin market installation

[Click to install](obsidian://show-plugin?id=next-toc), or:

1. Open Obsidian and go to `Settings > Community Plugins`.
2. Search for "Next TOC".
3. Click "Install".

### Manual Installation

1. Download the latest release
2. Copy `main.js`, `styles.css`, and `manifest.json` to your vault's plugins folder: `<vault>/.obsidian/plugins/next-toc/`
3. Reload Obsidian
4. Enable the plugin in Settings → Community Plugins

### BRAT (Recommended for Beta Users)

1. Install [BRAT](https://github.com/TfTHacker/obsidian42-brat) plugin
2. Click "Add Beta plugin" in BRAT settings
3. Enter `RavenHogWarts/obsidian-next-toc`
4. Enable the plugin

## Development

- Clone this repo
- Make sure your NodeJS is at least v16 (`node --version`)
- `npm i` or `yarn` to install dependencies
- `npm run dev` to start compilation in watch mode
- `npm run build` to build the plugin
- `npm run build:local` to build the plugin and copy it to your vault's plugins folder(need create a .env file in the project root and add the line: VAULT_PATH=/path/to/your/vault)
- `npm run version` to bump the version number and update the manifest.json, version.json, package.json
- `npm run release` to build the plugin and bump the version number

## Support

If you encounter any issues or have suggestions:
- [Open an issue](https://github.com/RavenHogWarts/obsidian-next-toc/issues) on GitHub
- [Join the discussion](https://github.com/RavenHogWarts/obsidian-next-toc/discussions) for questions and ideas

If you find this plugin helpful, you can support the development through:
- [afdian](https://afdian.com/a/ravenhogwarts)

## License

This project is licensed under the GPL-3.0 LICENSE - see the [LICENSE](LICENSE) file for details.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=RavenHogWarts/obsidian-next-toc&type=Timeline)](https://www.star-history.com/#RavenHogWarts/obsidian-next-toc&Timeline)
