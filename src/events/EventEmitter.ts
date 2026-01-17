import { EventEmitter as NodeEventEmitter } from "events";

// Define event types
export enum AppEvents {
  JOB_CREATED = "job:created",
  JOB_UPDATED = "job:updated",
  JOB_DELETED = "job:deleted",
  USER_REGISTERED = "user:registered",
  APPLICATION_SUBMITTED = "application:submitted",
}

// Event payload types
export interface JobCreatedPayload {
  jobId: number;
  companyId: number;
  title: string;
}

export interface JobUpdatedPayload {
  jobId: number;
  updates: any;
}

export interface JobDeletedPayload {
  jobId: number;
}

export interface UserRegisteredPayload {
  userId: number;
  email: string;
  role: string;
}

export interface ApplicationSubmittedPayload {
  applicationId: number;
  jobId: number;
  userId: number;
}

// Type-safe event map
export interface EventPayloadMap {
  [AppEvents.JOB_CREATED]: JobCreatedPayload;
  [AppEvents.JOB_UPDATED]: JobUpdatedPayload;
  [AppEvents.JOB_DELETED]: JobDeletedPayload;
  [AppEvents.USER_REGISTERED]: UserRegisteredPayload;
  [AppEvents.APPLICATION_SUBMITTED]: ApplicationSubmittedPayload;
}

/**
 * Centralized Event Emitter for Observer Pattern
 * Services can subscribe to events and react accordingly
 */
class AppEventEmitter {
  private emitter: NodeEventEmitter;

  constructor() {
    this.emitter = new NodeEventEmitter();
    this.emitter.setMaxListeners(50); // Increase if needed
  }

  /**
   * Emit an event with type-safe payload
   */
  emit<T extends AppEvents>(event: T, payload: EventPayloadMap[T]): void {
    console.log(`📢 Event emitted: ${event}`, payload);
    this.emitter.emit(event, payload);
  }

  /**
   * Subscribe to an event with type-safe handler
   */
  on<T extends AppEvents>(event: T, handler: (payload: EventPayloadMap[T]) => void | Promise<void>): void {
    this.emitter.on(event, handler);
  }

  /**
   * Subscribe to an event once
   */
  once<T extends AppEvents>(event: T, handler: (payload: EventPayloadMap[T]) => void | Promise<void>): void {
    this.emitter.once(event, handler);
  }

  /**
   * Unsubscribe from an event
   */
  off<T extends AppEvents>(event: T, handler: (payload: EventPayloadMap[T]) => void | Promise<void>): void {
    this.emitter.off(event, handler);
  }

  /**
   * Remove all listeners for an event
   */
  removeAllListeners(event?: AppEvents): void {
    this.emitter.removeAllListeners(event);
  }
}

// Singleton instance
export const appEventEmitter = new AppEventEmitter();
