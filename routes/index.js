/*
 * GET home page.
 */

exports.index = function (req, res) {
    res.render('index', {});
};
exports.test = function (req, res) {
    res.render('test', {});
}
exports.atest = function (req, res) {
    var url = req.url;
    res.render(url.substr(1, url.length - 1), {});
}
exports.a = function (req, res) {
    res.render('a', {});
//    var url = req.url;
//    res.render(url.substr(1,url.length-1),{});
}
exports.ipset = function (req, res) {
    rendertourl(req,res);
}
function rendertourl(req,res){
    var url = req.url;
    res.render(url.substr(1, url.length - 1), {});
}