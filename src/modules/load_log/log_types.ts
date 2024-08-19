// types.ts

// RunningLog.json のデータ型
export interface RunningLog {
    TID: string;
    IID: number;
    CT: {
      ScenarioPath: string;
      TriggerType: string;
      IsInterruption: boolean;
      EndTime: {
        TID: string;
        CT: {
          Binary: {
            TID: string;
            IID: number;
            CT: string;
          };
        };
      };
      ScenarioHash: string;
      BeginTime: {
        TID: string;
        CT: {
          Binary: {
            TID: string;
            IID: number;
            CT: string;
          };
        };
      };
      Version: string;
      UserName: string;
      MachineName: string;
    };
    error: ExceptionLog | null;
  }
  
  // ExceptionLog.json のデータ型
  export interface ExceptionLog {
    TID: string;
    IID: number;
    CT: {
      OccuredTime: {
        TID: string;
        CT: {
          Binary: {
            TID: string;
            IID: number;
            CT: string;
          };
        };
      };
      Line: number;
      ErrorMessage: string;
      ErrorDescription: string;
    };
  }
  