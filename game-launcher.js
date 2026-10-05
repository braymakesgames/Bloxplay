const BloxPlayGameLauncher = {

    currentGame: null,
    threeModule: null,
    animationFrame: null,
    bloxBuxTimer: null,
    gameStartTime: 0,

    async loadThree() {
        if (this.threeModule) {
            return this.threeModule;
        }

        this.threeModule = await import(
            "https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js"
        );

        return this.threeModule;
    },

    async mysteryHunt() {

        this.cleanup();

        const THREE = await this.loadThree();

        this.currentGame = "Mystery Hunt";
        this.gameStartTime = Date.now();

        document.body.innerHTML = `
            <div id="bloxplay3dGame">

                <div id="bloxplayTopBar">
                    <div>
                        <strong>🕵️ Mystery Hunt</strong>
                    </div>

                    <div id="bloxplayStats">
                        💰 <span id="bloxBuxAmount">0</span> BloxBux
                        <span id="gameTimer">00:00</span>
                    </div>

                    <button id="leaveGameButton">
                        Leave
                    </button>
                </div>

                <div id="bloxplay3dContainer"></div>

                <div id="mobileControls">

                    <div class="controlRow">
                        <button id="upButton">▲</button>
                    </div>

                    <div class="controlRow">
                        <button id="leftButton">◀</button>
                        <button id="downButton">▼</button>
                        <button id="rightButton">▶</button>
                    </div>

                </div>

                <div id="gameMessage">
                    Find the clues around the map!
                </div>

            </div>

            <style>

                html,
                body {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    background: #111;
                    font-family: Arial, sans-serif;
                }

                #bloxplay3dGame {
                    position: fixed;
                    inset: 0;
                    background: #111;
                    overflow: hidden;
                }

                #bloxplay3dContainer {
                    position: absolute;
                    inset: 0;
                }

                #bloxplay3dContainer canvas {
                    display: block;
                    width: 100%;
                    height: 100%;
                    touch-action: none;
                }

                #bloxplayTopBar {
                    position: absolute;
                    z-index: 10;
                    top: 0;
                    left: 0;
                    right: 0;

                    min-height: 58px;

                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    gap: 10px;
                    padding: 8px 12px;

                    box-sizing: border-box;

                    background: rgba(15,15,15,.92);
                    color: white;
                }

                #bloxplayStats {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                    font-size: 14px;
                }

                #leaveGameButton {
                    border: 0;
                    border-radius: 8px;
                    padding: 10px 14px;
                    background: #d33;
                    color: white;
                    font-weight: bold;
                }

                #mobileControls {
                    position: absolute;
                    z-index: 20;
                    left: 18px;
                    bottom: 20px;

                    user-select: none;
                    touch-action: none;
                }

                .controlRow {
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                }

                .controlRow button {
                    width: 58px;
                    height: 58px;

                    border: 2px solid rgba(255,255,255,.5);
                    border-radius: 14px;

                    background: rgba(20,20,20,.7);
                    color: white;

                    font-size: 24px;
                    font-weight: bold;

                    touch-action: none;
                }

                #gameMessage {
                    position: absolute;
                    z-index: 15;

                    left: 50%;
                    bottom: 20px;

                    transform: translateX(-50%);

                    padding: 10px 16px;

                    border-radius: 10px;

                    background: rgba(0,0,0,.65);
                    color: white;

                    text-align: center;
                    pointer-events: none;
                }

                @media (max-width: 600px) {

                    #bloxplayTopBar {
                        font-size: 13px;
                    }

                    #bloxplayStats {
                        flex-direction: column;
                        gap: 2px;
                    }

                    #gameMessage {
                        bottom: 145px;
                        font-size: 13px;
                    }

                }

            </style>
        `;

        const container =
            document.getElementById("bloxplay3dContainer");

        /*
         * REAL THREE.JS 3D
         */

        const scene = new THREE.Scene();

        scene.background =
            new THREE.Color(0x87b7df);

        scene.fog =
            new THREE.Fog(0x87b7df, 35, 120);


        /*
         * CAMERA
         */

        const camera =
            new THREE.PerspectiveCamera(
                70,
                window.innerWidth / window.innerHeight,
                0.1,
                500
            );


        /*
         * RENDERER
         */

        const renderer =
            new THREE.WebGLRenderer({
                antialias: true
            });

        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        );

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        renderer.shadowMap.enabled = true;

        container.appendChild(renderer.domElement);


        /*
         * LIGHTING
         */

        const ambientLight =
            new THREE.HemisphereLight(
                0xffffff,
                0x445566,
                2
            );

        scene.add(ambientLight);


        const sun =
            new THREE.DirectionalLight(
                0xffffff,
                2
            );

        sun.position.set(
            20,
            40,
            10
        );

        sun.castShadow = true;

        scene.add(sun);


        /*
         * GROUND
         */

        const groundGeometry =
            new THREE.BoxGeometry(
                120,
                1,
                120
            );

        const groundMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x4f8a45
            });

        const ground =
            new THREE.Mesh(
                groundGeometry,
                groundMaterial
            );

        ground.position.y = -0.5;

        ground.receiveShadow = true;

        scene.add(ground);


        /*
         * ROAD
         */

        const roadGeometry =
            new THREE.BoxGeometry(
                12,
                0.05,
                120
            );

        const roadMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x444444
            });

        const road =
            new THREE.Mesh(
                roadGeometry,
                roadMaterial
            );

        road.position.y = 0.03;

        scene.add(road);


        /*
         * BUILDINGS
         */

        function createBuilding(
            x,
            z,
            width,
            height,
            depth,
            color
        ) {

            const geometry =
                new THREE.BoxGeometry(
                    width,
                    height,
                    depth
                );

            const material =
                new THREE.MeshStandardMaterial({
                    color: color
                });

            const building =
                new THREE.Mesh(
                    geometry,
                    material
                );

            building.position.set(
                x,
                height / 2,
                z
            );

            building.castShadow = true;
            building.receiveShadow = true;

            scene.add(building);

            /*
             * ROOF
             */

            const roofGeometry =
                new THREE.BoxGeometry(
                    width + 0.4,
                    0.5,
                    depth + 0.4
                );

            const roofMaterial =
                new THREE.MeshStandardMaterial({
                    color: 0x333333
                });

            const roof =
                new THREE.Mesh(
                    roofGeometry,
                    roofMaterial
                );

            roof.position.set(
                x,
                height + 0.25,
                z
            );

            roof.castShadow = true;

            scene.add(roof);

        }


        createBuilding(
            -22,
            -20,
            16,
            10,
            14,
            0xb85c5c
        );

        createBuilding(
            22,
            -20,
            16,
            14,
            14,
            0x5c7eb8
        );

        createBuilding(
            -22,
            22,
            16,
            12,
            14,
            0xb88d5c
        );

        createBuilding(
            22,
            22,
            16,
            9,
            14,
            0x765cb8
        );


        /*
         * PLAYER
         */

        const player =
            new THREE.Group();

        scene.add(player);

        player.position.set(
            0,
            0,
            35
        );


        /*
         * PLAYER BODY
         */

        const body =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    1.4,
                    2,
                    0.8
                ),
                new THREE.MeshStandardMaterial({
                    color: 0x3498db
                })
            );

        body.position.y = 1.4;

        body.castShadow = true;

        player.add(body);


        /*
         * PLAYER HEAD
         */

        const head =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    1.2,
                    1.2,
                    1.2
                ),
                new THREE.MeshStandardMaterial({
                    color: 0xf0c8a0
                })
            );

        head.position.y = 3;

        head.castShadow = true;

        player.add(head);


        /*
         * PLAYER LEGS
         */

        const legMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x222222
            });


        const leftLeg =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.55,
                    1.5,
                    0.65
                ),
                legMaterial
            );

        leftLeg.position.set(
            -0.35,
            0.45,
            0
        );

        leftLeg.castShadow = true;

        player.add(leftLeg);


        const rightLeg =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.55,
                    1.5,
                    0.65
                ),
                legMaterial
            );

        rightLeg.position.set(
            0.35,
            0.45,
            0
        );

        rightLeg.castShadow = true;

        player.add(rightLeg);


        /*
         * CLUES
         */

        const clues = [];

        function createClue(x, z) {

            const geometry =
                new THREE.OctahedronGeometry(0.7);

            const material =
                new THREE.MeshStandardMaterial({
                    color: 0xffdd22,
                    emissive: 0x665500
                });

            const clue =
                new THREE.Mesh(
                    geometry,
                    material
                );

            clue.position.set(
                x,
                1,
                z
            );

            clue.castShadow = true;

            scene.add(clue);

            clues.push({
                object: clue,
                collected: false
            });

        }


        createClue(-8, 15);
        createClue(9, 10);
        createClue(-10, -5);
        createClue(10, -8);
        createClue(0, -25);


        /*
         * CAMERA
         */

        camera.position.set(
            player.position.x,
            7,
            player.position.z + 11
        );

        camera.lookAt(
            player.position.x,
            1.5,
            player.position.z
        );


        /*
         * MOVEMENT
         */

        const keys = {
            up: false,
            down: false,
            left: false,
            right: false
        };


        function setKey(name, value) {
            keys[name] = value;
        }


        document.addEventListener(
            "keydown",
            event => {

                if (event.key === "w" ||
                    event.key === "ArrowUp") {

                    setKey("up", true);

                }

                if (event.key === "s" ||
                    event.key === "ArrowDown") {

                    setKey("down", true);

                }

                if (event.key === "a" ||
                    event.key === "ArrowLeft") {

                    setKey("left", true);

                }

                if (event.key === "d" ||
                    event.key === "ArrowRight") {

                    setKey("right", true);

                }

            }
        );


        document.addEventListener(
            "keyup",
            event => {

                if (event.key === "w" ||
                    event.key === "ArrowUp") {

                    setKey("up", false);

                }

                if (event.key === "s" ||
                    event.key === "ArrowDown") {

                    setKey("down", false);

                }

                if (event.key === "a" ||
                    event.key === "ArrowLeft") {

                    setKey("left", false);

                }

                if (event.key === "d" ||
                    event.key === "ArrowRight") {

                    setKey("right", false);

                }

            }
        );


        function setupTouchButton(
            id,
            key
        ) {

            const button =
                document.getElementById(id);

            button.addEventListener(
                "pointerdown",
                event => {

                    event.preventDefault();

                    setKey(key, true);

                }
            );

            button.addEventListener(
                "pointerup",
                event => {

                    event.preventDefault();

                    setKey(key, false);

                }
            );

            button.addEventListener(
                "pointercancel",
                () => {

                    setKey(key, false);

                }
            );

            button.addEventListener(
                "pointerleave",
                () => {

                    setKey(key, false);

                }
            );

        }


        setupTouchButton(
            "upButton",
            "up"
        );

        setupTouchButton(
            "downButton",
            "down"
        );

        setupTouchButton(
            "leftButton",
            "left"
        );

        setupTouchButton(
            "rightButton",
            "right"
        );


        /*
         * LOOK AROUND
         */

        let looking = false;
        let lastX = 0;

        renderer.domElement.addEventListener(
            "pointerdown",
            event => {

                looking = true;
                lastX = event.clientX;

            }
        );

        renderer.domElement.addEventListener(
            "pointermove",
            event => {

                if (!looking) return;

                const difference =
                    event.clientX - lastX;

                lastX = event.clientX;

                player.rotation.y -=
                    difference * 0.008;

            }
        );

        renderer.domElement.addEventListener(
            "pointerup",
            () => {

                looking = false;

            }
        );

        renderer.domElement.addEventListener(
            "pointercancel",
            () => {

                looking = false;

            }
        );


        /*
         * BLOXBUX SYSTEM
         *
         * 1 minute = 1 BloxBux
         */

        function updateBloxBuxDisplay() {

            const amount =
                typeof BlockPlayAccounts !== "undefined"
                    ? BlockPlayAccounts.getBloxBux()
                    : 0;

            const label =
                document.getElementById(
                    "bloxBuxAmount"
                );

            if (label) {
                label.textContent =
                    amount.toLocaleString();
            }

        }


        updateBloxBuxDisplay();


        this.bloxBuxTimer =
            setInterval(() => {

                if (
                    typeof BlockPlayAccounts !==
                    "undefined"
                ) {

                    BlockPlayAccounts.addBloxBux(1);

                    updateBloxBuxDisplay();

                }

            }, 60000);


        /*
         * GAME TIMER
         */

        const timerInterval =
            setInterval(() => {

                const elapsed =
                    Math.floor(
                        (Date.now() -
                            this.gameStartTime) /
                        1000
                    );

                const minutes =
                    Math.floor(elapsed / 60);

                const seconds =
                    elapsed % 60;

                const timer =
                    document.getElementById(
                        "gameTimer"
                    );

                if (timer) {

                    timer.textContent =
                        String(minutes).padStart(2, "0") +
                        ":" +
                        String(seconds).padStart(2, "0");

                }

            }, 1000);


        this.gameTimerInterval =
            timerInterval;


        /*
         * LEAVE
         */

        document
            .getElementById("leaveGameButton")
            .addEventListener(
                "click",
                () => {

                    this.cleanup();

                    if (
                        typeof showGames ===
                        "function"
                    ) {

                        showGames();

                    } else {

                        location.reload();

                    }

                }
            );


        /*
         * ANIMATION
         */

        const clock =
            new THREE.Clock();


        const animate = () => {

            this.animationFrame =
                requestAnimationFrame(
                    animate
                );

            const delta =
                Math.min(
                    clock.getDelta(),
                    0.05
                );


            /*
             * PLAYER MOVEMENT
             */

            const moveSpeed =
                8 * delta;


            if (keys.up) {

                player.translateZ(
                    -moveSpeed
                );

            }

            if (keys.down) {

                player.translateZ(
                    moveSpeed
                );

            }

            if (keys.left) {

                player.rotation.y +=
                    2.5 * delta;

            }

            if (keys.right) {

                player.rotation.y -=
                    2.5 * delta;

            }


            /*
             * KEEP PLAYER ON MAP
             */

            player.position.x =
                Math.max(
                    -54,
                    Math.min(
                        54,
                        player.position.x
                    )
                );

            player.position.z =
                Math.max(
                    -54,
                    Math.min(
                        54,
                        player.position.z
                    )
                );


            /*
             * CAMERA FOLLOW
             */

            const cameraOffset =
                new THREE.Vector3(
                    0,
                    6,
                    10
                );

            cameraOffset.applyAxisAngle(
                new THREE.Vector3(0, 1, 0),
                player.rotation.y
            );

            const targetCamera =
                player.position.clone()
                    .add(cameraOffset);

            camera.position.lerp(
                targetCamera,
                0.12
            );

            camera.lookAt(
                player.position.x,
                player.position.y + 1.5,
                player.position.z
            );


            /*
             * ROTATE CLUES
             */

            clues.forEach(clue => {

                if (!clue.collected) {

                    clue.object.rotation.y +=
                        delta * 2;

                    clue.object.rotation.x +=
                        delta;

                    const distance =
                        clue.object.position
                            .distanceTo(
                                player.position
                            );

                    if (distance < 2) {

                        clue.collected = true;

                        scene.remove(
                            clue.object
                        );

                        const message =
                            document.getElementById(
                                "gameMessage"
                            );

                        if (message) {

                            message.textContent =
                                "Clue collected!";

                            setTimeout(() => {

                                if (message) {

                                    message.textContent =
                                        "Find the clues around the map!";

                                }

                            }, 1500);

                        }

                    }

                }

            });


            /*
             * RENDER REAL 3D
             */

            renderer.render(
                scene,
                camera
            );

        };


        animate();


        /*
         * RESIZE
         */

        const resizeHandler = () => {

            camera.aspect =
                window.innerWidth /
                window.innerHeight;

            camera.updateProjectionMatrix();

            renderer.setSize(
                window.innerWidth,
                window.innerHeight
            );

        };


        window.addEventListener(
            "resize",
            resizeHandler
        );

        this.resizeHandler =
            resizeHandler;

    },


    cleanup() {

        if (this.animationFrame) {

            cancelAnimationFrame(
                this.animationFrame
            );

            this.animationFrame = null;

        }

        if (this.bloxBuxTimer) {

            clearInterval(
                this.bloxBuxTimer
            );

            this.bloxBuxTimer = null;

        }

        if (this.gameTimerInterval) {

            clearInterval(
                this.gameTimerInterval
            );

            this.gameTimerInterval = null;

        }

        if (this.resizeHandler) {

            window.removeEventListener(
                "resize",
                this.resizeHandler
            );

            this.resizeHandler = null;

        }

    }

};


/*
 * GAME LAUNCHER
 */

async function launchBloxPlayGame(gameName) {

    if (gameName === "Mystery Hunt") {

        await BloxPlayGameLauncher.mysteryHunt();

        return;

    }

    alert(
        gameName + " is coming soon!"
    );

}
