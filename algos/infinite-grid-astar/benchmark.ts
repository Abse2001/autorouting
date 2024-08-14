import { runBenchmark } from "autorouting-dataset"
import { autoroute } from "./index"

await runBenchmark({
  solver: autoroute,
  solverName: "infgrid-astar",
  verbose: true,
})
