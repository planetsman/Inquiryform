<?php 
// encoding: utf-8

class AdTempoMail {
    const ENV = true;   // 本番環境 True
    //const ADMIN_MAIL = 'sofacover@adtempo-networks.co.jp';
    const ADMIN_MAIL = 'o7m6c5k4s1u8q4c7@l-boom.slack.com';
    const DEBUG = true;

    function __construct() {
        
        if ($_SERVER['SERVER_NAME'] == 'bluekitten4.sakura.ne.jp') {
            $this->success_url = 'https://bluekitten4.sakura.ne.jp/html/img/php-mail-form/index.html#thanks';
        } else {
            $this->success_url = 'https://www.adtempo-networks.co.jp/html/img/php-mail-form/index.html#thanks';
        }

        $this->base_dir = getcwd();

        if ( ! class_exists('PHPMailer')) {
            require $this->base_dir.'/PHPMailer/PHPMailerAutoload.php';
        }
        $this->mail = new PHPMailer;
        
        if ( ! class_exists('Smarty')) {
            require_once($this->base_dir.'/Smarty2/Smarty.class.php');
        }
        $this->out = new Smarty();
        $this->out->template_dir = $this->base_dir.'/templates/';
        $this->out->config_dir = $this->base_dir.'/Smarty2/configs/';
        // 書き込み可能ディレクトリ
        $this->out->compile_dir = $this->base_dir.'/work/templates_c/';
        $this->out->cache_dir = $this->base_dir.'/work/cache/';
        $this->work_dir = $this->base_dir.'/work';
        
        if (self::DEBUG) {
            $this->out->caching = false;
            $this->mail->SMTPDebug = 3;                               // Enable verbose debug output
        }
    }

    function setup_smtp() {
        $this->mail = new PHPMailer;
        $this->mail->setLanguage('ja', $this->base_dir.'/PHPMailer/language/');
        $this->mail->CharSet = "UTF-8";
        $this->mail->Encoding = "base64";

        $this->mail->isSMTP();                                      // Set mailer to use SMTP
        $this->mail->Host = 'adtempo-networks.co.jp';  // Specify main and backup SMTP servers
        $this->mail->SMTPAuth = true;                               // Enable SMTP authentication
        $this->mail->Username = 'admin';                 // SMTP username
        $this->mail->Password = '5+7-3waq';                           // SMTP password
        $this->mail->Port = 587;                                    // TCP port to connect to
    }

    function dbg_show_data() {
        echo "<h1>post</h1><pre>";
        print_r($_POST);
        echo "</pre>";
        echo "<h1>files</h1><pre>";
        print_r($_FILES);
        echo "</pre>";
    }
    function dbg_mail_send() {
        $this->out->assign('name', 'テストさん');
        $this->out->display('index.tpl');
    }

    function obs_sendmail($from_name, $to, $subj, $body) {
        $this->mail->setFrom('admin@adtempo-networks.co.jp', $from_name);
        $this->mail->addAddress($to);

        $this->mail->Subject = $subj;
        $this->mail->Body    = $body;

        if(!$this->mail->send()) {
            return $this->mail->ErrorInfo;
        } else {
            return "";
        }
    }
    function sendmail($from_name, $to, $subj, $body, $attach = FALSE) { 
        $this->mail->setFrom('admin@adtempo-networks.co.jp', $from_name);
        $this->mail->addAddress($to);

        $this->mail->Subject = $subj;
        $this->mail->Body    = $body;

        if (FALSE!==$attach) {
            $idx = 0;
            foreach($attach as $f => $a) {
                if (array_key_exists('store_name', $a)) {
                    $idx += 1;
                    $ext = $a['store_ext'];
                    $aname = sprintf('%d.%s', $idx, $ext);  
                    $this->mail->addAttachment($a['store_name'], $aname);
                }
            }
        }

        if(!$this->mail->send()) {
            return $this->mail->ErrorInfo;
        } else {
            return "";
        }
    }

