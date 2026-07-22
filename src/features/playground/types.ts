export type LogKind = "log" | "info" | "warn" | "error" | "result";

export interface LogLine {
  kind: LogKind;
  text: string;
}
