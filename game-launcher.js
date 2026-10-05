const BloxPlayGameLauncher = {

    mysteryTimer: null,
    mysteryBloxBuxTimer: null,

    mysteryHunt() {
        const app = document.getElementById("app");

        app.innerHTML = `
            <div id="mysteryGame" style="
                position:relative;
                width:100%;
                height:650px;
                background:#111;
                overflow:hidden;
                border-radius:16px;
            ">

                <canvas id="mysteryCanvas" style="
                    width:100%;
                    height:100%;
                    display:block;
                    touch-action:none;
                "></canvas>

                <div style="
                    position:absolute;
                    top:15px;
                    left:15px;
                    right:15px;
                    display:flex;
                    justify-content:space-between;
                    gap:10px;
                    pointer-events:none;
                ">

                    <div style="
                        background:rgba(0,0,0,.75);
                        padding:12px;
                        border-radius:10px;
                    ">
                        🕵️ Mystery Hunt
                        <br>
                        ⏱️ Time:
                        <span id="mysteryTime">120</span>
                        <br>
                        💰 BloxBux:
                        <span id="mysteryBloxBux">0</span>
                    </div>

                    <button
                        id="leaveMystery"
                        style="
                            pointer-events:auto;
                            height:45px;
                        "
                    >
                        Leave
                    </button>

                </div>

                <div style="
                    position:absolute;
                    bottom:20px;
                    left:20px;
                    display:grid;
                    grid-template-columns:60px 60px 60px;
                    gap:6px;
                ">

                    <div></div>

                    <button id="moveForward">▲</button>

                    <div></div>

                    <button id="moveLeft">◀</button>

                    <button id="moveBack">▼</button>

                    <button id="moveRight">▶</button>

                </div>

                <div style="
                    position:absolute;
                    bottom:20px;
                    right:20px;
                    background:rgba(0,0,0,.7);
                    padding:12px;
                    border-radius:10px;
                    font-size:13px;
                ">
                    Drag the screen to look around
                </div>

            </div>
        `;

        this.start3DMystery();
    },

    start3DMystery() {

        const canvas =
            document.getElementById("mysteryCanvas");

        const ctx =
            canvas.getContext("2d");

        let width = 0;
        let height = 0;

        function resize() {
            const rect =
                canvas.getBoundingClientRect();

            width = Math.max(320, rect.width);
            height = Math.max(400, rect.height);

            canvas.width = width * devicePixelRatio;
            canvas.height = height * devicePixelRatio;

            ctx.setTransform(
                devicePixelRatio,
                0,
                0,
                devicePixelRatio,
                0,
                0
            );
        }

        resize();

        window.addEventListener(
            "resize",
            resize
        );

        const player = {
            x: 0,
            z: 5,
            angle: 0,
            speed: 0.12
        };

        const buildings = [
            {x:-8,z:-10,w:5,d:5,h:5},
            {x:8,z:-12,w:6,d:5,h:6},
            {x:-10,z:5,w:4,d:7,h:4},
            {x:10,z:6,w:5,d:5,h:5},
            {x:0,z:-18,w:7,d:4,h:7}
        ];

        const clues = [
            {x:-5,z:-3,found:false},
            {x:6,z:-4,found:false},
            {x:-4,z:12,found:false},
            {x:8,z:14,found:false}
        ];

        let keys = {};

        document.onkeydown = function(e) {
            keys[e.key.toLowerCase()] = true;
        };

        document.onkeyup = function(e) {
            keys[e.key.toLowerCase()] = false;
        };

        function buttonMove(id, key) {

            const button =
                document.getElementById(id);

            if (!button) return;

            button.addEventListener(
                "pointerdown",
                e => {
                    e.preventDefault();
                    keys[key] = true;
                }
            );

            button.addEventListener(
                "pointerup",
                e => {
                    e.preventDefault();
                    keys[key] = false;
                }
            );

            button.addEventListener(
                "pointercancel",
                () => {
                    keys[key] = false;
                }
            );

            button.addEventListener(
                "pointerleave",
                () => {
                    keys[key] = false;
                }
            );
        }

        buttonMove("moveForward","w");
        buttonMove("moveBack","s");
        buttonMove("moveLeft","a");
        buttonMove("moveRight","d");

        let dragging = false;
        let lastX = 0;

        canvas.addEventListener(
            "pointerdown",
            e => {
                dragging = true;
                lastX = e.clientX;
            }
        );

        canvas.addEventListener(
            "pointermove",
            e => {

                if (!dragging) return;

                const difference =
                    e.clientX - lastX;

                player.angle +=
                    difference * 0.008;

                lastX = e.clientX;
            }
        );

        canvas.addEventListener(
            "pointerup",
            () => {
                dragging = false;
            }
        );

        canvas.addEventListener(
            "pointercancel",
            () => {
                dragging = false;
            }
        );

        function project(x,y,z) {

            const dx =
                x - player.x;

            const dz =
                z - player.z;

            const cos =
                Math.cos(player.angle);

            const sin =
                Math.sin(player.angle);

            const cameraX =
                dx * cos - dz * sin;

            const cameraZ =
                dx * sin + dz * cos;

            if (cameraZ <= 0.2) {
                return null;
            }

            const scale =
                300 / cameraZ;

            return {
                x: width / 2 + cameraX * scale,
                y: height / 2 - y * scale,
                scale: scale
            };
        }

        function drawCube(x,z,w,d,h,color) {

            const bottom =
                project(x,z * 0 + 0,z);

            const top =
                project(x, h, z);

            if (!bottom || !top) return;

            const scale =
                top.scale;

            const width3D =
                w * scale;

            const depth3D =
                d * scale;

            const height3D =
                h * scale;

            ctx.fillStyle = color;

            ctx.fillRect(
                top.x - width3D / 2,
                top.y,
                width3D,
                height3D
            );

            ctx.fillStyle = "rgba(0,0,0,.25)";

            ctx.fillRect(
                top.x + width3D / 2,
                top.y,
                depth3D * .35,
                height3D
            );
        }

        function drawGround() {

            ctx.fillStyle = "#26382a";

            ctx.fillRect(
                0,
                0,
                width,
                height
            );

            for (
                let x = -30;
                x <= 30;
                x += 2
            ) {

                const p1 =
                    project(x,0,-30);

                const p2 =
                    project(x,0,30);

                if (!p1 || !p2) continue;

                ctx.strokeStyle =
                    "rgba(255,255,255,.08)";

                ctx.beginPath();

                ctx.moveTo(p1.x,p1.y);
                ctx.lineTo(p2.x,p2.y);

                ctx.stroke();
            }

            for (
                let z = -30;
                z <= 30;
                z += 2
            ) {

                const p1 =
                    project(-30,0,z);

                const p2 =
                    project(30,0,z);

                if (!p1 || !p2) continue;

                ctx.beginPath();

                ctx.moveTo(p1.x,p1.y);
                ctx.lineTo(p2.x,p2.y);

                ctx.stroke();
            }
        }

        function drawClue(clue) {

            if (clue.found) return;

            const p =
                project(clue.x,1,clue.z);

            if (!p) return;

            ctx.fillStyle = "#facc15";

            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                Math.max(5,p.scale * .18),
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.fillStyle = "white";

            ctx.font = "bold 14px Arial";

            ctx.textAlign = "center";

            ctx.fillText(
                "?",
                p.x,
                p.y + 5
            );
        }

        function drawPlayer() {

            const head =
                project(
                    player.x,
                    2.7,
                    player.z
                );

            const body =
                project(
                    player.x,
                    1.5,
                    player.z
                );

            if (!head || !body) return;

            const size =
                Math.max(12, body.scale * .7);

            ctx.fillStyle = "#f2c7a5";

            ctx.beginPath();

            ctx.arc(
                head.x,
                head.y,
                size * .3,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.fillStyle = "#2563eb";

            ctx.fillRect(
                body.x - size / 2,
                body.y,
                size,
                size * 1.2
            );

            ctx.fillStyle = "#111827";

            ctx.fillRect(
                body.x - size / 2,
                body.y + size * 1.2,
                size * .35,
                size
            );

            ctx.fillRect(
                body.x + size * .15,
                body.y + size * 1.2,
                size * .35,
                size
            );
        }

        function update() {

            let forward = 0;
            let sideways = 0;

            if (
                keys["w"] ||
                keys["arrowup"]
            ) forward += 1;

            if (
                keys["s"] ||
                keys["arrowdown"]
            ) forward -= 1;

            if (
                keys["a"] ||
                keys["arrowleft"]
            ) sideways -= 1;

            if (
                keys["d"] ||
                keys["arrowright"]
            ) sideways += 1;

            player.x +=
                Math.cos(player.angle) *
                sideways *
                player.speed;

            player.z +=
                Math.sin(player.angle) *
                sideways *
                player.speed;

            player.x +=
                Math.sin(player.angle) *
                forward *
                player.speed;

            player.z -=
                Math.cos(player.angle) *
                forward *
                player.speed;

            player.x =
                Math.max(-25,Math.min(25,player.x));

            player.z =
                Math.max(-25,Math.min(25,player.z));

            clues.forEach(clue => {

                const distance =
                    Math.hypot(
                        player.x - clue.x,
                        player.z - clue.z
                    );

                if (
                    distance < 1.5 &&
                    !clue.found
                ) {

                    clue.found = true;

                    mysteryClues++;

                    mysteryBloxBux += 5;
                }
            });
        }

        function render() {

            update();

            drawGround();

            buildings.forEach(building => {

                drawCube(
                    building.x,
                    building.z,
                    building.w,
                    building.d,
                    building.h,
                    "#64748b"
                );

            });

            clues.forEach(drawClue);

            drawPlayer();

            requestAnimationFrame(render);
        }

        let mysteryTime = 120;
        let mysteryBloxBux = 0;
        let mysteryClues = 0;

        const timeLabel =
            document.getElementById("mysteryTime");

        const buxLabel =
            document.getElementById("mysteryBloxBux");

        this.mysteryTimer =
            setInterval(() => {

                mysteryTime--;

                if (timeLabel) {
                    timeLabel.textContent =
                        mysteryTime;
                }

                if (mysteryTime <= 0) {

                    clearInterval(
                        this.mysteryTimer
                    );

                    alert(
                        "The mystery round ended!"
                    );
                }

            },1000);

        this.mysteryBloxBuxTimer =
            setInterval(() => {

                mysteryBloxBux += 1;

                if (buxLabel) {
                    buxLabel.textContent =
                        mysteryBloxBux;
                }

            },10000);

        document
            .getElementById("leaveMystery")
            .onclick = () => {

                clearInterval(
                    this.mysteryTimer
                );

                clearInterval(
                    this.mysteryBloxBuxTimer
                );

                if (
                    typeof showGames ===
                    "function"
                ) {
                    showGames();
                }
            };

        render();
    },

    brainGrab() {
        alert("Brain Grab is next.");
    },

    islandSurvival() {
        alert("Island Survival is next.");
    },

    blockRacers() {
        alert("Block Racers is next.");
    },

    ghostHunt() {
        alert("Ghost Hunt is next.");
    },

    coinRush() {
        alert("Coin Rush is next.");
    },

    buildCity() {
        alert("Build City is next.");
    }
};
