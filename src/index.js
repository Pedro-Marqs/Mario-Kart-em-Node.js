const bd_characters = require("./characters.js");
const prompt = require("prompt-sync")();

console.log("Escolha seu personagem:");
console.log("(1) Mario");
console.log("(2) Peach");
console.log("(3) Yoshi");
console.log("(4) Bowser");
console.log("(5) Luigi");
console.log("(6) Donkey Kong");
let option = parseInt(prompt("> "));

function chooseCharacter(x) {
  switch (x) {
    case 1:
      return { nome: "Mario", ...bd_characters["Mario"] };
      break;
    case 2:
      return { nome: "Peach", ...bd_characters["Peach"] };
      break;
    case 3:
      return { nome: "Yoshi", ...bd_characters["Yoshi"] };
      break;
    case 4:
      return { nome: "Bowser", ...bd_characters["Bowser"] };
      break;
    case 5:
      return { nome: "Luigi", ...bd_characters["Luigi"] };
      break;
    case 6:
      return { nome: "Donkey Kong", ...bd_characters["Donkey_Kong"] };
      break;
    default:
      console.log("Personagem inválido!");
      return null;
  }
}

const player1 = chooseCharacter(option);
player1.velocidade = parseInt(player1.Velocidade);
player1.manobrabilidade = parseInt(player1.Manobrabilidade);
player1.poder = parseInt(player1.Poder);
player1.pontos = 0;

function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

console.log(`Você escolheu: ${player1.nome}`);

let option2 = rollDice();
while (option2 === option) {
  option2 = rollDice();
}

const player2 = chooseCharacter(option2);
player2.velocidade = parseInt(player2.Velocidade);
player2.manobrabilidade = parseInt(player2.Manobrabilidade);
player2.poder = parseInt(player2.Poder);
player2.pontos = 0;

console.log(`O PC vai jogar com ${player2.nome}`);

async function getRandomBlock() {
  let random = Math.random();
  let result;

  switch (true) {
    case random < 0.33:
      result = "RETA";
      break;
    case random < 0.66:
      result = "CURVA";
      break;
    default:
      result = "CONFRONTO";
  }

  return result;
}

async function logRollResult(characterName, block, diceResult, attribute) {
  console.log(
    `${characterName} 🎲 rolou um dado de ${block} ${diceResult} + ${attribute} = ${
      diceResult + attribute
    }`
  );
}

async function playRaceEngine(character1, character2) {
  for (let round = 1; round <= 5; round++) {
    console.log(`🏁 Rodada ${round}`);

    let block = await getRandomBlock();
    console.log(`Bloco: ${block}`);

    let diceResult1 = await rollDice();
    let diceResult2 = await rollDice();

    let totalTestSkill1 = 0;
    let totalTestSkill2 = 0;

    if (block === "RETA") {
      totalTestSkill1 = diceResult1 + character1.velocidade;
      totalTestSkill2 = diceResult2 + character2.velocidade;

      await logRollResult(
        player1.nome,
        "VELOCIDADE",
        diceResult1,
        character1.velocidade
      );

      await logRollResult(
        player2.nome,
        "VELOCIDADE",
        diceResult2,
        character2.velocidade
      );
    }
    if (block === "CURVA") {
      totalTestSkill1 = diceResult1 + character1.manobrabilidade;
      totalTestSkill2 = diceResult2 + character2.manobrabilidade;

      await logRollResult(
        player1.nome,
        "MANOBRABILIDADE",
        diceResult1,
        character1.velocidade
      );

      await logRollResult(
        player2.nome,
        "MANOBRABILIDADE",
        diceResult2,
        character2.velocidade
      );
    }
    if (block === "CONFRONTO") {
      let powerResult1 = diceResult1 + character1.poder;
      let powerResult2 = diceResult2 + character2.poder;

      console.log(`${character1.nome} confrontou com ${character2.nome}!🥊`);

      await logRollResult(player1.nome, "PODER", diceResult1, character1.poder);

      await logRollResult(player2.nome, "PODER", diceResult2, character2.poder);

      if (powerResult1 > powerResult2 && character2.pontos > 0) {
        console.log(
          `${character1.nome} venceu o confronto! ${character2.nome} perdeu 1 ponto 🐢`
        );
        character2.pontos--;
      }
      if (powerResult2 > powerResult1 && character1.pontos > 0) {
        console.log(
          `${character2.nome} venceu o confronto! ${character1.nome} perdeu 1 ponto 🐢`
        );
        character1.pontos--;
      }

      console.log(
        powerResult2 == powerResult1
          ? "Confronto empatado! Nenhum ponto foi perdido"
          : ""
      );
    }

    if (totalTestSkill1 > totalTestSkill2) {
      console.log(`${character1.nome} marcou um ponto!`);
      character1.pontos++;
    } else if (totalTestSkill2 > totalTestSkill1) {
      console.log(`${character2.nome} marcou um ponto!`);
      character2.pontos++;
    } else if (totalTestSkill2 === totalTestSkill1 && block != "CONFRONTO") {
      console.log(`Empate! Ninguém marcou ponto!`);
    }
    console.log("----------------------------------");
  }
}

async function declareWinner(character1, character2) {
  console.log("Resultado final:");
  console.log(`${character1.nome}: ${character1.pontos} ponto(s)`);
  console.log(`${character2.nome}: ${character2.pontos} ponto(s)`);

  if (character1.pontos > character2.pontos) {
    console.log(`\n${character1.nome} venceu a corrida! Parabéns!🏆`);
  } else if (character1.pontos < character2.pontos) {
    console.log(`\n${character2.nome} venceu a corrida! Parabéns!🏆`);
  } else {
    console.log("A corrida terminou em empate🤝");
  }
}

(async function main() {
  console.log(
    `🏁🚨 Corrida entre ${player1.nome} e ${player2.nome} começando...\n`
  );

  await playRaceEngine(player1, player2);

  await declareWinner(player1, player2);
})();
