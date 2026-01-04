function calculateSalary() {
    // --- 1. 設定（ここは画面の入力値から取ってくるように後で変更可） ---
    const hourlyWage = 1000; // 時給
    const taxRate = 0.03;    // 税金3% (0.03)

    // 時間の入力（例：19:00 ～ 翌07:10）
    // 計算しやすいようにすべて「分」に直します
    const startHour = 19;
    const startMin = 0;
    const endHour = 31; // 翌7時は +24して 31時と考えます
    const endMin = 10;
    
    // ★重要：会社の定時ルール（翌03:50）
    const fixTimeHour = 27; // 翌3時は +24して 27時
    const fixTimeMin = 50;
    const fixTimeTotal = fixTimeHour * 60 + fixTimeMin;

    // --- 2. 計算ロジック ---
    
    // 開始と終了を「分」にする
    const startTotal = startHour * 60 + startMin;
    const endTotal = endHour * 60 + endMin;
    
    // 全体の拘束時間
    let totalWorkMinutes = endTotal - startTotal;

    // ここで休憩時間を引く（例として60分引きます）
    // ※実際はここを自動計算ロジックに差し替えます
    const breakMinutes = 60; 
    totalWorkMinutes -= breakMinutes;

    // ★定時と残業の切り分け
    let regularMinutes = 0;
    let overtimeMinutes = 0;

    // 定時（03:50）より前か後かで分ける
    if (endTotal > fixTimeTotal) {
        // 定時を超えている場合
        regularMinutes = (fixTimeTotal - startTotal) - breakMinutes; // ※休憩が定時内にあると仮定
        overtimeMinutes = endTotal - fixTimeTotal; // 3:50以降は全部残業！
    } else {
        // 定時内の場合
        regularMinutes = totalWorkMinutes;
        overtimeMinutes = 0;
    }

    // 金額計算
    const basePay = Math.floor(hourlyWage * (regularMinutes / 60));
    const overtimePay = Math.floor((hourlyWage * 1.25) * (overtimeMinutes / 60));
    
    // ※今回はシンプルにするため深夜手当は割愛していますが、ここに追加できます

    const totalPay = basePay + overtimePay;
    const takeHomePay = Math.floor(totalPay * (1 - taxRate)); // 税引き後

    // --- 3. 結果を画面に表示する（HTML生成） ---
    
    // 残業時間の表示形式を作る（例：3時間20分 / 200分）
    const otHr = Math.floor(overtimeMinutes / 60);
    const otMin = overtimeMinutes % 60;
    const otText = `${otHr}時間${otMin}分 <span style="font-size:0.9em; color:#666;">(${overtimeMinutes}分)</span>`;

    // 結果を表示するエリア（HTML側に <div id="result-area"></div> が必要）
    const resultHtml = `
        <div style="background:#f0f8ff; padding:15px; border-radius:8px; border:2px solid #0070f3;">
            <h3 style="margin-top:0;">💰 支給額: ¥${totalPay.toLocaleString()}</h3>
            <p style="color:#555;">(手取り目安: ¥${takeHomePay.toLocaleString()})</p>
            <hr>
            <p><strong>① 通常勤務</strong><br>
            ${Math.floor(regularMinutes/60)}時間${regularMinutes%60}分<br>
            ¥${basePay.toLocaleString()}</p>
            
            <p><strong>② 残業時間 (単価 ¥${(hourlyWage * 1.25).toLocaleString()})</strong><br>
            ${otText}<br>
            <span style="color:#d32f2f; font-weight:bold;">¥${overtimePay.toLocaleString()}</span></p>
            
            <p style="font-size:0.8em; color:#888;">
            ※定時(${fixTimeHour-24}:${fixTimeMin})以降は自動的に残業(1.25倍)で計算
            </p>
        </div>
    `;

    // 画面に埋め込む
    document.getElementById('result').innerHTML = resultHtml;
}
