export interface Setting {
  displays: {
    ["peoples-records"]: string
    evaluation: string
  }
}

export type Category = "displays";
export type Id = "evaluation" | "peoples-records";