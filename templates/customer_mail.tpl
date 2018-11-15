{* Smarty 2 お客様通知メール テンプレート *}

お問い合わせフォーム送信内容


■貴社名
{$form.i01}

■部署名
{$form.i02}

■名前
(省略)

■郵便番号〒
{$form.i04}

■所在地
{$form.i05}

■TEL
(省略)

■メールアドレス
{$form.i07}


■ご依頼内容
{$form.i08}

■座面取り外し
{$form.i09}

■カラー
{$form.i10}

■カラー(選択)
{$form.i10_sc}

■添付ファイル
1. {$attach[0].name}
2. {$attach[1].name}
3. {$attach[2].name}


■備考欄
{$form.i12}

{foreach from=$sizes key=slot_no item=size}
■採寸{$slot_no}
  タイプ {$size.1} A {$size.2} B {$size.3} C {$size.4} D {$size.5} E {$size.6} F {$size.7} 枚数 {$size.8}
{/foreach}


■店舗名
{$form.i15}

■店舗担当者名
(省略)

■郵便番号
{$form.i17}

■所在地
{$form.i18}

■TEL
(省略)

※ 本メールはメールフォームから自動送信されております。
※ 本メールに心当たりが無い場合、お手数ですが下記までお問い合わせください。

http://www.adtempo-networks.co.jp/