    function form_main() {
        $fields = 'i01 i02 i03 i04 i05 i06 i07 i08 i09 i10 i10_sc i12 i15 i16 i17 i18 i19 s1_1 s1_2 s1_3 s1_4 s1_5 s1_6 s1_7 s1_8 s2_1 s2_2 s2_3 s2_4 s2_5 s2_6 s2_7 s2_8 s3_1 s3_2 s3_3 s3_4 s3_5 s3_6 s3_7 s3_8 s4_1 s4_2 s4_3 s4_4 s4_5 s4_6 s4_7 s4_8 s5_1 s5_2 s5_3 s5_4 s5_5 s5_6 s5_7 s5_8';
        $fields = explode(' ', $fields);
        $files = array('i11_1', 'i11_2'); //$files = array('i11_1', 'i11_2', 'i11_3');
        $output = array();
        $attach = array();

        foreach($fields as $f) {
            if (array_key_exists($f, $_POST)) {
                $output[$f] = trim($_POST[$f]);
            } else {
                $output[$f] = "";
            }
        }

        // copy sizes
        $sizes = array();
        $size_slots = array(1,2,3,4,5);
        $t_size_type = array('1' => 'フラット', '2' => '前垂れ');
        foreach($size_slots as $sz) {
            $sizes[$sz] = array();
            for($i=1; $i<=8; $i++) {
                $sizes[$sz][$i] = $output[sprintf("s%d_%d", $sz,$i)];
                if ($i==1) {    // select 項目
                    if (array_key_exists($sizes[$sz][$i], $t_size_type)) {
                        $sizes[$sz][$i] = $t_size_type[ $sizes[$sz][$i] ];
                    }
                }
            }
        }


        // replace select/radio values
        $t08 = array('e' => '見積もり依頼', 'i' => '問い合わせ');
        if (array_key_exists($output['i08'], $t08)) {
            $output['i08'] = $t08[$output['i08']];
        }
        $t09 = array('1' => '可能', '0' => '不可');
        if (array_key_exists($output['i09'], $t09)) {
            $output['i09'] = $t09[$output['i09']];
        }
        $t10 = array('p' => 'レザー郵送', 's' => 'サンプルから選択', 'e' => 'その他 (2回目以降ご注文の方はこちらへ)');
        if (array_key_exists($output['i10'], $t10)) {
            $output['i10'] = $t10[$output['i10']];
        }

        // file attach
        foreach($files as $f) {
            $idx = array_search($f, $files);
            if (array_key_exists($f, $_FILES) && ! empty($_FILES[$f]['tmp_name'])) {    
                $tmp_name = $this->store_attach($f);               
                if ($tmp_name == null ) {
                    exit(3);
                } else {
                    $attach[$idx] = $_FILES[$f];
                    $attach[$idx]['store_name'] = $tmp_name[0];    
                    $attach[$idx]['store_ext']  = $tmp_name[1];    
                    if (self::DEBUG) {
                        //$attach[$idx]['name'] = $tmp_name;
                    }
                }
            } else {
                $attach[$idx] = array('name' => '', 'type' => '', 'tmp_name' => '', 'error' => -1, 'size' => 0);
            }
        }

        $this->out->assign('form', $output);
        $this->out->assign('attach', $attach);
        $this->out->assign('sizes', $sizes);
        $this->out->assign('size_slots', $size_slots);

        $body_a = $this->out->fetch('admin_mail.tpl');
        $body_c = $this->out->fetch('customer_mail.tpl');

        if ( $this->form_send_admin($body_a, $attach) ) {
            // 管理者への送信に成功した場合は、お客様へ通知メールを送信
            
            $this->form_send_customer($body_c, $output['i07'], $attach);  // 成功したらリダイレクトする
        } else {    // 管理者への送信に失敗
            ?>
            <!DOCTYPE html>
            <html lang="ja">
            <head>
                <meta charset="UTF-8">
                <title>メール送信</title>
            </head>
            <body>            
               <p>送信に失敗しました。お手数ですが暫く時間を空けてから再度送信してください。</p>
               <button onclick="window.history.back()">戻る</button>

            </body></html><?php
        }
    }

    function delete_attach($attach) {   // メール送信後に、添付ファイルをサーバから削除
        if ( ! is_array($attach)) {return;}

        foreach($attach as $f => $a) {
            if (array_key_exists('store_name', $a)) {
                unlink($a['store_name']);
            }
        }
    }

