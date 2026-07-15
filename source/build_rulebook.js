const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  LevelFormat, PageBreak
} = require('docx');
const fs = require('fs');

const ACCENT = "2E5E4E";   // deep alpine green
const ACCENT2 = "8C5A2B";  // rock brown
const LIGHT = "EAF0ED";

// ---------- helpers ----------
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 160 },
    children: [new TextRun({ text, bold: true, color: ACCENT, size: 30 })],
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 100 },
    children: [new TextRun({ text, bold: true, color: ACCENT2, size: 26 })],
  });
}
function p(runs, opts = {}) {
  const children = Array.isArray(runs) ? runs : [new TextRun({ text: runs, size: 22 })];
  return new Paragraph({ spacing: { after: 120 }, children, ...opts });
}
function bullet(text, level = 0) {
  const children = Array.isArray(text) ? text : [new TextRun({ text, size: 22 })];
  return new Paragraph({ numbering: { reference: "bullets", level }, spacing: { after: 60 }, children });
}
function num(text) {
  const children = Array.isArray(text) ? text : [new TextRun({ text, size: 22 })];
  return new Paragraph({ numbering: { reference: "steps", level: 0 }, spacing: { after: 80 }, children });
}
function b(t){ return new TextRun({ text: t, bold: true, size: 22 }); }
function t(t2){ return new TextRun({ text: t2, size: 22 }); }
function cube(color, label){ return new TextRun({ text: label, bold: true, color, size: 22 }); }

// ---------- tables ----------
function cell(text, { bold=false, width, shade=null, color=null, align=AlignmentType.LEFT } = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: shade ? { type: ShadingType.CLEAR, fill: shade, color: "auto" } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({
      alignment: align,
      children: [new TextRun({ text, bold, size: 20, color: color || "000000" })],
    })],
  });
}
function headerRow(labels, widths) {
  return new TableRow({
    tableHeader: true,
    children: labels.map((l, i) => cell(l, { bold: true, width: widths[i], shade: ACCENT, color: "FFFFFF" })),
  });
}
function dataRow(vals, widths, shadeRow=false) {
  return new TableRow({
    children: vals.map((v, i) => cell(v, { width: widths[i], shade: shadeRow ? LIGHT : null,
      align: i === 0 ? AlignmentType.LEFT : AlignmentType.CENTER })),
  });
}
function makeTable(headers, rows, widths) {
  const total = widths.reduce((a,b)=>a+b,0);
  return new Table({
    columnWidths: widths,
    width: { size: total, type: WidthType.DXA },
    borders: {
      top:{style:BorderStyle.SINGLE,size:2,color:"BBBBBB"},
      bottom:{style:BorderStyle.SINGLE,size:2,color:"BBBBBB"},
      left:{style:BorderStyle.SINGLE,size:2,color:"BBBBBB"},
      right:{style:BorderStyle.SINGLE,size:2,color:"BBBBBB"},
      insideHorizontal:{style:BorderStyle.SINGLE,size:1,color:"DDDDDD"},
      insideVertical:{style:BorderStyle.SINGLE,size:1,color:"DDDDDD"},
    },
    rows: [headerRow(headers, widths), ...rows.map((r,i)=>dataRow(r, widths, i%2===1))],
  });
}

const children = [];

// ---------- TITLE ----------
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 400, after: 40 },
  children: [new TextRun({ text: "SUMMIT", bold: true, color: ACCENT, size: 72 })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 40 },
  children: [new TextRun({ text: "A cooperative climbing game", italics: true, color: "888888", size: 22 })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 200 },
  children: [new TextRun({ text: "Reach the summit together", size: 26, color: ACCENT2 })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT } },
  spacing: { after: 240 },
  children: [new TextRun({ text: "", size: 2 })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 40 },
  children: [new TextRun({ text: "RULEBOOK", bold: true, size: 22, color: "888888" })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 300 },
  children: [new TextRun({ text: "For 2\u20134 players \u00B7 Ages 8+ \u00B7 About 45\u201360 minutes", italics: true, size: 20, color: "888888" })],
}));

