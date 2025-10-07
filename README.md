# pokepixel

A recreation of the classic Pokemon Red/Blue games built with React and TypeScript. This project aims to recreate the original Pokemon experience in the browser, maintaining the authentic feel while leveraging modern web technologies.

<img width="1675" alt="image" src="https://github.com/papes11/pokepixel/blob/80de266b080c9bf8ce375139cfcb8f914a4ba4bf/Screenshot%20(137).png" />

## Features

- 🎮 Classic Pokemon gameplay mechanics
- 🗺️ Multiple maps and locations from the original games
- ⚔️ Turn-based battle system
- 🎵 Original game music and sound effects
- 📱 Responsive design with GameBoy-style interface
- 💾 Save/Load game functionality
- 🏪 PokeMart and Pokemon Center implementations
- 📦 Item and inventory system
- 🎯 Trainer battles
- 🌿 Wild Pokemon encounters
- 📱 Mobile-friendly controls

## Tech Stack

- React 18
- TypeScript
- Redux Toolkit for state management
- Styled Components for styling
// Removed Firebase hosting

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/.git
cd pokepixel
```

2. Install dependencies:

```bash
yarn install
```

3. Start the development server:

```bash
yarn start
```

The game will be available at `http://localhost:3000`

## Controls

- **Arrow Keys**: Move character
- **Space**: Menu
- **Enter**: Confirm
- **Space**: Pause

## Project Structure

- `/src/components`: React components for game UI
- `/src/maps`: Game map data and configurations
- `/src/state`: Redux store and state management
- `/src/assets`: Game assets (sprites, music, etc.)
- `/src/styles`: Global styles and theme configurations

## Environment Variables

Create a `.env.local` in the project root with:

```bash
NEXT_PUBLIC_RECIPIENT_ADDRESS=Emo62hDD3NppK3K7A5PLF7CwEy2eJpCYnVM6zMwtjZ16
RPC_ENDPOINT=https://api.devnet.solana.com
MERKLE_TREE_ADDRESS=REPLACE_WITH_YOUR_TREE
SIGNER_SECRET_KEY=REPLACE_WITH_B58_SECRET_ON_SERVER
MINT_NAME=QN Pixel
MINT_SYMBOL=QNPIX
MINT_URI=https://qn-shared.quicknode-ipfs.com/ipfs/QmQFh6WuQaWAMLsw9paLZYvTsdL5xJESzcoSxzb6ZU3Gjx
MINT_SELLER_FEE_BPS=500
```

On Vercel, set `RPC_ENDPOINT`, `MERKLE_TREE_ADDRESS`, `SIGNER_SECRET_KEY`, and the optional mint metadata as Project Environment Variables. Do not expose `SIGNER_SECRET_KEY` as public.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Special thanks to

- [darkmurkrow YouTube channel](https://www.youtube.com/@darkmurkrow) for uploading playthroughs of the game used for reference
- [Brandon Smith](https://www.brandons.me/) for creating the [Gameboy Codepen](https://codepen.io/brundolf/pen/beagbQ) used for the mobile view
- [luttje](https://github.com/luttje) for creating the [Pokemon GameBoy CSS](https://github.com/luttje/css-pokemon-gameboy/tree/main) used for some styling
- [The Spriters Resource](https://www.spriters-resource.com/game_boy_gbc/pokemonredblue/) for uploading sprites and assets used
- [Video Game Music](https://downloads.khinsider.com/game-soundtracks/album/pokemon-game-boy-pok-mon-sound-complete-set-play-cd) for uploading the music and sounds used
- [Strategy Wiki](https://strategywiki.org/wiki/Pok%C3%A9mon_Red_and_Blue/Walkthrough) for uploading information on trainers, maps and items

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This is a fan-made project and is not affiliated with or endorsed by Nintendo, Game Freak, or The Pokemon Company. All Pokemon-related content is property of their respective owners.
