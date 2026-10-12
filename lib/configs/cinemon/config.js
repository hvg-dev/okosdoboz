carco.project.okosdoboz.version = "3.62";

carco.project.okosdoboz.start = function(a, b, c, d, callback){
    carco.functions.console("Okosdoboz "+carco.project.okosdoboz.version+", current host: "+carco.project.okosdoboz.hosts[carco.project.okosdoboz.currentHost]);
    if (callback && typeof callback == "function") callback();
};