// ---------- OVERVIEW ----------
children.push(h1("1. Overview"));
children.push(p([
  b("Summit"), t(" is a fully cooperative game about a team of climbers ascending a mountain together. "),
  t("You win — or lose — as a group. The mountain is revealed one step at a time, and the higher you go, the hungrier, colder, and more exhausted your climbers become. "),
  t("The core tension is simple: everything that goes wrong takes up space where your climbing strength should be."),
]));
children.push(p([
  b("Goal: "), t("Get your team from the starting hex to the summit, "), b("20 hexes away"),
  t(", before your climbers are worn down completely."),
]));
children.push(p([b("Players: "), t("2\u20134, fully cooperative. "), b("Length: "), t("about 45\u201360 minutes.")]));

// ---------- THE CUBE ECONOMY (core principle) ----------
children.push(h1("2. The Core Idea: Your Cubes"));
children.push(p([
  t("This is the most important rule in the game. Read it first. "),
  b("Every player holds a fixed number of cubes for the whole game"), t(" — for example, 18. "),
  t("You never gain or lose cubes from your hand. Instead, your cubes "), b("change colour"),
  t(" by swapping them at the shared "), b("pool"), t(" in the middle of the table."),
]));
children.push(p("The colours are:"));
children.push(bullet([cube(ACCENT, "Green = Stamina."), t("  Your usable strength. This is what lets you climb. You start with all green.")]));
children.push(bullet([cube("C9A227", "Yellow = Hunger."), t("  Gained every turn. Removed by eating food.")]));
children.push(bullet([cube("B03A2E", "Red = Damage."), t("  Gained by failing climbs. Removed by healing, bandages, first aid.")]));
children.push(bullet([cube("7B4BA3", "Purple = Poison."), t("  Gained from mushrooms. One wears off on its own each turn.")]));
children.push(bullet([cube(ACCENT2, "Brown = Weight."), t("  Items you carry, or a teammate you're carrying. Returned when you set them down.")]));
children.push(bullet([cube("2E6DA4", "Blue = Cold."), t("  Hard mode only. Gained when alone; removed by teammates and warmth.")]));
children.push(p([
  b("The key principle: "), t("your total cubes never change. When you gain hunger, damage, poison, weight or cold, you "),
  b("hand green cubes to the pool"), t(" and take the coloured cubes in exchange. When you recover, you "),
  b("hand the coloured cubes back"), t(" and take green cubes. So \u201Closing stamina\u201D always means having fewer of your cubes showing green."),
]));
children.push(p([
  t("There is exactly one item — "), b("Climbing Boots"), t(" — that permanently raises your total (see Items & Cards)."),
]));

// ---------- SETUP ----------
children.push(h1("3. Setup"));
children.push(num("Place the starting hex in the middle of the table. All players begin standing on it."));
children.push(num("Reveal the hexes surrounding the starting hex. (Each hex edge shows a number from 1 to 20.)"));
children.push(num([t("Each player chooses a "), b("character class"), t(" (or deal them randomly). Take your starting stamina as that many green cubes.")]));
children.push(num("Place all other cubes in the pool in the middle of the table."));
children.push(num([b("Each player draws one card"), t(" from the deck to start with.")]));

// ---------- CLASSES ----------
children.push(h1("4. Character Classes"));
children.push(p("Each class trades stamina, strength, luck, and support differently. Pick one each (or deal them at random). The Climber is the baseline; every other class is a variation on it."));
children.push(makeTable(
  ["Class", "Stamina", "Identity in one line"],
  [
    ["The Agile", "20", "The pure climber and scout \u2014 nimble, high stamina, ranges ahead."],
    ["The Climber", "18", "The baseline \u2014 no special effects. Every other class is measured against it."],
    ["The Healer", "16", "Removes damage from any player (including itself)."],
    ["The Cook", "16", "Doubles the hunger removed from food fed to a teammate."],
    ["The Strong", "16", "The gear mule \u2014 carries items and fallen teammates cheaply."],
    ["The Gambler", "14", "High variance \u2014 doubles the climb roll, but falls twice as hard."],
    ["The Android", "14", "A tireless machine \u2014 immune to hunger and damage, but never rolls."],
  ],
  [2400, 1400, 6000]
));
children.push(p([new TextRun({ text: "The Climber (18) is the baseline. Specialist classes have a little less stamina, which pays for their special ability; the Agile has more, but carries gear at double weight.", italics: true, size: 20, color: "888888" })]));

children.push(h2("The Climber \u2014 18 stamina (baseline)"));
children.push(p([t("The plain, no-frills character and the reference point for the whole roster: normal stamina, normal item weight, rolls the die normally, no special ability. The best choice for a new player, and the yardstick every other class is defined against.")]));

