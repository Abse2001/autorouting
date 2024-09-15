import type { AnySoupElement } from "@tscircuit/soup"
import type { Obstacle } from "../types"
import { getObstaclesFromRoute } from "./getObstaclesFromRoute"
import type { ConnectivityMap } from "circuit-json-to-connectivity-map"

const EVERY_LAYER = ["top", "inner1", "inner2", "bottom"]

export const getObstaclesFromCircuitJson = (
  soup: AnySoupElement[],
  connMap?: ConnectivityMap,
) => {
  const withNetId = (idList: string[]) =>
    connMap
      ? idList.concat(
          idList.map((id) => connMap?.getNetConnectedToId(id)!).filter(Boolean),
        )
      : idList
  const obstacles: Obstacle[] = []
  for (const element of soup) {
    if (element.type === "pcb_smtpad") {
      if (element.shape === "circle") {
        obstacles.push({
          // @ts-ignore
          type: "oval",
          layers: [element.layer],
          center: {
            x: element.x,
            y: element.y,
          },
          width: element.radius * 2,
          height: element.radius * 2,
          connectedTo: withNetId([element.pcb_smtpad_id]),
        })
      } else if (element.shape === "rect") {
        obstacles.push({
          type: "rect",
          layers: [element.layer],
          center: {
            x: element.x,
            y: element.y,
          },
          width: element.width,
          height: element.height,
          connectedTo: withNetId([element.pcb_smtpad_id]),
        })
      }
    } else if (element.type === "pcb_keepout") {
      if (element.shape === "circle") {
        obstacles.push({
          // @ts-ignore
          type: "oval",
          layers: element.layers,
          center: {
            x: element.center.x,
            y: element.center.y,
          },
          width: element.radius * 2,
          height: element.radius * 2,
          connectedTo: [],
        })
      } else if (element.shape === "rect") {
        obstacles.push({
          type: "rect",
          layers: element.layers,
          center: {
            x: element.center.x,
            y: element.center.y,
          },
          width: element.width,
          height: element.height,
          connectedTo: [],
        })
      }
    } else if (element.type === "pcb_hole") {
      if (element.hole_shape === "oval") {
        obstacles.push({
          // @ts-ignore
          type: "oval",
          center: {
            x: element.x,
            y: element.y,
          },
          width: element.hole_width,
          height: element.hole_height,
          connectedTo: [],
        })
      } else if (element.hole_shape === "square") {
        obstacles.push({
          type: "rect",
          layers: EVERY_LAYER,
          center: {
            x: element.x,
            y: element.y,
          },
          width: element.hole_diameter,
          height: element.hole_diameter,
          connectedTo: [],
        })
      } else if (element.hole_shape === "round") {
        obstacles.push({
          type: "rect",
          layers: EVERY_LAYER,
          center: {
            x: element.x,
            y: element.y,
          },
          width: element.hole_diameter,
          height: element.hole_diameter,
          connectedTo: [],
        })
      }
    } else if (element.type === "pcb_plated_hole") {
      if (element.shape === "circle") {
        obstacles.push({
          // @ts-ignore
          type: "oval",
          layers: EVERY_LAYER,
          center: {
            x: element.x,
            y: element.y,
          },
          width: element.outer_diameter,
          height: element.outer_diameter,
          connectedTo: withNetId([element.pcb_plated_hole_id]),
        })
      } else if (element.shape === "oval" || element.shape === "pill") {
        obstacles.push({
          // @ts-ignore
          type: "oval",
          layers: EVERY_LAYER,
          center: {
            x: element.x,
            y: element.y,
          },
          width: element.outer_width,
          height: element.outer_height,
          connectedTo: withNetId([element.pcb_plated_hole_id]),
        })
      }
    } else if (element.type === "pcb_trace") {
      const traceObstacles = getObstaclesFromRoute(
        element.route.map((rp) => ({
          x: rp.x,
          y: rp.y,
          layer: "layer" in rp ? rp.layer : rp.from_layer,
        })),
        element.source_trace_id!,
      )
      obstacles.push(...traceObstacles)
    } else if (element.type === "pcb_via") {
      obstacles.push({
        type: "rect",
        layers: element.layers,
        center: {
          x: element.x,
          y: element.y,
        },
        connectedTo: [], // TODO we can associate source_ports with this via
        width: element.outer_diameter,
        height: element.outer_diameter,
      })
    }
  }
  return obstacles
}
