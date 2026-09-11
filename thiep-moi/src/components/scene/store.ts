import { create } from "zustand";

/**
 * Interaction phases for the Nam-branch "diploma tube" reveal:
 *  idle     -> tube sits closed on the table, waiting for the first tap
 *  opening  -> cap lifts off, invitation scroll rises out of the tube
 *  emerged  -> scroll has unfurled into a flat card, waiting for 2nd tap
 *  zooming  -> camera pushes into the card, tube/table fade away
 *  revealed -> placeholder hand-off to the main invitation page
 */
export type ScenePhase = "idle" | "opening" | "emerged" | "zooming" | "revealed";

interface SceneState {
  phase: ScenePhase;
  setPhase: (phase: ScenePhase) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  phase: "idle",
  setPhase: (phase) => set({ phase }),
}));
