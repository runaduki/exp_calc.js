let expTables = {};

fetch("./data/expTables.json")
  .then(response => response.json())
  .then(data => {
    expTables = data;
    console.log("経験値テーブル読み込み完了", expTables);
  })
  .catch(err => console.error("読み込みエラー:", err));

function calcLevel() {
  const type = document.getElementById("typeSelect").value;
  const expInput = document.getElementById("mainInput").value;
  const result = document.getElementById("result");

  let exp = parseInt(expInput, 10);

  console.log("type:", type);
  console.log("exp:", exp);
  console.log("expTables:", expTables);

  if (isNaN(exp) || exp < 0) {
    result.textContent = "正しい累積経験値を入力してください。";
    return;
  }

  const expTable = expTables[type];

  if (!expTable) {
    result.textContent = "データがありません。";
    return;
  }

  let level = 1;
  for (let i = 0; i < expTable.length; i++) {
    if (exp >= expTable[i]) {
      level = i + 1;
    } else {
      break;
    }
  }

  const maxLevel = expTable.length;
  const bloomingLevel = 100;

  let nextLevelExp = expTable[level] || "MAX";
  let toNext = (nextLevelExp !== "MAX") ? nextLevelExp - exp : 0;

  let statusText = "";

  if (level === 99) {
    statusText = "カンスト！";
  } else if (level === bloomingLevel) {
    statusText = "開花🌸";
  } else if (level === maxLevel) {
    statusText = "開花カンスト！";
  }

  result.innerHTML = `
    累積EXP: <strong>${exp}</strong><br>
    ⇒ 極Lv.<strong>${level}</strong><br>
    ${statusText}<br>
    ${nextLevelExp !== "MAX" && level !== maxLevel ? 
      `次まで: <strong>${toNext}</strong> EXP` : ""}
  `;
}

function calc() {
  const mode = document.querySelector('input[name="mode"]:checked').value;

  if (mode === "exp") {
    calcLevel();
  } else {
    calcExpFromLevel();
  }
}

document.querySelectorAll('input[name="mode"]').forEach(radio => {
  radio.addEventListener("change", () => {
    const input = document.getElementById("mainInput");

     input.value = "";
     document.getElementById("result").textContent = "ここに結果が表示されます";

    if (radio.value === "exp") {
      input.placeholder = "累積EXPを入力";
    } else {
      input.placeholder = "目標極Lvを入力";
    }
  });
});

function calcExpFromLevel() {
  const type = document.getElementById("typeSelect").value;
  const levelInput = document.getElementById("mainInput").value;
  const result = document.getElementById("result");

  let level = parseInt(levelInput, 10);

  if (isNaN(level) || level <= 0) {
    result.textContent = "正しいレベルを入力してください。";
    return;
  }

  const expTable = expTables[type];

  if (!expTable) {
    result.textContent = "データがありません。";
    return;
  }

  if (level > expTable.length) {
    result.textContent = "そのレベルは存在しません。";
    return;
  }

  const exp = expTable[level - 1];

  const maxLevel = expTable.length;
  const bloomingLevel = 100;

  let nextLevelExp = expTable[level] || "MAX";
  let toNext = (nextLevelExp !== "MAX") ? nextLevelExp - exp : 0;

  let statusText = "";

  if (level === 99) {
    statusText = "カンスト！";
  } else if (level === bloomingLevel) {
    statusText = "開花🌸";
  } else if (level === maxLevel) {
    statusText = "開花カンスト！";
  }

  result.innerHTML = `
    極Lv.<strong>${level}</strong><br>
    累積EXP: <strong>${exp}</strong><br>
    ${statusText}<br>
    ${nextLevelExp !== "MAX" && level !== maxLevel ? 
      `次まで: <strong>${toNext}</strong> EXP` : ""}
  `;
}

// 初期表示設定
window.addEventListener("DOMContentLoaded", () => {
  const selected = document.querySelector('input[name="mode"]:checked');
  const input = document.getElementById("mainInput");

  if (selected.value === "exp") {
    input.placeholder = "累積EXPを入力";
  } else {
    input.placeholder = "レベルを入力";
  }
});
