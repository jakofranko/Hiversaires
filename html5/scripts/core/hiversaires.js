"use strict";

class Hiversaires {
  constructor() {
    this.element = document.createElement("hiversaires");
    document.body.appendChild(this.element);
    window.hiversaires = this;
    window.hh = this;
    this.keyboard = new Keyboard();
    this.artBook = new ArtBook();
    this.game = new Game();
    this.music = new Music();
    this.stage = new Stage(this.element);
    this.walkthrough = new Walkthrough();
  }

  start() {
    this.stage.start();
    this.game.start();
    this.walkthrough.start();

    if (DEBUG_START_FRESH) {
      this.game.wipePlayerProgress();
    }
    this.game.load();
    this.updateMusic();
    this.actionCheck();
    this.moveCheck();
    this.menuHome();
  }

  get currentNode() {
    return nodesByID.get(this.game.userNodeID);
  }

  get currentSubject() {
    return this.currentNode.subjects[this.game.userOrientation];
  }

  get currentPuzzle() {
    let subject = this.currentSubject;
    if (subject != null && subject.type == SubjectType.puzzle) {
      return puzzlesByID.get(subject.puzzleID);
    }
    return null;
  }

  get currentSeals() {
    let sealsFound = [];
    for (let puzzle of puzzlesByID.values()) {
      if (
        puzzle instanceof SealTerminal &&
        this.game.puzzleState[puzzle.id] > 0
      ) {
        sealsFound.push(puzzle.info.seal);
      }
    }
    return sealsFound;
  }

  setCurrentAction(value) {
    this.currentAction = value;
    this.stage.setHidden(this.stage.trigger("action"), value == null);
  }

  updateMusic() {
    this.music.setRecord(recordsByChapter.get(this.game.userChapter));
  }

  moveCheck() {
    this.actionReset();

    this.stage.setHidden(
      this.stage.trigger("moveForward"),
      this.currentSubject.type == SubjectType.none
    );

    this.stage.setImage(
      "viewMain",
      "node/" + this.game.userNodeID + "." + this.game.userOrientation + ".jpg"
    );

    this.illusionCheck();

    if (this.currentSubject.type == SubjectType.puzzle) {
      this.actionCheck();
    }

    this.music.setAmbience(ambienceByZone.get(this.currentNode.zone));

    console.log(
      this.game.userNodeID,
      this.game.userOrientation,
      this.currentSubject
    );
  }

  moveLeft() {
    if (this.game.userChapter == Chapter.credit) {
      return;
    }
    this.music.playEffect("footstep_turn");
    this.game.userOrientation = (this.game.userOrientation + 4 - 1) % 4;
    this.stage.animateTurnLeft();
    this.moveCheck();
  }

  moveRight() {
    if (this.game.userChapter == Chapter.credit) {
      return;
    }
    this.music.playEffect("footstep_turn");
    this.game.userOrientation = (this.game.userOrientation + 4 + 1) % 4;
    this.stage.animateTurnRight();
    this.moveCheck();
  }

  moveForward() {
    if (this.game.userChapter == Chapter.credit) {
      return;
    }
    this.playFootStep();

    if (this.currentSubject.type == SubjectType.node) {
      let { nodeID, orientation } = this.currentSubject;
      this.game.userNodeID = nodeID;
      if (orientation != null) {
        this.game.userOrientation = orientation;
      }
    }

    this.stage.animateStepForward();
    this.moveCheck();
  }

  warpTo(node, orientation) {
    this.game.userNodeID = node;
    this.game.userOrientation = orientation % 4;
    this.moveCheck();
  }

  moveBackward() {
    if (this.game.userChapter == Chapter.credit) {
      return;
    }
    this.music.playEffect("footstep_turn");

    this.game.userOrientation = (this.game.userOrientation + 4 + 2) % 4;

    if (this.currentSubject.type == SubjectType.node) {
      let { nodeID, orientation } = this.currentSubject;
      this.game.userNodeID = nodeID;
      if (orientation != null) {
        this.game.userOrientation = orientation;
      }
    }

    this.game.userOrientation = (this.game.userOrientation + 4 + 2) % 4;

    this.stage.animateStepBackward();
    this.moveCheck();
  }

