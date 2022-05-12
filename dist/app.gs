// Compiled using gas_mail_replier 1.0.0 (TypeScript 4.6.3)
"use strict";
//import GmailMessage = GoogleAppsScript.Gmail.GmailMessage;
const searchQuery = 'subject: 【gas_mail_replier】'; // メール検索する際の検索クエリ
const nameAddressReg = /名前（漢字）：(?<target>.+)/; // 名前欄の表現（正規表現）
const emailAddressReg = /メールアドレス：(?<target>.+)/; // メアド欄の表現（正規表現）
const telAddressReg = /ＴＥＬ：(?<target>.+)/; // 電話番号欄の表現（正規表現）
const replySubject = '件名を入れてください'; // 返信するメールの件名
const replyBodyText = `
（このメールは自動送信です。返信しないでください）
お問合せありがとうございます。
確認後メール送信します。
`;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const main = () => {
    const query = `${searchQuery} is:unread`;
    const threads = GmailApp.search(query, 0, 10);
    threads.forEach((thread) => {
        thread.getMessages().forEach((message) => {
            // メール内容の解析
            const parsed = parse(message);
            // メール送信
            if (parsed.email) {
                sendMail(parsed.email);
            }
            // 処理済みにする
            markRead(message);
        });
    });
};
const parse = (message) => {
    var _a, _b, _c, _d, _e, _f;
    const plainBody = message.getPlainBody();
    const nameMatch = (_b = (_a = plainBody.match(nameAddressReg)) === null || _a === void 0 ? void 0 : _a.groups) !== null && _b !== void 0 ? _b : {};
    const emailMatch = (_d = (_c = plainBody.match(emailAddressReg)) === null || _c === void 0 ? void 0 : _c.groups) !== null && _d !== void 0 ? _d : {};
    const telMatch = (_f = (_e = plainBody.match(telAddressReg)) === null || _e === void 0 ? void 0 : _e.groups) !== null && _f !== void 0 ? _f : {};
    return {
        subject: message.getSubject(),
        name: nameMatch.target || null,
        email: emailMatch.target || null,
        tel: telMatch.target || null,
    };
};
const sendMail = (email) => {
    GmailApp.sendEmail(email, replySubject, replyBodyText);
};
const markRead = (message) => {
    message.markRead();
};
