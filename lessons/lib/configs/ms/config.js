carco.project.okosdoboz.version = "3.62";

carco.project.okosdoboz.start = function(a, b, c, d, callback){
    carco.functions.console("Okosdoboz "+carco.project.okosdoboz.version+", current host: "+carco.project.okosdoboz.hosts[carco.project.okosdoboz.currentHost]);

    if (carco.functions.isMobile.iOS()) {
        MathJax.Hub.Config({

            extensions: ["tex2jax.js"],
            jax: ["input/TeX", "output/HTML-CSS"],
            imageFont: null,
            "HTML-CSS": {
                webFont: "STIX-Web"
            },
            tex2jax: {inlineMath: [["$","$"],["\\(","\\)"]]},
            messageStyle: "none",
            skipStartupTypeset: true,
            display: "inline",
            styles: {
                ".MathJax_Preview": {
                    visibility: "hidden"
                }
            }
        });
        MathJax.Hub.Register.StartupHook(
            "HTML-CSS Jax Config",
            function () {MathJax.OutputJax["HTML-CSS"].FontFaceBug = true}
        );
    }else{
        MathJax.Hub.Config({
            extensions: ["tex2jax.js"],
            jax: ["input/TeX", "output/HTML-CSS"],
            "HTML-CSS": {
                availableFonts: ["TeX"]
            },
            tex2jax: {inlineMath: [["$","$"],["\\(","\\)"]]},
            messageStyle: "none",
            skipStartupTypeset: true,
            display: "inline",
            styles: {
                ".MathJax_Preview": {
                    visibility: "hidden"
                }
            }
        });
    }

    if (callback && typeof callback == "function") callback();
};