/**
 * Backfill `status` on orders created before the lifecycle existed.
 *
 *   isDelivered: true  -> completed
 *   isDelivered: false -> placed
 *
 * Idempotent: only touches documents that have no `status` yet. Run with
 * `--dry` to see the counts without writing.
 *
 *   node scripts/migrate-order-status.mjs --dry
 *   node scripts/migrate-order-status.mjs
 */
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import mongoose from "mongoose";

const DRY_RUN = process.argv.includes("--dry");

const run = async () => {
  if (!process.env.CONN_STR) {
    console.error("CONN_STR is not set");
    process.exit(1);
  }

  await mongoose.connect(process.env.CONN_STR);
  const orders = mongoose.connection.db.collection("orders");

  const pending = await orders.countDocuments({ status: { $exists: false } });
  const delivered = await orders.countDocuments({
    status: { $exists: false },
    isDelivered: true,
  });
  const notDelivered = pending - delivered;

  console.log(`orders without a status : ${pending}`);
  console.log(`  -> completed          : ${delivered}`);
  console.log(`  -> placed             : ${notDelivered}`);

  if (DRY_RUN) {
    console.log("\ndry run, nothing written");
    await mongoose.disconnect();
    return;
  }

  if (pending === 0) {
    console.log("nothing to migrate");
    await mongoose.disconnect();
    return;
  }

  const now = new Date();

  const completed = await orders.updateMany(
    { status: { $exists: false }, isDelivered: true },
    {
      $set: {
        status: "completed",
        statusHistory: [{ status: "completed", at: now }],
      },
      // The boolean is now derived from `status` as a virtual.
      $unset: { isDelivered: "" },
    }
  );

  const placed = await orders.updateMany(
    { status: { $exists: false } },
    {
      $set: { status: "placed", statusHistory: [{ status: "placed", at: now }] },
      $unset: { isDelivered: "" },
    }
  );

  console.log(`\nmigrated ${completed.modifiedCount} -> completed`);
  console.log(`migrated ${placed.modifiedCount} -> placed`);

  const remaining = await orders.countDocuments({ status: { $exists: false } });
  console.log(`remaining without status: ${remaining}`);

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
