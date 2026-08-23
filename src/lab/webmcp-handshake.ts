export interface WebMcpSubmitEvent {
  readonly agentInvoked?: boolean;
  readonly respondWith?: (result: Promise<unknown>) => void;
  preventDefault(): void;
}

export function handleWebMcpSubmit(
  event: WebMcpSubmitEvent,
  markHandshake: () => unknown,
): boolean {
  event.preventDefault();
  if (event.agentInvoked !== true) {
    return false;
  }

  const result = markHandshake();
  event.respondWith?.(Promise.resolve(result));
  return true;
}
