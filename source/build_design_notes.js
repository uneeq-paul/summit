const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  BorderStyle, LevelFormat
} = require('docx');
const fs = require('fs');

const ACCENT = "2E5E4E";
const ACCENT2 = "8C5A2B";

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 160 },
    children: [new TextRun({ text, bold: true, color: ACCENT, size: 30 })],
  });
}
function p(runs) {
  const children = Array.isArray(runs) ? runs : [new TextRun({ text: runs, size: 22 })];
  return new Paragraph({ spacing: { after: 120 }, children });
}
function bullet(text) {
  const children = Array.isArray(text) ? text : [new TextRun({ text, size: 22 })];
  return new Paragraph({ numbering: { reference: "b", level: 0 }, spacing: { after: 80 }, children });
}
function b(x){ return new TextRun({ text: x, bold: true, size: 22 }); }
function t(x){ return new TextRun({ text: x, size: 22 }); }

const children = [];

children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 200, after: 40 },
  children: [new TextRun({ text: "SUMMIT", bold: true, color: ACCENT, size: 48 })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 40 },
  children: [new TextRun({ text: "Design Notes", color: ACCENT2, size: 30, bold: true })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT } },
  spacing: { after: 200 },
  children: [new TextRun({ text: "", size: 2 })],
}));
children.push(p([new TextRun({ text: "Working notes for the designer \u2014 not part of the player rulebook. This is where ideas that aren't in the game yet, and questions to settle through playtesting, are kept.", italics: true, size: 21, color: "666666" })]));

children.push(h1("Ideas Parking Lot"));
children.push(p("Things that could be added later, once the core game has been played a few times."));
children.push(bullet([b("New biomes. "), t("Reaching the summit could open a new biome with fresh positive and negative effects. Start with a single biome (start to summit) and add more once the base game feels right.")]));
children.push(bullet([b("Weather / turn events. "), t("A shared event at the start of each round that affects everyone \u2014 e.g. a storm turn where all climbs cost +2, or a clear turn with no hunger. Gives the mountain its own \u201Cvoice\u201D and a home for the cold theme beyond hard mode.")]));
children.push(bullet([b("Rest action. "), t("Spend a whole turn stationary to recover. May be redundant with the Healer and food \u2014 test whether the cube economy needs another recovery lever.")]));
children.push(bullet([b("Campfire item. "), t("A reusable item that warms everyone on its hex each turn. Worth adding if hard-mode cold turns out to force the team together too rigidly \u2014 it lets a scout buy some time alone.")]));

children.push(h1("Questions to Settle in Playtesting"));
children.push(bullet([b("Hex numbers. "), t("The single most important thing to lock down. The whole stamina spread (12\u201320) assumes a typical climb requirement of about 10\u201314. Decide what numbers go on the hex edges first \u2014 everything else calibrates off that.")]));
children.push(bullet([b("Class stamina balance. "), t("Current spread: Agile 20, Climber 18, Healer/Cook/Strong 16, Gambler/Android 14. Watch the low-pool classes \u2014 lift them by 2 if they pass out constantly. If the Agile feels strictly best, trim it toward 18\u201319 (doubled item weight may be a softer cost than lost stamina).")]));
children.push(bullet([b("Agile movement. "), t("The Agile moves two hexes per turn, everyone else one. If two feels too limited in play, try allowing three \u2014 but watch that the Agile doesn't range so far ahead that it breaks up the group and erodes the buddy bonuses.")]));
children.push(bullet([b("Healer strength. "), t("Full-roll healing may be too strong. If so, cap it (e.g. heal no more than 4) or add a cost (can't climb the turn it heals) before reducing the roll.")]));
children.push(bullet([b("Cold and togetherness. "), t("Watch whether the team ever meaningfully separates in hard mode. If cold makes staying together the only correct choice, add the campfire so solitude becomes a buyable resource.")]));
children.push(bullet([b("Summit distance. "), t("Set to 20 hexes. Adjust for game length once you know how long an average turn takes.")]));
children.push(bullet([b("Card counts and weights. "), t("Deck is currently 73 cards. Rebalance counts once you see which items are drawn too often or too rarely.")]));
children.push(bullet([b("Lose-by-attrition. "), t("Currently you only lose if all players pass out at once. Decide whether a stalled team (unable to progress) should also lose, or whether passing out is enough.")]));

const doc = new Document({
  creator: "Summit",
  title: "Summit — Design Notes",
  numbering: { config: [ { reference: "b", levels: [
    { level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 460, hanging: 260 } } } },
  ]}]},
  styles: { default: { document: { run: { font: "Calibri", size: 22 } } } },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1100, bottom: 1100, left: 1200, right: 1200 } } },
    children,
  }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(__dirname + "/../design/Summit_Design_Notes.docx", buf);
  console.log("written", buf.length);
});
