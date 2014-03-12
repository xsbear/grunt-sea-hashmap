/*map start*/
seajs.production = true;
if(seajs.production){
    seajs.config({
        map: <%= mapArray %>
    });
}
/*map end*/