    function store_attach($files_field_name) {  
        try {
            
            if ( ! isset($_FILES[$files_field_name]['error']) || is_array($_FILES[$files_field_name]['error']) ) {
                throw new RuntimeException('送信エラー');
            }

            switch($_FILES[$files_field_name]['error']) {
                case UPLOAD_ERR_OK: break;
                case UPLOAD_ERR_NO_FILE:
                    throw new RuntimeException('ファイルを受信できません.');
                case UPLOAD_ERR_INI_SIZE:
                case UPLOAD_ERR_FORM_SIZE:
                    throw new RuntimeException("ファイル容量が制限を超えています.");
                default:
                    throw new RuntimeException('不明なエラーです.');
            }
            
            if ($_FILES[$files_field_name]['size'] > 1024*1024*10) {
                throw new RuntimeException('ファイル容量が制限を超えました.');
            }
            
            $finfo = new finfo(FILEINFO_MIME_TYPE);
            if (false === $ext = array_search(
                $finfo->file($_FILES[$files_field_name]['tmp_name']),
                array(
                    'jpg' => 'image/jpeg',
                    'png' => 'image/png',
                    'gif' => 'image/gif'
                ), true
            )) {
                throw new RuntimeException('対応しないファイル形式です.');
            }
            
            $tmp = tempnam($this->work_dir, 'tmp_'.sha1($_FILES[$files_field_name]['name']).'.'.$ext );
            if ( ! move_uploaded_file($_FILES[$files_field_name]['tmp_name'], $tmp)) {
                throw new RuntimeException('ファイルの移動に失敗しました.');
            } else {
                return array($tmp, $ext);    
            }
        } catch(RuntimeException $e) {
            ?>
            <!DOCTYPE html>
            <html lang="ja">
            <head>
                <meta charset="UTF-8">
                <title>メール送信</title>
            </head>
            <body>            
               <p>画像アップロード中にエラーが発生しました。<?php echo $e->getMessage(); ?></p>
               <button onclick="window.history.back()">戻る</button>

            </body></html><?php
            return NULL;
        }
    }


    function form_send_customer($body, $to, $attach) {
        $this->setup_smtp();
        //$this->mail->addAttachment($here.'/img/VGA_tentacle.jpg', 'new.jpg');    // 名前指定で添付
        $error = $this->sendmail('アドテンポネットワークス', $to, '【お問い合わせ受付完了のご案内】アドテンポネットワークス㈱', $body, $attach);

        if (is_array($attach)) {    // 実施タイミング注意
            $this->delete_attach($attach);
        }

        if (empty($error)) {
            //echo "success";
            
            header('Location: '.$this->success_url);    
            
            exit;
        } else {
            ?>
            <!DOCTYPE html>
            <html lang="ja">
            <head>
                <meta charset="UTF-8">
                <title>メール送信</title>
            </head>
            <body>            
                <?php echo "送信エラー:". $error; ?>
            </body></html><?php
        }
    }

    function form_send_admin($body, $attach) {
        $this->setup_smtp();
        //$this->mail->addAttachment($here.'/img/VGA_tentacle.jpg', 'new.jpg');    // 名前指定で添付
        $error = $this->sendmail('メールフォーム', self::ADMIN_MAIL, 'ソファカバー メールフォーム通知', $body, $attach);

        if (empty($error)) {
            return true;    // success
        } else {
            return false;   // fail
        }
    }

}


$method = $_SERVER['REQUEST_METHOD'];
if ('POST'==$method) {
    if (AdTempoMail::DEBUG) {
        ini_set('display_errors', 1);
        ini_set('display_startup_errors', 1);
        error_reporting(E_ALL);
    }
    $main = new AdTempoMail();
    //$main->dbg_show_data();
    //$main->dbg_mail_send();
    $main->form_main();
    
} else {
    //ini_set('upload_max_filesize', '10M');
    if (self::DEBUG) {
        $inis = explode(' ','memory_limit post_max_size upload_max_filesize');
        echo "<pre>";
        echo getcwd();
        foreach($inis as $ini) {
            printf("php.ini [%s] = [%s]\n", $ini, ini_get($ini));
        }
        echo "</pre>";
    }
}