  actionCheck() {
    this.stage.setHidden(
      this.stage.trigger("moveForward"),
      this.currentPuzzle == null
    );

    this.setCurrentAction(null);

    if (this.currentPuzzle != null) {
      this.actionReset();
      this.currentPuzzle.setup();
    }
  }

  action() {
    if (this.game.userChapter == Chapter.credit) {
      return;
    }
    if (this.currentAction != null) {
      this.currentAction();
    }
  }

  actionReset() {
    this.stage.setHidden(this.stage.billboard("menuBlack"), true);
    this.stage.setHidden(this.stage.billboard("menuCredit1"), true);
    this.stage.setHidden(this.stage.billboard("menuCredit2"), true);
    this.stage.setHidden(this.stage.billboard("menuCredit3"), true);
    this.stage.setHidden(this.stage.billboard("menuCredit4"), true);
    this.stage.setHidden(this.stage.billboard("menuLogo"), true);
    this.stage.setHidden(this.stage.billboard("menuControls"), true);

    this.stage.setAlpha("overlay", 0);
    this.stage.setAlpha("clockFace", 0);
    this.stage.setAlpha("clockShadow", 0);
    this.stage.setAlpha("progressPane", 0);
    this.stage.setAlpha("ententeScreen", 0);
    this.stage.setAlpha("illusion", 0);

    this.setCurrentAction(null);
  }

  templateClockInterface() {
    this.stage.setImage(
      "interfaceDimclock",
      "interface/clock." + this.game.puzzleState[1] + ".svg"
    );
    this.stage.setAlpha("interfaceDimclock", 1);
    this.stage.fadeOut(this.stage.billboard("interfaceDimclock"), 0.5, 3);
  }

  templateClockAlert() {
    this.stage.setAlpha("interfaceDimclockAlert", 1.0);
    this.stage.fadeOut(
      this.stage.billboard("interfaceDimclockAlert"),
      0.5,
      0.5
    );
  }

  templateSealInterface() {
    let seals = this.currentSeals;

    console.log(seals);

    this.stage.setImage(
      "interfaceSeal1",
      "interface/seal." + (seals[0] == null ? "none" : seals[0]) + ".svg"
    );
    this.stage.setImage(
      "interfaceSeal2",
      "interface/seal." + (seals[1] == null ? "none" : seals[1]) + ".svg"
    );

    this.stage.setHidden(this.stage.billboard("interfaceSeal1"), false);
    this.stage.setHidden(this.stage.billboard("interfaceSeal2"), false);

    this.stage.setAlpha("interfaceSeal1", 1);
    this.stage.setAlpha("interfaceSeal2", 1);

    this.stage.fadeOut(this.stage.billboard("interfaceSeal1"), 0.5, 3);
    this.stage.fadeOut(this.stage.billboard("interfaceSeal2"), 0.5, 3);
  }

  templateSealAlert() {
    this.stage.setAlpha("interfaceSealAlert", 1.0);
    this.stage.fadeOut(this.stage.billboard("interfaceSealAlert"), 0.5, 0.5);
  }

  templateEnergyInterface() {
    this.stage.setImage(
      "interfaceFuse1",
      "interface/fuse." + this.game.userEnergy + ".svg"
    );

    this.stage.setHidden(this.stage.billboard("interfaceFuse1"), false);
    this.stage.setAlpha("interfaceFuse1", 1);

    this.stage.fadeOut(this.stage.billboard("interfaceFuse1"), 0.5, 3);
  }

  checkConditions(conditions) {
    for (let condition of conditions) {
      let state = this.game.puzzleState[condition.puzzleID];
      let passes = true;
      switch (condition.type) {
        case ConditionType.equals:
          passes = state == condition.value;
          break;
        case ConditionType.doesNotEqual:
          passes = state != condition.value;
          break;
        case ConditionType.isLessThan:
          passes = state < condition.value;
          break;
        case ConditionType.isLessThanOrEqualTo:
          passes = state <= condition.value;
          break;
        case ConditionType.isGreaterThan:
          passes = state > condition.value;
          break;
        case ConditionType.isGreaterThanOrEqualTo:
          passes = state >= condition.value;
          break;
      }
      if (!passes) {
        return false;
      }
    }
    return true;
  }

