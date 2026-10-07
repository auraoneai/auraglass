import {
  dependencyVersion,
  readRepoFile,
} from "./helpers/hostedRuntimeContracts";

describe("Hosted WebSocket runtime contract", () => {
  const websocketSource = readRepoFile("server/websocket-server.js");
  const collaborationClientSource = readRepoFile(
    "src/services/websocket/collaboration-service.ts"
  );

  it("declares server-side WebSocket runtime dependencies needed by the entrypoint", () => {
    expect(dependencyVersion("socket.io")).toBeDefined();
    expect(dependencyVersion("ioredis")).toBeDefined();
    expect(dependencyVersion("jsonwebtoken")).toBeDefined();
  });

  it("requires JWT_SECRET before verifying token-authenticated sockets", () => {
    expect(/const JWT_SECRET = process\.env\.JWT_SECRET/.test(websocketSource)).toBe(
      true
    );
    expect(
      /JWT_SECRET is required to verify authenticated websocket connections/.test(
        websocketSource
      )
    ).toBe(true);
    expect(/jwt\.verify\(token, JWT_SECRET\)/.test(websocketSource)).toBe(true);
  });

  it("gates userId-only anonymous sessions behind an explicit non-production demo setting", () => {
    expect(/ENABLE_DEMO_AUTH|ALLOW_ANONYMOUS_WS/.test(websocketSource)).toBe(
      true
    );
    expect(/NODE_ENV/.test(websocketSource)).toBe(true);
    expect(/production/.test(websocketSource)).toBe(true);
    expect(/else if \(userId\) \{/.test(websocketSource)).toBe(false);
  });

  it("keeps presence, cursor, and selection events scoped to a joined room", () => {
    for (const eventName of [
      "cursor-move",
      "selection-change",
      "update-presence",
    ]) {
      const eventBlockPattern = new RegExp(
        `socket\\.on\\('${eventName}'[\\s\\S]*?const roomId = Array\\.from\\(socket\\.rooms\\)\\.find\\(r => r !== socket\\.id\\);[\\s\\S]*?if \\(roomId\\)`,
        "m"
      );

      expect(websocketSource).toMatch(eventBlockPattern);
    }
  });

  it("treats collaborative editing as explicitly unsupported until real OT/CRDT behavior exists", () => {
    expect(/collaborative-edit/.test(websocketSource)).toBe(true);
    expect(
      /unsupported|not supported|COLLABORATION_EDIT_UNSUPPORTED/i.test(
        websocketSource
      )
    ).toBe(true);
    expect(
      /applyOperationalTransform[\s\S]*placeholder[\s\S]*return operation;/.test(
        websocketSource
      )
    ).toBe(false);
    expect(
      /\/\/ Simplified OT - in production, use a proper OT algorithm/.test(
        websocketSource
      )
    ).toBe(false);
  });

  it("keeps the package collaboration client presence-only for 3.3", () => {
    expect(collaborationClientSource).toMatch(
      /COLLABORATION_EDIT_UNSUPPORTED/
    );
    expect(collaborationClientSource).toMatch(
      /Collaborative document editing is not supported by AuraGlass 3\.3/
    );
    expect(collaborationClientSource).not.toMatch(/operationQueue/);
    expect(collaborationClientSource).not.toMatch(
      /socket\.emit\("collaborative-edit"/
    );
  });
});
