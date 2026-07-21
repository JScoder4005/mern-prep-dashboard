export type LogKind = "log" | "info" | "warn" | "error";

export interface LogLine {
  kind: LogKind;
  text: string;
}
