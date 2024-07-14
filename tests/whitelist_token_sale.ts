import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { WhitelistTokenSale } from "../target/types/whitelist_token_sale";
import { PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createMint } from "@solana/spl-token";
import { assert } from "chai";

describe("whitelist_token_sale", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.WhitelistTokenSale as Program<WhitelistTokenSale>;

  const saleKeypair = Keypair.generate();
  const payerKeypair = Keypair.generate();
  const price = new anchor.BN(1000000); // 1 SOL
  const maxPerWallet = new anchor.BN(5);
  const totalSupply = new anchor.BN(1000);
  let tokenMint: PublicKey;

  before(async () => {
    // Fund the payer account
    const signature = await provider.connection.requestAirdrop(payerKeypair.publicKey, 2 * LAMPORTS_PER_SOL);
    await provider.connection.confirmTransaction(signature);

    // Create a mock token mint for testing
    tokenMint = await createMint(
      provider.connection,
      payerKeypair,
      payerKeypair.publicKey,
      null,
      9
    );
  });

  it("Initializes the sale", async () => {
    await program.methods
      .initialize(price, maxPerWallet, totalSupply)
      .accounts({
        sale: saleKeypair.publicKey,
        tokenMint: tokenMint,
        authority: payerKeypair.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([saleKeypair, payerKeypair])
      .rpc();

    const saleAccount = await program.account.sale.fetch(saleKeypair.publicKey);
    assert.ok(saleAccount.authority.equals(payerKeypair.publicKey));
    assert.ok(saleAccount.tokenMint.equals(tokenMint));
    assert.ok(saleAccount.price.eq(price));
    assert.ok(saleAccount.maxPerWallet.eq(maxPerWallet));
    assert.ok(saleAccount.totalSupply.eq(totalSupply));
    assert.ok(saleAccount.totalSold.eq(new anchor.BN(0)));
  });

  it("Adds a user to the whitelist (simplified)", async () => {
    // Generate a new public key to represent the user being added to the whitelist
    const userPubkey = Keypair.generate().publicKey;

    // Derive the PDA for the whitelist entry
    const [whitelistEntry] = await PublicKey.findProgramAddress(
      [Buffer.from("whitelist"), saleKeypair.publicKey.toBuffer(), userPubkey.toBuffer()],
      program.programId
    );

    try {
      // Call the addToWhitelist instruction
      await program.methods
        .addToWhitelist(userPubkey)
        .accounts({
          sale: saleKeypair.publicKey,
          whitelistEntry,
          authority: payerKeypair.publicKey,
          user: userPubkey,
          systemProgram: SystemProgram.programId,
        })
        .signers([payerKeypair])
        .rpc();

      // Fetch the whitelist entry account and check if it was created correctly
      const whitelistAccount = await program.account.whitelistEntry.fetch(whitelistEntry);
      assert.ok(whitelistAccount.user.equals(userPubkey), "Whitelist entry was not created correctly");

      console.log("User successfully added to whitelist");
    } catch (error) {
      console.error("Error adding user to whitelist:", error);
      console.error("Error details:", error);
      console.error("Error message:", error.message);
      if (error.logs) {
        console.error("Transaction logs:", error.logs);
      }
      throw error;
    }
  });

  // it("Prevents non-whitelisted users from buying tokens", async () => {
  //   const nonWhitelistedBuyer = Keypair.generate();
  //   const [whitelistEntry] = await PublicKey.findProgramAddress(
  //     [Buffer.from("whitelist"), saleKeypair.publicKey.toBuffer(), nonWhitelistedBuyer.publicKey.toBuffer()],
  //     program.programId
  //   );

  //   const [buyerPurchaseAccount] = await PublicKey.findProgramAddress(
  //     [Buffer.from("purchase"), saleKeypair.publicKey.toBuffer(), nonWhitelistedBuyer.publicKey.toBuffer()],
  //     program.programId
  //   );

  //   try {
  //     await program.methods
  //       .buyTokens(new anchor.BN(1))
  //       .accounts({
  //         sale: saleKeypair.publicKey,
  //         whitelistEntry,
  //         tokenVault: tokenVaultKeypair.publicKey,
  //         buyerTokenAccount: nonWhitelistedBuyer.publicKey, // This is just a placeholder
  //         buyerPurchaseAccount,
  //         buyer: nonWhitelistedBuyer.publicKey,
  //         tokenProgram: TOKEN_PROGRAM_ID,
  //         systemProgram: SystemProgram.programId,
  //       })
  //       .signers([nonWhitelistedBuyer])
  //       .rpc();
  //     assert.fail("Expected an error, but none was thrown");
  //   } catch (error) {
  //     assert.include(error.toString(), "User is not whitelisted");
  //   }
  // });
});