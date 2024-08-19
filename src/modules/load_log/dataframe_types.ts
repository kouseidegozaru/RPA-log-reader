interface DataFrameRow {
    userName: string;       // ユーザー名
    machineName: string;    // マシン名
    scenarioName: string;   // シナリオ名
    scenarioPath: string;   // シナリオパス
    startTime: Date;        // 実行開始日時
    endTime: Date;          // 実行終了日時
    runTime: number;        // 実行時間 (単位: 秒)
    triggerType: string;    // トリガー種別
    status: string;         // ステータス（成功か失敗）
    error?: string;         // エラー情報 (エラーがある場合のみ)
}
