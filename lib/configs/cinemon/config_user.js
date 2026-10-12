if (!carco) var carco = {};
if (!carco.data) carco.data = {};
if (!carco.data.okosdoboz) carco.data.okosdoboz = {};

carco.data.okosdoboz.createPlayer = function() {
    var player = document.getElementById("odPlayer")
    var playeritems = carco.functions.player.get(player);
    var root = playeritems.root;
    carco.container(root);

    window.config = {
        item: playeritems.root,
        carco: {
            paramsdata: {
                user: {
                    usertype: "user",
                    currentgame: carco.data.okosdoboz.id,  //game id
                    currenttrack: "1", //current track
                    tracksorder: "random", //or order
                    feedbacktype: "practice", //or test
                    lang: "en", //or en
                    datatype: "local",
                    playersize:false,
                    restartbutton: true,
                    disableautoplaysounds:true,
                    disabledeletesoundsrcfolder:true
                },
                system: {
                    usertype: "user",
                    currentproject: "okosdoboz"
                }
            },
            layer: "root",
            addtools: "root",
            urls: {
                root: carco.project.okosdoboz.hosts[carco.project.okosdoboz.currentHost]+"../",
                lib: carco.project.okosdoboz.hosts[carco.project.okosdoboz.currentHost]+"/",
                saveduserstatusfolder: "saveduserstatus/",
                imagesfolder: "images_ms/",
                halfimagesfolder: "images_ms/half/",
                datajsfolder: "tracksjs/",
                saveduserstatusfolder: "saveduserstatus/"
            },
            customparams:{
                gametype:"root",
                feedbackon: false
            },
            playeritems: playeritems,
            size:{
                width:3150,
                height:1350
            },
            colorisetype: "svg",
            scale:{type:"fitinternal"},
            language:{
                id:{
                    "students_button": {
                        hu: "Diákoknak",
                        en: "For Students"
                    },
                    "teachers_button": {
                        hu: "Tanároknak",
                        en: "For Teachers"
                    },
                    "checkbutton": {
                        hu: "Ellenőrzés",
                        en: "Ready to Check?"
                    },
                    "solutionbutton": {
                        hu: "Megoldás",
                        en: "Answer"
                    },
                    "nextbutton": {
                        hu: "Tovább",
                        en: "Next"
                    },
                    "info_students_button": {
                        hu: "Diákoknak",
                        en: "For students"
                    },
                    "info_teachers_button": {
                        hu: "Tanároknak",
                        en: "For teachers"
                    },
                    "info_infostudents": {
                        hu: "Információ diákoknak",
                        en: "Information for students"
                    },
                    "info_infoteachers": {
                        hu: "Információ tanároknak",
                        en: "Information for teachers"
                    },
                    "info_close_button": {
                        hu: "Bezár",
                        en: "Close"
                    },
                    "scoretitle": {
                        hu: "Eredmény: ",
                        en: "Result: "
                    },
                    "restartbutton": {
                        hu: "Újra",
                        en: "Replay"
                    }
                }
            }
        },
        preloadcallback: function (callback) {
            root.carco.playersoundspreload(callback);
        }
    }

    carco.functions.plugin("game", "endscreen", function() {
        return function(item){

            var percent = Math.round(item.carco.scores.scorepercent)
            var root = item.carco.root;

            if (item.carco.paramsdata.user.lang == "hu"){
                var outcome = "Pontjaid: ";
                var text1 = "ÖSSZESEN";
                var text2 = "";
                var text3 = "Pont";
                var text = "Gratulálunk! Remek munka!";
                if (percent<90){text = "Ügyes vagy, de még pontosítsd tudásod!"};
                if (percent<71){text = "Gyakorolj még! Fejleszd ismereteidet!"};
                if (percent<51){text = "Ne keseredj el, próbálkozz még és jobban fog sikerülni!"};
                if (percent<31){text = "Hát ez most nem sikerült! Még gyakorolnod kell!"};
                var restarttext = "Újra";
            }else{
                var outcome = "Your Score: ";
                var text1 = "TOTAL";
                var text2 = "";
                var text3 = "Score";
                var text = "Congratulations! Great job!";
                if (percent<90){text = "Nice, but you still need some practice!"};
                if (percent<71){text = "You need more practice! Extend your knowledge!"};
                if (percent<51){text = "Don’t worry, try harder and you’ll be successful!"};
                if (percent<31){text = "Well, you failed this time! You need more practice!"};
                var restarttext = "Restart";
            }
            if (item.carco.root.carco.playeritems.endscreen) {

                if (!item.carco.root.carco.playeritems.endscreen_bgeval) {
                    item.carco.root.carco.playeritems.endscreen_bgeval = carco.functions.children.createHTML({type: "div", attr: {class: "bg_eval"}});
                    item.carco.root.carco.playeritems.endscreen.appendChild(item.carco.root.carco.playeritems.endscreen_bgeval);

                    item.carco.root.carco.playeritems.endscreen_bgeval_bird = carco.functions.children.createHTML({type: "div", attr: {class: "bird"}});
                    item.carco.root.carco.playeritems.endscreen_bgeval.appendChild(item.carco.root.carco.playeritems.endscreen_bgeval_bird);

                    item.carco.root.carco.playeritems.endscreen_bgeval_boy = carco.functions.children.createHTML({type: "div", attr: {class: "boy"}});
                    item.carco.root.carco.playeritems.endscreen_bgeval.appendChild(item.carco.root.carco.playeritems.endscreen_bgeval_boy);

                    item.carco.root.carco.playeritems.endscreen_bgeval_girl = carco.functions.children.createHTML({type: "div", attr: {class: "girl"}});
                    item.carco.root.carco.playeritems.endscreen_bgeval.appendChild(item.carco.root.carco.playeritems.endscreen_bgeval_girl);

                };


                var endscreensounds_girl_sad = [
                    ["2_L_Bet.mp3","end_girl_sad_1"],
                    ["2_L_Sure.mp3","end_girl_sad_2"],
                    ["2_L_Um.mp3","end_girl_sad_3"]
                ];

                var endscreensounds_girl_happy = [
                    ["1_L_Very.mp3","end_girl_happy_1"],
                    ["1_L_Well.mp3","end_girl_happy_2"],
                    ["1_L_Youre.mp3","end_girl_happy_3"]
                ];

                var endscreensounds_boy_sad = [
                    ["2_W_Better.mp3","end_boy_sad_1"],
                    ["2_W_Give.mp3","end_boy_sad_2"],
                    ["2_W_Spaghettio.mp3","end_boy_sad_3"]
                ];

                var endscreensounds_boy_happy = [
                    ["1_W_Fantastic.mp3","end_boy_happy_1"],
                    ["1_W_Very.mp3","end_boy_happy_2"],
                    ["1_W_You.mp3","end_boy_happy_3"]
                ];

                item.carco.root.carco.playeritems.endscreen_bgeval_boy.style.display = "none";
                item.carco.root.carco.playeritems.endscreen_bgeval_girl.style.display = "none";

                var hideo = carco.functions.math.generateFromArray([[item.carco.root.carco.playeritems.endscreen_bgeval_boy, endscreensounds_boy_happy, endscreensounds_boy_sad], [item.carco.root.carco.playeritems.endscreen_bgeval_girl, endscreensounds_girl_happy, endscreensounds_girl_sad]])
                if (hideo[0]) hideo[0].style.display = "block";

                var soundid = false;
                if (percent > 71){
                    item.carco.root.carco.playeritems.endscreen_bgeval.className = "bg_eval happy"
                    if (hideo[1]) soundid = carco.functions.math.generateFromArray(hideo[1]);
                }else{
                    item.carco.root.carco.playeritems.endscreen_bgeval.className = "bg_eval sad"
                    if (hideo[2]) soundid = carco.functions.math.generateFromArray(hideo[2]);
                };

                if (soundid){

                    item.carco.endscreensoundwait = 1000;

                    if (!item.carco.endscreensoundplay){
                        item.carco.endscreensoundplay = function() {
                            function stop(){
                                carco.createjs.Sound.stop();
                            };
                            setTimeout(function() {
                                root.carco.game.stopAllRunnedAudio(item.carco.endscreensoundcurrent);
                                root.carco.currentplayaudio = {src:item.carco.endscreensoundcurrent, stop:stop};
                                item.carco.endscreensounds[item.carco.endscreensoundcurrent] = carco.createjs.Sound.play(item.carco.endscreensoundcurrent);
                                root.carco.checkcallbackwait = 0;
                                root.carco.checkcallbackdata = false;
                            }, item.carco.endscreensoundwait);
                        };
                    };

                    item.carco.endscreensoundcurrent = soundid[1];

                    if (item.carco.endscreensounds[soundid[1]]) {
                        item.carco.endscreensoundplay();
                    };
                };

                if (root.carco.playeritems.endscreen_outcome) root.carco.playeritems.endscreen_outcome.innerHTML = outcome + " " + item.carco.scores.userscore;
                if (root.carco.playeritems.endscreen_percent) root.carco.playeritems.endscreen_percent.innerHTML = "<div class='drwmsg_endscreen_left'>"+text1 + "</div><div class='drwmsg_endscreen_right'>" + percent+"%</div>";
                if (root.carco.playeritems.endscreen_text) root.carco.playeritems.endscreen_text.innerHTML = text;

                if (root.carco.playeritems.endscreen_scores) {
                    root.carco.playeritems.endscreen_scores.innerHTML = ""
                    var ii = 0;
                    if (root.carco.paramsdata.user.currenttrack&&!isNaN(Number(root.carco.paramsdata.user.currenttrack))){
                        ii = Number(root.carco.paramsdata.user.currenttrack)-1;
                    };

                    if (!ii) ii = 0;
                    for (var x in root.carco.score){
                        ii = ii + 1;
                        var itext = "<div class='drwmsg_endscreen_scorewor'><div class='drwmsg_endscreen_left'>"+ii+". "+text2+"</div><div class='drwmsg_endscreen_right'>"+text3+" "+root.carco.score[x].userscore+"/"+root.carco.score[x].allscore+"</div></div>"
                        root.carco.playeritems.endscreen_scores.innerHTML = root.carco.playeritems.endscreen_scores.innerHTML + itext;
                    };
                };

                if (root.carco.playeritems.endscreen_restart) {
                    root.carco.playeritems.endscreen_restart.innerHTML = restarttext;
                    carco.functions.listeners.remove(root.carco.playeritems.endscreen_restart, "mousedown", item.carco.nextfunction)
                    carco.functions.listeners.add(root.carco.playeritems.endscreen_restart, "mousedown", item.carco.nextfunction)
                };
                carco.functions.kiopembed.init(root);
                if (root.carco.paramsdata.user.feedbacktype == "practice"||root.carco.paramsdata.user.feedbacktype == "test"&&!root.carco.paramsdata.user.kiop){
                    if (root.carco.playeritems.blacklayer) root.carco.playeritems.blacklayer.className = "drwmsg-layer drwmsg-layer_trans";
                    root.carco.playeritems.endscreen.className = "drwmsg-endscreen drwmsg-endtrans";
                };
            };
            carco.functions.kiopembed.get(root);

            item.carco.endscreenresize = function() {
                var body_height = document.body.offsetHeight;
                if (root.carco.playeritems.endscreen) {
                    var player = root.carco.playeritems.player
                    root.carco.playeritems.endscreen.style.width = player.offsetWidth / 100 * 80 + "px";
                    var end_height = root.carco.playeritems.endscreen.offsetHeight;
                    var end_width = root.carco.playeritems.endscreen.offsetWidth;
                    root.carco.playeritems.endscreen.style.marginTop = -root.carco.playeritems.blacklayer.offsetHeight+10 +"px";
                };
            };

            item.carco.endscreenresize()

            carco.functions.listeners.remove(window, "resize", item.carco.endscreenresize)
            carco.functions.listeners.add(window, "resize", item.carco.endscreenresize)

        }
    });

    carco.functions.root.init(window.config);
    carco.functions.microsoft.init(root);
    if (carco.project.okosdoboz.playercallback) carco.project.okosdoboz.playercallback(root)
    window.drwmsg = root;

    root.carco.checkcallback = function(root, go, itrueallvalues){
        if (root.carco.game.process == 2||go){

            var checkcallbacksounds_girl_sad = [
                ["2_L_Mmmm.mp3","check_ccs_girl_sad_1"],
                ["2_L_Not.mp3","check_ccs_girl_sad_2"],
                ["2_L_Whoops.mp3","check_ccs_girl_sad_3"]
            ];

            var checkcallbacksounds_girl_happy = [
                ["1_L_Perfect.mp3","check_ccs_girl_happy_1"],
                ["1_L_Thats.mp3","check_ccs_girl_happy_2"],
                ["1_L_Thats_right.mp3","check_ccs_girl_happy_3"]
            ];

            var checkcallbacksounds_boy_sad = [
                ["2_W_Give.mp3","check_ccs_boy_sad_1"],
                ["2_W_Try.mp3","check_ccs_boy_sad_2"],
                ["2_W_UhOh.mp3","check_ccs_boy_sad_3"]
            ];

            var checkcallbacksounds_boy_happy = [
                ["1_W_Good.mp3","check_ccs_boy_happy_1"],
                ["1_W_Thats_right.mp3","check_ccs_boy_happy_2"],
                ["1_WThats.mp3","check_ccs_boy_happy_3"]
            ];

            if (root.carco.checkcallbackdata&&root.carco.checkcallbackdata == "boy"||
                root.carco.checkcallbackdata&&root.carco.checkcallbackdata == "girl"){
                if (root.carco.checkcallbackdata&&root.carco.checkcallbackdata == "girl"){
                    var hideo = ["girl", checkcallbacksounds_girl_happy, checkcallbacksounds_girl_sad];
                }else {
                    var hideo = ["boy", checkcallbacksounds_boy_happy, checkcallbacksounds_boy_sad];
                };
            }else{
                var hideo = carco.functions.math.generateFromArray([["boy", checkcallbacksounds_boy_happy, checkcallbacksounds_boy_sad], ["girl", checkcallbacksounds_girl_happy, checkcallbacksounds_girl_sad]])
            };

            var trueallvalues = root.carco.game.trueAllValues();
            if (itrueallvalues) trueallvalues = itrueallvalues;
            var soundid = false;
            var wait = 0;

            if (trueallvalues){
                if (hideo[1]) soundid = carco.functions.math.generateFromArray(hideo[1]);
            }else{
                if (hideo[2]) soundid = carco.functions.math.generateFromArray(hideo[2]);
            };

            if (root.carco.checkcallbackwait && root.carco.checkcallbackwait > wait) wait = root.carco.checkcallbackwait;

            if (soundid){

                if (!root.carco.checkcallbacksoundplay){
                    root.carco.checkcallbacksoundplay = function(id) {
                        function stop(){
                            carco.createjs.Sound.stop();
                        };
                        setTimeout(function() {
                            root.carco.game.stopAllRunnedAudio(root.carco.checkcallbacksoundcurrent);
                            root.carco.currentplayaudio = {src:root.carco.checkcallbacksoundcurrent, stop:stop};
                            root.carco.checkcallbacksounds[id] = carco.createjs.Sound.play(root.carco.checkcallbacksoundcurrent);
                            root.carco.checkcallbackwait = 0;
                            root.carco.checkcallbackdata = false;
                        }, root.carco.checkcallbacksoundwait);
                    };
                };

                var ssrc = root.carco.paramsdata.system.urls.lib+"/configs/cinemon/checkcallback_sounds/"+soundid[0];
                ssrc = ssrc.replace(/\/+/g, "/");

                if (carco.functions.isMobile.androidApp()){
                    if (ssrc.match("../lib/")){
                        ssrc = ssrc.split("../lib/")[1];
                    };
                    var ssrc = "/android_asset/www/"+ssrc;
                };

                root.carco.checkcallbacksoundcurrent = soundid[1];
                root.carco.checkcallbacksoundwait = wait;

                if (root.carco.checkcallbacksounds[soundid[1]]) {
                    root.carco.checkcallbacksoundplay(soundid[1]);
                }else{
                    console.log("not found checkcallback sound");
                };

            };


        };
    };

    root.carco.playersoundspreload = function(callback) {
        if (!root.carco.checkcallbacksounds) root.carco.checkcallbacksounds = {};
        if (!root.carco.endscreensounds) root.carco.endscreensounds = {};

        var ssrc = root.carco.paramsdata.system.urls.lib+"configs/cinemon/checkcallback_sounds/";
        ssrc = carco.functions.image.removeDoubleSlash(ssrc);
        ssrc = carco.functions.image.removeDoubleSlash(ssrc);

        if (carco.functions.isMobile.androidApp()){
            if (ssrc.match("../lib/")){
                ssrc = ssrc.split("../lib/")[1];
            };
            var ssrc = "/android_asset/www/"+ssrc;
        };


        var essrc = root.carco.paramsdata.system.urls.lib+"configs/cinemon/endscreen_sounds/";
        essrc = carco.functions.image.removeDoubleSlash(essrc);
        essrc = carco.functions.image.removeDoubleSlash(essrc);

        if (carco.functions.isMobile.androidApp()){
            if (essrc.match("../lib/")){
                essrc = essrc.split("../lib/")[1];
            };
            var essrc = "/android_asset/www/"+essrc;
        };


        var checkcallbacksounds = [
            ["2_L_Mmmm.mp3","check_ccs_girl_sad_1"],
            ["2_L_Not.mp3","check_ccs_girl_sad_2"],
            ["2_L_Whoops.mp3","check_ccs_girl_sad_3"],
            ["1_L_Perfect.mp3","check_ccs_girl_happy_1"],
            ["1_L_Thats.mp3","check_ccs_girl_happy_2"],
            ["1_L_Thats_right.mp3","check_ccs_girl_happy_3"],
            ["2_W_Give.mp3","check_ccs_boy_sad_1"],
            ["2_W_Try.mp3","check_ccs_boy_sad_2"],
            ["2_W_UhOh.mp3","check_ccs_boy_sad_3"],
            ["1_W_Good.mp3","check_ccs_boy_happy_1"],
            ["1_W_Thats_right.mp3","check_ccs_boy_happy_2"],
            ["1_WThats.mp3","check_ccs_boy_happy_3"]
        ];

        var endscreensounds = [
            ["2_L_Bet.mp3","end_girl_sad_1"],
            ["2_L_Sure.mp3","end_girl_sad_2"],
            ["2_L_Um.mp3","end_girl_sad_3"],
            ["1_L_Very.mp3","end_girl_happy_1"],
            ["1_L_Well.mp3","end_girl_happy_2"],
            ["1_L_Youre.mp3","end_girl_happy_3"],
            ["2_W_Better.mp3","end_boy_sad_1"],
            ["2_W_Give.mp3","end_boy_sad_2"],
            ["2_W_Spaghettio.mp3","end_boy_sad_3"],
            ["1_W_Fantastic.mp3","end_boy_happy_1"],
            ["1_W_Very.mp3","end_boy_happy_2"],
            ["1_W_You.mp3","end_boy_happy_3"]
        ];

        var isounds = [];
        for (var x in checkcallbacksounds){
            isounds.push({src: ssrc + checkcallbacksounds[x][0], id: checkcallbacksounds[x][1]});
        };
        for (var x in endscreensounds){
            isounds.push({src: essrc + endscreensounds[x][0], id: endscreensounds[x][1]});
        };

        if (isounds.length){

            if (root.carco.playersoundspreloadfile){
                carco.createjs.Sound.removeEventListener("fileload", root.carco.playersoundspreloadfile);
            };

            var loadedfiles = 0;
            root.carco.playersoundspreloadfile = function(ev){
                var id = ev.id;
                loadedfiles = loadedfiles + 1;

                if (id.match("end_")){
                    root.carco.endscreensounds[id] = ev.id;
                } else {
                    root.carco.checkcallbacksounds[id] = ev.id;
                };

                if (loadedfiles == isounds.length){
                    setTimeout(function() {
                        carco.createjs.Sound.removeEventListener("fileload", root.carco.playersoundspreloadfile);
                        if (callback) callback(root);
                    },100);
                };
            };


            carco.createjs.Sound.addEventListener("fileload", root.carco.playersoundspreloadfile);
            carco.createjs.Sound.registerSounds(isounds);
        }else{
            if (callback) callback(root);
        };

    };

    return root;

};