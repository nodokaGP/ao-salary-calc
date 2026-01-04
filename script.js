function calculateSalary() {
    // --- 1. 画面の入力値を取得する ---
    const hourlyWage = 1000; // 時給
    const taxRate = 0.03;    // 税金3%

    // HTMLの入力ボックスから値を取ってくる
    const startTimeStr = document.getElementById('startTime').value; // "19:00"
    const endTimeStr = document.getElementById('endTime').value;     // "07:10"
    const breakMinutes = parseInt(document.getElementById('breakMins').value) || 0;

    // 時間(HH:MM)を分に変換する関数
    function timeToMins(timeStr) {
        const parts = timeStr.split(':');
        return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }

    let startTotal = timeToMins(startTimeStr);
    let endTotal = timeToMins(endTimeStr);

    // ★重要：もし終了時間が開始時間より小さければ「翌日」とみなす
    // 例：開始19:00(1140) 終了07:00(420) → 終了に24時間(1440)を足す
    if (endTotal < startTotal) {
        endTotal += 24 * 60;
    }

    // --- 会社の特殊ルール設定 ---
    // 定時境界線：翌03:50 (27:50 = 1670分)
    // ※もし日勤で使うならここを15:50の設定に変える必要がありますが、一旦夜勤専用で
    const fixTimeTotal = 27 * 60 + 50; 

    // --- 2. 計算ロジック (ここは前回と同じ) ---
    
    // 全体の拘束時間
    let totalWorkMinutes = endTotal - startTotal;
    totalWorkMinutes -= breakMinutes; // 休憩を引く

    let regularMinutes = 0;
    let overtimeMinutes = 0;

    // 定時（03:50）判定
    if (endTotal > fixTimeTotal) {
        // 定時を超えている
        // 定時までの時間 - 休憩
        regularMinutes = (fixTimeTotal - startTotal) - breakMinutes;
        
        // もし休憩引きすぎてマイナスになったら0にする（念のため）
        if (regularMinutes < 0) regularMinutes = 0;

        // 3:50以降は全部残業
        overtimeMinutes = endTotal - fixTimeTotal;
    } else {
        // 定時内の場合
        regularMinutes = totalWorkMinutes;
        overtimeMinutes = 0;
    }

    // 金額計算
    const basePay = Math.floor(hourlyWage * (regularMinutes / 60));
    const overtimePay = Math.floor((hourlyWage * 1.25) * (overtimeMinutes / 60));
    const totalPay = basePay + overtimePay;
    const takeHomePay = Math.floor(totalPay * (1 - taxRate));

    // --- 3. 結果表示 ---
    const otHr = Math.floor(overtimeMinutes / 60);
    const otMin = overtimeMinutes % 60;
    const otText = `${otHr}時間${otMin}分 <span style="font-size:0.9em; color:#666;">(${overtimeMinutes}分)</span>`;

    const regHr = Math.floor(regularMinutes / 60);
    const regMin = regularMinutes % 60;

    const resultHtml = `
        <div style="background:#f0f8ff; padding:15px; border-radius:8px; border:2px solid #0070f3; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <h3 style="margin-top:0; border-bottom:1px solid #ddd; padding-bottom:10px;">💰 支給額: ¥${totalPay.toLocaleString()}</h3>
            <p style="color:#555; margin-bottom:0;">(手取り目安: ¥${takeHomePay.toLocaleString()})</p>
            <hr style="border:0; border-top:1px dashed #ccc; margin:15px 0;">
            
            <div style="margin-bottom:15px;">
                <strong>① 通常勤務 (～03:50)</strong><br>
                ${regHr}時間${regMin}分<br>
                ¥${basePay.toLocaleString()}
            </div>
            
            <div>
                <strong>② 残業時間 (単価 ¥1,250)</strong><br>
                ${otText}<br>
                <span style="color:#d32f2f; font-weight:bold; font-size:1.2em;">¥${overtimePay.toLocaleString()}</span>
            </div>
            
            <p style="font-size:0.75em; color:#888; margin-top:15px; text-align:right;">
            ※03:50以降は自動的に残業計算
            </p>
        </div>
    `;

    document.getElementById('result').innerHTML = resultHtml;
}
