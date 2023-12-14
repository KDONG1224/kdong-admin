export const faqTypeList = [
  { label: '종류', value: 'concat' },
  {
    label: '이력서',
    value: 'resume'
  },
  {
    label: '이메일',
    value: 'email'
  },
  {
    label: '기타',
    value: 'etc'
  }
];

export const changeKorFaqType = (type: string) => {
  const find = faqTypeList.find((f) => f.value === type);

  if (!find) return '-';

  return find.label;
};
