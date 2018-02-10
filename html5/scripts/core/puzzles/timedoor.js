"use strict";

class TimeDoor extends Door {
  constructor(id, innerNodeID, hours, minutes) {
    super(id);
    this.innerNodeID = innerNodeID;
    this.hours = hours;
    this.minutes = minutes;
  }

  setup() {
    hiversaires.interface.flashVignette();

    const now = new Date(Date.now());
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    if (
      (currentHours == this.hours && currentMinutes == this.minutes) ||
      hiversaires.game.userNodeID == innerNodeID
    ) {
      hiversaires.game.puzzleState.timeDoor = true;
    }

    if (this.isUnlocked) {
      hiversaires.setCurrentAction(this.openDoor.bind(this));
      hiversaires.setModifier("open");
    }
  }

  get isUnlocked() {
    return hiversaires.game.puzzleState.timeDoor;
  }
}
