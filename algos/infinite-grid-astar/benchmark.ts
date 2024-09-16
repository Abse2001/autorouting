import { runBenchmark } from "benchmark"
import { autoroute } from "./index"

await runBenchmark({
  solver: autoroute,
  solverName: "infgrid-astar",
  verbose: true,
})
