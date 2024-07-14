# Whitelist Token Sale

A Solana program for managing whitelisted token sales. This program allows for the creation of a token sale with a whitelist, enabling only approved addresses to participate in the sale.

## Program ID

The program has been deployed on Solana devnet with the following Program ID:

```
8CfNbqPDAVDWZhTWEKg475aRzERSkXhRd4R37CHBShhQ
```

## Features

- Initialize a token sale with customizable parameters
- Manage a whitelist of approved buyers
- Enforce purchase limits per wallet
- Track total supply and total sold tokens

## Prerequisites

- Rust and Cargo
- Solana CLI tools
- Node.js and npm
- Anchor framework

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/akshatcoder-hash/whitelist-token-sale.git
   cd whitelist-token-sale
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the program:
   ```
   anchor build
   ```

## Testing

Run the test suite:

```
anchor test
```

## Usage

1. Initialize the sale:
   ```javascript
   await program.methods
     .initialize(price, maxPerWallet, totalSupply)
     .accounts({
       // ... account details
     })
     .rpc();
   ```

2. Add a user to the whitelist:
   ```javascript
   await program.methods
     .addToWhitelist(userPublicKey)
     .accounts({
       // ... account details
     })
     .rpc();
   ```

3. Purchase tokens (for whitelisted users):
   ```javascript
   await program.methods
     .buyTokens(amount)
     .accounts({
       // ... account details
     })
     .rpc();
   ```

## Contributing

We welcome contributions to the Whitelist Token Sale project! Please see our [Contributing Guide](CONTRIBUTING.md) for more details on how to get started.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or concerns, please open an issue on this repository or contact the maintainer:

- GitHub: [@akshatcoder-hash](https://github.com/akshatcoder-hash)
