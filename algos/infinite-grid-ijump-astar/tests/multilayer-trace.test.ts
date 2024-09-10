import { getSimpleRouteJson } from "autorouting-dataset"
import { test, expect } from "bun:test"
import { circuitJsonToPcbSvg } from "circuit-to-svg"
import { IJumpAutorouter } from "../v2"

const soup: any = [
  {
    type: "source_port",
    source_port_id: "source_port_0",
    name: "pin1",
    pin_number: 1,
    port_hints: ["-", "left", "pin1", "1"],
    source_component_id: "source_component_0",
  },
  {
    type: "source_port",
    source_port_id: "source_port_1",
    name: "pin2",
    pin_number: 2,
    port_hints: ["+", "right", "pin2", "2"],
    source_component_id: "source_component_0",
  },
  {
    type: "source_component",
    source_component_id: "source_component_0",
    ftype: "simple_resistor",
    name: "R1",
    resistance: 10000,
  },
  {
    type: "source_port",
    source_port_id: "source_port_2",
    name: "pin1",
    pin_number: 1,
    port_hints: ["-", "left", "pin1", "1"],
    source_component_id: "source_component_1",
  },
  {
    type: "source_port",
    source_port_id: "source_port_3",
    name: "pin2",
    pin_number: 2,
    port_hints: ["+", "right", "pin2", "2"],
    source_component_id: "source_component_1",
  },
  {
    type: "source_component",
    source_component_id: "source_component_1",
    ftype: "simple_resistor",
    name: "R2",
    resistance: 10000,
  },
  {
    type: "source_port",
    source_port_id: "source_port_4",
    name: "pin1",
    pin_number: 1,
    port_hints: ["-", "left", "pin1", "1"],
    source_component_id: "source_component_2",
  },
  {
    type: "source_port",
    source_port_id: "source_port_5",
    name: "pin2",
    pin_number: 2,
    port_hints: ["+", "right", "pin2", "2"],
    source_component_id: "source_component_2",
  },
  {
    type: "source_component",
    source_component_id: "source_component_2",
    ftype: "simple_resistor",
    name: "R_obstacle",
    resistance: 10000,
  },
  {
    type: "source_trace",
    source_trace_id: "source_trace_0",
    connected_source_port_ids: ["source_port_1", "source_port_2"],
    connected_source_net_ids: [],
  },
  {
    type: "schematic_component",
    schematic_component_id: "schematic_component_0",
    center: { x: 0, y: 0 },
    rotation: 0,
    size: { width: 1, height: 0.55 },
    source_component_id: "source_component_0",
    symbol_name: "boxresistor_horz",
  },
  {
    type: "schematic_component",
    schematic_component_id: "schematic_component_1",
    center: { x: 0, y: 0 },
    rotation: 0,
    size: { width: 1, height: 0.55 },
    source_component_id: "source_component_1",
    symbol_name: "boxresistor_horz",
  },
  {
    type: "schematic_component",
    schematic_component_id: "schematic_component_2",
    center: { x: 0, y: 0 },
    rotation: 0,
    size: { width: 1, height: 0.55 },
    source_component_id: "source_component_2",
    symbol_name: "boxresistor_horz",
  },
  {
    type: "schematic_port",
    schematic_port_id: "schematic_port_0",
    schematic_component_id: "schematic_component_0",
    center: { x: -0.5, y: 0 },
    source_port_id: "source_port_0",
    facing_direction: "left",
  },
  {
    type: "schematic_port",
    schematic_port_id: "schematic_port_1",
    schematic_component_id: "schematic_component_0",
    center: { x: 0.5, y: 0 },
    source_port_id: "source_port_1",
    facing_direction: "right",
  },
  {
    type: "schematic_port",
    schematic_port_id: "schematic_port_2",
    schematic_component_id: "schematic_component_1",
    center: { x: -0.5, y: 0 },
    source_port_id: "source_port_2",
    facing_direction: "left",
  },
  {
    type: "schematic_port",
    schematic_port_id: "schematic_port_3",
    schematic_component_id: "schematic_component_1",
    center: { x: 0.5, y: 0 },
    source_port_id: "source_port_3",
    facing_direction: "right",
  },
  {
    type: "schematic_port",
    schematic_port_id: "schematic_port_4",
    schematic_component_id: "schematic_component_2",
    center: { x: -0.5, y: 0 },
    source_port_id: "source_port_4",
    facing_direction: "left",
  },
  {
    type: "schematic_port",
    schematic_port_id: "schematic_port_5",
    schematic_component_id: "schematic_component_2",
    center: { x: 0.5, y: 0 },
    source_port_id: "source_port_5",
    facing_direction: "right",
  },
  {
    type: "pcb_component",
    pcb_component_id: "pcb_component_0",
    center: { x: -5, y: 0 },
    width: 1.5999999999999996,
    height: 0.6000000000000001,
    layer: "top",
    rotation: 0,
    source_component_id: "source_component_0",
  },
  {
    type: "pcb_component",
    pcb_component_id: "pcb_component_1",
    center: { x: 5, y: 0 },
    width: 1.5999999999999996,
    height: 0.6000000000000001,
    layer: "top",
    rotation: 0,
    source_component_id: "source_component_1",
  },
  {
    type: "pcb_component",
    pcb_component_id: "pcb_component_2",
    center: { x: 0, y: 0 },
    width: 4.3,
    height: 1.5,
    layer: "top",
    rotation: 0,
    source_component_id: "source_component_2",
  },
  {
    type: "pcb_board",
    pcb_board_id: "pcb_board_0",
    center: { x: 0, y: 0 },
    width: 12,
    height: 10,
  },
  {
    type: "pcb_smtpad",
    pcb_smtpad_id: "pcb_smtpad_0",
    pcb_component_id: "pcb_component_0",
    pcb_port_id: "pcb_port_0",
    layer: "bottom",
    shape: "rect",
    width: 0.6000000000000001,
    height: 0.6000000000000001,
    port_hints: ["1", "left"],
    x: -5.5,
    y: 0,
  },
  {
    type: "pcb_smtpad",
    pcb_smtpad_id: "pcb_smtpad_1",
    pcb_component_id: "pcb_component_0",
    pcb_port_id: "pcb_port_1",
    layer: "bottom",
    shape: "rect",
    width: 0.6000000000000001,
    height: 0.6000000000000001,
    port_hints: ["2", "right"],
    x: -4.5,
    y: 0,
  },
  {
    type: "pcb_smtpad",
    pcb_smtpad_id: "pcb_smtpad_2",
    pcb_component_id: "pcb_component_1",
    pcb_port_id: "pcb_port_2",
    layer: "bottom",
    shape: "rect",
    width: 0.6000000000000001,
    height: 0.6000000000000001,
    port_hints: ["1", "left"],
    x: 4.5,
    y: 0,
  },
  {
    type: "pcb_smtpad",
    pcb_smtpad_id: "pcb_smtpad_3",
    pcb_component_id: "pcb_component_1",
    pcb_port_id: "pcb_port_3",
    layer: "bottom",
    shape: "rect",
    width: 0.6000000000000001,
    height: 0.6000000000000001,
    port_hints: ["2", "right"],
    x: 5.5,
    y: 0,
  },
  {
    type: "pcb_smtpad",
    pcb_smtpad_id: "pcb_smtpad_4",
    pcb_component_id: "pcb_component_2",
    pcb_port_id: "pcb_port_4",
    layer: "top",
    shape: "rect",
    width: 1.5,
    height: 1.5,
    port_hints: ["1", "left"],
    x: -1.4,
    y: 0,
  },
  {
    type: "pcb_smtpad",
    pcb_smtpad_id: "pcb_smtpad_5",
    pcb_component_id: "pcb_component_2",
    pcb_port_id: "pcb_port_5",
    layer: "top",
    shape: "rect",
    width: 1.5,
    height: 1.5,
    port_hints: ["2", "right"],
    x: 1.4,
    y: 0,
  },
  {
    type: "pcb_port",
    pcb_port_id: "pcb_port_0",
    pcb_component_id: "pcb_component_0",
    layers: ["bottom"],
    x: -5.5,
    y: 0,
    source_port_id: "source_port_0",
  },
  {
    type: "pcb_port",
    pcb_port_id: "pcb_port_1",
    pcb_component_id: "pcb_component_0",
    layers: ["bottom"],
    x: -4.5,
    y: 0,
    source_port_id: "source_port_1",
  },
  {
    type: "pcb_port",
    pcb_port_id: "pcb_port_2",
    pcb_component_id: "pcb_component_1",
    layers: ["bottom"],
    x: 4.5,
    y: 0,
    source_port_id: "source_port_2",
  },
  {
    type: "pcb_port",
    pcb_port_id: "pcb_port_3",
    pcb_component_id: "pcb_component_1",
    layers: ["bottom"],
    x: 5.5,
    y: 0,
    source_port_id: "source_port_3",
  },
  {
    type: "pcb_port",
    pcb_port_id: "pcb_port_4",
    pcb_component_id: "pcb_component_2",
    layers: ["top"],
    x: -1.4,
    y: 0,
    source_port_id: "source_port_4",
  },
  {
    type: "pcb_port",
    pcb_port_id: "pcb_port_5",
    pcb_component_id: "pcb_component_2",
    layers: ["top"],
    x: 1.4,
    y: 0,
    source_port_id: "source_port_5",
  },
  {
    type: "pcb_trace_hint",
    pcb_trace_hint_id: "pcb_trace_hint_0",
    pcb_component_id: null,
    pcb_port_id: "pcb_port_1",
    route: [{ x: -3, y: 0, via: true }],
  },
  {
    type: "pcb_trace_hint",
    pcb_trace_hint_id: "pcb_trace_hint_1",
    pcb_component_id: null,
    pcb_port_id: "pcb_port_2",
    route: [{ x: 3, y: 0, via: true }],
  },
]

test("ijump-astar: multilayer trace", () => {
  const input = getSimpleRouteJson(soup)

  const autorouter = new IJumpAutorouter({
    input,
  })

  const traces = autorouter.solveAndMapToTraces()

  expect(circuitJsonToPcbSvg(soup.concat(traces))).toMatchSvgSnapshot(
    import.meta.path,
  )
})
