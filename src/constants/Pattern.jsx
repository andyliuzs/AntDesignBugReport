/* 正则表达式 */

// ipv4表达式
export const ipv4Pattern = /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/;
// ipv4 or with mark
export const ipv4OrWithMarkPattern = /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}($|\/(\d{1}|[0-2]{1}\d{1}|3[0-2])$)/;

export const ipv4WithMarkPattern = /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}\/(\d{1}|[0-2]{1}\d{1}|3[0-2])$/;
// 名称昵称匹配 字母、数字、下划线、空格
export const namePattern = /^[\u4e00-\u9fa5_@\-\.a-zA-Z0-9]{2,20}$/;
export const adminNamePattern = /^[a-zA-Z][_\-a-zA-Z0-9]{1,15}$/;
export const tagNamePattern = /^[\u4e00-\u9fa5a-zA-Z0-9]{2,20}$/;
export const serviceNamePattern = /^[\u4e00-\u9fa5_@\-\.a-zA-Z0-9]{2,10}$/;
export const outgoingNamePattern = /^[\u4e00-\u9fa5_@\-\.a-zA-Z0-9]{2,10}$/;
// port
export const portPattern = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
export const publickeyPattern = /^[0-9A-Za-z]{52}\.k$/;
export const notePattern = /^[\u4E00-\u9FA5A-Za-z0-9_\-@.()（）&+!！$?~ ]{0,200}$/;
export const privatekeyPattern = /^[0-9A-Fa-f]{64}$/;
export const ipv6Pattern = /(^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$)|(^((?:[0-9A-Fa-f]{1,4}(?::[0-9A-Fa-f]{1,4})*)?)::((?:[0-9A-Fa-f]{1,4}(?::[0-9A-Fa-f]{1,4})*)?)$)/;
export const ipv6PatternStartFB = /^fb[0-9a-f]{2}:[0-9a-f:]+$/;
// mac地址匹配
export const macPattern = /(^[A-F0-9]{2}(-[A-F0-9]{2}){5}$)|(^[A-F0-9]{2}(:[A-F0-9]{2}){5}$)/gi
export const numberPattern = /^[0-9]*$/
// 8位数字
export const length8Pattern = /^\d{8}$/

export const atomicDomainPattern=/^[0-9a-zA-Z]{1,}\.[0-9a-zA-Z]{1,}$/
export const folderNamePattern = /^[\u4e00-\u9fa5_@\-\.a-zA-Z0-9]{2,10}$/;
export const ipv4MaskPattern = /^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)$/

export const ipv6OrIpv4Pattern = /(^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$)|(^((?:[0-9A-Fa-f]{1,4}(?::[0-9A-Fa-f]{1,4})*)?)::((?:[0-9A-Fa-f]{1,4}(?::[0-9A-Fa-f]{1,4})*)?)$)|(^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$)/;

// 域名或者 url校验
export const urlPattern = /^(?=^.{3,255}$)(http(s)?:\/\/)(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*([\?&]\w+=\w*)*$/
