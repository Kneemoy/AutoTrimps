//MODULES["upgrades"] = {};
const upgradeList = ['Miners', 'Scientists', 'Coordination', 'Speedminer', 'Speedlumber', 'Speedfarming', 'Speedscience', 'Speedexplorer',
  'Megaminer', 'Megalumber', 'Megafarming', 'Megascience', 'Efficiency', 'TrainTacular', 'Trainers', 'Explorers', 'Blockmaster', 'Battle',
  'Bloodlust', 'Bounty', 'Egg', 'Anger', 'Formations', 'Dominance', 'Barrier', 'UberHut', 'UberHouse', 'UberMansion', 'UberHotel',
  'UberResort', 'Trapstorm', 'Gigastation', 'Shieldblock', 'Potency', 'Magmamancers'];

//Buys all available non-equip upgrades listed in var upgradeList
function buyUpgrades () {
  for (const upgrade of upgradeList) {
    const gameUpgrade = game.upgrades[upgrade];
    const available = (gameUpgrade.allowed > gameUpgrade.done && canAffordTwoLevel(gameUpgrade));

    //skip coordination if its set to manual, or it cant be afforded
    if (upgrade === 'Coordination' && (getPageSetting('ManualCoords') || !canAffordCoordinationTrimps())) {
      continue;
    }

    //skip shieldblock if its setting is disabled
    if (upgrade === 'Shieldblock' && !getPageSetting('BuyShieldblock')) {
      continue;
    }

    //skip gigastation if its disabled, or if next gigastation doesnt fall in line with your warpstation + delta settings
    if (upgrade === 'Gigastation'
      && (game.global.lastWarp
        ? game.buildings.Warpstation.owned < (Math.floor(game.upgrades.Gigastation.done * getPageSetting('DeltaGigastation')) + getPageSetting('FirstGigastation'))
        : game.buildings.Warpstation.owned < getPageSetting('FirstGigastation'))) {
      continue;
    }

    //skip bloodlust during scientist challenges and while we have autofight enabled.
    if (upgrade === 'Bloodlust' && game.global.challengeActive === 'Scientist' && getPageSetting('BetterAutoFight')) {
      continue;
    }

    //skip potency when autoBreedTimer is disabled
    if (upgrade === 'Potency' && getPageSetting('GeneticistTimer') >= 0) {
      continue;
    }

    //Main logics:
    if (!available) {
      continue;
    }
    if (game.upgrades.Scientists.done < game.upgrades.Scientists.allowed && upgrade !== 'Scientists') {
      continue;
    }

    buyUpgrade(upgrade, true, true);
    debug('Upgraded ' + upgrade, 'upgrades', '*upload2');
    //loop again.
  }
}