children.push(h2("The Agile \u2014 20 stamina"));
children.push(p([t("The nimble climber and natural scout. Highest stamina in the game, but not strong: "), b("items weigh double"), t(" for the Agile. Its one great gift is speed: the Agile "), b("may move to two hexes in a single turn"), t(", where every other class is limited to one. Each of those climbs is a separate check with its own die roll and its own risk of damage, so ranging ahead is powerful but never free.")]));

children.push(h2("The Healer \u2014 16 stamina"));
children.push(p([t("At the start of the turn, the Healer rolls the die and removes that much "), b("damage (red)"), t(" from one player \u2014 itself or a teammate. "), b("Healing removes damage only, never hunger."), t(" Any heal beyond a player's current damage is wasted. Invaluable after a rough climb, near-idle when the team is climbing cleanly.")]));

children.push(h2("The Cook \u2014 16 stamina"));
children.push(p([t("Once per turn, the Cook may feed a food card to a "), b("teammate on the same hex"), t(" and double its hunger removal (an apple removes 4 instead of 2). The double applies only to food given to others, not the Cook's own eating \u2014 so the Cook must stay close to the group to shine.")]));

children.push(h2("The Strong \u2014 16 stamina"));
children.push(p([t("Powerful but tires fast. "), b("Items weigh half"), t(" (rounded down) for the Strong, making it the team's gear mule. It also "), b("carries fallen teammates cheaply"), t(" and "), b("keeps a rope after using it"), t(" instead of losing it. Its lower stamina is the price of all that strength.")]));

children.push(h2("The Gambler \u2014 14 stamina"));
children.push(p([t("The Gambler rolls the die once, like everyone else, then "), b("doubles that number"), t(" for the climb (a 6 counts as +12). But the same roll cuts both ways: on a "), b("failed climb it takes double damage"), t(" (fall short by 3, take 6 damage). Its low stamina forces it to lean on the dice \u2014 which is the whole point of the character.")]));

children.push(h2("The Android \u2014 14 stamina"));
children.push(p([t("The Android is a machine, so it "), b("never gets hungry and never takes damage"), t(" \u2014 it never holds yellow or red cubes, and it "), b("cannot be healed"), t(". In exchange, it "), b("never rolls the die on climbs"), t(": it climbs on stamina + buddy bonus + tools only. This caps its climb total at 20 even with full team support, so it can never gamble its way up a hard pitch alone.")]));
children.push(bullet([b("Carrying. "), t("The Android carries fallen teammates at half cost (like the Strong). It does not get the Strong's half-weight discount on items \u2014 keeping the two distinct (Android hauls people; Strong hauls gear).")]));
children.push(bullet([b("Hard-mode fragility. "), t("The Android still gets cold. If it ever reaches 6 blue cubes it freezes permanently and is out of the game. It can only remove blue via teammates or a wool blanket \u2014 so it must not be abandoned in the cold.")]));

// ---------- THE MAP ----------
children.push(h1("5. The Mountain & Movement"));
children.push(h2("Hexes and climbing requirements"));
children.push(p([
  t("The mountain is built from hexes. Each edge of a hex shows a number from "), b("1 to 20"), t(". "),
  t("To move from your current hex to an adjacent one, add together the "), b("two edges that touch"),
  t(" — the edge on your hex and the edge on the hex you're moving to. That sum is the "), b("climbing requirement"), t("."),
]));
children.push(p([new TextRun({ text: "Example: your hex's edge shows 3, and the adjacent hex's touching edge shows 5. The climbing requirement is 3 + 5 = 8.", italics: true, size: 21 })]));
children.push(h2("Revealing the mountain"));
children.push(p("When you move onto a hex for the first time, reveal the hexes around it. The mountain unfolds as you explore."));
children.push(h2("Movement rules"));
children.push(bullet([b("One hex per turn. "), t("Each turn you may move to one new hex \u2014 except the Agile, who may move to two.")]));
children.push(bullet([b("Re-traversing. "), t("You may also move back across hexes you've already visited as many times as you like in a turn, as long as you meet each climbing requirement.")]));
children.push(bullet([b("Descending. "), t("You may climb back down to a visited hex for half the climbing requirement, rounded up.")]));
children.push(p([new TextRun({ text: "Note: \u201Cnew to you\u201D is personal — a hex counts as new even if a teammate has already been there.", italics: true, size: 21 })]));

