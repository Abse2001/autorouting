import { Circuit } from "@tscircuit/core"
import { expect, test } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { getSimpleRouteJson } from "solver-utils"
import { IJumpAutorouter } from "../v2"
import { getDebugSvg } from "./fixtures/get-debug-svg"

test("ijump-astar: intersection with margin", () => {
  const circuit = new Circuit()

  circuit.add(
    <board width="10mm" height="2mm" routingDisabled>
      <resistor name="R1" resistance="1k" footprint="0402" pcbX={-3} />
      <resistor name="R2" resistance="1k" footprint="0402" pcbX={3} />
      <trace from=".R1 > .pin1" to=".R2 > .pin1" />
    </board>,
  )

  const inputCircuitJson = circuit.getCircuitJson()

  const input = getSimpleRouteJson(inputCircuitJson as AnyCircuitElement[])

  const autorouter = new IJumpAutorouter({
    input,
    debug: true,
  })

  const traces = autorouter.solveAndMapToTraces()

  expect(getDebugSvg({ inputCircuitJson, autorouter })).toMatchSvgSnapshot(
    import.meta.path,
  )
})
