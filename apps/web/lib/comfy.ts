import { nanoid } from "nanoid";
import workflow from "./workflows/base.v1";
const clientId = nanoid();

export function getBaseWorkflow(
  positive: string,
  negative: string,
  seed: number,
  checkpoint: string,
  batchSize: number,
  width: number,
  height: number
) {
  const s = workflow
    .replaceAll("__CLIENT_ID_REPLACE__", clientId)
    .replaceAll("__SEED_REPLACE__", `${seed}`)
    .replaceAll("__CHECKPOINT_REPLACE__", checkpoint)
    .replaceAll("__BATCH_SIZE_REPLACE__", `${batchSize}`)
    .replaceAll("__WIDTH_REPLACE__", `${width}`)
    .replaceAll("__HEIGHT_REPLACE__", `${height}`)
    .replaceAll(
      "__POSITIVE_REPLACE__",
      positive.replaceAll('"', '\\"').replaceAll("\n", "\\n")
    )
    .replaceAll(
      "__NEGATIVE_REPLACE__",
      negative.replaceAll('"', '\\"').replaceAll("\n", "\\n")
    );

  try {
    return JSON.parse(s);
  } catch (e) {
    console.error(e);
  }
}
