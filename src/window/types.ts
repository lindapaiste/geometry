export interface PropertyLimit {
  min?: number;
  max?: number;
  priority?: number;
}

export interface ISizedText {
  vw?: number;
  vh?: number;
  fontSize?: number;
  width?: number;
}

export interface ISizedView {
  vw?: number;
  vh?: number;
  width?: number;
  height?: number;
}

export type KeysToLimits<Keys extends keyof any> = Partial<
  Record<Keys, PropertyLimit>
>;

export type ObjToLimits<OT> = Partial<Record<keyof OT, PropertyLimit>>;

export type TextSizeLimits = Partial<Record<keyof ISizedText, PropertyLimit>>;

export interface Basis<T> {
  property: keyof T;
  value: number;
}

export interface IScalable<T> {
  scale(value: number): T;
}
