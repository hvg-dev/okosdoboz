if (!carco) var carco = {};
if (!carco.data) carco.data = {};
if (!carco.data.okosdoboz) carco.data.okosdoboz = {};

carco.data.okosdoboz.createPlayer = function() {
    var player = document.getElementById("odPlayer")
    var playeritems = carco.functions.player.get(player);
    var root = playeritems.root;
    carco.container(root);

    var config = {
        item: playeritems.root,
        carco: {
            paramsdata: {
                user: {
                    usertype: "user",
                    currentgame: carco.data.okosdoboz.id,  //game id
                    currenttrack: "1", //current track
                    tracksorder: "random", //or order
                    feedbacktype: "practice", //or test
                    lang: "hu", //or en
                    datatype: "local",
                    playersize:"fullscreen",
                    restartbutton: true,
                    enablehalfimages: true
                },
                system: {
                    usertype: "user",
                    disablehalfimages: false,
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
                        en: "Check"
                    },
                    "solutionbutton": {
                        hu: "Megoldás",
                        en: "Solution"
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
                        en: "Score: "
                    }
                }
            }
        }
    }

    carco.functions.root.init(config);
    carco.functions.microsoft.init(root);
    if (carco.project.okosdoboz.playercallback) carco.project.okosdoboz.playercallback(root)
    window.drwmsg = root;

    return root;

};