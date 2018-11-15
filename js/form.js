// アドテンポ様 お問い合わせフォーム
// ver 0.1.0 2018年8月29日 初期
// ver 0.1.1 2018年9月2日 入力値の検証（単純必須）
// ver 0.1.2 2018年9月2日 入力値の検証 見積もり依頼 選択時の必須
// ver 0.1.3 2018年9月5日 カラーサンプルのポップアップ
// ver 0.1.4 2018年9月5日 確認画面への入力値の転記
// ver 0.1.5 2018年9月9日 サンクス画面への遷移方法変更
// ver 0.1.6 2018年9月12日 メールアドレス・郵便番号・メールアドレスの形式検証
// ver 0.1.7 2018年9月19日 ファイル添付数3→2, i09_2 popup対応
// ver 0.1.8 2018年9月26日 #fill でテストデータオートフィルに対応
// ver 0.1.9 2018年9月26日 ご依頼内容及びi09の選択による必須項目の変化に対応
(function( $ ) {
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();












var Validation;
(function (Validation) {
    var JqueryValidator = /** @class */ (function () {
        function JqueryValidator() {
        }
        JqueryValidator.prototype.get_error_elem = function (selector, cls_name) {
            var s, p, e, cls;
            cls = "." + cls_name;
            s = $(selector).first();
            if (s.length > 0) {
                p = s.parent();
                if (p) { 
                    e = p.find(cls); // ".error_msg"
                    
                    if (e.length > 0) {
                        return e;
                    }
                    else {
                        p = s.parent().parent();
                        if (p) {
                            e = p.find(cls);
                            
                            if (e.length > 0) {
                                return e;
                            }
                            else {
                                p = s.parent().parent().parent();
                                e = p.find(cls);
                                
                                if (e.length > 0) {
                                    return e;
                                }
                            }
                        }
                    }
                }
            }
            return undefined;
        };
        // radio の場合は、 selector部分は field_nameを指定する
        JqueryValidator.prototype.show_error = function (selector, is_show, set_class, msg_class) {
            if (set_class === void 0) { set_class = true; }
            if (msg_class === void 0) { msg_class = "error_msg"; }
            var p = this.get_error_elem(selector, msg_class);
            if (p) {
                /*if (msg.length > 0 && is_show) {
                    p.text(msg);
                }*/
                if (is_show) { // show error (検証失敗)
                    p.show();
                    if (set_class)
                        $(selector).addClass("error");
                }
                else { // hide error (検証成功)
                    p.hide();
                    if (set_class)
                        $(selector).removeClass("error");
                }
            }
            else {
                console.log("show_error in " + selector + ": ." + msg_class + " not found");
            }
        };
        JqueryValidator.prototype.check = function (selector, set_class) {
            if (set_class === void 0) { set_class = true; }
            var valid;
            valid = this.isValid(selector);
            this.show_error(selector, !valid, set_class);
            return valid;
        };
        JqueryValidator.prototype.isValid = function (selector) { return false; };
        return JqueryValidator;
    }());
    var RequiredRadio = /** @class */ (function (_super) {
        __extends(RequiredRadio, _super);
        function RequiredRadio() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RequiredRadio.prototype.get_error_elem = function (field_name, cls_name) {
            var s, p, e, selector;
            selector = "input[name='" + field_name + "']"; // :checked
            console.log("gee R: " + selector);
            return _super.prototype.get_error_elem.call(this, selector, cls_name);
        };
        RequiredRadio.prototype.check = function (field_name) {
            return _super.prototype.check.call(this, field_name, false);
        };
        RequiredRadio.prototype.isValid = function (field_name) {
            var j, v, name;
            name = "input[name='" + field_name + "']:checked";
            j = $(name);
            if (j.length < 0) {
                return false;
            }
            else {
                v = j.val();
                if (typeof v === "undefined" || v === null) {
                    
                    return false;
                }
                v = String(v).trim();
                if (v.length < 1) {
                    return false;
                }
            }
            return true;
        };
        return RequiredRadio;
    }(JqueryValidator));
    Validation.RequiredRadio = RequiredRadio;
    var Required = /** @class */ (function (_super) {
        __extends(Required, _super);
        function Required() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Required.prototype.isValid = function (selector) {
            var j, v;
            j = $(selector);
            if (j.length < 0) {
                return false;
            }
            else {
                v = j.val();
                if (typeof v === "undefined" || v === null) {
                    return false;
                }
                v = String(v).trim();
                if (v.length < 1) {
                    return false;
                }
            }
            return true;
        };
        return Required;
    }(JqueryValidator));
    Validation.Required = Required;

    //}
    var RequiredMail = /** @class */ (function (_super) {
        __extends(RequiredMail, _super);
        function RequiredMail() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RequiredMail.prototype.check = function (selector) {
            return _super.prototype.check.call(this, selector, false);
        };
        RequiredMail.prototype.isValid = function (selector) {
            var j, v, p;
            j = $(selector);
            if (j.length < 0) {
                return false;
            }
            else {
                v = j.val();
                if (typeof v === "undefined" || v === null) {
                    return false;
                }
                v = String(v).trim();
                if (v.length < 1) {
                    return false;
                }
                p = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                if (null === v.match(p)) {
                    return false;
                }
            }
            return true;
        };
        return RequiredMail;
    }(JqueryValidator));
    Validation.RequiredMail = RequiredMail;
    var RequiredPostal = /** @class */ (function (_super) {
        __extends(RequiredPostal, _super);
        function RequiredPostal() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RequiredPostal.prototype.check = function (selector) {
            return _super.prototype.check.call(this, selector, false);
        };
        RequiredPostal.prototype.isValid = function (selector) {
            var j, v, p;
            j = $(selector);
            if (j.length < 0) {
                return false;
            }
            else {
                v = j.val();
                if (typeof v === "undefined" || v === null) {
                    return false;
                }
                v = String(v).trim();
                if (v.length < 1) {
                    return false;
                }
                p = /^[0-9]{3}-[0-9]{4}$/;
                if (null === v.match(p)) {
                    return false;
                }
            }
            return true;
        };
        return RequiredPostal;
    }(JqueryValidator));
    Validation.RequiredPostal = RequiredPostal;
})(Validation || (Validation = {}));

function log(s) {
    console.log(s);
}
function danger() {
    $("body").css("color", "red");
}
var get_radio_val = function (field_name) {
    var name, e, v;
    name = "input[name='" + field_name + "']:checked";
    e = $(name);
    if (e.length > 0) {
        v = e.val();
    }
    else {
        v = "";
    }
    return v;
};
var get_select_val = function (select_id) {
    var name, e, v;
    name = "select#" + select_id;
    e = $(name);
    if (e.length > 0) {
        v = e.val();
    }
    else {
        v = "";
    }
    return v;
};
// p1 .. p4 表示切り替え
function open_confirm(ev) {
    ev.preventDefault();
    var ok = static_validate();
    if (ok) {
        copy_values();
        $("section.p2").hide();
        $("section.p3").show();
        
    }
    else {
        log("open_confirm: invalid");
    }
}
function return_form(ev) {
    ev.preventDefault();
    $("section.p2").show();
    $("section.p3").hide();
}
function dummy_submit(ev) {
    ev.preventDefault(); // テスト用
    var e_form = $('#f1');
    
    
    if (e_form.length > 0) {
        log("set action");
        e_form.attr('action', '/html/img/php-mail-form/mail-form1809.php');
        log("do submit");
        e_form.submit();
    }
    else {
        log("form not found");
    }
}
// 採寸方法
var toggle_saisun = function (ev) {
    $("section.saisun").toggle();
};
// i09_2 座面取り外し popup 
var toggle_i09_2 = function (ev) {
    var show, i09;
    i09 = $("input[name='i09']:checked");
    show = false;
    log("i09_2 toggle: " + i09);
    if (i09.length > 0) {
        var v = i09.val();
        if (typeof v === "undefined" || v === null) {
        }
        else {
            v = parseInt(v);
            if (v == 0) {
                show = true;
            }
        }
    }
    if (show) {
        $(".i09_2").show();
    }
    else {
        $(".i09_2").hide();
    }
};
// 色見本
var open_color_sample = function (ev) {
    var jq, p; 
    jq = $; 
    p = jq.magnificPopup;
    p.open({
        items: {
            src: '#color_popup',
            type: 'inline'
        },
        callbacks: {
            open: function () {
                console.log("open");
            },
            close: function () {
                console.log("close2");
            }
        }
    });
};
var select_color_sample = function (ev) {
    var inp, c;
    log("select color");
    inp = $(this).val();
    if (inp !== undefined && inp !== null) {
        $("#sample_color").text(inp);
    }
};
var check_is_estimate = function () {
    if ('e' == get_radio_val('i08')) {
        return true;
    }
    return false;
};
// 静的バリデーション OUT: true if succeed
function static_validate() {
    var req, radio, ok, reqm, reqp;
    var reqs, req_radios;
    var reqes;
    var reqms, reqps;
    var is_estimate, is_color_etc, is_photo_required;
    req = new Validation.Required();
    radio = new Validation.RequiredRadio();
    reqm = new Validation.RequiredMail();
    reqp = new Validation.RequiredPostal();
    ok = true;
    // 入力有無チェック
    reqs = "i01 i02 i03 i04 i05 i06 i07".split(" ");
    
    for (var _i = 0, reqs_1 = reqs; _i < reqs_1.length; _i++) {
        var name_1 = reqs_1[_i];
        var sel = "#" + name_1;
        ok &= req.check(sel);
        log(sel + ": " + ok);
    }
    // 見積もり依頼か？
    is_estimate = check_is_estimate();
    if (is_estimate) { // 見積もり依頼の場合の検証
        req_radios = "i08 i09 i10".split(" ");
        for (var _a = 0, req_radios_1 = req_radios; _a < req_radios_1.length; _a++) {
            var name_2 = req_radios_1[_a];
            radio.show_error(name_2, false, true); // i08 .. i10 エラーのリセット
        }
        
        if ('1' == get_radio_val('i09')) { // 座面の取り外しが可能な場合 i10は必須
            req_radios = "i08 i09 i10".split(" ");
        }
        else {
            req_radios = "i08 i09".split(" ");
        }
        for (var _b = 0, req_radios_2 = req_radios; _b < req_radios_2.length; _b++) {
            var name_3 = req_radios_2[_b];
            ok &= radio.check(name_3);
            log(name_3 + ": " + ok);
        }
        
        //
        
        
        
        
        
        
        
        
        
        // 1-2 実測寸法
        // 少なくとも1行目のA,B,C,枚数は必須
        reqes = "s1_1 s1_2 s1_3 s1_4 s1_8".split(" ");
        for (var _c = 0, reqes_1 = reqes; _c < reqes_1.length; _c++) {
            var name_4 = reqes_1[_c];
            var sel = "#" + name_4;
            ok &= req.check(sel);
            log(sel + ": " + ok);
        }
        // 1-2 実測寸法
        // 座面タイプの選択があれば検証
        
        for (var _d = 0, _e = [1, 2, 3, 4, 5]; _d < _e.length; _d++) {
            var zamen_n = _e[_d];
            var ty = void 0, names = void 0;
            var x = "s" + zamen_n + "_1";
            ty = get_select_val("s" + zamen_n + "_1");
            //log(`Zamen Type(${x}): ${ty}`);
            names = [];
            if (ty.length > 0) {
                if ("1" == ty) { // フラット A,B,C,枚数
                    for (var _f = 0, _g = [2, 3, 4, 8]; _f < _g.length; _f++) {
                        var n = _g[_f];
                        names.push("s" + zamen_n + "_" + n);
                    }
                }
                else { // 前垂れ A-F,枚数
                    for (var _h = 0, _j = [2, 3, 4, 5, 6, 7, 8]; _h < _j.length; _h++) {
                        var n = _j[_h];
                        names.push("s" + zamen_n + "_" + n);
                    }
                }
                for (var _k = 0, names_1 = names; _k < names_1.length; _k++) {
                    var name_5 = names_1[_k];
                    var sel = "#" + name_5;
                    ok &= req.check(sel);
                    //log(sel+": "+ok);
                }
            }
        }
        // 1-2 納品先住所
        reqs = "i15 i16 i17 i18 i19".split(" ");
        for (var _l = 0, reqs_2 = reqs; _l < reqs_2.length; _l++) {
            var name_6 = reqs_2[_l];
            var sel = "#" + name_6;
            ok &= req.check(sel);
            log(sel + ": " + ok);
        }
        // 形式チェック E-mail
        reqms = ["i07"];
        for (var _m = 0, reqms_1 = reqms; _m < reqms_1.length; _m++) {
            var name_7 = reqms_1[_m];
            var sel = "#" + name_7;
            ok &= reqm.check(sel);
            log(name_7 + ": " + ok);
        }
        // 形式チェック 郵便番号
        reqps = "i04 i17".split(" ");
        for (var _o = 0, reqps_1 = reqps; _o < reqps_1.length; _o++) {
            var name_8 = reqps_1[_o];
            var sel = "#" + name_8;
            ok &= reqp.check(sel);
            log(name_8 + ": " + ok);
        }
        // TODO: 備考欄 条件
    }
    else { // 見積もり依頼 ではない場合 (お問い合わせ)
        // i09,i11 は不要
        req_radios = "i08".split(" ");
        for (var _p = 0, req_radios_3 = req_radios; _p < req_radios_3.length; _p++) {
            var name_9 = req_radios_3[_p];
            ok &= radio.check(name_9);
            log(name_9 + ": " + ok);
        }
        
        //
        
        // 寸法s エラーのリセット
        reqs = "s1_1 s1_2 s1_3 s1_4 s1_8".split(" ");
        for (var _q = 0, reqs_3 = reqs; _q < reqs_3.length; _q++) {
            var name_10 = reqs_3[_q];
            req.show_error("#" + name_10, false);
        }
        for (var _r = 0, _s = [1, 2, 3, 4, 5]; _r < _s.length; _r++) {
            var zamen_n = _s[_r];
            for (var _t = 0, _u = [1, 2, 3, 4, 5, 6, 7, 8]; _t < _u.length; _t++) {
                var n = _u[_t];
                req.show_error("#s" + zamen_n + "_" + n, false);
            }
        }
        // 納品先住所s エラーのリセット
        reqs = "i15 i16 i17 i18 i19".split(" ");
        for (var _v = 0, reqs_4 = reqs; _v < reqs_4.length; _v++) {
            var name_11 = reqs_4[_v];
            req.show_error("#" + name_11, false);
        }
    }
    // 色選択は「その他 (2回目以降ご注文の方はこちらへ)」か？
    is_color_etc = false;
    if ('e' == get_radio_val('i10')) {
        is_color_etc = true;
    }
    // 写真が必須かどうか。推移的なので注意 
    is_photo_required = false;
    if (!is_color_etc) {
        // 写真必須
        is_photo_required = true;
    }
    if (!is_estimate) {
        is_photo_required = false;
    }
    if (is_photo_required) { // 写真必須
        reqs = "i11_1 i11_2".split(" "); 
        for (var _w = 0, reqs_5 = reqs; _w < reqs_5.length; _w++) {
            var name_12 = reqs_5[_w];
            var sel = "#" + name_12;
            ok &= req.check(sel);
            log(sel + ": " + ok);
        }
    }
    else { // 写真は必須でない
        reqs = "i11_1 i11_2".split(" "); 
        for (var _x = 0, reqs_6 = reqs; _x < reqs_6.length; _x++) {
            var name_13 = reqs_6[_x];
            req.show_error("#" + name_13, false);
        }
    }
    return ok;
}
var copy_text = function (src_names, dest_names) {
    var le = src_names.length;
    if (le != dest_names.length) {
        danger();
    }
    for (var i = 0; i < le; i++) {
        var x = $("input[name=" + src_names[i] + "]").val();
        log("COPY [" + src_names[i] + "] to " + dest_names[i] + ": " + x);
        $(".p3 ." + dest_names[i]).text(String(x));
    }
};
// 入力フォーム→確認画面 入力内容の複写
var copy_values = function () {
    var src, dest, i, x;
    src = "i01 i02 i03 i04 i05 i06 i07".split(" ");
    dest = "c01 c02 c03 c04 c05 c06 c07".split(" ");
    copy_text(src, dest);
    // textarea
    x = $("textarea[name=i12]").val();
    $(".p3 .c12").text(x);
    var copy_radio = function (srcname, dest, dict) {
        var x;
        x = get_radio_val(srcname) || "";
        log("COPY radio[" + srcname + "] to [" + dest + "]: " + x);
        if (dict !== undefined && dict !== null) {
            x = dict[x];
        }
        $(dest).text(x);
    };
    copy_radio("i10", ".p3 .c10", { p: "レザー郵送", s: "サンプルから選択", e: "その他" });
    copy_radio("i10_sc", ".p3 .c10_sc");
    
    
    copy_radio("i08", ".p3 .c08", { e: "見積もり依頼", i: "問い合わせ" });
    copy_radio("i09", ".p3 .c09", ["不可", "可能"]);
    var copy_select = function (srcid, dest, dict) {
        var x;
        x = get_select_val(srcid) || "";
        log("COPY select[#" + srcid + "] to [" + dest + "]: " + x);
        if (dict !== undefined && dict !== null) {
            x = dict[x];
        }
        $(dest).text(x);
    };
    if (check_is_estimate()) {
        // 採寸
        for (var _i = 0, _a = [1, 2, 3, 4, 5]; _i < _a.length; _i++) {
            var size_n = _a[_i];
            for (var _b = 0, _c = [1, 2, 3, 4, 5, 6, 7, 8]; _b < _c.length; _b++) {
                var idx = _c[_b];
                var cls_name = "s" + size_n + "_" + idx;
                if (idx != 1) {
                    x = $("input[name=" + cls_name + "]").val();
                    //log(`COPY SIZE [${cls_name}] : ${x}`);
                    $(".p3 ." + cls_name).text(x);
                }
                else {
                    copy_select(cls_name, ".p3 ." + cls_name, ["", "フラット", "前垂れ"]);
                }
            }
        }
        // 納品先
        src = "i15 i16 i17 i18 i19".split(" ");
        dest = "c15 c16 c17 c18 c19".split(" ");
        copy_text(src, dest);
    }
};
var fill_test_values = function () {
    var src, dest, i, x;
    log("for debug fill");
    var set_text = function (name, val) {
        $("input[name=" + name + "]").val(val);
    };
    var rand = function (range, base) {
        return Math.floor(Math.random() * range) + base;
    };
    var words = "あ い う え お か き く け こ さ し す せ そ A B C D E F G H I J K L M N O P Q R S T U".split(" ");
    var fill_text = function (names) {
        for (var _i = 0, names_2 = names; _i < names_2.length; _i++) {
            var name_14 = names_2[_i];
            var word = void 0, n = void 0, wl = void 0, r = void 0;
            n = rand(16, 4);
            wl = words.length;
            word = "";
            for (var i_1 = 0; i_1 < n; i_1++) {
                word += words[rand(wl, 0)];
            }
            $("input[name=" + name_14 + "]").val(word);
        }
    };
    src = "i01 i02 i03 i04 i05 i06 i07".split(" ");
    fill_text(src);
    // textarea
    $("textarea[name=i12]").val("テスト\nテスト");
    var set_radio = function (name, val) {
        log("SET radio[" + name + "] to " + val);
        $("input[name=" + name + "]").val([val]);
    };
    var set_select = function (name, val) {
        log("SET select[" + name + "] to " + val);
        $("select[name=" + name + "]").val(val);
    };
    set_radio("i10", "p"); 
    set_radio("i10_sc", "SC-6"); 
    //$("intpu[name=i10_sc]").trigger("change");
    set_radio("i08", "e"); 
    set_radio("i09", 0); 
    if (true) { // 見積もり
        // 採寸
        for (var _i = 0, _a = [1, 2, 3, 4, 5]; _i < _a.length; _i++) {
            var size_n = _a[_i];
            for (var _b = 0, _c = [1, 2, 3, 4, 5, 6, 7, 8]; _b < _c.length; _b++) {
                var idx = _c[_b];
                var cls_name = "s" + size_n + "_" + idx;
                if (idx != 1) {
                    set_text(cls_name, rand(1600, 10));
                }
                else {
                    set_select(cls_name, rand(2, 1)); 
                }
            }
        }
        // 納品先
        src = "i15 i16 i17 i18 i19".split(" ");
        fill_text(src);
        set_text("i04", "108-0014");
        set_text("i17", "108-0014");
        set_text("i07", "o7m6c5k4s1u8q4c7@l-boom.slack.com");
    }
};
// 初期化：表示・非表示の設定、画面間の遷移ボタン
$(function () {
    var h, processed;
    processed = false;
    h = window.location.hash;
    if (h.length > 1) {
        if (h.indexOf("thank") !== -1) { // after mail sent
            $("section.p1").hide();
            $("section.p4").show();
            processed = true;
        }
        if (h.indexOf("fill") !== -1) {
            fill_test_values();
            processed = false; // フォームを表示
        }
    }
    if (!processed) { // フォームを表示
        $("section.p1").hide();
        $("section.p2").show();
        $(".to_confirm").on("click", open_confirm);
        $(".show_saisun").on("click", toggle_saisun);
        $(".to_form").on("click", return_form);
        //$(".entry").on("submit click", dummy_submit);
        $(".entry").on("click", dummy_submit);
        $("#i10_2").on("change", open_color_sample); // IE11, FF, Chrome ok
        $("input[name=i10_sc]").on("change", select_color_sample);
        $("input[name=i09]").on("change", toggle_i09_2); 
    }
});
})(jQuery);//