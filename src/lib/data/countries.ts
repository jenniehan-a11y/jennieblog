// 주요 국가 코드와 이름/국기
export const COUNTRIES: Record<string, { name: string; flag: string }> = {
  KR: { name: '한국', flag: '🇰🇷' },
  US: { name: '미국', flag: '🇺🇸' },
  GB: { name: '영국', flag: '🇬🇧' },
  JP: { name: '일본', flag: '🇯🇵' },
  FR: { name: '프랑스', flag: '🇫🇷' },
  DE: { name: '독일', flag: '🇩🇪' },
  CN: { name: '중국', flag: '🇨🇳' },
  IN: { name: '인도', flag: '🇮🇳' },
  ES: { name: '스페인', flag: '🇪🇸' },
  IT: { name: '이탈리아', flag: '🇮🇹' },
  CA: { name: '캐나다', flag: '🇨🇦' },
  AU: { name: '호주', flag: '🇦🇺' },
  SE: { name: '스웨덴', flag: '🇸🇪' },
  DK: { name: '덴마크', flag: '🇩🇰' },
  NO: { name: '노르웨이', flag: '🇳🇴' },
  TW: { name: '대만', flag: '🇹🇼' },
  HK: { name: '홍콩', flag: '🇭🇰' },
  TH: { name: '태국', flag: '🇹🇭' },
};

export function getCountryInfo(code: string) {
  return COUNTRIES[code] || { name: code, flag: '🌍' };
}

export function getRegion(countryCode: string): 'domestic' | 'international' {
  return countryCode === 'KR' ? 'domestic' : 'international';
}
