// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

wmsx.Room = function(screenElement) {
    var self = this;

    function init() {
        buildPeripherals();
        buildAndPlugMachine();
    }

    this.powerOn = function(paused) {
        setPageVisibilityHandling();
        self.screen.powerOn();
        self.speaker.powerOn();
        self.keyboard.powerOn();
        self.joysticksControls.powerOn();
        self.mouseControls.powerOn();
        if (self.machine.getBIOSSocket().inserted() && !self.machine.powerIsOn) self.machine.powerOn(paused);
    };

    this.powerOff = function() {
        self.machine.powerOff();
        self.joysticksControls.powerOff();
        self.mouseControls.powerOff();
        self.keyboard.powerOff();
        self.speaker.powerOff();
        self.screen.powerOff();
    };

    this.loading = function(boo) {
        this.screen.loading(boo);
        this.machine.loading(boo);
    };

    this.exit = function() {
        self.machine.getMachineControlsSocket().controlStateChanged(wmsx.MachineControls.POWER_OFF, true);
        self.peripheralControls.controlActivated(wmsx.PeripheralControls.SCREEN_DEFAULTS);
    };

    var setPageVisibilityHandling = function() {
        var wasPaused;
        function visibilityChange() {
            if (document.hidden) wasPaused = self.machine.systemPause(true);
            else if (!wasPaused) self.machine.systemPause(false);
        }
        document.addEventListener("visibilitychange", visibilityChange);
    };

    var buildPeripherals = function() {
        self.fileDownloader = new wmsx.FileDownloader();
        self.stateMedia = new wmsx.LocalStorageSaveStateMedia();
        self.cassetteDeck = new wmsx.FileCassetteDeck();
        self.diskDrive = new wmsx.FileDiskDrive();
        self.fileLoader = new wmsx.FileLoader();
        self.screen = new wmsx.CanvasDisplay(screenElement);
        self.speaker = new wmsx.WebAudioSpeaker();
        self.keyboard = new wmsx.DOMKeyboard();
        self.joysticksControls = new wmsx.GamepadJoysticksControls();
        self.mouseControls = new wmsx.DOMMouseControls();
        self.machineControls = new wmsx.DOMMachineControls();
        self.peripheralControls = new wmsx.DOMPeripheralControls();

        self.fileLoader.connectPeripherals(self.cassetteDeck, self.diskDrive);
        self.screen.connectPeripherals(self.fileLoader, self.fileDownloader, self.keyboard, self.machineControls, self.peripheralControls, self.mouseControls);
        self.machineControls.connectPeripherals(self.screen);
        self.keyboard.connectPeripherals(self.screen);
        self.joysticksControls.connectPeripherals(self.screen);
        self.mouseControls.connectPeripherals(self.screen);
        self.stateMedia.connectPeripherals(self.fileDownloader);
        self.cassetteDeck.connectPeripherals(self.screen, self.fileDownloader);
        self.diskDrive.connectPeripherals(self.screen, self.fileDownloader);
        self.peripheralControls.connectPeripherals(self.screen.getMonitor(), self.joysticksControls, self.mouseControls, self.fileLoader, self.cassetteDeck, self.diskDrive);
    };

    var buildAndPlugMachine = function() {
        self.machine = new wmsx.Machine();
        self.stateMedia.connect(self.machine.getSavestateSocket());
        self.fileLoader.connect(self.machine, self.machine.getSlotSocket(), self.machine.getBIOSSocket(), self.machine.getExpansionSocket(), self.machine.getCartridgeSocket(), self.machine.getSavestateSocket());
        self.screen.connect(self.machine.getVideoOutput(), self.machine.getMachineControlsSocket(), self.machine.getCartridgeSocket());
        self.speaker.connect(self.machine.getAudioSocket());
        self.machineControls.connect(self.machine.getMachineControlsSocket());
        self.keyboard.connect(self.machine.getKeyboardSocket());
        self.joysticksControls.connect(self.machine.getJoysticksSocket(), self.machine.getMachineControlsSocket());
        self.mouseControls.connect(self.machine.getMouseSocket());
        self.cassetteDeck.connect(self.machine.getCassetteSocket());
        self.diskDrive.connect(self.machine.getDiskDriveSocket());
        self.peripheralControls.connect(self.machine.getMachineControlsSocket(), self.machine.getCartridgeSocket());
    };


    this.machine = null;
    this.screen = null;
    this.speaker = null;
    this.machineControls = null;
    this.keyboard = null;
    this.joysticksControls = null;
    this.mouseControls = null;
    this.fileDownloader = null;
    this.cassetteDeck = null;
    this.diskDrive = null;
    this.stateMedia = null;
    this.fileLoader = null;
    this.peripheralControls = null;


    init();

};