// ---------- THE TURN ----------
children.push(h1("6. The Turn"));
children.push(p([b("All players take their turns simultaneously."), t(" Each turn, resolve these steps in order:")]));
children.push(num([b("Get hungry. "), t("Every player hands 1 green cube to the pool and takes 1 yellow cube. This happens every turn, unavoidably.")]));
children.push(num([b("Passive effects. "), t("Remove 1 purple (poison) cube if you have any. In hard mode, resolve cold.")]));
children.push(num([b("Healer heals. "), t("The Healer rolls the die and removes that much damage from one player \u2014 itself or a teammate. Damage only; never hunger.")]));
children.push(num([b("Climb / act. "), t("Attempt climbs, use items, trade items, and move.")]));
children.push(p([new TextRun({ text: "A specialist action (the Healer's heal or the Cook's cooking) does not use up your turn \u2014 you may perform it and still climb and move in the same turn.", italics: true, size: 21 })]));

// ---------- CLIMBING ----------
children.push(h1("7. Climbing (the Skill Check)"));
children.push(p([
  t("To attempt a climb, compare your available stamina against the climbing requirement. "),
  b("You do not spend your cubes to climb"), t(" — you simply need to reach the requirement. Your climb total is:"),
]));
children.push(p([new TextRun({ text: "Green stamina  +  die roll  +  buddy bonuses  +  item bonuses", bold: true, size: 23, color: ACCENT })], { alignment: AlignmentType.CENTER }));
children.push(bullet([b("Die roll. "), t("Every climb, roll the die and add it to your total for that climb only. No cubes are exchanged for the roll.")]));
children.push(bullet([b("Buddy bonus. "), t("+3 if a teammate is at the base of the climb (they lift you up), +3 if a teammate is at the top (they pull you up). Maximum +6. No cubes exchanged.")]));
children.push(p([
  b("Success: "), t("if your total meets or exceeds the requirement, you make the climb and move to the new hex."),
]));
children.push(p([
  b("Failure: "), t("if you fall short, you stay on your current hex and take "), b("red damage equal to the amount you missed by"),
  t("."),
]));
children.push(p([new TextRun({ text: "The die roll makes every climb a gamble: a hard climb might just be reachable on a 6, but a low roll means damage. A tough climb can still be worth attempting if you're willing to risk it.", italics: true, size: 21 })]));

// ---------- PASSING OUT ----------
children.push(h1("8. Passing Out & Carrying"));
children.push(p([b("Passing out: "), t("if a player reaches 0 stamina (no green cubes), they pass out and cannot act.")]));
children.push(p([
  b("Carrying: "), t("another player may carry a passed-out teammate. The carrier takes "), b("12 brown (weight) cubes"),
  t(" — the Strong and Android take only 6 — swapping that much of their own green stamina away for as long as they carry. "),
  t("This works like a very heavy item: carrying a teammate makes your own climbs much harder. When you set them down, return the brown cubes for green."),
]));

// ---------- ITEMS ----------
children.push(h1("9. Items & Cards"));
children.push(h2("Drawing cards"));
children.push(bullet([b("Draw on arrival. "), t("Every time you move onto a hex that is new to you, draw one card. No roll needed.")]));
children.push(bullet([b("Inventory limit. "), t("You may hold at most 3 items at a time.")]));
children.push(bullet([b("Trading. "), t("While on the same hex as a teammate, you may hand items to each other freely.")]));
children.push(h2("Weight"));
children.push(p([
  t("Items with a weight cost you stamina to carry. When you pick up an item, take "), b("brown cubes equal to its weight"),
  t(" in exchange for green. Weight is modified by class: "), b("doubled"), t(" for the Agile, "), b("halved and rounded down"),
  t(" for the Strong. Weight returns to green when you discard or give away the item."),
]));

children.push(h2("Food — removes hunger (single use, then discard)"));
children.push(makeTable(
  ["Item", "Weight", "Effect", "In deck"],
  [
    ["Apple", "1", "Remove 2 hunger", "10"],
    ["Trail Mix", "1", "Remove 2 hunger", "10"],
    ["Coconut", "5", "Remove 5 hunger", "10"],
    ["Lollipop", "0", "Remove 1 hunger; +10 stamina for this turn only", "3"],
    ["Poisonous Mushroom", "0", "Roll the die: take that much poison and remove that much hunger", "5"],
  ],
  [3000, 1400, 3800, 1600]
));

