# Āto License Generator

Create intellectual property licenses for all your NFTs. 

## Overview

The [`ato-api-form.html`](https://github.com/ATO-nft/api-client/blob/main/ato-api-form.html) page includes a form displaying parameters to set. When the form is submitted, the API sends an intellectual property license (pdf file) in response (in English and French). This file can then be stored and added to the NFT metadata. 

## Test

Go to [this web page](https://ato.works/) and click on the `Download License` button.

## Authentication

There is no access restriction on the demo version.

To use the testnet version, please contact us to get your API key ([Discord](https://discord.gg/2sFr3dqvfg) or [email](mailto:julien@ato.network)). 

## Parameters

- `ArtworkName`: the name of the NFT
- `FileName`: the name of the media file linked with the NFT
- `FileType`: the extension of the media file
- `FileSize`: the size of of the media file
- `CreatorName`: the name of the NFT creator
- `CreatorAddress`: the Ethereum adddress of the NFT creator
- `ListNetwork`: the network to which the NFT is published
- `RightLevel`: private use, public use limited to resale, or public use for all purposes 
- `RightAdapt`: right to adapt (bool)
- `RightLogo`: right to add a logo (bool)
- `RightMerch`: merchandising right (bool)
- `RightDuration`: duration of the rights
- `SupplyNumber`: number of editions of the NFT
- `RightExclusive`: exclusivity of 
- `NonReissuance`: non-reissuance guarantee (bool)
- `ResaleRight`: percentage of resale right
- `VersionApi`: version of the API
- `NftLicense`: the type of license (art, gaming or redeemable)
- `NftStandard`: NFT standard (ERC-721 or ERC-1155)

## Change log

#### v0.9.3-beta

- Added API key
- Added payment Solidity contract (Rinkeby)

#### v0.9.0-beta 

- Initial version

## Support

- Email: [julien@ato.network](mailto:julien@ato.network)
- Discord: [https://discord.gg/2sFr3dqvfg](https://discord.gg/2sFr3dqvfg)
- Twitter: [https://twitter.com/julienbrg](https://twitter.com/julienbrg)



