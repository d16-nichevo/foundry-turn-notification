Hooks.on("combatTurnChange", (combat, prior, current) => {

if(game.user.isGM) {
  // Don't show the notification for the GM.
  // Comment out the below line if you want
  // the GM to see this turn notification.
  // return;
}

// Do not allow execution outside of combat.
// const combat = game.combat;
if (!combat) {
  ui.notifications.warn("No active combat.");
  return;
}

// Work out names of players and actors:
const currentCombatant = combat.combatant;
const nextCombatant = combat.turns[(combat.turn + 1) % combat.turns.length];
const actor = currentCombatant?.actor;
const player = game.users.find(u => actor?.testUserPermission(u, "OWNER"));
const playerName = game.user.name;
const currentActorName = currentCombatant?.name ?? "Unknown";
const nextActorName = nextCombatant?.name ?? "Unknown";
const isMyTurn = currentCombatant?.actor?.isOwner ?? false;
const isUpNext = nextCombatant?.actor?.isOwner ?? false;

// Remove any existing turn notification
$("#d16-turn-notification-popup").remove();

// Generate message inside popup:
let popupHtml = "";
if(isMyTurn) {
  // Current user's turn now:
  popupHtml = `
  <p>It's your turn ${playerName}!</p>
  <p style="font-size:200%">Now Acting: ${currentActorName}</p>
`
}
else if (isUpNext) {
  // Current user's turn next:
  popupHtml = `
  <p>Get ready ${playerName}...</p>
  <p>Now Acting: ${currentActorName}</p>
  <p style="font-size:200%">Up Next: ${nextActorName}</p>
`
}
else
{
  // Current user isn't now or next,
  // no need to proceed.
  return;
}

// Show box:
const box = $(`
  <div id="d16-turn-notification-popup" style="
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: #222;
    color: white;
    padding: 20px;
    border: 2px solid #666;
    border-radius: 8px;
    z-index: 10000;
    cursor: pointer;
    box-shadow: 0 0 10px black;
    font-size: 300%;
    text-align: center;
  ">
    ${popupHtml}
    <p style="font-size:50%"><em>Click this box to close.</em></p>
  </div>
`);
box.on("click", () => box.remove());
$("body").append(box);

});