children.push(h2("Tools & gear"));
children.push(makeTable(
  ["Item", "Weight", "Effect", "In deck"],
  [
    ["Rope", "2", "A player higher up lets all players below climb free of stamina. Used up afterward (the Strong keeps it instead).", "2"],
    ["Rope Gun", "3", "Everyone on your hex picks one target hex and gets +12 stamina for that climb. Consumed after use.", "2"],
    ["Mushroom Shelf", "2", "When used to move hex-to-hex, all players get double stamina for that climb. Consumed that turn.", "2"],
    ["Chalk Bag", "0", "Re-roll one failed climb die. Single use, then discard.", "4"],
    ["Piton", "1", "On a failed climb, stay put and take no damage. Single use.", "3"],
    ["Bandage", "1", "Remove 2 damage. Single use.", "3"],
    ["First Aid Kit", "2", "Remove up to 4 damage. Single use.", "2"],
    ["Wool Blanket", "2", "Remove 2 cold. Single use.", "2"],
    ["Climbing Boots", "0", "Permanently increase your total stamina by 2, then discard.", "1"],
    ["Rockfall", "0", "Bad draw: all players on your hex take 2 damage, then discard.", "4"],
    ["Nothing", "0", "You find nothing. No effect.", "10"],
  ],
  [2600, 1200, 4400, 1600]
));
children.push(p([new TextRun({ text: "The deck contains 73 cards in total.", italics: true, size: 20, color: "888888" })]));

// ---------- HARD MODE ----------
children.push(h1("10. Hard Mode: Cold"));
children.push(p([b("Blue cubes = cold."), t(" Hard mode adds a pressure that rewards staying together.")]));
children.push(bullet([b("Alone gets cold. "), t("At the start of your turn, if you are on a hex by yourself, take 1 blue cube. It stays until you can warm up.")]));
children.push(bullet([b("Company warms you. "), t("At the start of your turn, if you share a hex with a teammate, remove 1 blue cube.")]));
children.push(bullet([b("Wool Blanket "), t("removes 2 blue when used.")]));
children.push(bullet([b("Android shutdown. "), t("If the Android ever reaches 6 blue cubes, it freezes permanently and is out of the game.")]));

// ---------- HANDICAP VARIANT ----------
children.push(h1("11. Optional Variant: Handicap"));
children.push(p([t("For players who want an extra challenge, this optional variant lets anyone start the game weaker than normal. It can be used with or without hard mode, and each player decides for themselves \u2014 so players of different skill levels can share the same game.")]));
children.push(p([t("When you take your starting stamina, you may "), b("give up as much of it as you like"), t(". For example, the Climber normally starts with 18 green cubes; a player using this variant might choose to start with 16, 14, or fewer. The cubes you give up go to the pool and are gone for the rest of the game.")]));
children.push(bullet([b("Keep at least 6. "), t("You must always start with at least 6 stamina, so a handicapped climber can still make a reasonable climb.")]));
children.push(bullet([b("Everyone chooses their own. "), t("Each player sets their own handicap independently.")]));

// ---------- WIN / LOSE ----------
children.push(h1("12. Winning & Losing"));
children.push(p([b("You win"), t(" when the team reaches the summit, 20 hexes from the start.")]));
children.push(bullet([b("Going alone. "), t("A lone survivor can still win by reaching the summit \u2014 the team may finish with a single climber.")]));
children.push(p([b("You lose"), t(" if all players are passed out at the same time, with no one left to carry the fallen.")]));

const doc = new Document({
  creator: "Summit",
  title: "Summit — Rulebook",
  numbering: {
    config: [
      { reference: "bullets", levels: [
        { level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 460, hanging: 260 } } } },
        { level: 1, format: LevelFormat.BULLET, text: "\u25E6", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 900, hanging: 260 } } } },
      ]},
      { reference: "steps", levels: [
        { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 460, hanging: 260 } } } },
      ]},
    ],
  },
  styles: {
    default: { document: { run: { font: "Calibri", size: 22 } } },
  },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1000, bottom: 1000, left: 1200, right: 1200 } } },
    children,
  }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(__dirname + "/../rules/Summit_Rulebook.docx", buf);
  console.log("written", buf.length);
});
