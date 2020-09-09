/**
** echartsX,Y轴文字大小自适应
** fontSize(res)
** 返回值：字体大小
**/
export function fontSize(res:number) {
    let clientWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
    if (!clientWidth) return;
    let fontSize = 100 * (clientWidth / 1920);
    return res * fontSize;
}