  templateEnergyAlert() {
    this.stage.setAlpha("interfaceFuseAlert", 1.0);
    this.stage.fadeOut(this.stage.billboard("interfaceFuseAlert"), 1.5, 0.5);
  }

  templateAudioInterface() {
    this.stage.setImage(
      "interfaceAudio",
      "interface/music." +
        (this.game.puzzleState[35] == 1 ? "on" : "off") +
        ".svg"
    );

    this.stage.setAlpha("interfaceAudio", 1);
    this.stage.fadeOut(this.stage.billboard("interfaceAudio"), 0.5, 3);
  }

  setModifier(modifier) {
    this.stage.setImage(
      "overlay",
      "node/" +
        this.game.userNodeID +
        "." +
        this.game.userOrientation +
        "." +
        modifier +
        ".jpg"
    );
  }

  showModifier(fadeDuration = 0, fadeDelay = 0) {
    this.stage.setHidden(this.stage.billboard("overlay"), false);
    this.stage.fadeIn(this.stage.billboard("overlay"), fadeDuration, fadeDelay);
  }

  hideModifier(fadeDuration = 0, fadeDelay = 0) {
    this.stage.setHidden(this.stage.billboard("overlay"), false);
    this.stage.fadeOut(
      this.stage.billboard("overlay"),
      fadeDuration,
      fadeDelay
    );
  }

  updateNode(node, img, puzzleID) {
    if (this.game.userNodeID == node && this.currentPuzzle.id == puzzleID) {
      this.stage.setImage("overlay", "node_old/node." + img + ".jpg");
    }
  }

  templateVignette() {
    this.stage.setAlpha("vignette", 1.0);
    this.stage.fadeOut(this.stage.billboard("vignette"), 1.0, 0);
  }

  templateSaveInterface() {
    this.stage.setHidden(this.stage.billboard("interfaceSave"), false);
    this.stage.setAlpha("interfaceSave", 1);
    this.stage.fadeOut(this.stage.billboard("interfaceSave"), 0.5, 3);
  }

  illusionCheck() {
    if (Math.random() < 0.3) {
      return;
    }

    for (let puzzle of puzzlesByID.values()) {
      if (
        puzzle instanceof Illusion &&
        puzzle.info.nodeID == this.game.userNodeID &&
        puzzle.info.orientation == this.game.userOrientation
      ) {
        puzzle.appear();
        break;
      }
    }
  }

  illusionInterface() {
    let illusionCount = 0;

    for (let puzzle of puzzlesByID.values()) {
      if (puzzle instanceof Illusion) {
        illusionCount += this.game.puzzleState[puzzle.id];
      }
    }

    this.stage.setImage(
      "interfaceIllusion",
      "interface/illusion." + illusionCount + ".svg"
    );
    this.stage.setAlpha("interfaceIllusion", 1);
    this.stage.fadeOut(this.stage.billboard("interfaceIllusion"), 0.5, 3);
  }

  playFootStep() {
    this.game.userFootstep += 1;
    let effect = "footstep_collide";
    if (this.currentSubject.type == SubjectType.node) {
      effect =
        this.game.userFootstep % 2 == 1 ? "footstep_left" : "footstep_right";
    }
    this.music.playEffect(effect);
  }

  menuHome() {
    this.stage.setAlpha("menuBlack", 1.0);
    this.stage.setHidden(this.stage.billboard("menuBlack"), false);

    this.stage.setAlpha("menuLogo", 1.0);
    this.stage.setHidden(this.stage.billboard("menuLogo"), false);

    this.stage.setAlpha("menuControls", 1.0);
    this.stage.setHidden(this.stage.billboard("menuControls"), false);

    this.stage.setHidden(this.stage.billboard("interfaceSeal1"), true);
    this.stage.setHidden(this.stage.billboard("interfaceSeal2"), true);
    this.stage.setHidden(this.stage.billboard("interfaceFuse1"), true);
    this.stage.setHidden(this.stage.billboard("interfaceSave"), true);

    this.stage.fadeOut(this.stage.billboard("menuBlack"), 2.0, 0);
    this.stage.fadeOut(this.stage.billboard("menuLogo"), 2.0, 3);
    this.stage.fadeOut(this.stage.billboard("menuControls"), 1.0, 8);

    this.music.volume = 1; // Music
  }
}
